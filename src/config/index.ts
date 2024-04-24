export const PRODUCT_CATEGORIES = [
  {
    label: 'Ui kits',
    value: 'ui_kits' as const,
    featured: [
      {
        name: 'Editor picks',
        href: '/products',
        imageSrc: '/nav/ui-kits/mixed.jpg'
      },
      {
        name: 'New Arrivals',
        href: '/products',
        imageSrc: '/nav/ui-kits/blue.jpg'
      },
      {
        name: 'BestSellers',
        href: '/products',
        imageSrc: '/nav/ui-kits/purple.jpg'
      }
    ]
  },
  {
    label: 'Icons',
    value: 'icons' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: '/products',
        imageSrc: '/nav/icons/picks.jpg'
      },
      {
        name: 'New Arrivals',
        href: '/products',
        imageSrc: '/nav/icons/new.jpg'
      },
      {
        name: 'BestSelling Icons',
        href: '/products',
        imageSrc: '/nav/icons/bestsellers.jpg'
      }
    ]
  }
];
