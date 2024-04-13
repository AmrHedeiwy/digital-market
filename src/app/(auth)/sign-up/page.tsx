'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icons from '@/components/Icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator
} from '@/lib/validators/account-credentials-validator';

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator)
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // TODO: send data to the server
  };

  return (
    <>
      <div className="container relative pt-20 flex flex-col items-center justify-center lg:px-0">
        <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center text-center">
            <Icons.logo className="w-60 h-28" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              className={buttonVariants({ variant: 'link', className: 'group' })}
              href="/sign-in"
            >
              Already have an account? Sign-in
              <ArrowRight className="w-4 h-4 transition group-hover:ml-1" />
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
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register('password')}
                    className={cn(!!errors.password && 'focus-visible:ring-red-500')}
                    placeholder="Password"
                  />
                </div>

                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
