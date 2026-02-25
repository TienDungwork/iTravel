Tên đề tài: iTravel - Website Du lịch Thông minh
Loại hệ thống: Web (Full-stack)
Lĩnh vực áp dụng: Du lịch
Công nghệ sử dụng:
- Backend: Next.js 16 API Routes (Node.js), Mongoose ODM
- Frontend: Next.js 16 App Router, React 19, TypeScript
- Database: MongoDB 7
- Authentication: NextAuth.js (JWT + CredentialsProvider, bcryptjs)
- AI: OpenAI API (GPT-3.5-turbo)
- Hosting/Deployment: Vercel (Frontend + Backend), Docker (MongoDB)

----------------------------------------
2.5 Công cụ sử dụng
----------------------------------------

2.5.1 Công cụ Backend

a) Next.js 16 (App Router - API Routes)

Next.js là một framework mã nguồn mở xây dựng trên nền tảng React, được phát triển bởi Vercel. Phiên bản 16 sử dụng kiến trúc App Router mới, cho phép xây dựng cả frontend và backend trong cùng một dự án thông qua cơ chế API Routes. Việc lựa chọn Next.js làm nền tảng backend xuất phát từ nhiều lý do:

- Kiến trúc Fullstack thống nhất: Next.js cho phép định nghĩa các API endpoint trực tiếp trong thư mục app/api/ bằng các file route.ts, sử dụng các hàm GET, POST, PUT, DELETE tương ứng với các phương thức HTTP. Điều này giúp giảm thiểu độ phức tạp khi quản lý hai dự án backend và frontend riêng biệt.
- Server-Side Rendering (SSR) và Static Site Generation (SSG): Hỗ trợ render trang phía server giúp tăng tốc độ tải trang và cải thiện SEO, đặc biệt quan trọng với website du lịch cần được tìm thấy trên công cụ tìm kiếm.
- Middleware và Route Handlers: Hệ thống middleware cho phép xử lý xác thực, kiểm tra quyền truy cập trước khi request đến API endpoint, đảm bảo tính bảo mật của hệ thống.

b) Mongoose ODM (phiên bản 9.0.2)

Mongoose là thư viện Object Document Mapping (ODM) cho MongoDB và Node.js. Mongoose được sử dụng để định nghĩa cấu trúc dữ liệu (Schema), xác thực dữ liệu đầu vào, và tương tác với cơ sở dữ liệu MongoDB một cách có cấu trúc. Trong dự án, Mongoose được sử dụng để định nghĩa 7 model chính: User, Destination, Category, Province, Review, Trip và Itinerary. Mỗi model được định nghĩa với TypeScript interface tương ứng, đảm bảo tính an toàn kiểu dữ liệu xuyên suốt ứng dụng.

c) MongoDB 7

MongoDB là hệ quản trị cơ sở dữ liệu NoSQL hướng tài liệu (document-oriented), lưu trữ dữ liệu dưới dạng JSON-like (BSON). Lý do lựa chọn MongoDB:

- Tính linh hoạt của schema: Dữ liệu du lịch có cấu trúc đa dạng (địa điểm, đánh giá, lịch trình, chuyến đi), MongoDB cho phép lưu trữ các tài liệu với cấu trúc khác nhau trong cùng một collection mà không cần migration phức tạp.
- Hiệu suất truy vấn cao: Hỗ trợ indexing linh hoạt (text index cho tìm kiếm, compound index cho lọc dữ liệu) giúp tăng tốc độ truy vấn. Hệ thống sử dụng text index trên trường name và description của Destination, compound index trên categoryId và provinceId.
- Tích hợp tốt với hệ sinh thái JavaScript/TypeScript: MongoDB làm việc tốt với Mongoose và Node.js, tạo nên một hệ sinh thái đồng nhất.

Trong môi trường phát triển, MongoDB được triển khai thông qua Docker container (mongo:7) với Docker Compose, giúp đảm bảo môi trường nhất quán giữa các máy phát triển.

d) NextAuth.js (phiên bản 4.24.13)

NextAuth.js là thư viện xác thực dành cho Next.js, hỗ trợ nhiều phương thức đăng nhập (Credentials, OAuth, v.v.). Trong dự án, NextAuth.js được cấu hình với CredentialsProvider (xác thực bằng email/mật khẩu) và chiến lược phiên JWT (JSON Web Token). Lý do lựa chọn:

- Tích hợp sâu với Next.js: NextAuth.js được thiết kế riêng cho Next.js, cung cấp hook useSession() để truy cập thông tin phiên người dùng từ phía client.
- Bảo mật: Mật khẩu được hash bằng bcryptjs với salt rounds = 12 trước khi lưu vào database. JWT token được sử dụng để duy trì phiên đăng nhập, tránh lưu trữ phiên trên server.
- Phân quyền: Hệ thống hỗ trợ phân biệt vai trò người dùng (user/admin) thông qua trường role trong JWT token, cho phép kiểm soát quyền truy cập tại các API endpoint.

e) OpenAI API (thư viện openai phiên bản 6.15.0)

OpenAI API được sử dụng để tích hợp trí tuệ nhân tạo vào hệ thống, cụ thể là hai tính năng chính:

- AI Itinerary Generator: Sử dụng model GPT-3.5-turbo để tự động tạo lịch trình du lịch dựa trên ngân sách, số ngày, số người và sở thích của người dùng. Hệ thống gửi thông tin các địa điểm du lịch có sẵn trong database làm ngữ cảnh (context) cho AI, giúp AI đưa ra gợi ý phù hợp với thực tế.
- AI Chatbot (Floating Chat): Sử dụng GPT-3.5-turbo để tạo trợ lý du lịch ảo, hỗ trợ người dùng tìm địa điểm phù hợp, gợi ý lịch trình, trả lời các câu hỏi về du lịch Việt Nam. Chatbot có khả năng duy trì lịch sử hội thoại (tối đa 10 tin nhắn gần nhất) để hiểu ngữ cảnh cuộc trò chuyện.

2.5.2 Công cụ Frontend

a) React 19

React là thư viện JavaScript mã nguồn mở do Meta (Facebook) phát triển, được sử dụng để xây dựng giao diện người dùng theo mô hình component-based. Phiên bản 19 mang đến nhiều cải tiến về hiệu suất và Developer Experience. React được sử dụng thông qua Next.js App Router, tận dụng cơ chế Server Components và Client Components ('use client') để tối ưu hóa việc render.

b) TypeScript 5

TypeScript là ngôn ngữ lập trình mở rộng của JavaScript, bổ sung hệ thống kiểu dữ liệu tĩnh (static typing). Việc sử dụng TypeScript mang lại nhiều lợi ích:

- Phát hiện lỗi tại thời điểm biên dịch, giảm thiểu lỗi runtime.
- Cung cấp IntelliSense và auto-completion trong IDE, tăng năng suất lập trình.
- Định nghĩa interface rõ ràng cho các model dữ liệu (IUser, IDestination, ICategory, v.v.), tạo hợp đồng (contract) giữa frontend và backend.
- Đảm bảo tính nhất quán kiểu dữ liệu trong toàn bộ ứng dụng.

c) Tailwind CSS 4

Tailwind CSS là framework CSS theo phương pháp utility-first, cung cấp các lớp CSS sẵn có (utility classes) để xây dựng giao diện nhanh chóng mà không cần viết CSS tùy chỉnh. Phiên bản 4 cải thiện hiệu suất và giảm kích thước file CSS sản xuất. Lý do lựa chọn:

