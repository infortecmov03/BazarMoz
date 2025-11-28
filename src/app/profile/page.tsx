'use client';

import { useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, Timestamp } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  name: string;
  email: string;
  createdAt: Timestamp;
}

export default function ProfilePage() {
  const { user, isUserLoading, auth } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [accountAge, setAccountAge] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userRef);

  useEffect(() => {
    if (userProfile?.createdAt) {
      const date = userProfile.createdAt.toDate();
      setAccountAge(formatDistanceToNow(date, { addSuffix: true, locale: ptBR }));
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container py-8 md:py-12">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Gerencie as informações da sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Nome</h3>
                {isLoading ? <Skeleton className="h-5 w-48" /> : <p>{userProfile?.name}</p>}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Email</h3>
                {isLoading ? <Skeleton className="h-5 w-64" /> : <p>{userProfile?.email}</p>}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Membro desde</h3>
                {isLoading ? <Skeleton className="h-5 w-32" /> : <p>{accountAge}</p>}
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
