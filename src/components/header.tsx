'use client';

import { Menu, ShoppingBag, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from '@/components/cart-sheet';
import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { SearchDialog } from './search-dialog';
import { useAuth } from '@/firebase';
import Link from 'next/link';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isUserLoading } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <a href="/" className="text-2xl font-bold text-primary">
            Bazar Moçambique AI
          </a>
          <div className="hidden flex-1 md:flex justify-center">
             <SearchDialog />
          </div>
          <div className="hidden md:flex items-center gap-2">
             <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag />
                <span className="sr-only">Open cart</span>
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </div>
            {!isUserLoading && (
              user ? (
                 <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <UserIcon />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )
            )}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <SearchDialog />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 py-6">
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => {
                        const menuTrigger = document.querySelector('[aria-controls="radix-:R1mlaq:"]');
                        if (menuTrigger instanceof HTMLElement) {
                            menuTrigger.click();
                        }
                        setIsCartOpen(true)
                    }}>
                        <ShoppingBag />
                        Carrinho ({totalItems})
                    </Button>
                     {!isUserLoading && (
                        user ? (
                          <Button variant="ghost" className="justify-start gap-2" asChild>
                            <Link href="/profile"><UserIcon /> Perfil</Link>
                          </Button>
                        ) : (
                           <Button variant="ghost" className="justify-start gap-2" asChild>
                            <Link href="/login">Login</Link>
                          </Button>
                        )
                      )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