- Phát triển nhanh: Thiết kế trực tiếp trong JSX/TSX bằng các utility classes, không cần chuyển đổi giữa file HTML và CSS.
- Tùy chỉnh dễ dàng: Hệ thống có thể định nghĩa màu sắc, font chữ, spacing riêng thông qua cấu hình.
- Responsive Design: Cung cấp hệ thống breakpoint sẵn có (sm, md, lg, xl) để xây dựng giao diện tương thích nhiều kích thước màn hình.

d) Lucide React (phiên bản 0.562.0)

Lucide React là thư viện icon mã nguồn mở, cung cấp hơn 1000 icon vector với thiết kế nhất quán, hỗ trợ tùy chỉnh kích thước, màu sắc, và stroke width. Dự án sử dụng Lucide React để hiển thị các icon trên giao diện như MapPin, Calendar, Star, Heart, Search, v.v.

2.5.3 Công cụ phát triển chung

a) Visual Studio Code

Visual Studio Code (VS Code) là trình soạn thảo mã nguồn của Microsoft, được sử dụng làm môi trường phát triển tích hợp (IDE) chính cho dự án. VS Code hỗ trợ tốt TypeScript, React/Next.js với các extension như ESLint, Prettier, Tailwind CSS IntelliSense.

b) Git và GitHub

Git là hệ thống quản lý phiên bản phân tán, được sử dụng để theo dõi lịch sử thay đổi mã nguồn. GitHub là nền tảng lưu trữ mã nguồn từ xa (remote repository), hỗ trợ cộng tác nhóm và quản lý dự án thông qua Issues, Pull Requests.

c) Docker và Docker Compose

Docker là nền tảng ảo hóa ứng dụng, cho phép đóng gói ứng dụng và các phụ thuộc vào container độc lập. Docker Compose được sử dụng để định nghĩa và quản lý môi trường phát triển cục bộ, cụ thể là khởi động MongoDB server (mongo:7) với cấu hình nhất quán (port 27017, volume lưu trữ dữ liệu). File docker-compose.yml của dự án định nghĩa service mongodb với cấu hình tự động khởi động lại (restart: unless-stopped) và volume persistent để bảo toàn dữ liệu.

d) Node.js và npm

Node.js là môi trường chạy JavaScript phía server, làm nền tảng cho Next.js và các công cụ phát triển. npm (Node Package Manager) được sử dụng để quản lý các thư viện phụ thuộc (dependencies) của dự án.

e) ESLint

ESLint là công cụ phân tích mã nguồn tĩnh (static code analysis), giúp phát hiện và cảnh báo các lỗi lập trình, vi phạm quy ước coding. Dự án sử dụng eslint-config-next để áp dụng các quy tắc lint đặc thù cho Next.js.

2.5.4 Công cụ thiết kế và quản lý

a) Vercel

Vercel là nền tảng điện toán đám mây (cloud platform) được thiết kế riêng cho các ứng dụng Next.js. Dự án sử dụng Vercel để triển khai (deploy) ứng dụng lên môi trường sản xuất (production). Vercel cung cấp:

- CI/CD tự động: Tự động build và deploy khi có thay đổi trên nhánh chính của repository.
- Domain management: Quản lý tên miền và HTTPS tự động.
- Serverless Functions: Các API Routes của Next.js được tự động triển khai dưới dạng serverless functions.
- Edge Network: Phân phối nội dung qua mạng CDN toàn cầu, giảm độ trễ truy cập.

b) MongoDB Atlas (tùy chọn)

MongoDB Atlas là dịch vụ cơ sở dữ liệu đám mây (Database as a Service) do MongoDB Inc. cung cấp. Hệ thống hỗ trợ kết nối đến cả MongoDB cục bộ (localhost) và MongoDB Atlas thông qua biến môi trường MONGODB_URI, cho phép linh hoạt chuyển đổi giữa môi trường phát triển và sản xuất.

2.5.5 Công cụ Testing

a) ESLint (Kiểm thử tĩnh)

ESLint được sử dụng như công cụ kiểm thử tĩnh, phân tích mã nguồn để phát hiện các lỗi cú pháp, lỗi logic và vi phạm quy ước trước khi chạy ứng dụng. Lệnh npm run lint được sử dụng để thực hiện kiểm tra toàn bộ mã nguồn.

b) Kiểm thử thủ công (Manual Testing)

Quá trình kiểm thử thủ công được thực hiện thông qua trình duyệt web, kiểm tra các chức năng của hệ thống bao gồm: đăng ký/đăng nhập, tìm kiếm địa điểm, tạo lịch trình AI, quản lý yêu thích, đánh giá, và các chức năng quản trị. Các test case cụ thể được trình bày tại mục 4.3.

c) Browser Developer Tools

Công cụ phát triển tích hợp trong trình duyệt (Chrome DevTools, Firefox DevTools) được sử dụng để kiểm tra và debug giao diện người dùng, phân tích hiệu suất tải trang, kiểm tra Network requests và Response từ API, và debug JavaScript/TypeScript phía client.

----------------------------------------
CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
----------------------------------------

3.1 Phân tích thực trạng

3.1.1 Phân tích thị trường du lịch

a) Tổng quan thị trường du lịch Việt Nam

Ngành du lịch Việt Nam đang trên đà phục hồi mạnh mẽ sau đại dịch COVID-19. Theo số liệu từ Tổng cục Du lịch Việt Nam, năm 2024, Việt Nam đón khoảng 17,5 triệu lượt khách quốc tế, tăng 38,9% so với năm 2023. Du lịch nội địa cũng ghi nhận sự tăng trưởng ấn tượng với khoảng 110 triệu lượt khách, doanh thu du lịch ước đạt khoảng 840 nghìn tỷ đồng.

Xu hướng chuyển đổi số trong ngành du lịch đang diễn ra mạnh mẽ trên thế giới và Việt Nam cũng không ngoại lệ. Theo báo cáo của Statista (2024), thị trường du lịch trực tuyến toàn cầu đạt giá trị khoảng 433 tỷ USD, dự kiến tăng lên 690 tỷ USD vào năm 2028. Tại Việt Nam, tỷ lệ người dùng internet đạt khoảng 78%, với hơn 72 triệu người sử dụng smartphone, tạo nên tiềm năng lớn cho các nền tảng du lịch số.

b) Thực trạng hiện tại

Hiện nay, người dùng Việt Nam thu thập thông tin du lịch từ nhiều nguồn riêng lẻ và thiếu sự kết nối:

- Các website du lịch như Traveloka, Booking.com, Agoda chủ yếu tập trung vào đặt phòng khách sạn và vé máy bay, ít cung cấp thông tin chi tiết về điểm đến và trải nghiệm du lịch địa phương.
- Mạng xã hội (Facebook, Instagram, TikTok) cung cấp thông tin phong phú nhưng thiếu tính hệ thống, khó xác minh và không có công cụ lập kế hoạch tích hợp.
- Các blog du lịch cá nhân cung cấp trải nghiệm thực tế nhưng thông tin phân tán, không được cập nhật thường xuyên và thiếu tính tương tác.
- Các ứng dụng du lịch hiện tại ít tích hợp trí tuệ nhân tạo để cá nhân hóa trải nghiệm và hỗ trợ người dùng lên kế hoạch.

c) Các vấn đề tồn tại

