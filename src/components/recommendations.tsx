'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ProductList } from './product-list';
import type { Product } from '@/lib/types';
import { recommendProducts } from '@/ai/flows/product-recommendations';
import { useToast } from '@/hooks/use-toast';
import { products as allProductsStore } from '@/lib/products';
import type { ProductSchema } from '@/ai/flows/product-recommendations';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [browsingHistory, setBrowsingHistory] = useState<Product[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const storedHistory = localStorage.getItem('browsingHistory');
    if (storedHistory) {
      setBrowsingHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    const handleGetRecommendations = async () => {
      if (browsingHistory.length === 0) {
        return;
      }
  
      setIsLoading(true);
      setRecommendations([]);
  
      try {
        const result: ProductSchema[] = await recommendProducts({
          userPreferences: 'Gosto de arte moderna e gadgets úteis. Prefiro produtos com boas avaliações e preços moderados.',
          browsingHistory: browsingHistory.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              imageUrl: p.imageUrl,
              category: p.category,
              stock: p.stock,
          })),
        });
        
        const mappedResults: Product[] = result.map(rec => {
          const productFromStore = allProductsStore.find(p => p.id === rec.id);
          return productFromStore || { ...rec, imageHint: '' };
        }).filter(p => p && !browsingHistory.some(hist => hist.id === p.id)).slice(0, 3) as Product[];
  
        setRecommendations(mappedResults);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Erro ao obter recomendações',
          description: 'Ocorreu um problema ao se comunicar com a IA. Tente novamente mais tarde.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if(browsingHistory.length > 0){
        handleGetRecommendations();
    }
  }, [browsingHistory, toast]);

  if (pathname.startsWith('/products/')) {
    return null;
  }

  if (isLoading) {
    return (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Recomendações de IA para você</h2>
            <p className="text-muted-foreground">Analisando seu gosto...</p>
            <div className="mt-6 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </section>
    )
  }

  if (recommendations.length === 0) {
    return null;
  }


  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recomendações de IA para você</h2>
          <p className="text-muted-foreground">Com base nos produtos que você visualizou recentemente.</p>
        </div>
      </div>

      <div className="mt-6">
        <ProductList products={recommendations} />
      </div>
    </section>
  );
}
