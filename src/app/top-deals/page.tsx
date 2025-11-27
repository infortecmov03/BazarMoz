import ProductList from '@/components/products/ProductList';
import { firestore } from '@/firebase/server';
import type { Product } from '@/lib/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { placeholderProducts } from '@/lib/placeholder-products';

async function getSaleProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, 'products');
    const q = query(productsRef, where('isOnSale', '==', true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      return products;
    }
  } catch (error) {
    console.error("Could not fetch sale products, probably because the database is not populated yet.", error);
  }
  // Fallback to placeholder data if Firestore is empty or fails
  return placeholderProducts.filter(p => p.isOnSale);
}

export default async function TopDealsPage() {
  const saleProducts = await getSaleProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold font-headline">Promoções</h1>
      {saleProducts.length > 0 ? (
        <ProductList products={saleProducts} />
      ) : (
        <p className="text-center text-muted-foreground">De momento, não há produtos em promoção.</p>
      )}
    </div>
  );
}
