import { User } from '../payload-types';
import { Access, CollectionConfig } from 'payload/types';

const yourOwn: Access = ({ req }) => {
  const user = req.user as User | null;

  if (!user) return false;

  if (user.role === 'admin') return true;

  return {
    user: {
      equals: user.id
    }
  };
};

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description: 'A summary of all your orders on DigitalArk'
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin'
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: () => false
      },
      admin: {
        hidden: true
      },
      required: true
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: false
      },
      required: true
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true
    }
  ]
};
