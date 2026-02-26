# YÊU CẦU CHỨC NĂNG & PHÂN TÍCH BÀI TOÁN
## iTravel - Website Du lịch Thông minh

---

## 1. BÀI TOÁN ĐẶT RA

### 1.1 Thực trạng

Người dùng Việt Nam muốn đi du lịch phải dùng nhiều nguồn rời rạc:
- **Mạng xã hội** (Facebook, TikTok): có ảnh đẹp nhưng thông tin không hệ thống, khó xác minh
- **Booking, Agoda**: chuyên đặt phòng, ít thông tin trải nghiệm địa điểm
- **Google Search**: kết quả phân tán, không tích hợp công cụ lập kế hoạch
- **Blog cá nhân**: thông tin thực tế nhưng không cập nhật thường xuyên

Theo khảo sát 500 người dùng internet Việt Nam (độ tuổi 18–45):

| Phương thức tìm kiếm thông tin du lịch | Tỷ lệ |
|----------------------------------------|-------|
| Google Search                          | 74%   |
| Mạng xã hội (Facebook, TikTok)         | 68%   |
| Website đặt phòng (Booking, Agoda)     | 52%   |
| Blog du lịch cá nhân                   | 35%   |
| **Ứng dụng du lịch chuyên dụng**       | **28%** |

Tỷ lệ 28% cho ứng dụng du lịch chuyên dụng cho thấy **cơ hội lớn** cho nền tảng tích hợp đầy đủ, đặc biệt tích hợp AI để cá nhân hóa trải nghiệm.

### 1.2 Vấn đề cần giải quyết

1. **Thiếu nền tảng tập trung** — người dùng mất thời gian tra cứu ở nhiều nơi
2. **Khó lên lịch trình** — cần kiến thức về địa lý, giao thông, mùa du lịch, ngân sách
3. **Thiếu cá nhân hóa** — gợi ý chung chung, không dựa trên sở thích và ngân sách từng người
4. **Thông tin không xác minh** — review trên mạng xã hội thiếu khách quan
5. **Địa điểm địa phương chưa được quảng bá** — nhiều điểm đẹp bị bỏ qua

### 1.3 Giải pháp

Xây dựng **iTravel** — nền tảng web tập trung cho phép:
- Tìm kiếm, lọc, xem thông tin địa điểm du lịch Việt Nam ở một chỗ
- Đọc đánh giá được kiểm duyệt từ cộng đồng
- Lên lịch trình tự động bằng AI (GPT-3.5-turbo) dựa trên ngân sách + sở thích
- Chat với AI trợ lý du lịch 24/7

---

## 2. ACTOR VÀ MỤC TIÊU

| STT | Actor         | Mô tả                                                         |
|-----|---------------|---------------------------------------------------------------|
| 1   | Guest (Khách) | Chưa đăng nhập, xem thông tin công khai                      |
| 2   | User          | Đã đăng ký, dùng đầy đủ tính năng cá nhân                   |
| 3   | Admin         | Quản trị toàn bộ nội dung và người dùng                      |
| 4   | AI System     | OpenAI GPT-3.5-turbo — tạo lịch trình & chatbot tư vấn       |

### Mục tiêu của từng Actor

**Guest:** Xem trang chủ, duyệt danh sách địa điểm, xem chi tiết, đọc đánh giá

**User:** Đăng nhập/đăng ký, thêm yêu thích, viết đánh giá, tạo lịch trình AI, chat với AI, quản lý thông tin cá nhân, quản lý chuyến đi, xem lịch sử lịch trình

**Admin:** Quản lý địa điểm (CRUD), quản lý danh mục, quản lý tỉnh/thành, duyệt đánh giá, quản lý người dùng, xem thống kê, khởi tạo dữ liệu mẫu

**AI System:** Nhận input từ user (ngân sách, ngày, sở thích), kết hợp dữ liệu DB thực, trả về lịch trình tối ưu và câu trả lời tư vấn du lịch bằng tiếng Việt

---

## 3. USE-CASE CHÍNH (19 UC)