- Thiếu nền tảng tập trung: Người dùng phải truy cập nhiều website và ứng dụng khác nhau để tìm kiếm thông tin, so sánh giá cả, đọc đánh giá và lập lịch trình. Điều này gây mất thời gian và không hiệu quả.
- Khó khăn trong việc lập lịch trình: Việc tự lên kế hoạch du lịch đòi hỏi kiến thức về địa lý, giao thông, giá cả và mùa du lịch. Không phải ai cũng có đủ kinh nghiệm và thời gian để lập một lịch trình hợp lý.
- Thiếu tính cá nhân hóa: Các nền tảng du lịch hiện tại thường đưa ra gợi ý chung chung, không dựa trên ngân sách, sở thích và nhu cầu cụ thể của từng người dùng.
- Thông tin không được xác minh: Đánh giá và thông tin trên mạng xã hội thường thiếu tính khách quan, có thể bị thao túng hoặc không chính xác.
- Thiếu quảng bá du lịch địa phương: Nhiều địa điểm du lịch đẹp và độc đáo tại các địa phương chưa được quảng bá rộng rãi trên các nền tảng số.

d) Số liệu minh họa

Bảng 3.1: Khảo sát phương thức tìm kiếm thông tin du lịch của người Việt Nam (2024)

| Phương thức                          | Tỷ lệ sử dụng (%) |
|--------------------------------------|-------------------|
| Mạng xã hội (Facebook, TikTok)       | 68                |
| Website đặt phòng (Booking, Agoda)   | 52                |
| Google Search                        | 74                |
| Bạn bè/người thân giới thiệu         | 45                |
| Ứng dụng du lịch chuyên dụng         | 28                |
| Blog du lịch cá nhân                 | 35                |
| Website du lịch địa phương           | 15                |

(Nguồn: Khảo sát giả định trên 500 người dùng internet Việt Nam, độ tuổi 18-45)

Nhận xét: Môi trường tìm kiếm thông tin du lịch còn phân tán, chưa có nền tảng nào chiếm ưu thế tuyệt đối. Tỷ lệ sử dụng ứng dụng du lịch chuyên dụng còn thấp (28%), cho thấy cơ hội lớn cho các nền tảng du lịch số mới, đặc biệt là các nền tảng tích hợp AI để nâng cao trải nghiệm người dùng.

3.1.2 Phân tích nhu cầu người dùng

Hệ thống iTravel xác định ba nhóm người dùng chính (Actor):

a) Khách du lịch (User)

Khách du lịch là nhóm người dùng chính của hệ thống, bao gồm cả khách nội địa và quốc tế. Nhu cầu cốt lõi:

- Tìm kiếm địa điểm du lịch: Người dùng muốn tìm kiếm địa điểm du lịch theo danh mục (biển đảo, núi rừng, di tích lịch sử, ẩm thực, v.v.), theo tỉnh/thành phố, hoặc bằng từ khóa.
- Xem thông tin chi tiết địa điểm: Bao gồm hình ảnh, mô tả, giá cả, thời điểm lý tưởng, tiện ích, đánh giá từ người dùng khác.
- Lên lịch trình du lịch: Người dùng muốn được hỗ trợ lên kế hoạch du lịch phù hợp với ngân sách, thời gian và sở thích cá nhân. Đây là nhu cầu mà trí tuệ nhân tạo có thể đáp ứng hiệu quả.
- Lưu địa điểm yêu thích: Người dùng muốn đánh dấu và lưu lại các địa điểm quan tâm để xem lại sau.
- Đánh giá và chia sẻ trải nghiệm: Người dùng muốn viết đánh giá, chấm điểm các địa điểm đã thăm.
- Tư vấn du lịch: Người dùng muốn được tư vấn trực tuyến về các vấn đề liên quan đến du lịch.

Bảng 3.2: Khảo sát nhu cầu người dùng du lịch (khách du lịch)

| Nhu cầu                              | Tỷ lệ quan tâm (%) |
|---------------------------------------|-------------------|
| Tìm kiếm địa điểm theo sở thích       | 82                |
| AI gợi ý lịch trình tự động            | 76                |
| Xem đánh giá từ người dùng khác        | 88                |
| Lưu địa điểm yêu thích                 | 65                |
| Tư vấn du lịch tự động (AI Chatbot)    | 71                |
| Thông tin giá cả và chi phí            | 90                |

(Nguồn: Khảo sát giả định trên 300 người dùng mục tiêu)

b) Quản trị viên (Admin)

Quản trị viên là người quản lý toàn bộ nội dung và người dùng của hệ thống. Nhu cầu cốt lõi:

- Quản lý địa điểm du lịch: Thêm mới, chỉnh sửa, xóa địa điểm; quản lý trạng thái (ẩn/hiện, nổi bật).
- Quản lý danh mục và tỉnh thành: Thêm mới, chỉnh sửa, xóa các danh mục du lịch và tỉnh thành.
- Quản lý người dùng: Xem danh sách, cập nhật vai trò (user/admin), xóa tài khoản.
- Quản lý đánh giá: Xem, duyệt, từ chối hoặc xóa đánh giá của người dùng.
- Thống kê tổng quan: Xem các số liệu thống kê về địa điểm, người dùng, đánh giá, lượt xem.
- Khởi tạo dữ liệu mẫu: Tạo dữ liệu demo cho mục đích trình diễn và kiểm thử.

c) AI (Trí tuệ nhân tạo)

AI là "actor" đặc biệt trong hệ thống, đóng vai trò hỗ trợ xử lý thông minh. Vai trò:

- Tạo lịch trình tự động: Nhận đầu vào từ người dùng (ngân sách, số ngày, số người, sở thích), kết hợp với dữ liệu địa điểm trong database, sử dụng model ngôn ngữ GPT-3.5-turbo đề xuất lịch trình tối ưu.
- Tư vấn du lịch: Hoạt động như trợ lý ảo, trả lời các câu hỏi về du lịch, gợi ý địa điểm phù hợp dựa trên ngữ cảnh cuộc hội thoại.

3.2 Phân tích yêu cầu hệ thống

3.2.1 Liệt kê Actor

Bảng 3.3: Danh sách Actor của hệ thống

| STT | Actor         | Mô tả                                                       |
|-----|---------------|--------------------------------------------------------------|
| 1   | Khách (Guest) | Người dùng chưa đăng nhập, có thể xem thông tin công khai   |
| 2   | User          | Người dùng đã đăng ký và đăng nhập                          |
| 3   | Admin         | Quản trị viên hệ thống                                      |
| 4   | AI System     | Hệ thống trí tuệ nhân tạo (OpenAI GPT-3.5-turbo)           |

3.2.2 Mục tiêu từng Actor

Bảng 3.4: Mục tiêu của từng Actor

| Actor         | Mục tiêu chính                                                                                |
|---------------|-----------------------------------------------------------------------------------------------|
| Khách (Guest) | Xem trang chủ, duyệt danh sách địa điểm, xem chi tiết địa điểm, đọc đánh giá                |
| User          | Đăng nhập/đăng ký, yêu thích địa điểm, viết đánh giá, tạo lịch trình AI, chat với AI,       |
|               | quản lý thông tin cá nhân, quản lý chuyến đi, xem lịch sử lịch trình AI                     |
| Admin         | Quản lý địa điểm (CRUD), quản lý danh mục, quản lý người dùng, quản lý đánh giá,            |
|               | xem thống kê, khởi tạo dữ liệu mẫu                                                          |
| AI System     | Tạo lịch trình du lịch tự động, tư vấn du lịch qua chatbot, phân tích nhu cầu người dùng    |

3.2.3 Use-case chính

Danh sách các Use-case chính của hệ thống:

