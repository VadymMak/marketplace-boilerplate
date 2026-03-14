# Marketplace Boilerplate

Production-ready Next.js 15 marketplace template with multi-role auth, Stripe payments, vendor dashboard, and admin panel.

> Built by [VadymMak](https://smartctx.dev) · March 2026

---

## Stack

| Tool        | Version | Purpose                       |
| ----------- | ------- | ----------------------------- |
| Next.js     | 15.x    | Framework (App Router)        |
| TypeScript  | 5+      | Type safety                   |
| CSS Modules | —       | Styling (no Tailwind)         |
| Prisma      | 5+      | ORM                           |
| PostgreSQL  | —       | Database (Neon)               |
| NextAuth.js | v5      | Auth — buyer / vendor / admin |
| Stripe      | latest  | Payments (test mode)          |
| Vercel Blob | latest  | Image uploads                 |
| Resend      | 4+      | Email delivery                |
| Zustand     | latest  | Cart state                    |
| bcryptjs    | —       | Password hashing              |
| pnpm        | 9+      | Package manager               |

---

## Features

- ✅ Multi-role auth — buyer / vendor / admin
- ✅ Product catalog with search, filters, pagination
- ✅ Shopping cart (Zustand + localStorage)
- ✅ Stripe checkout (test mode)
- ✅ Vendor dashboard — CRUD products, order stats
- ✅ Admin panel — manage users, moderate listings
- ✅ Email notifications via Resend
- ✅ SEO — sitemap, robots, JSON-LD Product schema
- ✅ Dark/light theme (CSS variables, next-themes)
- ✅ Pure CSS animations — no Framer Motion
- ✅ Lighthouse 90+ Performance, 100 SEO

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/VadymMak/marketplace-boilerplate.git
cd marketplace-boilerplate

# 2. Install
pnpm install
pnpm approve-builds

# 3. Environment
cp .env.example .env.local
# Fill in your values (see below)

# 4. Database
npx prisma db push
npx tsx prisma/seed.ts

# 5. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```bash
# Site
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Marketplace

# Database (Neon — neon.tech)
DATABASE_URL=postgresql://...

# Auth (NextAuth v5)
NEXTAUTH_SECRET=     # openssl rand -base64 32
NEXTAUTH_URL=https://yourdomain.com

# Stripe (stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# File uploads (Vercel Blob)
BLOB_READ_WRITE_TOKEN=

# Email (Resend — resend.com)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
OWNER_EMAIL=you@yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Test Accounts

After running seed:

| Email           | Password    | Role   |
| --------------- | ----------- | ------ |
| buyer@test.com  | password123 | BUYER  |
| vendor@test.com | password123 | VENDOR |
| admin@test.com  | password123 | ADMIN  |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          ← homepage, products, cart
│   ├── (auth)/            ← login, register
│   ├── (protected)/       ← account, checkout, orders
│   ├── dashboard/         ← vendor dashboard
│   ├── admin/             ← admin panel
│   └── api/               ← API routes
├── components/
│   ├── ui/                ← Button, Card, Badge, Modal...
│   ├── layout/            ← Header, Footer, Sidebar
│   ├── catalog/           ← ProductCard, FilterPanel, SearchBar
│   ├── cart/              ← CartItem, CartSummary
│   └── dashboard/         ← ProductForm
├── lib/
│   ├── auth.ts            ← NextAuth v5 config
│   ├── db.ts              ← Prisma singleton
│   ├── stripe.ts          ← Stripe client
│   ├── email.ts           ← Resend helpers
│   └── utils.ts           ← slugify, formatPrice
├── hooks/
│   └── useCart.ts         ← Zustand cart store
└── styles/
    ├── globals.css
    ├── variables.css      ← design tokens
    ├── themes.css         ← dark/light
    ├── typography.css
    └── animations.css
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy

For Stripe webhook — add endpoint in Stripe Dashboard:

```
https://yourdomain.com/api/webhooks/stripe
```

---

## License

MIT — free to use for client projects.
