'use client';
import { useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useAuth } from '../provider';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useUser(): AuthState {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        try {
          // If no user, sign in anonymously for session management (e.g., cart)
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