UC01. Xem trang chủ (Guest, User)
UC02. Duyệt danh sách địa điểm với bộ lọc và tìm kiếm (Guest, User)
UC03. Xem chi tiết địa điểm (Guest, User)
UC04. Đăng ký tài khoản (Guest)
UC05. Đăng nhập hệ thống (Guest)
UC06. Thêm/xóa địa điểm yêu thích (User)
UC07. Viết đánh giá địa điểm (User)
UC08. Tạo lịch trình du lịch bằng AI (User)
UC09. Chat với AI trợ lý du lịch (User)
UC10. Quản lý thông tin cá nhân (User)
UC11. Đổi mật khẩu (User)
UC12. Quản lý chuyến đi (User)
UC13. Quản lý địa điểm du lịch - CRUD (Admin)
UC14. Quản lý danh mục (Admin)
UC15. Quản lý người dùng (Admin)
UC16. Quản lý/duyệt đánh giá (Admin)
UC17. Xem thống kê tổng quan (Admin)
UC18. Khởi tạo dữ liệu mẫu (Admin)
UC19. Quản lý chuyến đi của người dùng (Admin)

3.2.4 Yêu cầu chức năng

Bảng 3.5: Yêu cầu chức năng của hệ thống

| Mã    | Yêu cầu chức năng                                               | Độ ưu tiên |
|-------|------------------------------------------------------------------|------------|
| FR01  | Hệ thống cho phép người dùng đăng ký tài khoản với email/mật khẩu| Cao        |
| FR02  | Hệ thống cho phép người dùng đăng nhập bằng email/mật khẩu       | Cao        |
| FR03  | Hệ thống hiển thị trang chủ với hero section, danh mục, địa điểm nổi bật | Cao |
| FR04  | Hệ thống cho phép tìm kiếm địa điểm theo từ khóa                | Cao        |
| FR05  | Hệ thống cho phép lọc địa điểm theo danh mục và tỉnh/thành      | Cao        |
| FR06  | Hệ thống hiển thị chi tiết địa điểm (hình ảnh, mô tả, giá, đánh giá) | Cao  |
| FR07  | Hệ thống cho phép người dùng thêm/xóa địa điểm yêu thích        | Trung bình |
| FR08  | Hệ thống cho phép người dùng viết đánh giá và chấm điểm địa điểm | Trung bình |
| FR09  | Hệ thống sử dụng AI để tạo lịch trình du lịch tự động           | Cao        |
| FR10  | Hệ thống cung cấp chatbot AI tư vấn du lịch                     | Trung bình |
| FR11  | Hệ thống cho phép người dùng cập nhật thông tin cá nhân          | Trung bình |
| FR12  | Hệ thống cho phép người dùng đổi mật khẩu                       | Trung bình |
| FR13  | Hệ thống cho phép Admin quản lý địa điểm (thêm, sửa, xóa)      | Cao        |
| FR14  | Hệ thống cho phép Admin quản lý danh mục                        | Cao        |
| FR15  | Hệ thống cho phép Admin quản lý người dùng                      | Cao        |
| FR16  | Hệ thống cho phép Admin duyệt/từ chối đánh giá                  | Trung bình |
| FR17  | Hệ thống hiển thị thống kê tổng quan cho Admin                  | Trung bình |
| FR18  | Hệ thống cho phép Admin khởi tạo dữ liệu mẫu                   | Thấp       |
| FR19  | Hệ thống cho phép người dùng quản lý chuyến đi cá nhân          | Trung bình |

3.2.5 Yêu cầu phi chức năng

Bảng 3.6: Yêu cầu phi chức năng của hệ thống

| Mã    | Yêu cầu phi chức năng                                          | Mô tả chi tiết                                                    |
|-------|-----------------------------------------------------------------|--------------------------------------------------------------------|
| NFR01 | Hiệu suất                                                      | Thời gian tải trang dưới 3 giây; API response dưới 500ms          |
| NFR02 | Bảo mật                                                        | Mật khẩu hash bcryptjs (12 rounds); JWT authentication; HTTPS     |
| NFR03 | Khả năng mở rộng                                               | Kiến trúc modular cho phép thêm tính năng mới dễ dàng             |
| NFR04 | Tương thích                                                    | Hoạt động trên các trình duyệt chính (Chrome, Firefox, Safari, Edge) |
| NFR05 | Responsive Design                                              | Giao diện tương thích trên desktop, tablet và mobile              |
| NFR06 | Khả dụng (Availability)                                        | Hệ thống hoạt động 99.9% thời gian (đảm bảo bởi Vercel)         |
| NFR07 | SEO                                                            | Hỗ trợ Server-Side Rendering để tối ưu hóa SEO                  |
| NFR08 | Trải nghiệm người dùng                                        | Giao diện trực quan, dễ sử dụng, có animation và transition mượt |

3.2.6 Ràng buộc hệ thống

Bảng 3.7: Ràng buộc hệ thống

| STT | Ràng buộc                                                                              |
|-----|----------------------------------------------------------------------------------------|
| 1   | Hệ thống phải sử dụng Next.js 16 làm framework chính                                  |
| 2   | Cơ sở dữ liệu phải sử dụng MongoDB (hỗ trợ cả local và Atlas)                        |
| 3   | Xác thực người dùng phải sử dụng NextAuth.js với chiến lược JWT                       |
| 4   | AI features yêu cầu OPENAI_API_KEY hợp lệ để hoạt động                                |
| 5   | Hình ảnh sử dụng từ Unsplash (remote patterns được cấu hình trong next.config.ts)      |
| 6   | Deployment trên Vercel (cấu hình trong vercel.json)                                    |
| 7   | Ngôn ngữ giao diện chính: Tiếng Việt                                                  |

----------------------------------------
CHƯƠNG 4: XÂY DỰNG CHƯƠNG TRÌNH VÀ KIỂM THỬ
----------------------------------------

4.1 Triển khai hệ thống

4.1.1 Cấu trúc mã nguồn

a) Cấu trúc thư mục tổng thể

```
iTravel/
|-- src/                          # Thư mục mã nguồn chính
|   |-- app/                      # Next.js App Router (pages và API routes)
|   |   |-- api/                  # Backend API endpoints
|   |   |   |-- admin/            # API quản trị
|   |   |   |   |-- categories/   # CRUD danh mục
|   |   |   |   |-- destinations/ # CRUD địa điểm
|   |   |   |   |-- reviews/      # Quản lý đánh giá
|   |   |   |   |-- stats/        # Thống kê
|   |   |   |   |-- trips/        # Quản lý chuyến đi
|   |   |   |   |-- users/        # Quản lý người dùng
|   |   |   |-- auth/             # API xác thực (NextAuth.js)
|   |   |   |-- categories/       # API danh mục công khai
|   |   |   |-- chat/             # API chatbot AI
|   |   |   |-- destinations/     # API địa điểm công khai
|   |   |   |-- favorites/        # API yêu thích
|   |   |   |-- itinerary/        # API tạo lịch trình AI
|   |   |   |-- provinces/        # API tỉnh/thành
|   |   |   |-- reviews/          # API đánh giá công khai
|   |   |   |-- seed/             # API khởi tạo dữ liệu mẫu
|   |   |   |-- trips/            # API chuyến đi
|   |   |   |-- user/             # API người dùng (profile, password, itineraries, reviews)
|   |   |-- about/                # Trang giới thiệu
|   |   |-- admin/                # Trang quản trị (Dashboard)
|   |   |-- auth/                 # Trang xác thực
|   |   |   |-- login/            # Trang đăng nhập
|   |   |   |-- register/         # Trang đăng ký
|   |   |-- destinations/         # Trang danh sách và chi tiết địa điểm
|   |   |   |-- [slug]/           # Trang chi tiết địa điểm (dynamic route)
|   |   |-- favorites/            # Trang địa điểm yêu thích
|   |   |-- itinerary/            # Trang tạo lịch trình AI
|   |   |-- trips/                # Trang quản lý chuyến đi
|   |   |-- user/                 # Trang thông tin cá nhân
|   |   |-- globals.css           # File CSS toàn cục
|   |   |-- layout.tsx            # Layout chính của ứng dụng
|   |   |-- page.tsx              # Trang chủ (Homepage)
|   |-- components/               # Các React component tái sử dụng
|   |   |-- chat/                 # Component chatbot
|   |   |   |-- FloatingChat.tsx  # Widget chat nổi (floating)
|   |   |-- destination/          # Component địa điểm
|   |   |   |-- DestinationCard.tsx # Card hiển thị địa điểm
|   |   |   |-- ReviewsSection.tsx  # Mục đánh giá địa điểm
|   |   |-- layout/               # Component bố cục
|   |   |   |-- Header.tsx        # Thanh điều hướng trên cùng
|   |   |   |-- Footer.tsx        # Chân trang
|   |   |-- providers/            # Context Providers
|   |   |   |-- AuthProvider.tsx  # NextAuth Session Provider
|   |   |-- ui/                   # Component giao diện chung
|   |   |   |-- CategoryIcon.tsx  # Hiển thị icon danh mục
|   |   |   |-- Toast.tsx         # Thông báo pop-up
|   |-- models/                   # MongoDB Schemas (Mongoose)
|   |   |-- User.ts               # Model người dùng
|   |   |-- Destination.ts        # Model địa điểm du lịch
|   |   |-- Category.ts           # Model danh mục
|   |   |-- Province.ts           # Model tỉnh/thành
|   |   |-- Review.ts             # Model đánh giá
|   |   |-- Trip.ts               # Model chuyến đi
|   |   |-- Itinerary.ts          # Model lịch trình AI
|   |   |-- index.ts              # File xuất tất cả model
|   |-- lib/                      # Thư viện tiện ích
|   |   |-- db.ts                 # Kết nối MongoDB (connection pooling)
|-- public/                       # Tài nguyên tĩnh (images, favicon)
|-- docker-compose.yml            # Cấu hình Docker cho MongoDB
|-- package.json                  # Cấu hình dự án và dependencies
|-- tsconfig.json                 # Cấu hình TypeScript
|-- next.config.ts                # Cấu hình Next.js
|-- vercel.json                   # Cấu hình Vercel deployment
|-- .env.example                  # Mẫu biến môi trường
```

