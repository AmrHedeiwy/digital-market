## Getting Started

This is a repository for Digital-Market App: Next.js 14, React, Payload, tRPC, Tailwind

## Features:

- 🛠️ Complete marketplace built from scratch in Next.js 14
- 💻 Beautiful landing page & product pages included
- 🎨 Custom artwork included
- 💳 Full admin dashboard
- 🛍️ Users can purchase and sell their own products
- 🛒 Locally persisted shopping cart
- 🔑 Authentication using Payload
- 🌟 Clean, modern UI using shadcn-ui
- ✉️ Beautiful emails for signing up and after purchase
- ✅ Admins can verify products to ensure high quality
- 🎁 ...much more

---

### Prerequisites

##### Node version 18.x.x

### Cloning the repository

```
git clone https://github.com/AmrHedeiwy/digital-market
```

### Install packages

```
npm i
```

### Setup .env file

```
PAYLOAD_SECRET
MONGODB_URL
NEXT_PUBLIC_SERVER_URL

RESEND_API_KEY

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_KEY
```

### Start the app

```
npm run dev
```

### Available commands

Running commands with npm `npm run [command]`

| command        | description                              |
| :------------- | :--------------------------------------- |
| dev            | Starts a development instance of the app |
| generate:types | Generates paylaod-types for Typescript   |
