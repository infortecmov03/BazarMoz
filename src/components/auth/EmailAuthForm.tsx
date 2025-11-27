'use client';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';

const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailAuthFormProps {
  onAuthSuccess: () => void;
}

export function EmailAuthForm({ onAuthSuccess }: EmailAuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleRegister = (data: FormValues) => {
    if (!data.password || !auth) return;
    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await sendEmailVerification(userCredential.user);
        await signOut(auth); // Sign out to force user to verify email
        toast({
          title: 'Conta Criada!',
          description: 'Enviámos um e-mail de verificação. Por favor, verifique a sua caixa de entrada para poder fazer login.',
        });
        form.reset();
        onAuthSuccess();
      } catch (error: any) {
        toast({
          title: 'Erro no Registo',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleLogin = (data: FormValues) => {
    if (!data.password || !auth) return;
    startTransition(async () => {
      try {
        const credential = EmailAuthProvider.credential(data.email, data.password);

        // If user is anonymous, link the account. Otherwise, sign in.
        if (user && user.isAnonymous) {
          await linkWithCredential(user, credential);
           toast({
            title: 'Conta associada!',
            description: 'A sua conta foi associada com sucesso.',
          });
        } else {
           const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
           if (!userCredential.user.emailVerified) {
             await signOut(auth);
             toast({
               title: 'E-mail não verificado',
               description: 'Por favor, verifique a sua caixa de entrada.',
               variant: 'destructive',
             });
             return; // Stop execution
           }
            toast({
              title: 'Login bem-sucedido!',
              description: `Bem-vindo de volta!`,
            });
        }
        onAuthSuccess();
      } catch (error: any) {
        toast({
          title: 'Erro no Login',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };
  
  const handlePasswordReset = (data: FormValues) => {
    if (!auth) return;
    startTransition(async () => {
      try {
        await sendPasswordResetEmail(auth, data.email);
        toast({
          title: 'E-mail de Recuperação Enviado',
          description: 'Se existir uma conta com este e-mail, receberá um link para redefinir a sua palavra-passe.',
        });
        setIsForgotPassword(false);
        form.reset();
      } catch (error: any) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const onSubmit = isForgotPassword ? handlePasswordReset : isLogin ? handleLogin : handleRegister;

  if (isForgotPassword) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Recuperar Palavra-passe</CardTitle>
          <CardDescription>
            Insira o seu e-mail para receber um link de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="o_seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Link de Recuperação
              </Button>
            </form>
          </Form>
           <Button variant="link" size="sm" className="mt-4 px-0" onClick={() => setIsForgotPassword(false)}>
            Voltar ao Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Registar'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Entre com o seu e-mail e palavra-passe.' : 'Crie uma nova conta.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="o_seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavra-passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {isLogin && (
              <Button variant="link" size="sm" className="px-0 h-auto py-1 text-xs" onClick={() => setIsForgotPassword(true)}>
                Esqueceu-se da palavra-passe?
              </Button>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>
        </Form>
        <Button variant="link" size="sm" className="mt-4 px-0" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Não tem uma conta? Registe-se.' : 'Já tem uma conta? Faça login.'}
        </Button>
      </CardContent>
    </Card>
  );
}
