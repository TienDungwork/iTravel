
---
## PHẦN 1: CẤU TRÚC TỔNG QUAN

### Câu hỏi "hãy mô tả kiến trúc hệ thống?"

Trả lời ngắn gọn:

> "Dự án sử dụng kiến trúc **Fullstack Monolith** trên Next.js 16, nghĩa là frontend và backend nằm cùng một codebase. Frontend là React 19 với TypeScript, backend là các API Routes viết trong thư mục `app/api/`. Cơ sở dữ liệu dùng MongoDB thông qua Mongoose ODM. Xác thực người dùng dùng NextAuth.js với chiến lược JWT. AI dùng OpenAI GPT-3.5-turbo cho hai chức năng: tạo lịch trình và chatbot."

**Luồng request điển hình:**

```
Trình duyệt (React) --> Next.js Server --> API Route (route.ts)
                                               |
                                        connectDB() --> MongoDB
                                               |
                                        OpenAI API (nếu cần)
                                               |
                                       NextResponse.json() --> Trình duyệt
```

---

## PHẦN 2: GIẢI THÍCH CODE CHI TIẾT

### 2.1 Kết nối Database - `src/lib/db.ts`

```typescript
const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;   // Tái sử dụng kết nối cũ
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
```

**Giải thích - đây là Connection Pooling pattern:**

Next.js chạy trên serverless (mỗi API request có thể là một Node.js process mới). Nếu không có caching, mỗi request sẽ tạo một kết nối MongoDB mới, rất tốn tài nguyên và chậm.

Giải pháp: Lưu kết nối vào `global.mongoose` - biến global tồn tại suốt vòng đời của process Node.js. Lần đầu gọi `connectDB()` thì kết nối và lưu vào cache. Từ lần thứ 2 trở đi trong cùng process, trả về kết nối đã có mà không kết nối lại.

---

### 2.2 Xác thực người dùng - `src/app/api/auth/[...nextauth]/route.ts`

```typescript
CredentialsProvider({
    async authorize(credentials) {
        // Bước 1: Kiểm tra input
        if (!credentials?.email || !credentials?.password) {
            throw new Error('Vui lòng nhập email và mật khẩu');
        }

        // Bước 2: Tìm user trong DB, .select('+password') vì password có select: false
        const user = await UserModel.findOne({ email: credentials.email })
                                    .select('+password');

        // Bước 3: So sánh password hash
        const isValid = await user.comparePassword(credentials.password);

        // Bước 4: Trả về object user cho NextAuth
        return { id, name, email, role, avatar };
    }
})
```

**Giải thích - tại sao dùng `.select('+password')`?**

Trong User model, trường password được định nghĩa với `select: false`. Điều này có nghĩa là mặc định khi query User, MongoDB sẽ không trả về trường password trong kết quả. Đây là biện pháp bảo mật, tránh vô tình lộ password hash ra ngoài. Khi cần so sánh password (chỉ trong quá trình đăng nhập), ta phải viết rõ `.select('+password')` để yêu cầu MongoDB trả về trường này.

**Luồng JWT - callbacks:**

```typescript
callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;    // Lần đầu đăng nhập: nhét id và role vào token
            token.role = user.role;
        }
        return token;  // Token này được mã hóa và lưu vào cookie
    },
    async session({ session, token }) {
        session.user.id = token.id;    // Mỗi request: đọc từ token ra session
        session.user.role = token.role;
        return session;
    }
}
```

Khi người dùng đăng nhập lần đầu: `authorize()` chạy, trả về user object. JWT callback lấy user.id và user.role nhét vào token, token được mã hóa bằng NEXTAUTH_SECRET rồi lưu vào cookie. Các request sau: token từ cookie được giải mã, session callback đọc id và role từ token, gắn vào session object. Kết quả: `getServerSession(authOptions)` ở bất kỳ API nào đều biết được user hiện tại là ai và có quyền gì.

---

### 2.3 Đăng ký người dùng - `src/app/api/auth/register/route.ts`

```typescript
export async function POST(request: NextRequest) {
    // Validate input
    if (password.length < 6) { return 400 error }

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) { return 400 error }

    // Tạo user - bcrypt hash xảy ra TỰ ĐỘNG trong pre-save hook của model
    const user = await User.create({ name, email, password, role: 'user' });
}
```

