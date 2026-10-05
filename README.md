# Oviya's Crochet — E-commerce App

A modern, mobile-first e-commerce website for **Oviya's Crochet**, a handmade crochet business based in Tamil Nadu, India.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd app
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in all values in `.env.local` (see [Environment Variables](#environment-variables) below).

### 3. Set up the database
```bash
# Push schema to your PostgreSQL database
npm run db:push

# Seed with sample products, discounts, and admin user
npm run db:seed
```

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — **the app is in `E:\Oviya\codebase\app`**, not the parent folder.

---

## 📂 Project Structure

```
app/
├── app/
│   ├── (store)/          # Public storefront routes
│   │   ├── page.tsx      # Home page
│   │   ├── shop/         # Shop listing + [category]
│   │   ├── product/[slug]/  # Product detail
│   │   ├── checkout/     # Checkout flow
│   │   ├── order/[orderNumber]/success/
│   │   ├── track/        # Order tracking
│   │   └── about/
│   ├── admin/            # Admin dashboard (protected)
│   │   └── orders/       # Orders with NEW badge
│   └── api/              # API routes
│       ├── checkout/     # Create order + Razorpay
│       ├── payments/razorpay/verify/
│       ├── coupon/validate/
│       ├── orders/track/
│       ├── email/send/
│       └── admin/orders/ # Mark seen, update status
├── components/
│   ├── ui/               # Header, YarnMascot, Toast
│   └── store/            # ProductCard, CartDrawer
├── lib/
│   ├── db.ts             # Prisma singleton
│   ├── pricing.ts        # getEffectivePrice (pure, testable)
│   ├── email.ts          # Resend email system
│   ├── cart-store.ts     # Zustand cart (persisted)
│   ├── discount-mapper.ts # Prisma → DiscountInput mapper
│   └── utils.ts          # formatINR, slugify, etc.
└── prisma/
    ├── schema.prisma     # Full DB schema
    └── seed.ts           # 18 products, 3 discounts, admin user
```

---

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon/Supabase recommended) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email (used in seed) |
| `ADMIN_PASSWORD` | Admin login password (used in seed, change after first login!) |
| `RAZORPAY_KEY_ID` | Razorpay key ID (use test keys in dev) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as RAZORPAY_KEY_ID (exposed to client) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `EMAIL_FROM` | Sender email, e.g. `Oviya's Crochet <orders@yourdomain.com>` |
| `ADMIN_NOTIFY_EMAIL` | Email that receives new order alerts |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_SITE_URL` | Full app URL (used in emails) |

### Razorpay Test Mode
Use these test credentials during development:
- Test cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/
- UPI ID: `success@razorpay`
- Card: `4111 1111 1111 1111` | CVV: any 3 digits | Expiry: any future date

---

## 🗄️ Database

This app uses **PostgreSQL** via **Prisma ORM**. Recommended providers:
- [Neon](https://neon.tech) — free serverless Postgres
- [Supabase](https://supabase.com) — free Postgres with extras

### Seed data
The seed creates:
- **18 products** across 6 categories (Amigurumi, Bags, Home Decor, Baby, Accessories, Gift Hampers)
- **3 discounts**: Storewide 10%, Amigurumi 15%, and coupon `WELCOME10`
- **1 admin user** using `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars
- **Default settings**: ₹60 shipping, free shipping above ₹1,000, COD disabled

> ⚠️ **Replace placeholder images** with real product photos from the Instagram page `@oviyas_crochet`.
> Update image URLs in `prisma/seed.ts` or upload via the Admin → Products panel.

---

## 💳 Payment Flow

1. Customer fills checkout form → `POST /api/checkout` validates & creates order
2. Razorpay modal opens in browser
3. On success → `POST /api/payments/razorpay/verify` verifies HMAC signature
4. Order status → `PLACED`, customer gets confirmation email
5. Razorpay webhook at `/api/webhooks/razorpay` handles async events idempotently

---

## 📧 Email Templates

Emails are sent via **Resend** with branded HTML templates for:
- Order confirmation (customer + admin alert)
- Status changes: Confirmed → In Production → Ready → Shipped → Delivered
- Cancellation / Refund

---

## 🛡️ Admin Panel

Visit `/admin/orders` to:
- See new orders pinned at top with **NEW** badge
- Click an order to see items, customer details, address
- Change order status → automatically emails the customer
- Add tracking number when marking as Shipped

Default admin login: use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`.

---

## 🎨 Design System

Defined in `app/globals.css` as CSS custom properties:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F1FD` | Page background |
| `--surface` | `#FFF9F5` | Cards, header |
| `--pri` | `#6F4FB0` | Primary buttons, links |
| `--pink` | `#F58FB5` | Discount badges, NEW badge |
| `--mint` | `#CFEBDD` | Made-to-order note |
| `--ink` | `#2E2442` | Body text |

Fonts: **Baloo 2** (headings) + **DM Sans** (body) via `next/font/google`.

Dark mode is supported via `prefers-color-scheme` and `data-theme="dark"` attribute.

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Set `NEXTAUTH_URL` to your production URL
5. Run `npm run db:push` against production DB once
6. Run `npm run db:seed` to seed initial data

---

## 🧶 Photo Credits

Placeholder images use Unsplash/Pexels free-to-use photos.
**Replace with Oviya's actual product photos from Instagram `@oviyas_crochet` before launch.**
