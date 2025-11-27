'use client';

import { useUser as useFirebaseUserHook } from '@/firebase';

/**
 * @deprecated Use `useUser` from `@/firebase` instead.
 */
export const useAuth = () => {
  const { user, isUserLoading } = useFirebaseUserHook();
  return { user, loading: isUserLoading };
};