b) Mô tả vai trò từng thư mục

- src/app/: Chứa tất cả các trang và API routes của ứng dụng theo cơ chế App Router của Next.js 16. Mỗi thư mục con tương ứng với một route (URL path) của ứng dụng. File page.tsx định nghĩa giao diện trang, file route.ts định nghĩa API endpoint.

- src/app/api/: Chứa toàn bộ backend API endpoints. Được tổ chức thành các nhóm: admin/ (API quản trị), auth/ (xác thực), và các API công khai (destinations, categories, provinces, reviews, favorites, chat, itinerary, seed, trips, user). Mỗi API file sử dụng NextResponse để trả về dữ liệu JSON và connectDB() để kết nối database.

- src/components/: Chứa các React component được tái sử dụng ở nhiều trang. Được tổ chức theo chức năng: chat/ (chatbot), destination/ (hiển thị địa điểm), layout/ (bố cục trang), providers/ (context providers), ui/ (component giao diện chung).

- src/models/: Chứa các Mongoose Schema định nghĩa cấu trúc dữ liệu. Mỗi file tương ứng với một collection trong MongoDB, bao gồm TypeScript interface và Mongoose Schema.

- src/lib/: Chứa các hàm tiện ích dùng chung. File db.ts thực hiện kết nối MongoDB với cơ chế connection pooling (lưu trữ kết nối trong global variable) để tránh tạo kết nối mới cho mỗi request.

- public/: Chứa các tài nguyên tĩnh như hình ảnh và favicon, được phục vụ trực tiếp bởi Next.js.

4.1.2 Giao diện chương trình

a) Trang chủ (Homepage)

Trang chủ là điểm vào chính của ứng dụng, bao gồm các phần:
- Hero Section: Hiển thị hình ảnh lớn với tiêu đề và thanh tìm kiếm nổi bật, tạo ấn tượng đầu tiên cho người dùng.
- Danh mục du lịch: Hiển thị các danh mục (Biển đảo, Núi rừng, Di tích, Ẩm thực, Lãng mạn) dưới dạng icon grid với gradient màu sắc.
- Địa điểm nổi bật: Hiển thị danh sách các địa điểm được đánh dấu nổi bật với hình ảnh, đánh giá, giá cả. Dữ liệu được hard-code với 4 địa điểm tiêu biểu: Vịnh Hạ Long, Phố cổ Hội An, Đà Lạt, Phú Quốc.
- Thống kê: Hiển thị các số liệu ấn tượng (500+ địa điểm, 10K+ du khách, 4.8 đánh giá, 95% hài lòng).
- Call-to-Action: Kêu gọi người dùng khám phá địa điểm hoặc tạo lịch trình AI.

b) Trang danh sách địa điểm (Destinations)

Trang này cho phép người dùng duyệt và tìm kiếm địa điểm du lịch:
- Thanh tìm kiếm: Hỗ trợ tìm kiếm theo từ khóa.
- Bộ lọc: Lọc theo danh mục (category) và tỉnh/thành (province). Dữ liệu danh mục và tỉnh thành được tải từ API.
- Lưới địa điểm: Hiển thị các địa điểm dưới dạng card với hình ảnh, tên, địa điểm, giá cả, đánh giá. Hỗ trợ chế độ Grid và List view.
- Phân trang: Hỗ trợ phân trang khi số lượng địa điểm lớn.

c) Trang chi tiết địa điểm (Destination Detail)

Trang hiển thị thông tin chi tiết của một địa điểm, bao gồm:
- Gallery hình ảnh: Hiển thị nhiều hình ảnh của địa điểm.
- Thông tin chi tiết: Tên, mô tả, địa chỉ, khoảng giá, thời điểm lý tưởng, thời gian tham quan, tiện ích.
- Mục đánh giá (ReviewsSection): Hiển thị danh sách đánh giá từ người dùng khác và form viết đánh giá mới.

d) Trang đăng nhập/đăng ký (Auth)

- Trang đăng nhập: Form nhập email và mật khẩu, sử dụng NextAuth signIn() với CredentialsProvider. Có liên kết đến trang đăng ký.
- Trang đăng ký: Form nhập tên, email, mật khẩu. Tạo tài khoản mới và tự động đăng nhập.

e) Trang tạo lịch trình AI (Itinerary)

Trang cho phép người dùng tạo lịch trình du lịch bằng AI:
- Form nhập liệu: Người dùng nhập ngân sách (VNĐ), số ngày, số người.
- Chọn sở thích: Người dùng chọn các sở thích (Biển đảo, Núi rừng, Văn hóa, Di tích, Phiêu lưu, Ẩm thực, Nghỉ dưỡng, Lãng mạn) bằng các nút interactive.
- Kết quả: Hiển thị lịch trình được AI tạo ra, bao gồm danh sách điểm đến theo ngày, thời gian tham quan, chi phí ước tính, và các mẹo du lịch.

f) Chat AI (FloatingChat)

Widget chat nổi (floating) hiển thị ở góc màn hình, cho phép người dùng trò chuyện với AI trợ lý du lịch bất cứ lúc nào. Chatbot hỗ trợ hỏi đáp về địa điểm, gợi ý lịch trình, mẹo du lịch.

g) Trang quản trị (Admin Dashboard)

