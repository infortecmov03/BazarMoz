'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">A verificar permissões...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Painel de Administração</CardTitle>
          <CardDescription>Bem-vindo à área de gestão do Bazar Moçambique.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>De momento, esta área está em construção.</p>
          <p>Em breve, poderá gerir produtos, ver encomendas e muito mais a partir daqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
