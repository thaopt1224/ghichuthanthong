# Ghi Chú Thần Thông

Web app lưu lại những điều thú vị bạn gặp — tập phim, chương truyện, link hay, và ghi chú cá nhân.

## Tính năng

- Đăng nhập / đăng ký bằng Email & Password (Firebase Auth)
- Tạo, sửa, xoá ghi chú với **tiêu đề**, **nội dung**, **link URL**
- Mỗi tài khoản chỉ thấy ghi chú của mình
- **Tìm kiếm ngôn ngữ tự nhiên** — gõ câu như *"tập phim one piece"* hoặc *"chương solo leveling"*
- Giao diện tối, màu chủ đạo **cam & đen**

## Cài đặt

### 1. Clone và cài dependency

```bash
npm install
```

### 2. Tạo project Firebase

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Bật **Authentication** → Sign-in method → **Email/Password**
4. Tạo **Firestore Database** (chế độ production)
5. Vào Project Settings → Your apps → thêm Web app → copy config

### 3. Cấu hình biến môi trường

```bash
cp .env.example .env
```

Điền các giá trị Firebase vào `.env`.

### 4. Firestore Security Rules

Trong Firebase Console → Firestore → Rules, dán nội dung file `firestore.rules`.

### 5. Tạo composite index (nếu cần)

Khi chạy lần đầu, Firestore có thể báo thiếu index. Click link trong console để tạo index cho:
- Collection: `notes`
- Fields: `userId` (Ascending), `updatedAt` (Descending)

### 6. Chạy dev

```bash
npm run dev
```

Mở http://localhost:5173

## Cấu trúc dữ liệu

```
notes/{noteId}
  ├── userId: string
  ├── title: string
  ├── content: string
  ├── url: string
  ├── createdAt: number
  └── updatedAt: number
```

## Tech stack

- React 18 + TypeScript + Vite
- Firebase Auth + Firestore
- Fuse.js (tìm kiếm mờ + xử lý câu hỏi tự nhiên phía client)

## Build production

```bash
npm run build
```

Deploy thư mục `dist/` lên Vercel, Netlify, hoặc Firebase Hosting.
