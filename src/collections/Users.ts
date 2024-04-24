import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail';
import { User } from '../payload-types';
import { Access, CollectionConfig } from 'payload/types';

const adminAndUser: Access = ({ req, data }) => {
  const user = req.user as User | null;

  if (!user) return false;

  if (user.role === 'admin') return true;

  return {
    id: { equals: user.id }
  };
};

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: 'verify your account',
          buttonText: 'Verify Account',
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        });
      }
    }
  },
  access: {
    read: adminAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin'
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
    defaultColumns: ['id']
  },

  fields: [
    {
      name: 'products',
      label: 'Products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
      admin: {
        condition: () => false
      }
    },
    {
      name: 'product_files',
      type: 'relationship',
      relationTo: 'product_files',
      hasMany: true,
      admin: {
        condition: () => false
      }
    },
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    }
  ]
};

export default Users;
