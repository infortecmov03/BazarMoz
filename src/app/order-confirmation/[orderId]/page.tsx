'use client';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { CartItem } from '@/lib/types'; // Using CartItem because order items have the same structure
import { useUser, useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';

// Define a type for the order to ensure type safety
interface Order {
  id: string;
  orderDate: Timestamp;
  customerDetails: string; // This is a stringified JSON
  items: CartItem[];
  totalAmount: number;
}

// This is now a client component to use the useUser hook and get the userId
export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore(); // Get firestore instance from the hook

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading || !firestore) return; // Wait for user and firestore to be loaded
    if (!user) {
        // Handle case where there is no user (e.g. redirect or show error)
        setLoading(false);
        return;
    };
    
    const getOrder = async () => {
      // Orders are now in a subcollection of the user
      const docRef = doc(firestore, 'users', user.uid, 'orders', orderId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder({ 
          id: docSnap.id,
          orderDate: data.orderDate,
          customerDetails: data.customerDetails,
          items: data.items,
          totalAmount: data.totalAmount,
        });
      } else {
        setOrder(null);
      }
      setLoading(false);
    };

    getOrder();
  }, [orderId, user, isUserLoading, firestore]);

  if (loading || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    notFound();
  }
  
  const orderItems = order.items;
  const total = order.totalAmount;
  const customerDetails = JSON.parse(order.customerDetails);

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <CardTitle className="text-2xl">Obrigado pelo seu pedido!</CardTitle>
              <CardDescription>O seu pedido foi confirmado e está a ser processado.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Número do Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Data:</strong> {order.orderDate.toDate().toLocaleDateString('pt-MZ')}
              </p>
               <p>
                <strong>Nome:</strong> {customerDetails.name}
              </p>
               <p>
                <strong>Morada:</strong> {customerDetails.address}
              </p>
            </div>
            <Separator />
            <ul className="grid gap-3">
              {orderItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.name} <span className="text-xs">x{item.quantity}</span>
                  </span>
                  <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/50 p-6">
          <Button asChild className="w-full">
            <Link href="/">Continuar a Comprar</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