| Mã   | Tên Use-case                        | Actor         |
|------|-------------------------------------|---------------|
| UC01 | Xem trang chủ                       | Guest, User   |
| UC02 | Duyệt & tìm kiếm địa điểm          | Guest, User   |
| UC03 | Xem chi tiết địa điểm              | Guest, User   |
| UC04 | Đăng ký tài khoản                   | Guest         |
| UC05 | Đăng nhập hệ thống                  | Guest         |
| UC06 | Thêm/xóa địa điểm yêu thích        | User          |
| UC07 | Viết đánh giá, chấm điểm           | User          |
| UC08 | Tạo lịch trình du lịch bằng AI     | User          |
| UC09 | Chat với AI trợ lý du lịch          | User          |
| UC10 | Cập nhật thông tin cá nhân          | User          |
| UC11 | Đổi mật khẩu                        | User          |
| UC12 | Quản lý chuyến đi                   | User          |
| UC13 | Quản lý địa điểm (CRUD)             | Admin         |
| UC14 | Quản lý danh mục                    | Admin         |
| UC15 | Quản lý người dùng                  | Admin         |
| UC16 | Duyệt/từ chối đánh giá              | Admin         |
| UC17 | Xem thống kê tổng quan              | Admin         |
| UC18 | Khởi tạo dữ liệu mẫu               | Admin         |
| UC19 | Quản lý chuyến đi người dùng        | Admin         |

---

## 4. YÊU CẦU CHỨC NĂNG (FR)

| Mã   | Yêu cầu chức năng                                                              | Ưu tiên     | API Route thực tế               |
|------|---------------------------------------------------------------------------------|-------------|----------------------------------|
| FR01 | Đăng ký tài khoản với email/mật khẩu (validate, hash bcrypt, check trùng)     | Cao         | `POST /api/auth/register`        |
| FR02 | Đăng nhập bằng email/mật khẩu, cấp JWT token                                 | Cao         | `POST /api/auth/[...nextauth]`   |
| FR03 | Trang chủ: hero section, danh mục, địa điểm nổi bật, thống kê                 | Cao         | `GET /api/destinations?featured` |
| FR04 | Tìm kiếm địa điểm theo từ khóa (text index MongoDB)                           | Cao         | `GET /api/destinations?q=...`    |
| FR05 | Lọc địa điểm theo danh mục và tỉnh/thành, kết hợp với tìm kiếm               | Cao         | `GET /api/destinations?category=&province=` |
| FR06 | Xem chi tiết địa điểm: gallery, mô tả, giá, tiện ích, đánh giá               | Cao         | `GET /api/destinations/[slug]`   |
| FR07 | Thêm/xóa địa điểm yêu thích (toggle, yêu cầu đăng nhập)                      | Trung bình  | `POST /api/favorites`            |
| FR08 | Viết đánh giá và chấm điểm (cần admin duyệt trước khi hiển thị)               | Trung bình  | `POST /api/reviews`              |
| FR09 | Tạo lịch trình AI: lọc DB → gọi GPT-3.5 → lưu Itinerary → trả kết quả       | Cao         | `POST /api/itinerary/generate`   |
| FR10 | Chatbot AI: duy trì lịch sử 10 tin nhắn, trả lời bằng tiếng Việt             | Trung bình  | `POST /api/chat`                 |
| FR11 | Cập nhật thông tin cá nhân (tên, avatar, bio)                                 | Trung bình  | `PUT /api/user/profile`          |
| FR12 | Đổi mật khẩu (xác nhận mật khẩu cũ, hash mới)                                | Trung bình  | `PUT /api/user/password`         |
| FR13 | Admin: CRUD địa điểm (thêm, sửa, xóa, ẩn/hiện, đánh dấu nổi bật)            | Cao         | `/api/admin/destinations`        |
| FR14 | Admin: CRUD danh mục du lịch                                                   | Cao         | `/api/admin/categories`          |
| FR15 | Admin: quản lý người dùng (xem, đổi role, xóa)                                | Cao         | `/api/admin/users`               |
| FR16 | Admin: duyệt (approve) hoặc từ chối (xóa) đánh giá người dùng                | Trung bình  | `/api/admin/reviews`             |
| FR17 | Admin: xem thống kê (số địa điểm, user, review, lượt xem)                    | Trung bình  | `GET /api/admin/stats`           |
| FR18 | Admin: khởi tạo dữ liệu mẫu (seed categories, provinces, destinations, users) | Thấp        | `POST /api/seed`                 |
| FR19 | User: tạo và quản lý chuyến đi cá nhân (thêm điểm đến, cập nhật trạng thái)  | Trung bình  | `/api/trips`                     |

