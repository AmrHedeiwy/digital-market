'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icons from '@/components/Icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { ZodError } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get('as') === 'seller';
  const origin = searchParams.get('origin');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator)
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        toast.error('Invalid email or password.');
        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error('Something went wrong. Please try again.');
    },
    onSuccess: async () => {
      toast.success(`Signed in successfully`);

      if (origin) {
        router.push(`/${origin}`);

        return router.refresh();
      }

      if (isSeller) {
        router.push('/sell');
        return router.refresh();
      }

      router.push('/');
      return router.refresh();
    }
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  return (
    <div className="container relative pt-20 flex flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center text-center">
          <Icons.logo className="w-24 h-24" />
          <h1 className="text-2xl font-bold">
            Sign in to your {isSeller ? 'seller' : ''} account
          </h1>
          <Link
            className={buttonVariants({ variant: 'link', className: 'group' })}
            href="/sign-up"
          >
            Dont&apos;t have an account? Sign-up
            <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  className={cn(!!errors.email && 'focus-visible:ring-red-500')}
                  placeholder="you@example.com"
                />
                {!!errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register('password')}
                  type="password"
                  className={cn(!!errors.password && 'focus-visible:ring-red-500')}
                  placeholder="Password"
                />
                {!!errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin h-6 w-6 text-zinc-300" />
                    <p className="font-semibold text-muted">Loading...</p>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {isSeller ? (
            <Button
              onClick={() => router.replace('/sign-in', undefined)}
              variant="secondary"
              disabled={isLoading}
            >
              Continue as customer
            </Button>
          ) : (
            <Button
              onClick={() => router.push('?as=seller')}
              variant="secondary"
              disabled={isLoading}
            >
              Continue as seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
