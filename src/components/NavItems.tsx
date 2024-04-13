'use client';

import { PRODUCT_CATEGORIES } from '@/config';
import { useEffect, useRef, useState } from 'react';
import NavItem from './NavItem';
import useOnClickOutside from '@/hooks/use-on-click-outside';

const NavItems = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close active nav-item when clicking outside of it
  useOnClickOutside(navRef, () => setActiveIdx(null));

  // Close active nav-item on 'ESC' key
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null);
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIdx === i) setActiveIdx(null);
          else setActiveIdx(i);
        };

        return (
          <NavItem
            category={category}
            handleOpen={handleOpen}
            isOpen={activeIdx === i}
            key={category.value}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
