'use client';

import { useUser } from '@/firebase';
import { useState, useEffect } from 'react';

// For now, we will hardcode the admin UIDs.
// In a real application, this should be managed in a secure backend or Firestore collection.
const ADMIN_UIDS = [
    'SEU_UID_ADMIN_VAI_AQUI', // UID temporário para teste
    'gD7n37dhqigCk6sxRezuLPeHwQ33'
];

export const useAdmin = () => {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      // Check if the current user's UID is in the list of admin UIDs
      setIsAdmin(ADMIN_UIDS.includes(user.uid));
    } else {
      setIsAdmin(false);
    }
    
    setLoading(false);
  }, [user, isUserLoading]);

  return { isAdmin, loading };
};
