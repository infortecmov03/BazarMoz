'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Skeleton } from '../ui/skeleton';
import placeholderImages from '@/lib/placeholder-images.json';

const DynamicAddToCartButton = dynamic(() => import('../cart/AddToCartButton').then(mod => mod.AddToCartButton), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-24 rounded-md" />
});

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = (product.images && product.images[0]) || placeholderImages.productCard.src.replace('{id}', product.id);

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={placeholderImages.productCard.hint}
          />
          {product.stock <= 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">Esgotado</Badge>
          )}
          {product.isOnSale && product.stock > 0 && (
              <Badge className="absolute top-2 left-2">Promoção</Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2 h-10 text-sm">{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-lg font-bold">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(product.price)}
          </p>
          {/* Prevent Link parent from navigating when clicking the button */}
          <div onClick={(e) => e.preventDefault()}>
            <DynamicAddToCartButton product={product} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
