import { redirect } from 'next/navigation';

// This page is not needed as the home page already lists all products.
// We redirect to the home page instead.
export default function ProductsPage() {
  redirect('/');
}
