import ProductList from '@/components/products/ProductList';
import { firestore } from '@/firebase/server';
import type { Product } from '@/lib/types';
import { collection, getDocs, query } from 'firebase/firestore';
import { placeholderProducts } from '@/lib/placeholder-products';

async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, 'products');
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      return products;
    }
  } catch (error) {
    console.error("Could not fetch products, probably because the database is not populated yet.", error);
  }
  // Fallback to placeholder data if Firestore is empty or fails
  return placeholderProducts;
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold font-headline mb-8">Todos os Produtos</h1>
      <ProductList products={products} />
    </div>
  );
}
