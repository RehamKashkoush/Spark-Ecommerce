# Spark E-Commerce Platform — Phase 7

This is the cumulative project through Phase 7.

## Included phases

- Phase 1: React/Vite setup, UI foundation, routing, Customer/Seller/Admin layouts
- Phase 2: DummyJSON catalog, 100+ products, search, filters, categories, product details
- Phase 3: Authentication, JWT-ready roles, protected Customer/Seller/Admin routes
- Phase 4: Cart, Wishlist, Checkout, Orders
- Phase 5: Express, MongoDB, Mongoose, JWT authentication, real API
- Phase 6: Stripe Checkout test mode and Resend email integration
- Phase 7: Seller Hub with product CRUD, inventory, seller order queue, order status updates, earnings and payout requests

## Demo accounts

- Admin: admin@spark.test / Admin123!
- Seller: seller@spark.test / Seller123!
- Customer: customer@spark.test / Customer123!

## Run frontend

```bash
npm install
npm run dev
```

## Run backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env`, configure MongoDB/JWT/Stripe/Resend, then:

```bash
npm run seed
npm run dev
```

## Phase 7 seller APIs

- GET `/api/seller/dashboard`
- GET `/api/seller/products`
- POST `/api/seller/products`
- PATCH `/api/seller/products/:id`
- DELETE `/api/seller/products/:id`
- GET `/api/seller/orders`
- PATCH `/api/seller/orders/:id/status`
- GET `/api/seller/payouts`
- POST `/api/seller/payouts`

All seller endpoints require a valid JWT and `seller` role.


## Phase 9 - Live Order Tracking
- Socket.io real-time order room updates
- Customer live tracking page
- Seller courier location simulation
- Real-time status and courier coordinate updates
- JWT-protected Socket.io connections
- Order ownership and seller authorization for tracking rooms

Start the server normally with `npm run dev`. The client uses `VITE_API_URL` and connects to the Socket.io server on the same backend origin.


## Phase 11 — Profile + Address + Payment Details
- Customer profile editing with name, email and phone.
- Saved addresses with add, edit, delete and default address support.
- Checkout can use a saved address while keeping guest/new-address checkout.
- Payment profile metadata supports card brand, last 4 digits, expiry and PayPal email.
- Full card numbers and CVV are never stored in the application database.
- Profile data is stored in MongoDB and returned through protected API endpoints.

## Phase 12 — Phone Authentication + Real Email Verification
- New accounts start unverified and receive a real 6-digit email verification code through Resend.
- Email verification codes are hashed in MongoDB and expire after 10 minutes.
- Resend verification endpoint is available for unverified accounts.
- Phone verification uses Twilio Verify SMS OTP when Twilio environment variables are configured.
- Customers can verify a phone number from Profile or the verification screen.
- Phone OTP login is available from the Login screen.
- Login blocks accounts whose email is not verified.
- Demo seeded accounts remain verified for testing.
- Required backend environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID.

## Phase 14 — Final Testing + Bug Fixing

- Audited Customer, Seller, and Admin core flows from Phases 1–13.
- Preserved the required `import React from "react";` first line across all JSX files and service JS files.
- Added optional authentication for order creation so guest checkout can place Cash on Delivery orders.
- Online payment methods (Stripe, PayPal, Wallet) require a signed-in customer.
- Added payment-method validation and checkout validation on the API.
- Kept Seller/Admin protected routes and existing JWT role checks.
- Verified server-side JavaScript syntax for the core backend files.
- Full dependency installation/build was attempted but did not complete within the execution environment timeout; no build success is claimed from this environment.


## Bonus 1 — Google Login
- Google OAuth sign-in using Google Identity Services.
- Server verifies the Google ID token against GOOGLE_CLIENT_ID.
- Existing users are linked by verified email.
- New Google users are created as verified customer accounts.
- Google credentials are never stored as passwords.
- Configure VITE_GOOGLE_CLIENT_ID on the client and GOOGLE_CLIENT_ID on the server.


## Bonus 3 — Push Notifications
- In-app notification center with unread count and mark-read actions.
- Web Push subscription using VAPID + service worker.
- Order placement and order-status notifications are persisted in MongoDB and sent to subscribed browsers.
- Configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` in `server/.env`.
- Browser permission is enabled from Customer Profile.

## Bonus 4 — Email Marketing / Newsletter
- Customer newsletter subscribe/unsubscribe flow
- Newsletter subscriber status stored in MongoDB
- Admin audience list and campaign history
- Admin campaign composer
- Campaign delivery through Resend only to active subscribers
- Campaign send count/history

## Bonus 6 — Social Sharing & Referral Program
- Customer referral codes and invite links
- Referral registration via `?ref=CODE`
- Share through native Share API, WhatsApp and email
- Successful referral completion on first Delivered order
- 500 loyalty points awarded to both referrer and referred customer
- Referral notifications
- Customer referral history
- Admin referral statistics and history
- Backend endpoints: `/api/referrals`, `/api/referrals/ensure-code`, `/api/admin/referrals`

## Bonus 7 — Multi-Language
- English and Arabic UI language switcher.
- Language preference persisted in localStorage.
- Automatic document `lang` and RTL/LTR direction.
- Reusable `LanguageContext` and `LanguageSwitcher` components.
- Customer header navigation is localized.
- RTL layout adjustments for header, hero/content alignment, notifications, and referral sharing controls.

## Bonus 8 — Final Integration & Production Polish
- Added a React Error Boundary with a safe reload state.
- Added `GET /api/health` for backend health checks.
- Kept all previous phases and bonuses cumulative.
- Verified React JSX files keep the required `import React from "react";` first-line convention.

## Bonus 9 — Security & Production API Hardening
- Added security response headers and disabled Express fingerprinting.
- Added lightweight in-memory rate limiting for authentication and public newsletter endpoints.
- Added API 404 and centralized error responses.
- Expanded `/api/health` with MongoDB connection state.
- Added graceful shutdown for MongoDB and the HTTP server.
- Kept all existing phases and bonuses cumulative.


## Final Local Setup

The project includes placeholder `.env` files in both the frontend root and `server/`. Replace their placeholder values with your own credentials before using external services. Never put Stripe secret keys, Resend API keys, Twilio auth tokens, PayPal secrets, or JWT secrets in the frontend `.env`.

### Product API
The frontend now consumes the MongoDB-backed `/api/products` endpoint. Product responses include a stable `id`, and category responses use `{ slug, name }`, matching the React catalog components.

### Theme
The storefront includes a Light/Dark mode toggle in the customer navbar. The choice is persisted in localStorage.
