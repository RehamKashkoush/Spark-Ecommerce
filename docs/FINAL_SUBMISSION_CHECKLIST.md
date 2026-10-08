# Final Submission Checklist

## Frontend
- React + Vite
- React Router
- Customer storefront
- Seller hub
- Admin panel
- Arabic/English language switch
- Responsive layouts
- Error boundary

## Authentication
- Email registration/login
- Email verification
- Password reset flow
- Phone OTP flow
- Google Login
- JWT sessions
- Role protection

## Commerce
- Product catalog
- Search/filter/sort/pagination
- Product details and reviews
- Cart and wishlist
- Guest checkout
- Stripe
- PayPal Sandbox
- Cash on Delivery
- Wallet
- Saved cards through Stripe Payment Methods
- Promo codes

## Orders
- Order history/details
- Seller order processing
- Admin order management
- Status tracking
- Real-time Socket.io tracking
- Email notifications
- Push notifications

## Seller/Admin
- Seller products and inventory
- Earnings/payouts
- Seller verification
- User restriction/soft delete
- Product/category management
- Coupons
- Homepage banners/content

## Bonuses
- Google Login
- Saved Cards
- Push Notifications
- Email Marketing
- Loyalty / Rewards
- Social Sharing / Referrals
- Multi-Language

## Before Deployment
- Create production environment variables.
- Never commit `.env` files or API secrets.
- Use HTTPS for production.
- Configure MongoDB production connection.
- Configure Stripe live/test mode as required.
- Configure PayPal production credentials if moving beyond Sandbox.
- Configure Resend domain and sender.
- Configure Twilio Verify service.
- Generate production VAPID keys for Web Push.
- Set the production frontend URL and backend URL.
- Run `npm install` in both root and `server`.
- Run `npm run build` in the root.
- Run `npm start` in `server`.
- Run `node scripts/verify-project.mjs` from the project root.
