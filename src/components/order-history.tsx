'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderHistoryProps {
  orders: Order[] | null;
  isLoading: boolean;
}

export function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Compras</CardTitle>
        <CardDescription>
          Veja os detalhes de todos os seus pedidos anteriores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {orders.sort((a, b) => b.orderDate.toDate().getTime() - a.orderDate.toDate().getTime()).map((order) => (
              <AccordionItem value={order.id} key={order.id}>
                <AccordionTrigger>
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left">
                      <p className="font-medium">
                        Pedido de {format(order.orderDate.toDate(), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">ID: {order.id.substring(0, 7)}</p>
                    </div>
                    <Badge variant="secondary">MT{order.totalAmount.toFixed(2)}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-2">
                    {order.items.map((item) => (
                      <li key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                        </span>
                        <span className="font-medium">
                          MT{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            Você ainda não fez nenhuma compra.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
