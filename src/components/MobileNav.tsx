'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { PRODUCT_CATEGORIES } from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/payload-types';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

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
          <div
            className={cn(
              'flex items-center justify-between rounded-md border bg-gray-100 w-full mt-4'
            )}
          >
            <SheetClose>
              <Button
                className="text-blue-600 hover:text-blue-500 hover:underline"
                variant="ghost"
                onClick={() => router.push(user ? '/sell' : '/sign-in')}
              >
                {user ? 'Seller Dashboard' : 'Sign in'}
              </Button>
            </SheetClose>

            <SheetClose>
              {user && (
                <Button
                  variant="link"
                  className="text-red-600 hover:text-red-400 hover:underline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              )}

              {!user && (
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-500 hover:underline"
                  size="sm"
                  onClick={() => router.push('/sign-up')}
                >
                  Create account
                </Button>
              )}
            </SheetClose>
          </div>
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
                    <div className="group relative" key={item.name}>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
