# Spark E-Commerce Backend — Phase 6

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas
- Stripe test account
- Resend account/API key

## Setup

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Never put Stripe Secret Key or Resend API Key in the React app.

## Seed

```bash
npm run seed
```

## Run

```bash
npm run dev
```

API: `http://localhost:5000`

## Stripe local webhook

Install the Stripe CLI and forward test events to:

```text
http://localhost:5000/api/payments/webhook
```

Then put the generated webhook signing secret in `STRIPE_WEBHOOK_SECRET`.

## Test payment

Use Stripe's documented test card numbers in Stripe Checkout test mode.

## Resend

Use a verified sender domain for production. For development, Resend documents `onboarding@resend.dev` as a test sender in its examples.

Demo accounts:
- admin@spark.test / Admin123!
- seller@spark.test / Seller123!
- customer@spark.test / Customer123!
