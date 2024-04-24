'use client';

import { Car, Menu, SlashIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/payload-types';
import Cart from './Cart';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from './ui/breadcrumb';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';

const MobileNav = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col sm:max-w-lg overflow-scroll">
          <ul>
            {PRODUCT_CATEGORIES.map((category) => (
              <li className="space-y-10 px-2 py-6" key={category.label}>
                <div className="border-b-2 border-gray-200 -mb-px">
                  <p className=" text-gray-900 flex-1 whitespace-nowrap py-4 text-base font-medium">
                    {category.label}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 px-2">
                  {category.featured.map((item) => (
                    <div className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded-lg group-hover:opacity-75">
                        <Image
                          fill
                          src={item.imageSrc}
                          alt={`${item.name} image`}
                          className="object-cover object-center"
                        />
                      </div>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-900 font-medium mt-6"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <SheetFooter>
            <div className="flex items-center justify-center rounded-md border bg-gray-100 w-full">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={() => router.push(user ? '/sell' : '/sign-in')}
                >
                  {user ? 'Dashboard' : 'Sign in'}
                </Button>
              </SheetClose>

              <SlashIcon className="w-4 h-4" />

              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={() => (user ? signOut() : router.push('/sign-up'))}
                >
                  {user ? 'Log out' : 'Sign up'}
                </Button>
              </SheetClose>

              <div className="ml-auto mr-4">
                <Cart />
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