**Lý do hash password bằng pre-save hook thay vì trong API:**

Trong User model (`User.ts`), có định nghĩa `UserSchema.pre('save', ...)`. Đây là Mongoose middleware (hook) chạy tự động TRƯỚC khi lưu document. Hook này check nếu password thay đổi thì tự hash. Ưu điểm: dù create user ở đâu (API, seed, test...), mật khẩu đều được hash tự động, không cần lặp lại code hash ở mỗi nơi.

---

### 2.4 Tạo lịch trình AI - `src/app/api/itinerary/generate/route.ts`

**Bước 1: Lấy và lọc địa điểm từ DB**

```typescript
// Lấy tất cả địa điểm đang active, populate thông tin category và province
const rawDestinations = await Destination.find({ isActive: true })
    .populate('categoryId', 'name slug icon')
    .populate('provinceId', 'name code region')
    .lean();  // .lean() trả về plain JS object thay vì Mongoose Document, nhanh hơn
```

**Bước 2: Lọc theo sở thích người dùng**

```typescript
// Map preference của người dùng sang slug của category trong DB
const preferenceToCategory = {
    beach: ['bien-dao', 'bien'],
    mountain: ['nui-rung', 'nui', 'cao-nguyen'],
    food: ['am-thuc', 'cho-dem', 'pho-di-bo'],
    // ...
};

// Lọc những địa điểm có category slug khớp với sở thích
filteredDestinations = destinations.filter(d =>
    targetCategories.includes(d.categoryId?.slug || '')
);
```

**Bước 3: Lọc theo ngân sách**

```typescript
filteredDestinations = filteredDestinations.filter(d => {
    const avgPrice = (d.priceRange.min + d.priceRange.max) / 2;
    // Cho phép 50% linh hoạt để không quá cứng nhắc
    return avgPrice <= budgetPerPersonPerDay * 1.5;
}).sort((a, b) => (b.rating || 0) - (a.rating || 0));  // Ưu tiên rating cao
```

**Bước 4: Gửi prompt cho OpenAI**

Phần quan trọng: hệ thống không chỉ hỏi AI "hãy tạo lịch trình" mà gửi kèm DỮ LIỆU THỰC từ database:

```
Prompt gửi đi bao gồm:
- Ngân sách, số ngày, số người, sở thích
- Danh sách tối đa 10 địa điểm (đã lọc + sắp xếp)
- ID thực của từng địa điểm trong MongoDB
- Yêu cầu AI trả về JSON với destinationId từ danh sách đã cho
```

Tại sao làm vậy? Để AI không "hallucinate" (bịa đặt) địa điểm không có thật. AI chỉ được phép chọn từ danh sách cụ thể mình cung cấp.

**Bước 5: Xử lý response + Fallback**

```typescript
try {
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    aiResult = JSON.parse(cleanJson);
} catch {
    // Nếu AI trả về JSON sai format hoặc API lỗi
    return generateSmartFallbackItinerary(...);
}
```

Hàm `generateSmartFallbackItinerary()` là thuật toán tự viết, không dùng AI. Nó duyệt qua từng ngày, tính điểm cho mỗi địa điểm dựa trên rating và độ phù hợp ngân sách, chọn địa điểm có điểm cao nhất cho mỗi ngày, đảm bảo không chọn trùng. Đây là Safety Net - hệ thống luôn trả về kết quả dù OpenAI có lỗi.

---

### 2.5 AI Chatbot - `src/app/api/chat/route.ts`

```typescript
// Lấy dữ liệu địa điểm từ DB
const destinations = await Destination.find({ isActive: true })
    .select('name slug shortDescription priceRange rating provinceId categoryId')
    .lean();

// Build conversation messages
const messages = [
    { role: 'system', content: systemPrompt },    // Bối cảnh + dữ liệu địa điểm
    ...history.slice(-10).map(msg => ({...})),     // 10 tin nhắn gần nhất (context window)
    { role: 'user', content: message }             // Tin nhắn hiện tại
];
```

**Tại sao chỉ lấy 10 tin nhắn gần nhất?**

