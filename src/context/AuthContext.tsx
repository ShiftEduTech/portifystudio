'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface UserData {
  uid: string;
  fullName: string;
  email: string;
  role: 'user' | 'premium' | 'admin';
  plan?: string;
  provider: 'email' | 'google';
  createdAt?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Failsafe: never let auth loading spinner run forever.
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    if (!auth) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
      return () => {};
    }

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);

          // Fetch additional user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData);
            } else {
              setUserData(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData(null);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Auth listener failed:', error);
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