Trang dành cho quản trị viên, bao gồm:
- Dashboard thống kê: Hiển thị tổng số địa điểm, danh mục, tỉnh thành, người dùng, đánh giá, tổng lượt xem.
- Tab điều hướng: Chuyển đổi giữa các tab quản lý: Địa điểm, Danh mục, Người dùng, Đánh giá, Chuyến đi.
- CRUD địa điểm: Xem, thêm, sửa, xóa địa điểm. Modal form cho phép nhập/chỉnh sửa thông tin địa điểm chi tiết.
- Quản lý người dùng: Xem danh sách, cập nhật vai trò (user/admin), xóa người dùng.
- Quản lý đánh giá: Xem, duyệt/từ chối, xóa đánh giá.
- Quản lý chuyến đi: Xem danh sách chuyến đi của tất cả người dùng.
- Khởi tạo dữ liệu mẫu: Nút khởi tạo dữ liệu demo.

h) Trang yêu thích (Favorites)

Hiển thị danh sách các địa điểm mà người dùng đã đánh dấu yêu thích.

i) Trang quản lý chuyến đi (Trips)

Cho phép người dùng tạo và quản lý các chuyến đi cá nhân, bao gồm tên chuyến đi, địa điểm tham quan, ngày bắt đầu/kết thúc, ngân sách, số người.

j) Trang thông tin cá nhân (User)

Cho phép người dùng xem và cập nhật thông tin cá nhân (tên, email, avatar) và đổi mật khẩu.

Luồng người dùng chính:

1. Luồng tìm kiếm và xem địa điểm: Trang chủ -> Danh sách địa điểm -> Bộ lọc/Tìm kiếm -> Chi tiết địa điểm -> Đánh giá/Yêu thích.
2. Luồng tạo lịch trình AI: Đăng nhập -> Trang AI Lịch trình -> Nhập thông tin -> AI tạo lịch trình -> Xem kết quả.
3. Luồng quản trị: Đăng nhập (Admin) -> Admin Dashboard -> Chọn tab quản lý -> CRUD dữ liệu.
4. Luồng chat AI: Nhấn vào widget chat -> Nhập câu hỏi -> AI trả lời -> Tiếp tục hội thoại.

4.2 Mục tiêu kiểm thử

4.2.1 Functional Testing (Kiểm thử chức năng)

Mục tiêu: Xác minh tất cả các chức năng của hệ thống hoạt động đúng theo yêu cầu đặt ra, bao gồm: đăng ký/đăng nhập, tìm kiếm địa điểm, tạo lịch trình AI, quản lý yêu thích, đánh giá, và các chức năng quản trị. Đảm bảo mỗi API endpoint trả về dữ liệu đúng định dạng và mã trạng thái HTTP phù hợp.

4.2.2 UI Testing (Kiểm thử giao diện)

Mục tiêu: Đảm bảo giao diện người dùng hiển thị đúng trên các trình duyệt và kích thước màn hình khác nhau. Kiểm tra responsive design trên desktop (1920x1080, 1366x768), tablet (768px) và mobile (375px). Xác minh các animation, transition hoạt động mượt mà và các yếu tố tương tác (button, form, modal) phản hồi đúng.

4.2.3 Security Testing (Kiểm thử bảo mật)

Mục tiêu: Xác minh hệ thống bảo mật tại các điểm quan trọng:
- Mật khẩu được hash đúng cách (bcryptjs, 12 salt rounds) trước khi lưu vào database.
- Các API endpoint quản trị (admin/) chỉ cho phép người dùng có role admin truy cập.
- JWT token được tạo và xác minh đúng cách.
- Không lộ thông tin nhạy cảm (password) trong response của API.
- Ngăn chặn SQL/NoSQL injection thông qua Mongoose schema validation.

4.2.4 Performance Testing (Kiểm thử hiệu suất)

Mục tiêu: Đảm bảo hệ thống đáp ứng các chỉ tiêu hiệu suất:
- Thời gian tải trang đầu tiên (First Contentful Paint) dưới 2 giây.
- Thời gian phản hồi API dưới 500ms cho các truy vấn đơn giản.
- Hệ thống xử lý được ít nhất 100 request đồng thời mà không giảm hiệu suất đáng kể.
- Connection pooling MongoDB hoạt động hiệu quả (không tạo kết nối mới cho mỗi request).

4.2.5 Integration Testing (Kiểm thử tích hợp)

Mục tiêu: Xác minh sự tích hợp đúng giữa các thành phần của hệ thống:
- Frontend gọi đúng API endpoint và xử lý response/error đúng.
- NextAuth.js tích hợp đúng với MongoDB (xác thực người dùng).
- OpenAI API tích hợp đúng với hệ thống (tạo lịch trình, chatbot).
- Mongoose models tương tác đúng với MongoDB (CRUD operations).
- Session management hoạt động nhất quán giữa các trang.

4.3 Thực hiện kiểm thử

4.3.1 Kiểm thử chức năng (Functional Testing)

Phần này kiểm thử toàn bộ các chức năng nghiệp vụ chính của hệ thống iTravel, bao gồm: đăng ký/đăng nhập, tìm kiếm địa điểm, tạo lịch trình AI, quản lý yêu thích, đánh giá địa điểm, quản lý chuyến đi, và các chức năng quản trị hệ thống.

Bảng 4.1: Test case kiểm thử Đăng ký tài khoản

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-01 | Đăng ký thành công                        | Tên: Nguyễn Văn A, Email: new@test.com, Password: 123456     | Tài khoản được tạo, tự động đăng nhập, chuyển về trang chủ | Đạt     |
| TC-02 | Đăng ký với email đã tồn tại              | Email: user@itravel.vn (đã có), Password: 123456              | Hiển thị lỗi "Email đã được sử dụng"                    | Đạt        |
| TC-03 | Đăng ký với email không hợp lệ            | Email: khonghople, Password: 123456                           | Hiển thị lỗi "Email không hợp lệ"                       | Đạt        |
| TC-04 | Đăng ký thiếu trường bắt buộc             | Tên: (rỗng), Email: new@test.com, Password: 123456           | Form validation từ chối, hiển thị thông báo lỗi         | Đạt        |

Bảng 4.2: Test case kiểm thử Đăng nhập

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-05 | Đăng nhập thành công với tài khoản user   | Email: user@itravel.vn, Password: 123456                     | Chuyển hướng về trang chủ, hiển thị tên user             | Đạt        |
| TC-06 | Đăng nhập thành công với tài khoản admin  | Email: admin@itravel.vn, Password: 123456                    | Chuyển hướng về trang chủ, hiển thị menu Admin           | Đạt        |
| TC-07 | Đăng nhập với email không tồn tại         | Email: test@test.com, Password: 123456                       | Hiển thị lỗi "Email không tồn tại"                      | Đạt        |
| TC-08 | Đăng nhập với mật khẩu sai               | Email: user@itravel.vn, Password: wrongpw                    | Hiển thị lỗi "Mật khẩu không đúng"                      | Đạt        |
| TC-09 | Đăng nhập với email rỗng                  | Email: (rỗng), Password: 123456                              | Hiển thị lỗi "Vui lòng nhập email và mật khẩu"          | Đạt        |
| TC-10 | Đăng nhập với mật khẩu rỗng              | Email: user@itravel.vn, Password: (rỗng)                     | Hiển thị lỗi "Vui lòng nhập email và mật khẩu"          | Đạt        |

Bảng 4.3: Test case kiểm thử Tìm kiếm và lọc địa điểm

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-11 | Tìm kiếm địa điểm theo từ khóa           | Từ khóa: "Hạ Long"                                           | Danh sách địa điểm có tên/mô tả chứa "Hạ Long"          | Đạt        |
| TC-12 | Lọc theo danh mục                         | Chọn danh mục: "Biển đảo"                                    | Chỉ hiển thị địa điểm thuộc danh mục biển đảo           | Đạt        |
| TC-13 | Lọc theo tỉnh/thành                       | Chọn tỉnh: "Quảng Ninh"                                      | Chỉ hiển thị địa điểm thuộc tỉnh Quảng Ninh             | Đạt        |
| TC-14 | Tìm kiếm không có kết quả               | Từ khóa: "xyzabc123"                                         | Hiển thị thông báo "Không tìm thấy địa điểm phù hợp"   | Đạt        |
| TC-15 | Kết hợp lọc danh mục và tỉnh             | Danh mục: Biển đảo, Tỉnh: Khánh Hòa                         | Chỉ hiển thị địa điểm biển đảo tại Khánh Hòa           | Đạt        |

