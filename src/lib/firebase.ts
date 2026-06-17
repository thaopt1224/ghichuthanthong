import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const PLACEHOLDER_PATTERN = /^(your_|PASTE_)/

export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every(
    (value) =>
      typeof value === 'string' &&
      value.trim().length > 0 &&
      !PLACEHOLDER_PATTERN.test(value),
  )
}

let app: FirebaseApp | undefined
let authInstance: Auth | undefined
let dbInstance: Firestore | undefined

function initFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase chưa được cấu hình. Hãy tạo file .env từ .env.example.')
  }
  if (!app) {
    app = initializeApp(firebaseConfig)
    authInstance = getAuth(app)
    dbInstance = getFirestore(app)
  }
  return { auth: authInstance!, db: dbInstance! }
}

export function getFirebaseAuth(): Auth {
  return initFirebase().auth
}

export function getFirebaseDb(): Firestore {
  return initFirebase().db
}
