import { FirebaseError } from 'firebase/app'

export function getFirestoreErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Không kết nối được Firestore. Kiểm tra Firebase Console.'
  }

  switch (error.code) {
    case 'permission-denied':
      return 'Firestore từ chối truy cập. Vào Firebase Console → Firestore → Rules, dán nội dung file firestore.rules rồi Publish.'
    case 'failed-precondition':
      return 'Thiếu Firestore index. Mở DevTools (F12) → Console, bấm link tạo index trong lỗi, rồi thử lại.'
    case 'not-found':
      return 'Chưa tạo Firestore Database. Vào Firebase Console → Firestore Database → Create database.'
    case 'unavailable':
      return 'Firestore chưa sẵn sàng. Kiểm tra đã tạo database trong Firebase Console chưa.'
    default:
      return `Lỗi Firestore (${error.code}): ${error.message}`
  }
}
