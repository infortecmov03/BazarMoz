'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailAuthForm } from './EmailAuthForm';
import { PhoneAuthForm } from './PhoneAuthForm';
import { useState } from 'react';

export function AuthDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Registar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autenticação</DialogTitle>
          <DialogDescription>
            Escolha um método para entrar ou criar a sua conta.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">E-mail</TabsTrigger>
            <TabsTrigger value="phone">Telemóvel</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <EmailAuthForm onAuthSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="phone">
            <PhoneAuthForm onAuthSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
