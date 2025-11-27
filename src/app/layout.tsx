import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/AppHeader';
import { Toaster } from '@/components/ui/toaster';
import { PwaInstaller } from '@/components/PwaInstaller';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/providers/CartProvider';

export const metadata: Metadata = {
  title: 'Bazar Moçambique',
  description: 'O seu marketplace de confiança em Moçambique.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#facc15', // Amarelo
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="CiSd3QNIA6doraUqTj3cM8HzeiJhLegqaP84h2rf4uI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <CartProvider>
            <div className="flex min-h-screen w-full flex-col">
              <AppHeader />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
        <PwaInstaller />
      </body>
    </html>
  );
}
