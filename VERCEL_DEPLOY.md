# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Cấu hình Environment Variables

Vào **Vercel Dashboard** → **Project (i-travel)** → **Settings** → **Environment Variables**

Thêm các biến sau:

| Variable | Value | Ghi chú |
|----------|-------|---------|
| `MONGODB_URI` | `mongodb+srv://...` | Connection string từ MongoDB Atlas |
| `NEXTAUTH_SECRET` | `random-secret-key` | Chuỗi bất kỳ, dùng để mã hóa session |
| `NEXTAUTH_URL` | `https://i-travel-chi.vercel.app` | URL production của app |
| `OPENAI_API_KEY` | `sk-...` | API key từ OpenAI (cho tính năng AI) |

## Bước 2: Tạo MongoDB Atlas (Miễn phí)

1. Vào [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Đăng ký/Đăng nhập
3. Tạo **Free Cluster** (M0 - Free tier)
4. Tạo Database User (username + password)
5. Whitelist IP: `0.0.0.0/0` (cho phép mọi IP - cần thiết cho Vercel)
6. Copy Connection String → Thay `<password>` bằng password thật

## Bước 3: Redeploy

Sau khi thêm Environment Variables:
1. Vào tab **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy**

## ⚠️ Lưu ý quan trọng

- **Local** dùng file `.env.local` 
- **Vercel** dùng Environment Variables trong Dashboard
- Không commit file `.env.local` lên Git (đã được ignore)
