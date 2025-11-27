'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { CartSheetContent } from './CartSheet';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Abrir carrinho de compras</span>
        </Button>
      </SheetTrigger>
      <CartSheetContent />
    </Sheet>
  );
}
