import AddToCartButton from '@/components/AddToCartButton';
import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { formatPrice } from '@/lib/utils';
import { Check, Shield, SlashIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' }
];

const Page = async ({ params }: PageProps) => {
  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: { equals: params.productId },
      approvedForSale: { equals: 'approved' }
    }
  });

  const [product] = products;

  if (!product) return notFound();

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;

  const validUrls = product.images
    .map(({ image }) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <Breadcrumb>
            <BreadcrumbList>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <Fragment key={breadcrumb.id}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {i !== BREADCRUMBS.length - 1 && (
                    <BreadcrumbSeparator>
                      <SlashIcon />
                    </BreadcrumbSeparator>
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <section className="mt-4">
            <div className="flex items-center">
              <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>

              <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                {label}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-base text-muted-foreground">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <Check
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-green-500"
              />
              <p className="text-sm text-muted-foreground">
                Eligible for instant delivery
              </p>
            </div>
          </section>
        </div>

        {/* Product images */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-square rounded-lg">
            <ImageSlider urls={validUrls} />
          </div>
        </div>

        {/* add to cart */}
        <div className="mt-10 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div className="mt-10">
            <AddToCartButton product={product} />
          </div>
          <div className="mt-6 text-center">
            <div className="group inline-flex text-sm font-medium">
              <Shield
                aria-hidden="true"
                className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
              />
              <span className="text-muted-foreground group-hover:text-gray-700">
                30 Day Return Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subTitle={`Browse similar high-quality ${label} just like ${product.name}`}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
