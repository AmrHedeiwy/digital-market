"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
var adminAndUser = function (_a) {
    var req = _a.req, data = _a.data;
    var user = req.user;
    if (!user)
        return false;
    if (user.role === 'admin')
        return true;
    return {
        id: { equals: user.id }
    };
};
var Users = {
    slug: 'users',
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: 'verify your account',
                    buttonText: 'Verify Account',
                    href: "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token)
                });
            }
        }
    },
    access: {
        read: adminAndUser,
        create: function () { return true; },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === 'admin';
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === 'admin';
        }
    },
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== 'admin';
        },
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
                condition: function () { return false; }
            }
        },
        {
            name: 'product_files',
            type: 'relationship',
            relationTo: 'product_files',
            hasMany: true,
            admin: {
                condition: function () { return false; }
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
exports.default = Users;
