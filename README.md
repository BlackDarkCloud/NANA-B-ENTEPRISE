# Nana B Enterprise — E-commerce Platform

A full-stack e-commerce site built with Next.js 14, Prisma, Neon Postgres, Auth.js and Paystack.
Storefront + customer accounts + a full admin panel (products, orders, delivery zones, coupons).

---

## 1. Tech stack (and why)

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Deploys natively on Vercel, server + API routes in one codebase |
| Database | **Neon** (serverless Postgres) | Since you wanted off Supabase — Neon is *plain Postgres*, has a generous free tier, scales to zero, and has a **native one-click Vercel integration** (auto-fills your env vars on deploy) |
| ORM | Prisma | Type-safe queries, easy migrations, great DX for learning SQL-adjacent concepts without writing raw SQL |
| Auth | Auth.js (NextAuth v5) | Email/password accounts, JWT sessions, role field (`USER`/`ADMIN`) used to protect `/admin` |
| Payments | Paystack | Initialize transaction → redirect → **webhook verifies and confirms** (never trust the client redirect alone) |
| Styling | Tailwind CSS | Fast, matches the mobile-first look you shared |

All money is stored as **integers in pesewas** (GHS minor unit) in the database — this avoids floating-point rounding bugs that are common in e-commerce. `lib/money.ts` converts for display.

---

## 2. Prerequisites

- Node.js 18+ and npm
- A free [Neon](https://neon.tech) account
- A free [Paystack](https://paystack.com) account (use **test mode** keys first)
- A [Vercel](https://vercel.com) account
- Git

---

## 3. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in real values (see section 4 & 5 below)
cp .env.example .env

# 3. Push the Prisma schema to your database (creates all tables)
npm run db:push

# 4. Seed an admin account + starter categories/delivery zones
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit `http://localhost:3000`. Log in to `/admin` with the email/password printed by the seed script
(defaults to `admin@nanab.com` / `ChangeMe123!` unless you set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` — **change this password immediately** after first login by creating a new admin manually in the DB, since there's no "change password" UI yet, or re-run the seed with new env values).

---

## 4. Setting up Neon (database)

1. Go to [neon.tech](https://neon.tech) → create a free account → **New Project**.
2. Name it `nanab-enterprise`, pick a region close to Ghana (e.g. Europe).
3. Once created, go to **Connection Details**. Neon gives you two URLs:
   - **Pooled connection** (has `-pooler` in the hostname) → use for `DATABASE_URL`
   - **Direct connection** → use for `DIRECT_URL` (Prisma needs this for migrations)
4. Paste both into your `.env` file.

That's it — no manual table creation needed. `npm run db:push` reads `prisma/schema.prisma` and creates every table for you (Users, Products, Categories, Orders, OrderItems, DeliveryZones, Coupons).

To browse/edit your data visually any time: `npm run db:studio`.

---

## 5. Setting up Paystack

1. Sign up at [dashboard.paystack.com](https://dashboard.paystack.com).
2. Go to **Settings → API Keys & Webhooks**. Copy your **Test Secret Key** and **Test Public Key** into `.env`.
3. Under the same page, set your **Webhook URL** to:
   ```
   https://YOUR-DOMAIN.vercel.app/api/paystack/webhook
   ```
   (Paystack webhooks require a public HTTPS URL — you can't test them on `localhost` directly. Use the [Paystack CLI](https://paystack.com/docs/developer-tools/cli/) or a tunnel like `ngrok` if you need to test webhooks locally, or just test end-to-end after your first Vercel deploy.)
4. When you're ready to accept real payments, switch to your **Live** keys in Vercel's environment variables and update the webhook URL there too.

**Why the webhook matters:** the checkout API creates a `PENDING` order and redirects the customer to Paystack. The order is only marked `PAID` when Paystack's webhook fires and the server re-verifies the transaction directly with Paystack's API (`lib/paystack.ts`). This means stock is only decremented and coupons only consumed on **confirmed, verified** payment — a customer closing the tab after paying won't leave your order stuck as unpaid, and a customer faking a redirect can't trick the system into marking an order paid.

---

## 6. Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **Add New Project** → import the repo.
3. **Recommended:** In the Vercel dashboard, go to **Storage → Connect Database → Neon** — this auto-provisions the integration and injects `DATABASE_URL`/`DIRECT_URL` for you. Otherwise, add them manually.
4. Add the rest of your env vars in **Project Settings → Environment Variables** (copy everything from `.env`):
   - `AUTH_SECRET`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `NEXT_PUBLIC_APP_URL` → set to your real Vercel URL, e.g. `https://nanab-enterprise.vercel.app`
5. Deploy. Vercel runs `prisma generate && next build` automatically (see `package.json`'s `build` script).
6. After the first deploy, run the schema push + seed **once** against your production database:
   ```bash
   # Point your local .env at the production DATABASE_URL/DIRECT_URL temporarily, then:
   npm run db:push
   npm run db:seed
   ```
7. Update your Paystack webhook URL to point at the live domain (step 5.3 above).

---

## 7. Project structure

```
app/
  page.tsx                  Storefront home
  products/[slug]/          Product detail
  category/[slug]/          Category listing
  search/                   Search
  cart/                     Cart (client-side, localStorage)
  checkout/                 Checkout form → creates order → redirects to Paystack
  order/confirm/            Post-payment confirmation page
  login/, register/         Customer auth
  account/orders/           Customer order history
  admin/                    Admin panel (protected by middleware.ts)
    products/, orders/, delivery-zones/, coupons/
  api/
    checkout/                POST → creates order, initializes Paystack transaction
    paystack/webhook/        POST → verifies payment, marks order paid, decrements stock
    delivery-zones/          GET  → public list for checkout
    coupons/validate/        POST → validates a coupon code at checkout
    auth/[...nextauth]/      Auth.js handler
    auth/register/           Customer registration
    admin/*                  Admin-only CRUD for products, orders, zones, coupons
lib/
  prisma.ts, auth.ts, paystack.ts, money.ts
prisma/
  schema.prisma, seed.ts
middleware.ts                Blocks non-admins from /admin/*
```

---

## 8. What's already handled

- ✅ Server-side price/stock verification at checkout (never trusts client-submitted prices)
- ✅ Paystack signature verification + independent transaction re-verification on webhook
- ✅ Stock decrements and coupon usage only happen on confirmed payment
- ✅ Guest checkout (order tied to an email) that can later be upgraded into a real account via registration
- ✅ Role-based admin access via middleware
- ✅ All prices in integer minor units (no float rounding bugs)

## 9. What you'll likely want to add next

- Product image uploads (currently takes image URLs — wire up [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or Cloudinary for direct uploads)
- Email notifications (order confirmation, shipping updates) — [Resend](https://resend.com) integrates cleanly with Vercel
- Wishlist / reviews (schema has room to extend)
- A "forgot password" flow for customer accounts
- Pagination on the admin product/order lists once your catalog grows
- Discount display copy — the schema supports it, but you may want scheduled (start-date) discounts, not just coupons

---

## 10. Useful commands

```bash
npm run dev          # local dev server
npm run build         # production build (also runs prisma generate)
npm run db:push       # sync Prisma schema to the database (no migration history)
npm run db:migrate    # create a tracked migration (use once you're past the prototyping stage)
npm run db:studio     # visual database browser
npm run db:seed       # seed admin user + starter categories/delivery zones
```
