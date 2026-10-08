# Production Deployment Guide

## Frontend

Recommended Vercel deployment:

1. Import the repository into Vercel.
2. Keep the project root at the React/Vite application root.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add:
   - `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`
   - `VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID`
   - `VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY`
6. `vercel.json` keeps React Router routes working after refresh.

## Backend

Recommended Render deployment using `render.yaml`:

1. Create the web service from the repository.
2. The service root is `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set every `sync: false` variable in the Render dashboard.
6. Set `CLIENT_URL` to the deployed frontend origin.
7. Set `MONGODB_URI` to the production MongoDB connection string.
8. Keep all secret values in the hosting provider's environment settings. Never commit `.env` files.

## Stripe

Use the production Stripe secret and webhook secret only in backend environment variables. Register the webhook endpoint as:

`https://YOUR-BACKEND-DOMAIN/api/payments/webhook`

## Resend

Configure the production sender identity/domain in Resend and set `RESEND_API_KEY` only on the backend.

## Socket.io

The frontend derives the Socket.io origin from `VITE_API_URL`. For example:

`VITE_API_URL=https://api.example.com/api`

## Final smoke test

- Register and verify a customer.
- Login and refresh the page.
- Add a product to cart.
- Complete a COD test order.
- Check order history.
- Move an order through seller statuses.
- Confirm tracking updates.
- Test one Stripe sandbox payment.
- Test PayPal sandbox and Wallet if configured.
- Test push notification permission.
- Test newsletter subscribe/unsubscribe.
- Test referral reward after a delivered order.
- Test Arabic/English switching.
- Open a deep React route directly in a new browser tab.
