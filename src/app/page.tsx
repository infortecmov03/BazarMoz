import ProductList from '@/components/products/ProductList';
import { firestore } from '@/firebase/server';
import type { Product } from '@/lib/types';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { placeholderProducts } from '@/lib/placeholder-products';
import placeholderImages from '@/lib/placeholder-images.json';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, 'products');
    const q = query(productsRef, where('isFeatured', '==', true), limit(8));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    return products;
  } catch (error) {
    console.error("Could not fetch featured products, probably because the database is not populated yet.", error);
    return [];
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(firestore, 'products');
    const q = query(productsRef, limit(20));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    return products;
  } catch (error) {
    console.error("Could not fetch all products, probably because the database is not populated yet.", error);
    return [];
  }
}


export default async function Home() {
  let featuredProducts = await getFeaturedProducts();
  let allProducts = await getAllProducts();

  // If no products are found from firestore, use placeholder data
  if (featuredProducts.length === 0 && allProducts.length === 0) {
    featuredProducts = placeholderProducts.filter(p => p.isFeatured);
    allProducts = placeholderProducts;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {featuredProducts.length > 0 && (
        <>
          <h1 className="mb-4 text-3xl font-bold font-headline">Produtos em Destaque</h1>
          <ProductList products={featuredProducts} />
        </>
      )}
      
      <h2 className="mt-12 mb-4 text-3xl font-bold font-headline">Todos os Produtos</h2>
      <ProductList products={allProducts} />
    </div>
  );
}