Bảng 4.4: Test case kiểm thử Đánh giá địa điểm

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-16 | Gửi đánh giá hợp lệ                       | rating: 5, title: "Tuyệt vời", comment: "Rất đẹp và sạch"  | Đánh giá được lưu, hiển thị trong danh sách đánh giá    | Đạt        |
| TC-17 | Gửi đánh giá khi chưa đăng nhập          | Chưa đăng nhập, nhấn nút "Viết đánh giá"                    | Yêu cầu đăng nhập trước khi đánh giá                    | Đạt        |
| TC-18 | Gửi đánh giá thiếu tiêu đề               | rating: 4, title: (rỗng), comment: "Khá ổn"                 | Hiển thị lỗi validation, không gửi đánh giá             | Đạt        |
| TC-19 | Gửi đánh giá thiếu nội dung              | rating: 3, title: "OK", comment: (rỗng)                     | Hiển thị lỗi validation, không gửi đánh giá             | Đạt        |

Bảng 4.5: Test case kiểm thử Tạo lịch trình AI

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-20 | Tạo lịch trình thành công                | Ngân sách: 5.000.000, Số ngày: 3, Số người: 2, Sở thích: Biển đảo | Tạo lịch trình 3 ngày với các địa điểm biển đảo    | Đạt        |
| TC-21 | Tạo lịch trình với ngân sách thấp        | Ngân sách: 500.000, Số ngày: 3, Số người: 2                  | Tạo lịch trình với địa điểm giá rẻ phù hợp              | Đạt        |
| TC-22 | Tạo lịch trình không chọn sở thích       | Ngân sách: 3.000.000, Số ngày: 2, Số người: 1                | Tạo lịch trình với địa điểm đa dạng                     | Đạt        |
| TC-23 | Tạo lịch trình khi chưa đăng nhập       | Chưa đăng nhập, truy cập /itinerary                          | Yêu cầu đăng nhập trước khi sử dụng                     | Đạt        |
| TC-24 | Tạo lịch trình khi OpenAI API lỗi       | API key không hợp lệ hoặc hết hạn                             | Hệ thống sử dụng smart fallback, vẫn tạo được lịch trình | Đạt       |

Bảng 4.6: Test case kiểm thử Quản trị hệ thống (Admin CRUD)

| ID    | Mô tả                                     | Dữ liệu kiểm thử                                             | Kết quả mong đợi                                         | Trạng thái |
|-------|-------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|------------|
| TC-25 | Xem thống kê tổng quan                    | Đăng nhập Admin, vào Dashboard                               | Hiển thị đúng số lượng địa điểm, người dùng, đánh giá   | Đạt        |
| TC-26 | Thêm địa điểm mới                        | Tên: "Bãi Biển Mỹ Khê", Danh mục: Biển, Tỉnh: Đà Nẵng      | Địa điểm mới được tạo, hiển thị trong danh sách         | Đạt        |
| TC-27 | Sửa thông tin địa điểm                   | Cập nhật tên thành "Bãi Biển Mỹ Khê - Đà Nẵng"              | Thông tin địa điểm được cập nhật thành công              | Đạt        |
| TC-28 | Xóa địa điểm                             | Nhấn nút Xóa, xác nhận                                       | Địa điểm bị xóa khỏi danh sách                          | Đạt        |
| TC-29 | Duyệt đánh giá                           | Chọn đánh giá đang chờ duyệt, nhấn "Duyệt"                  | Đánh giá được phê duyệt, hiển thị trên trang chi tiết   | Đạt        |
| TC-30 | Cập nhật vai trò người dùng              | Chọn user, đổi role từ "user" sang "admin"                   | Vai trò được cập nhật thành công                         | Đạt        |
| TC-31 | Khởi tạo dữ liệu mẫu                    | Nhấn nút "Khởi tạo dữ liệu mẫu" trong Admin                 | Dữ liệu mẫu (địa điểm, danh mục, tỉnh thành) được tạo   | Đạt        |

4.3.2 Kiểm thử giao diện người dùng (UI Testing)

Phần này kiểm thử tính đúng đắn của giao diện hiển thị, trải nghiệm tương tác, khả năng responsive trên các thiết bị và trình duyệt khác nhau.

Bảng 4.7: Test case kiểm thử giao diện và responsive

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-32 | Trang chủ hiển thị đúng trên Desktop        | Trình duyệt Chrome, độ phân giải 1920x1080                   | Hero section, danh mục, địa điểm nổi bật hiển thị đúng bố cục | Đạt       |
| TC-33 | Trang chủ responsive trên Mobile             | Trình duyệt Chrome Mobile, màn hình 375px                    | Giao diện thu nhỏ phù hợp, menu hamburger hoạt động          | Đạt        |
| TC-34 | Trang danh sách địa điểm responsive          | Tablet 768px                                                  | Grid địa điểm tự điều chỉnh số cột, không tràn nội dung     | Đạt        |
| TC-35 | Header và navigation hiển thị đúng          | Tất cả trang, người dùng chưa đăng nhập                      | Hiển thị logo, menu điều hướng, nút Đăng nhập/Đăng ký        | Đạt        |
| TC-36 | Header thay đổi khi đăng nhập               | Người dùng đã đăng nhập                                      | Hiển thị tên user, avatar, menu profile thay vì nút đăng nhập | Đạt       |
| TC-37 | Modal thêm/sửa địa điểm hiển thị đúng       | Admin nhấn nút "Thêm địa điểm" hoặc "Sửa"                   | Modal mở đúng, các trường form hiển thị đầy đủ               | Đạt        |
| TC-38 | Toast notification hiển thị và tự đóng      | Thực hiện thao tác thành công (thêm yêu thích, đánh giá)     | Toast hiển thị thông báo xanh, tự biến mất sau 3 giây        | Đạt        |
| TC-39 | Toast lỗi hiển thị đúng màu                 | Thực hiện thao tác thất bại                                   | Toast hiển thị thông báo đỏ, nội dung mô tả lỗi rõ ràng     | Đạt        |
| TC-40 | FloatingChat widget hiển thị đúng vị trí    | Tất cả trang (ngoại trừ trang Admin)                          | Widget chat hiển thị ở góc dưới phải màn hình                | Đạt        |
| TC-41 | Cửa sổ chat mở/đóng khi nhấn nút           | Nhấn icon chat                                                | Cửa sổ chat trượt mở mượt, nhấn lại thì đóng                | Đạt        |
| TC-42 | Gallery ảnh địa điểm hiển thị đúng          | Trang chi tiết địa điểm có nhiều ảnh                          | Ảnh đầu tiên hiển thị lớn, có thể chuyển ảnh                | Đạt        |
| TC-43 | Skeleton loading hiển thị khi tải dữ liệu   | Kết nối chậm, trang đang tải dữ liệu từ API                  | Hiển thị placeholder loading thay vì trang trắng             | Đạt        |
| TC-44 | Tương thích trình duyệt Firefox             | Truy cập toàn bộ trang trên Firefox phiên bản mới nhất       | Giao diện hiển thị giống Chrome, không lỗi CSS               | Đạt        |
| TC-45 | Tương thích trình duyệt Safari              | Truy cập toàn bộ trang trên Safari (macOS)                    | Giao diện hiển thị đúng, font chữ hiển thị bình thường       | Đạt        |

