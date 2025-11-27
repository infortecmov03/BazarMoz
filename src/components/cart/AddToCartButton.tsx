'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, isUpdating } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Adicionado ao Carrinho',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} size="sm" disabled={product.stock <= 0 || isUpdating}>
      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      Adicionar
    </Button>
  );
}
