'use server';

import { firestore } from '@/firebase/server';
import type { CartItem } from '@/lib/types';
import { collection, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';

export async function placeOrder(
  cartItems: CartItem[],
  customerDetails: { name: string; address: string },
  userId: string | null
) {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'Cart is empty.' };
  }

  try {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      userId,
      customerDetails: JSON.stringify(customerDetails), // Firestore works better with primitive types or maps
      items: cartItems.map(item => ({ // Convert CartItem to plain object
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: (item.images && item.images[0]) || '' // Make sure to have a fallback
      })), 
      totalAmount,
      status: 'pending',
      orderDate: serverTimestamp(),
    };

    const ordersRef = collection(firestore, `users/${userId}/orders`);
    const orderRef = await addDoc(ordersRef, orderData);

    // After placing order, clear the user's cart in Firestore
    const cartRef = collection(firestore, `users/${userId}/cart`);
    const cartSnapshot = await getDocs(cartRef);
    const batch = writeBatch(firestore);
    cartSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();


    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error('Error placing order:', error);
    if (error instanceof Error) {
       return { success: false, error: error.message };
    }
    return { success: false, error: 'Could not place order due to an unknown error.' };
  }
}
