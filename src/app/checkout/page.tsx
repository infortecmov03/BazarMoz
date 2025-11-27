'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useUser } from '@/firebase';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

import { placeOrder } from '@/actions/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  address: z.string().min(10, { message: 'A morada deve ter pelo menos 10 caracteres.' }),
});

export default function CheckoutPage() {
  const { user, isUserLoading } = useUser();
  const { cart, clearCart, total } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      toast({
        title: 'Acesso Negado',
        description: 'Faça login para finalizar a compra.',
        variant: 'destructive',
      });
      router.push('/');
    }
    if (!isUserLoading && user && user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
       toast({
        title: 'E-mail não verificado',
        description: 'Verifique o seu e-mail para finalizar a compra.',
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [user, isUserLoading, router, toast]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!user || cart.length === 0) return;
      const result = await placeOrder(cart, values, user.uid);
      if (result.success && result.orderId) {
        toast({
          title: 'Pedido Realizado!',
          description: 'O seu pedido foi realizado com sucesso.',
        });
        clearCart(); // This will now also clear the Firestore cart via the provider
        router.push(`/order-confirmation/${result.orderId}`);
      } else {
        toast({
          title: 'Erro no Pedido',
          description: result.error || 'Não foi possível completar o seu pedido.',
          variant: 'destructive',
        });
      }
    });
  }
  
  if (isUserLoading || !user || cart.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Finalizar Compra</CardTitle>
          <CardDescription>
            Complete os seus dados para finalizar o pedido. Total: {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(total)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="O seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada de Entrega</FormLabel>
                    <FormControl>
                      <Input placeholder="A sua morada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pagar e Finalizar Pedido
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/">Voltar ao Catálogo</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