---

## 5. YÊU CẦU PHI CHỨC NĂNG (NFR)

| Mã    | Loại              | Yêu cầu cụ thể                                                    |
|-------|-------------------|--------------------------------------------------------------------|
| NFR01 | Hiệu suất         | Tải trang < 3 giây; API response < 500ms cho query thông thường   |
| NFR02 | Bảo mật           | bcryptjs 12 salt rounds; JWT authentication; HTTPS; env vars server-only |
| NFR03 | Khả năng mở rộng  | Kiến trúc modular, dễ thêm tính năng mới (thêm file route.ts là xong) |
| NFR04 | Tương thích       | Chrome, Firefox, Safari, Edge phiên bản mới nhất                  |
| NFR05 | Responsive        | Từ 375px (mobile) đến 1920px (desktop), dùng Tailwind breakpoints |
| NFR06 | Khả dụng          | 99.9% uptime, đảm bảo bởi Vercel SLA                             |
| NFR07 | SEO               | Server-Side Rendering cho trang địa điểm, metadata đầy đủ        |
| NFR08 | UX                | Giao diện tiếng Việt, animation mượt, skeleton loading, toast notification |

---

## 6. RÀNG BUỘC HỆ THỐNG

| STT | Ràng buộc                                                               |
|-----|-------------------------------------------------------------------------|
| 1   | Framework bắt buộc: Next.js 16 (App Router)                            |
| 2   | Database: MongoDB (local Docker hoặc Atlas), ODM: Mongoose              |
| 3   | Auth: NextAuth.js với chiến lược JWT + CredentialsProvider              |
| 4   | AI features: cần `OPENAI_API_KEY` hợp lệ — có fallback nếu lỗi        |
| 5   | Hình ảnh: từ Unsplash, khai báo `remotePatterns` trong `next.config.ts` |
| 6   | Deployment: Vercel (cấu hình `vercel.json`)                             |
| 7   | Ngôn ngữ giao diện: Tiếng Việt                                         |

---

## 7. CẤU TRÚC DỮ LIỆU — 7 COLLECTIONS

| Collection    | Mô tả                                      | Quan hệ chính                        |
|---------------|--------------------------------------------|--------------------------------------|
| `users`       | Tài khoản người dùng                       | favorites[] → destinations._id      |
| `destinations`| Địa điểm du lịch                           | categoryId → categories, provinceId → provinces |
| `categories`  | Danh mục (Biển đảo, Núi rừng, ...)         | —                                    |
| `provinces`   | Tỉnh/thành phố                             | region: Bắc/Trung/Nam                |
| `reviews`     | Đánh giá người dùng                         | userId → users, destinationId → destinations |
| `trips`       | Chuyến đi cá nhân                          | userId → users, destinations[].destinationId |
| `itineraries` | Lịch trình AI đã tạo                       | userId → users, items[].destinationId → destinations |

---

## 8. PHẠM VI BÀI TOÁN

**Trong phạm vi:**
- Quản lý thông tin địa điểm du lịch Việt Nam
- Tìm kiếm, lọc, đánh giá địa điểm
- Tạo và quản lý chuyến đi cá nhân
- Lịch trình AI và chatbot AI
- Hệ thống quản trị nội dung (Admin)

**Ngoài phạm vi (không triển khai):**
- Đặt phòng, mua vé (chỉ gợi ý, không booking)
- Thanh toán trực tuyến
- Ứng dụng di động native
- Real-time tracking vị trí GPS
