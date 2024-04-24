'use client';

import { usePathname } from 'next/navigation';
import MaxWidthWrapper from './MaxWidthWrapper';
import Icons from './Icons';
import Link from 'next/link';

const Footer = () => {
  const pathname = usePathname();

  const pathsToMinimize = ['/verify-email', '/sign-up', '/sign-in'];
  return (
    <footer className="bg-white flex-grow-0">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200 pt-2">
          {pathsToMinimize.includes(pathname) ? null : (
            <div className="pb-8 pt-16">
              <div className="flex justify-center">
                <Icons.logo className="h-20 w-20" />
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname) ? null : (
            <div>
              <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                <div
                  aria-hidden="true"
                  className="absolute bg-zinc-50 rounded-lg inset-0"
                ></div>

                <div className="text-center relative mx-auto max-w-sm">
                  <h3 className="font-semibold text-gray-900">Become a seller</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If you&apos;d like to sell high-quality digital products, you can do
                    so in minutes.{' '}
                    <Link
                      href="/sell"
                      className="whitespace-nowrap font-medium text-black hover:text-zinc-900"
                    >
                      Get started &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground md:text-left text-center">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>

          <div className="flex items-center justify-center mt-4 md:mt-0 space-x-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
              Cookie Policy
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
