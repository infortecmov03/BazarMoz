'use client';

import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/products';
import { Product } from '@/lib/types';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { Recommendations } from '@/components/recommendations';

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  const id = typeof params.id === 'string' ? params.id : '';
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      const storedHistoryJSON = localStorage.getItem('browsingHistory');
      let history: Product[] = storedHistoryJSON ? JSON.parse(storedHistoryJSON) : [];
      
      if (!history.find(p => p.id === product.id)) {
        history.push(product);
        if (history.length > 6) {
          history = history.slice(history.length - 6);
        }
        localStorage.setItem('browsingHistory', JSON.stringify(history));
      }
    }
  }, [product]);

  if (!product) {
    return notFound();
  }

  const handleAddToCart = () => {
    if (addToCart(product)) {
      toast({
        title: 'Produto adicionado',
        description: `${product.name} foi adicionado ao seu carrinho.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Fora de estoque',
        description: `Não há estoque suficiente para ${product.name}.`,
      });
    }
  };
  
  const cartItem = cartItems.find(item => item.id === product.id);
  const stock = product.stock - (cartItem?.quantity || 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={product.imageHint}
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-3xl font-bold text-primary">MT{product.price.toFixed(2)}</p>
               <p className="text-sm text-muted-foreground">
                {stock > 0 ? `${stock} em estoque` : 'Fora de estoque'}
              </p>
              <Button size="lg" onClick={handleAddToCart} disabled={stock === 0} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
          <div className="mt-16">
            <Recommendations />
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Construído por Bazar Moçambique. Todos os direitos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
}
