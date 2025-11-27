'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Trash2, Loader2 } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

export function CartSheetContent() {
  const { cart, itemCount, total, updateQuantity, removeFromCart, isUpdating, isLoading } = useCart();

  if (isLoading) {
      return (
        <SheetContent className="flex w-full flex-col items-center justify-center pr-0 sm:max-w-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>A carregar o carrinho...</p>
        </SheetContent>
      )
  }

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Carrinho ({itemCount})</SheetTitle>
        <SheetDescription>
          Reveja os seus itens antes de finalizar a compra.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      {itemCount > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 px-6 py-4">
              {cart.map((item) => {
                const primaryImage = (item.images && item.images[0]) ? item.images[0] : placeholderImages.cartItem.src.replace('{id}', item.id);
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={primaryImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        data-ai-hint={placeholderImages.cartItem.hint}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="h-8 w-16"
                          disabled={isUpdating}
                        />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)} disabled={isUpdating}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="bg-secondary/50 p-6">
            <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(total)}</span>
                </div>
                <SheetClose asChild>
                    <Button asChild className='w-full' disabled={isUpdating}>
                        <Link href="/checkout">Finalizar Compra</Link>
                    </Button>
                </SheetClose>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">O seu carrinho está vazio.</p>
        </div>
      )}
    </SheetContent>
  );
}
