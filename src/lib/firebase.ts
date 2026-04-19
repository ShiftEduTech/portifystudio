import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth | any;
let db: Firestore | any;
let storage: FirebaseStorage | any;
let googleProvider: GoogleAuthProvider | any;
let analytics: Analytics | any;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  // Analytics is only available in browser environments
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
} catch (error) {
  console.warn("Firebase Auth/DB failed to initialize.", error);
}

export { app, auth, db, storage, googleProvider, analytics };
