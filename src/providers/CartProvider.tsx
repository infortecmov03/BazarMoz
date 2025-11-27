'use client';

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getDocs, writeBatch, serverTimestamp, setDoc, deleteDoc, onSnapshot, CollectionReference, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isLoading: boolean;
  isUpdating: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [firestoreCart, setFirestoreCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Memoize the cart collection reference
  const cartColRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'cart');
  }, [user, firestore]);
  
  // Subscribe to Firestore cart changes
  useEffect(() => {
    if (!cartColRef) {
      // If there's no user, we might be using local cart. Don't show loading.
      if (!user) {
        setIsLoading(false);
      }
      return;
    };
    
    setIsLoading(true);
    const unsubscribe = onSnapshot(cartColRef, (snapshot) => {
      const serverCart = snapshot.docs.map(doc => ({ ...doc.data() as CartItem, id: doc.id }));
      setFirestoreCart(serverCart);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching cart from Firestore:", error);
      toast({ title: "Erro ao carregar carrinho", description: "Não foi possível sincronizar o seu carrinho.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [cartColRef, toast, user]);


  // Load local cart from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('bazar-pt-cart');
      if (storedCart) {
        setLocalCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Falha ao carregar o carrinho do localStorage', error);
    }
     // When the component first loads, we assume we might need to load from local storage
     // or wait for firestore. We set loading to false only after we know for sure.
     // The firestore effect will handle setting it to false for logged-in users.
     // For anonymous users, this ensures it doesn't show a loader forever.
    if (!user) {
        setIsLoading(false);
    }
  }, [user]);

  // Merge local cart to Firestore on user login
  useEffect(() => {
    const mergeCart = async () => {
      if (user && !user.isAnonymous && localCart.length > 0 && firestore) {
        setIsUpdating(true);
        const cartRef = collection(firestore, 'users', user.uid, 'cart');
        const batch = writeBatch(firestore);

        const serverCartSnapshot = await getDocs(cartRef);
        const serverCartItems = new Map(serverCartSnapshot.docs.map(d => [d.id, d.data() as CartItem]));

        localCart.forEach(localItem => {
          const docRef = doc(cartRef, localItem.id);
          const serverItem = serverCartItems.get(localItem.id);
          const newQuantity = serverItem ? serverItem.quantity + localItem.quantity : localItem.quantity;
          batch.set(docRef, { ...localItem, quantity: newQuantity });
        });

        try {
          await batch.commit();
          setLocalCart([]); // Clear local cart after merge
          localStorage.removeItem('bazar-pt-cart');
        } catch (error) {
          console.error("Error merging cart:", error);
          toast({ title: "Erro ao sincronizar carrinho", description: "Não foi possível guardar o seu carrinho online.", variant: "destructive" });
        } finally {
          setIsUpdating(false);
        }
      }
    };
    mergeCart();
  }, [user, firestore, localCart, toast]);


  const cart = useMemo(() => (user && !user.isAnonymous) ? firestoreCart : localCart, [user, firestoreCart, localCart]);

  const addToCart = useCallback(async (product: Product) => {
    setIsUpdating(true);
    if (user && firestore) { // This now includes anonymous users
      const cartRef = collection(firestore, 'users', user.uid, 'cart');
      const docRef = doc(cartRef, product.id);
      
      const currentCart = (user.isAnonymous) ? localCart : firestoreCart;
      const existingItem = currentCart.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      try {
         // For anonymous users, we still write to local storage
        if(user.isAnonymous){
             const updatedCart = existingItem
                ? localCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                : [...localCart, { ...product, quantity: 1 }];
            localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
            setLocalCart(updatedCart);
        } else {
             await setDoc(docRef, { ...product, quantity: newQuantity }, { merge: true });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({ title: "Erro", description: "Não foi possível adicionar ao carrinho.", variant: "destructive" });
      }
    } else { // Fallback for when user/firestore is not available
      setLocalCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        const updatedCart = existingItem
          ? prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...prevCart, { ...product, quantity: 1 }];
        localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
    setIsUpdating(false);
  }, [user, firestore, localCart, firestoreCart, toast]);

  const removeFromCart = useCallback(async (productId: string) => {
    setIsUpdating(true);
     if (user && firestore) {
       if(user.isAnonymous) {
         setLocalCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== productId);
            localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
       } else {
          const docRef = doc(firestore, 'users', user.uid, 'cart', productId);
          try {
            await deleteDoc(docRef);
          } catch (error) {
            console.error("Error removing from Firestore cart:", error);
            toast({ title: "Erro", description: "Não foi possível remover do carrinho.", variant: "destructive" });
          }
       }
    } else {
      setLocalCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.id !== productId);
        localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
     setIsUpdating(false);
  }, [user, firestore, toast]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setIsUpdating(true);
    if (user && firestore) {
       if(user.isAnonymous){
            setLocalCart(prevCart => {
                const updatedCart = prevCart.map(item => item.id === productId ? { ...item, quantity } : item);
                localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
       } else {
            const docRef = doc(firestore, 'users', user.uid, 'cart', productId);
            try {
                await setDoc(docRef, { quantity }, { merge: true });
            } catch (error) {
                console.error("Error updating Firestore cart:", error);
                toast({ title: "Erro", description: "Não foi possível atualizar o carrinho.", variant: "destructive" });
            }
       }
    } else {
      setLocalCart(prevCart => {
        const updatedCart = prevCart.map(item => item.id === productId ? { ...item, quantity } : item);
        localStorage.setItem('bazar-pt-cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
     setIsUpdating(false);
  }, [user, firestore, removeFromCart, toast]);

  const clearCart = useCallback(async () => {
    setIsUpdating(true);
    if (user && firestore) {
      if(user.isAnonymous){
        setLocalCart([]);
        localStorage.removeItem('bazar-pt-cart');
      } else {
        const cartRef = collection(firestore, 'users', user.uid, 'cart');
        const batch = writeBatch(firestore);
        try {
            const snapshot = await getDocs(cartRef);
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        } catch (error) {
            console.error("Error clearing Firestore cart:", error);
            toast({ title: "Erro", description: "Não foi possível limpar o carrinho.", variant: "destructive" });
        }
      }
    } else {
      setLocalCart([]);
      localStorage.removeItem('bazar-pt-cart');
    }
    setIsUpdating(false);
  }, [user, firestore, toast]);

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    isLoading,
    isUpdating,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