GPT-3.5-turbo có giới hạn context window (độ dài tối đa của toàn bộ conversation gửi đi). Nếu gửi quá nhiều tin nhắn, API sẽ báo lỗi hoặc tốn nhiều tiền. 10 tin nhắn là đủ để AI hiểu ngữ cảnh cuộc trò chuyện mà không quá tốn token.

**System prompt có gì?** Bao gồm: vai trò của AI (trợ lý du lịch), danh sách địa điểm dạng JSON, và quy tắc trả lời. Cách này gọi là "Retrieval-Augmented Generation" (RAG) đơn giản - inject dữ liệu thực vào context của AI thay vì chỉ dựa vào kiến thức có sẵn của model.

---

### 2.6 Quản lý Yêu thích - `src/app/api/favorites/route.ts`

```typescript
// Kiểm tra xem địa điểm đã được yêu thích chưa
const isFavorited = user.favorites.includes(destinationId);

// Toggle: nếu chưa có thì add, nếu có rồi thì remove
if (isFavorited) {
    user.favorites = user.favorites.filter(id => id.toString() !== destinationId);
} else {
    user.favorites.push(destinationId);
}
await user.save();
```

**Thiết kế DB:** Favorites không được lưu dưới dạng collection riêng mà là một mảng `favorites: [ObjectId]` trong chính document User. Khi cần hiển thị danh sách yêu thích, dùng `.populate('favorites', ...)` để MongoDB tự join và trả về thông tin đầy đủ của từng địa điểm.

Ưu điểm: Đơn giản, truy vấn nhanh (chỉ 1 document User). Nhược điểm: Nếu user có hàng nghìn yêu thích, document User sẽ phình to. Với quy mô hiện tại của ứng dụng, đây là thiết kế hợp lý.

---

## PHẦN 3: Một số CÂU HỎI

### "Tại sao chọn MongoDB thay vì MySQL/PostgreSQL?"

Trả lời: Dữ liệu du lịch có cấu trúc đa dạng và không đồng nhất. Ví dụ: địa điểm biển có trường "bestTime: ['Tháng 3-8']", địa điểm có thể có 1 ảnh hoặc 20 ảnh. Trong MySQL, lưu mảng ảnh cần bảng riêng (destinations_images), join phức tạp. MongoDB lưu trực tiếp mảng trong document, truy vấn đơn giản hơn. Ngoài ra, dữ liệu Destination còn có trường `priceRange` là object lồng nhau (nested object), rất tự nhiên trong MongoDB.

### "Tại sao không dùng SQL mà dùng Mongoose?"

Mongoose là ODM (Object Document Mapping) cho MongoDB, cho phép định nghĩa Schema (dù MongoDB không bắt buộc schema). Lý do dùng Mongoose: (1) TypeScript interface đảm bảo type safety, (2) Validation tự động khi save, (3) Middleware (pre-save hook để hash password), (4) Populate để thực hiện join giữa các collection.

### "Connection pooling hoạt động thế nào?"

Khi project build và chạy lần đầu, `connectDB()` được gọi. `cached.conn` là null nên tạo kết nối mới, lưu vào `global.mongoose`. Từ API request thứ 2, `cached.conn` đã có giá trị, hàm return ngay lập tức mà không kết nối lại. Điều này đặc biệt quan trọng khi deploy lên Vercel (serverless), vì các function invocations trong cùng container sẽ share kết nối.

### "JWT khác session cookie thế nào?"

Session cookie: server lưu thông tin phiên trong bộ nhớ hoặc DB, client chỉ có session ID. Mỗi request server phải tra cứu DB để xác thực.

JWT (JSON Web Token): thông tin được mã hóa và gửi về client (dưới dạng cookie). Mỗi request, server giải mã JWT bằng secret key, không cần tra cứu DB. Dự án dùng JWT nên xác thực nhanh hơn, phù hợp với Vercel serverless.

### "Middleware bảo vệ route admin như thế nào?"

Tại các API admin, đầu mỗi handler đều có:

