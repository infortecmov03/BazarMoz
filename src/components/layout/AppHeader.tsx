'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { CartIcon } from '@/components/cart/CartIcon';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Home, ShoppingBag, Info, User, Star, Search, Menu, Laptop, Shirt, HomeIcon, Dumbbell, LifeBuoy, ShieldCheck } from 'lucide-react';
import { Logo } from '../icons/Logo';
import { Input } from '../ui/input';
import { useUser, useAuth } from '@/firebase';
import { useAdmin } from '@/hooks/use-admin';

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useAdmin();
  const auth = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getInitials = () => {
    if (!user) return '';
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserIdentifier = () => {
    if (!user) return 'Visitante';
    return user.email || user.phoneNumber || 'Utilizador';
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/products', icon: ShoppingBag, label: 'Produtos' },
    { href: '/top-deals', icon: Star, label: 'Promoções' },
    { href: '/electronics', icon: Laptop, label: 'Eletrónica' },
    { href: '/fashion', icon: Shirt, label: 'Moda' },
    { href: '/home-garden', icon: HomeIcon, label: 'Casa & Jardim' },
    { href: '/sports', icon: Dumbbell, label: 'Desporto' },
    { href: '/about', icon: Info, label: 'Sobre Nós' },
    { href: '/support', icon: LifeBuoy, label: 'Suporte ao Cliente' },
  ];

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const UserMenu = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    if (user && !user.isAnonymous) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ''} />}
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || 'Utilizador'}</p>
                <p className="text-xs leading-none text-muted-foreground">{getUserIdentifier()}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Painel de Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>A Minha Conta</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Os Meus Pedidos</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return <AuthDialog />;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                     <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                        <Logo className="h-8 w-8" />
                        <span className="text-lg font-bold">Bazar Moçambique</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 rounded-md p-3 text-base font-medium text-foreground hover:bg-muted"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="hidden text-lg font-bold sm:inline-block">Bazar Moçambique</span>
            </Link>
          </div>

          <div className="hidden flex-1 justify-center px-4 md:flex">
             <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Procurar produtos, marcas e mais..." className="w-full rounded-full bg-muted pl-10 pr-4 py-2 text-base"/>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
             <nav className="hidden md:flex gap-4">
               {navItems.slice(0, 4).map(item => (
                 <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    {item.label}
                 </Link>
               ))}
            </nav>
            <div className="flex">
              <UserMenu />
            </div>
            <CartIcon />
          </div>
        </div>

        <div className="container pb-3 md:hidden">
           <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Procurar produtos..." className="w-full rounded-full bg-muted pl-10 pr-4 py-2 text-base"/>
          </div>
        </div>
      </header>
    </>
  );
}
