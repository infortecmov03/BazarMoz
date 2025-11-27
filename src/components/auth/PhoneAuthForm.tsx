'use client';

import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential, signInWithCredential } from 'firebase/auth';
import { useEffect, useState, useTransition } from 'react';
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

const phoneSchema = z.object({
  phone: z.string().startsWith('+', "Deve incluir o indicativo do país (ex: +258).").min(10, "Número de telemóvel inválido."),
});

const codeSchema = z.object({
  code: z.string().length(6, "O código deve ter 6 dígitos."),
});

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}

interface PhoneAuthFormProps {
  onAuthSuccess: () => void;
}

export function PhoneAuthForm({ onAuthSuccess }: PhoneAuthFormProps) {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });


  useEffect(() => {
    if (!auth) return;
    
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
       const recaptchaContainer = document.getElementById('recaptcha-container') ?? document.createElement('div');
       if (!document.getElementById('recaptcha-container')) {
           recaptchaContainer.id = 'recaptcha-container';
           document.body.appendChild(recaptchaContainer);
       }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        'size': 'invisible',
      });
      setRecaptchaReady(true);
      
      return () => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
      };
    } else if (typeof window !== 'undefined' && window.recaptchaVerifier) {
      setRecaptchaReady(true);
    }
  }, [auth]);

  const onSendCode = (data: z.infer<typeof phoneSchema>) => {
    startTransition(async () => {
      if (!recaptchaReady || !auth) {
        toast({
          title: 'Aguarde',
          description: 'O reCAPTCHA ainda não está pronto.',
          variant: 'destructive',
        });
        return;
      }
      try {
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, data.phone, appVerifier);
        setConfirmationResult(result);
        toast({
          title: 'Código Enviado',
          description: 'Enviámos um código por SMS para o seu telemóvel.',
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao Enviar Código',
          description: error.message,
          variant: 'destructive',
        });
        if (window.grecaptcha && window.recaptchaVerifier) {
            window.grecaptcha.reset(window.recaptchaVerifier.widgetId);
        }
      }
    });
  };

  const onVerifyCode = (data: z.infer<typeof codeSchema>) => {
    if (!confirmationResult || !auth) return;
    startTransition(async () => {
      try {
        const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, data.code);
        
        if (user && user.isAnonymous) {
          await linkWithCredential(user, credential);
          toast({
            title: 'Telemóvel Verificado!',
            description: 'A sua conta foi atualizada com sucesso.',
          });
        } else {
          await signInWithCredential(auth, credential);
           toast({
            title: 'Login bem-sucedido!',
            description: 'Bem-vindo de volta!',
          });
        }
        onAuthSuccess();
      } catch (error: any) {
        toast({
          title: 'Código Inválido',
          description: 'Não foi possível verificar o seu número. O código pode estar incorreto ou expirado.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Autenticação por Telemóvel</CardTitle>
        <CardDescription>
          {confirmationResult ? 'Insira o código que enviámos.' : 'Insira o seu número de telemóvel.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!confirmationResult ? (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onSendCode)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Telemóvel</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+258 84 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending || !recaptchaReady}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Código
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Verificação</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verificar Código
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