4.3.3 Kiểm thử bảo mật (Security Testing)

Phần này kiểm thử các cơ chế bảo mật của hệ thống, bao gồm xác thực, phân quyền, bảo vệ dữ liệu và ngăn chặn tấn công.

Bảng 4.8: Test case kiểm thử bảo mật xác thực và phân quyền

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-46 | Mật khẩu được hash trước khi lưu            | Tạo tài khoản mới, kiểm tra collection User trong MongoDB    | Trường password lưu chuỗi hash bcrypt, không phải plaintext  | Đạt        |
| TC-47 | API không trả về trường password            | Gọi GET /api/user/profile khi đã đăng nhập                  | Response JSON không chứa trường password                      | Đạt        |
| TC-48 | User truy cập trang Admin bị chặn           | Đăng nhập role user, truy cập /admin                         | Chuyển hướng về trang chủ, không hiển thị Admin Dashboard    | Đạt        |
| TC-49 | User gọi Admin API bị từ chối              | User (role user) gọi POST /api/admin/destinations            | HTTP 401 Unauthorized hoặc 403 Forbidden                     | Đạt        |
| TC-50 | Guest gọi API yêu cầu xác thực bị từ chối  | Không có session, gọi POST /api/reviews                      | HTTP 401 Unauthorized                                        | Đạt        |
| TC-51 | Guest truy cập trang yêu thích bị chuyển hướng | Chưa đăng nhập, truy cập /favorites                       | Chuyển hướng đến /auth/login                                 | Đạt        |
| TC-52 | JWT token không hợp lệ bị từ chối          | Gửi request với Authorization header chứa token giả         | HTTP 401 Unauthorized                                        | Đạt        |
| TC-53 | Ngăn chặn NoSQL injection qua Mongoose      | Gửi payload: { "$gt": "" } vào trường email khi đăng nhập   | Mongoose schema validation từ chối, không truy vấn database  | Đạt        |
| TC-54 | Biến môi trường nhạy cảm không lộ ra client | Inspect bundle JavaScript phía client                        | OPENAI_API_KEY, MONGODB_URI, NEXTAUTH_SECRET không có trong bundle | Đạt  |
| TC-55 | HTTPS được áp dụng trên môi trường production | Truy cập domain Vercel qua HTTP                             | Tự động chuyển hướng sang HTTPS                              | Đạt        |
| TC-56 | Session hết hạn sau thời gian quy định      | Không hoạt động trong thời gian dài                          | Yêu cầu đăng nhập lại khi session hết hạn                   | Đạt        |
| TC-57 | Admin không thể xóa chính tài khoản mình   | Admin đăng nhập, vào quản lý người dùng, thử xóa bản thân  | Hiển thị thông báo lỗi, không thực hiện xóa                 | Đạt        |

4.3.4 Kiểm thử tích hợp (Integration Testing)

Phần này kiểm thử sự phối hợp đúng đắn giữa các thành phần trong hệ thống: Frontend - API Routes - Database - Dịch vụ bên ngoài (NextAuth.js, OpenAI API).

Bảng 4.9: Test case kiểm thử tích hợp Frontend và API

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-58 | Trang danh sách địa điểm tải đúng dữ liệu từ API | Truy cập /destinations                                   | Hiển thị đúng danh sách địa điểm lấy từ GET /api/destinations | Đạt       |
| TC-59 | Trang chi tiết địa điểm tải đúng dữ liệu    | Truy cập /destinations/vinh-ha-long                          | Hiển thị đúng thông tin Vịnh Hạ Long từ API                 | Đạt        |
| TC-60 | Nút yêu thích gọi API và cập nhật UI        | Đăng nhập, nhấn icon tim trên DestinationCard               | POST /api/favorites được gọi, icon tim đổi trạng thái ngay  | Đạt        |
| TC-61 | Form đánh giá gửi dữ liệu và hiển thị kết quả | Điền form đánh giá, nhấn Gửi                              | POST /api/reviews được gọi, đánh giá xuất hiện trong danh sách | Đạt      |
| TC-62 | Thanh tìm kiếm gọi API và hiển thị kết quả  | Nhập từ khóa vào thanh tìm kiếm                             | GET /api/destinations?search=... được gọi, danh sách cập nhật | Đạt      |
| TC-63 | Bộ lọc danh mục và tỉnh gọi API đúng       | Chọn danh mục "Biển đảo" và tỉnh "Đà Nẵng"                 | GET /api/destinations?category=...&province=... được gọi     | Đạt        |

Bảng 4.10: Test case kiểm thử tích hợp NextAuth.js và MongoDB

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-64 | Đăng nhập thành công tạo session JWT        | Đăng nhập với thông tin tài khoản hợp lệ                    | JWT token được tạo, useSession() trả về đúng thông tin user  | Đạt        |
| TC-65 | Đăng xuất xóa session                        | Đăng nhập, sau đó đăng xuất                                  | Session bị xóa, useSession() trả về null, không thể gọi API yêu cầu xác thực | Đạt |
| TC-66 | Session user.role đúng với database          | Đăng nhập tài khoản admin@itravel.vn                         | session.user.role === "admin", điều hướng Admin Dashboard đúng | Đạt      |
| TC-67 | connectDB() tái sử dụng kết nối hiện có      | Gọi nhiều API liên tiếp                                      | Log chỉ hiển thị "Connected to MongoDB" một lần, không kết nối lại | Đạt   |

Bảng 4.11: Test case kiểm thử tích hợp OpenAI API

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-68 | AI sinh lịch trình dựa trên dữ liệu thực    | Gọi POST /api/itinerary/generate với preferences: ["beach"]  | Lịch trình trả về chứa địa điểm biển đảo có trong database  | Đạt        |
| TC-69 | AI Chatbot nhớ lịch sử hội thoại            | Gửi tin nhắn 2: "Ở đó có gì vui?", sau tin nhắn 1: "Hạ Long đẹp không?" | AI trả lời về Hạ Long, không hỏi lại ngữ cảnh           | Đạt        |
| TC-70 | Lịch trình AI được lưu vào MongoDB           | Tạo lịch trình thành công khi đã đăng nhập                  | Bản ghi Itinerary mới xuất hiện trong collection itineraries | Đạt        |
| TC-71 | Fallback khi OpenAI API không khả dụng      | Đặt OPENAI_API_KEY sai, gọi POST /api/itinerary/generate     | Hệ thống tự động dùng generateSmartFallbackItinerary(), vẫn trả về lịch trình | Đạt |

Bảng 4.12: Test case kiểm thử tích hợp Mongoose Models và MongoDB

| ID    | Mô tả                                        | Điều kiện kiểm thử                                          | Kết quả mong đợi                                              | Trạng thái |
|-------|----------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|------------|
| TC-72 | Text index tìm kiếm địa điểm hoạt động đúng | Gọi GET /api/destinations?search=Hạ Long                    | Trả về địa điểm "Vịnh Hạ Long" khớp với text index          | Đạt        |
| TC-73 | Populate reference giữa Destination và Category | Gọi GET /api/destinations, kiểm tra trường categoryId     | categoryId được populate thành object { name, icon, slug }   | Đạt        |
| TC-74 | Cascade cập nhật rating khi có đánh giá mới  | Gửi đánh giá 5 sao cho một địa điểm                         | Rating trung bình và reviewCount của địa điểm được cập nhật  | Đạt        |
| TC-75 | Unique constraint email User model           | Tạo tài khoản với email đã tồn tại                           | MongoDB trả về lỗi duplicate key, API trả về 409 Conflict    | Đạt        |
