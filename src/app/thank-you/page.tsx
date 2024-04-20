import Icons from '@/components/Icons';
import PaymentStatus from '@/components/PaymentStatus';
import { Separator } from '@/components/ui/separator';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { getServerSideUser } from '@/lib/payload-utils';
import { formatPrice } from '@/lib/utils';
import { Product, ProductFile, User } from '@/payload-types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;

  const { user } = await getServerSideUser(cookies());
  const paylaod = await getPayloadClient();

  const { docs: orders } = await paylaod.find({
    collection: 'orders',
    depth: 2,
    where: {
      id: { equals: orderId }
    }
  });

  const [order] = orders;

  if (!order) return notFound();

  const orderUserId = typeof order.user === 'string' ? order.user : order.user.id;

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  const orderTotal = (order.products as Product[]).reduce(
    (total, { price }) => total + price,
    0
  );

  const fee = 1;
  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4">
        <Icons.thankYou className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <div className="lg:col-start-2">
          <p className="text-sm font-medium text-blue-600">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thanks for ordering
          </h1>

          {order._isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was processed and your assets are available to download below.
              We&apos;ve sent your reciept and order details to{' '}
              <span className="font-medium text-gray-900">{user.email}</span>.
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we&apos;re currently processing it. So hang
              tight and we&apos;ll send you confirmation very soon!
            </p>
          )}

          <div className="mt-16 text-sm font-medium">
            <p className="text-muted-foreground">Order nr.</p>
            <p className="mt-2 text-gray-900">{order.id}</p>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.category
                )?.label;

                const downloadUrl = (product.product_files as ProductFile).url as string;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24 bg-gray-50">
                      {typeof image !== 'string' && !!image.url && (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.name} image`}
                          className=" rounded-md object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.name}</h3>

                        <p className="my-1">Category: {label}</p>
                      </div>

                      {order._isPaid && (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Download assets
                        </a>
                      )}
                    </div>

                    <p className="font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <Separator aria-hidden="true" />

            <div className="space-y-6 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text text-gray-900">{formatPrice(fee)}</p>
              </div>

              <Separator aria-hidden="true" />

              <div className="flex justify-between text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(orderTotal + fee)}</p>
              </div>

              <PaymentStatus
                isPaid={order._isPaid}
                orderEmail={user.email}
                orderId={order.id}
              />
              <Separator aria-hidden="true" />

              <Link
                href="/products"
                className="flex justify-end text-blue-600 hover:text-blue-500"
              >
                Contiue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
