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

## Deploy miễn phí (Firebase Hosting)

App đã dùng Firebase → **Firebase Hosting** là cách đơn giản nhất, **không cần mua host**.

URL miễn phí dạng: `https://ghi-chu-than-thong.web.app`

### Bước 1 — Cài Firebase CLI (một lần)

```bash
npm install -g firebase-tools
firebase login
```

### Bước 2 — Bật Hosting trên Console

1. [Firebase Console](https://console.firebase.google.com/) → project **ghi-chu-than-thong**
2. **Build** → **Hosting** → **Get started**

### Bước 3 — Deploy

Đảm bảo file `.env` đã có config đúng (Vite nhúng config lúc build):

```bash
npm run deploy
```

Lần đầu có thể hỏi project — chọn **ghi-chu-than-thong**.

### Bước 4 — Cho phép đăng nhập trên domain public

Firebase Console → **Authentication** → **Settings** → **Authorized domains**

Domain `ghi-chu-than-thong.web.app` thường được thêm tự động sau khi deploy Hosting. Nếu đăng nhập báo lỗi domain, thêm tay domain đó vào danh sách.

---

## Các lựa chọn miễn phí khác

| Nền tảng | Ưu điểm |
|----------|---------|
| **Firebase Hosting** | Cùng project với Auth/Firestore, deploy 1 lệnh |
| **[Vercel](https://vercel.com)** | Kết nối GitHub, tự deploy mỗi lần push |
| **[Netlify](https://netlify.com)** | Tương tự Vercel, kéo thả folder `dist` |

Với Vercel/Netlify: build command `npm run build`, output folder `dist`, thêm biến môi trường `VITE_FIREBASE_*` giống file `.env`.

## Build production

```bash
npm run build
```
