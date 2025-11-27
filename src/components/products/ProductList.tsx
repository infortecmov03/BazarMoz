import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products = [] }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
