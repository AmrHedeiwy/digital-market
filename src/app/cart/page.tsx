'use client';

import Icons from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PRODUCT_CATEGORIES } from '@/config';
import { useCart } from '@/hooks/use-cart';
import { cn, formatPrice } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Page = () => {
  const { items, removeItem } = useCart();

  const router = useRouter();

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      }
    });

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => setIsMounted(true), []);

  const cartTotal = items.reduce((total, { product }) => total + product.price, 0);
  const fee = 1;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn(
              'lg:col-span-7',
              isMounted &&
                items.length === 0 &&
                ' border-2 border-dashed rounded border-zinc-200 p-12'
            )}
          >
            <h1 className="sr-only">Items in your shopping cart</h1>

            {isMounted && items.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <Icons.cart className="w-44 h-44 mb-4 mr-4" aria-hidden="true" />
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show yet.
                </p>
              </div>
            )}

            <ul
              className={cn(
                isMounted &&
                  items.length > 0 &&
                  'divide-y divide-gray-200 border-b border-t border-gray-200'
              )}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (category) => category.value === product.category
                  )?.label;

                  const { image } = product.images[0];

                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== 'string' && !!image.url && (
                            <Image
                              src={image.url}
                              fill
                              alt="product image"
                              className="w-full h-full object-cover object-center rounded-md sm:h-48 sm:w-48"
                            />
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-center sm:ml-6">
                        <div className="relative">
                          <div className="flex flex-col items-start justify-center">
                            <h3>
                              <Link
                                className="font-medium text-gray-700 hover:text-gray-800"
                                href={`/product/${product.id}`}
                              >
                                {product.name}
                              </Link>
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Category: {label}
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                variant="ghost"
                                onClick={() => removeItem(product.id)}
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-xl font-medium text-gray-900">Order summary</h2>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">Substotal</p>

              <p className="text-sm font-medium text-gray-900">
                {isMounted ? (
                  formatPrice(cartTotal)
                ) : (
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                )}
              </p>
            </div>

            <Separator className="mt-4" aria-hidden="true" />

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">Flat Transaction Fee</p>
              <p className="text-xs font-medium text-gray-900">
                {isMounted ? (
                  formatPrice(fee)
                ) : (
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                )}
              </p>
            </div>

            <Separator className="mt-4" aria-hidden="true" />

            <div className="flex items-center justify-between mt-4">
              <p className="text-base font-medium text-gray-900">Order Total</p>
              <p className="text-base font-medium text-gray-900">
                {isMounted ? (
                  formatPrice(cartTotal + fee)
                ) : (
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                )}
              </p>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isLoading}
                onClick={() =>
                  createCheckoutSession({
                    productIds: items.map(({ product }) => product.id)
                  })
                }
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Just a moment...</span>
                  </div>
                ) : (
                  'Checkout'
                )}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