```typescript
const session = await getServerSession(authOptions);
if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

`getServerSession()` đọc cookie JWT, giải mã, trả về session. Nếu không có session hoặc role không phải admin, trả về 401 ngay, không xử lý tiếp.

### "Next.js App Router khác Pages Router ở chỗ nào?"

Pages Router (cũ): pages/api/... - file-based routing, getServerSideProps, getStaticProps. App Router (mới - dự án đang dùng): app/... - Server Components mặc định, file route.ts cho API, file page.tsx cho UI. Server Components render trực tiếp trên server, không gửi JavaScript xuống client, tối ưu performance. Chỉ những component có interactivity mới cần 'use client'.

---

## PHẦN 3.1: CÂU HỎI VỀ YÊU CẦU CHỨC NĂNG

### Q: "Hệ thống xử lý xác thực như thế nào?"

**A:** Hệ thống dùng NextAuth.js với CredentialsProvider (email/password) và chiến lược JWT. Khi đăng nhập, server tìm user trong MongoDB, so sánh mật khẩu với hash bcrypt, nếu hợp lệ thì tạo JWT token chứa {id, email, name, role}. Token được mã hóa bằng NEXTAUTH_SECRET và lưu vào httpOnly cookie. Mỗi request sau, middleware giải mã token, không cần query DB, rất nhanh. Role được encode trong token nên API admin chỉ cần đọc session.user.role để phân quyền, không cần tra DB.

### Q: "AI tạo lịch trình dựa trên cơ sở nào?"

**A:** AI không tự bịa ra địa điểm. Hệ thống làm 3 bước trước khi gọi AI: (1) Lấy tất cả địa điểm đang active từ MongoDB, (2) Lọc theo sở thích người dùng và ngân sách, (3) Gửi danh sách tối đa 10 địa điểm phù hợp nhất (kèm ID thực, giá, mô tả) vào prompt. AI chỉ được phép chọn từ danh sách này. Sau khi nhận kết quả, code validate lại ID và map sang object database. Nếu AI trả về ID sai, hệ thống tự sửa bằng cách tìm theo tên. Nếu hoàn toàn fail, có fallback algorithm tự tính toán.

### Q: "Hệ thống phân quyền admin hoạt động thế nào?"

**A:** Có 2 lớp phân quyền. Lớp 1 - Route level: trang `/admin` kiểm tra session.user.role trước khi render. Nếu không phải admin, redirect về trang chủ. Lớp 2 - API level: mỗi API endpoint trong `/api/admin/` đều gọi `getServerSession()` và kiểm tra role ngay đầu handler. Nếu không hợp lệ, trả về 401 ngay lập tức. Cả hai lớp đều cần qua cùng một xác thực JWT, đảm bảo không có "back-door".


## PHẦN 5: FLOW NGƯỜI DÙNG

### Flow đăng nhập:
1. User nhập email/password trên `/auth/login`
2. Client gọi `signIn('credentials', { email, password })`
3. NextAuth gọi `authorize()`: connect DB, findOne user, comparePassword
4. Nếu OK: tạo JWT token chứa {id, name, email, role}, đặt cookie
5. Redirect về trang chủ, Header đọc session và hiển thị tên user

### Flow tạo lịch trình AI:
1. User điền form: ngân sách, số ngày, số người, chọn sở thích
2. Client POST `/api/itinerary/generate` với {budget, days, travelers, preferences}
3. Server: connect DB, lấy destinations, lọc theo sở thích + ngân sách
4. Build prompt kèm danh sách địa điểm thực, gọi OpenAI gpt-3.5-turbo
5. Parse JSON từ AI, map destinationId về object thực trong DB
6. Lưu Itinerary document vào MongoDB
7. Trả về itinerary đầy đủ cho client hiển thị

### Flow chat AI:
1. User gõ tin nhắn trong FloatingChat widget
2. Client POST `/api/chat` với {message, history}
3. Server: lấy danh sách destinations từ DB
4. Build messages array: [system prompt + data, ... history[-10], user message]
5. Gọi OpenAI, nhận text reply
6. Trả về reply cho client, client append vào history

### Flow admin quản lý:
1. Admin đăng nhập, session.user.role = 'admin'
2. Admin truy cập `/admin` - server check role, render Admin Dashboard
3. Admin thực hiện CRUD qua các API endpoint `/api/admin/...`
4. Mỗi API endpoint check session.user.role trước khi xử lý
