# iTravel - Website Du lịch Thông minh

Website quảng bá du lịch địa phương và hỗ trợ lựa chọn lịch trình du lịch thông minh với AI.

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi động MongoDB (Docker)
```bash
docker compose up -d
```

### 3. Tạo file .env.local
```bash
MONGODB_URI=mongodb://localhost:27017/itravel
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 4. Chạy development server
```bash
npm run dev
```

### 5. Seed database
Truy cập http://localhost:3000/admin → Click "Khởi tạo dữ liệu mẫu"

## 📱 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@itravel.vn | 123456 |
| User | user@itravel.vn | 123456 |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                # Next.js pages & API routes
│   ├── api/           # Backend APIs
│   ├── auth/          # Login/Register pages
│   ├── admin/         # Admin dashboard
│   ├── destinations/  # Destinations pages
│   └── itinerary/     # AI itinerary page
├── components/        # React components
├── models/           # MongoDB schemas
└── lib/              # Utilities
```

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/destinations` | GET | List destinations |
| `/api/destinations/[slug]` | GET | Destination detail |
| `/api/categories` | GET | List categories |
| `/api/provinces` | GET | List provinces |
| `/api/reviews` | GET/POST | Reviews CRUD |
| `/api/favorites` | GET/POST | Favorites toggle |
| `/api/itinerary/generate` | POST | AI itinerary |
| `/api/seed` | POST | Seed database |

## ✨ Features

- ✅ Homepage với hero section, categories, featured destinations
- ✅ Destinations list với filter & search
- ✅ Destination detail với gallery, reviews
- ✅ AI Itinerary generator
- ✅ User authentication (login/register)
- ✅ Favorites functionality
- ✅ Reviews system
- ✅ Admin dashboard

## 📝 License

MIT
