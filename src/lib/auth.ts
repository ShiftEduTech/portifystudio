// @/lib/auth.ts 
// Firebase Authentication Helpers

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// 1. SIGNUP FLOW
export async function signUpWithEmail(fullName: string, email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Store additional data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName,
    email,
    role: 'user', // default role
    provider: 'email',
    createdAt: serverTimestamp()
  });

  return user;
}

// 2. LOGIN FLOW
export async function logInWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// 3. GOOGLE LOGIN
export async function logInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if first login (doc won't exist)
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // Create user document in Firestore on first login
    await setDoc(userDocRef, {
      uid: user.uid,
      fullName: user.displayName || 'Google User',
      email: user.email,
      role: 'user', // default role
      provider: 'google',
      createdAt: serverTimestamp()
    });
  }

  return user;
}
