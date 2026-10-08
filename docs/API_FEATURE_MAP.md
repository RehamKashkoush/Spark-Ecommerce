# API Feature Map

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/google

## Products
- GET /api/products
- GET /api/products/categories
- GET /api/products/:id

## Orders
- POST /api/orders
- GET /api/orders/my
- GET /api/orders/:id

## Seller
- GET /api/seller/dashboard
- GET /api/seller/products
- POST /api/seller/products
- PATCH /api/seller/products/:id
- DELETE /api/seller/products/:id
- GET /api/seller/orders
- PATCH /api/seller/orders/:id/status
- PATCH /api/seller/orders/:id/tracking
- GET /api/seller/payouts
- POST /api/seller/payouts

## Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/sellers
- GET /api/admin/products
- GET /api/admin/categories
- GET /api/admin/orders
- GET /api/admin/coupons
- GET /api/admin/banners

## Payments
- Stripe checkout/session verification/webhook routes
- PayPal create/capture routes
- Wallet balance and transaction routes
- Saved-card SetupIntent and PaymentMethod routes

## Notifications
- GET /api/notifications
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all
- POST /api/notifications/push/subscribe

## Marketing
- POST /api/newsletter/subscribe
- POST /api/newsletter/unsubscribe
- GET /api/admin/newsletter/subscribers
- POST /api/admin/newsletter/send

## Loyalty & Referrals
- GET /api/loyalty
- GET /api/loyalty/history
- GET /api/referrals
- POST /api/referrals/ensure-code
