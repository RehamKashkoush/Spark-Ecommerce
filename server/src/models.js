import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  googleId: { type: String, default: null, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  verified: { type: Boolean, default: false },
  phone: { type: String, default: '', trim: true },
  phoneVerified: { type: Boolean, default: false },
  emailVerificationCodeHash: { type: String, default: null },
  emailVerificationExpiresAt: { type: Date, default: null },
  phoneVerificationCodeHash: { type: String, default: null },
  phoneVerificationExpiresAt: { type: Date, default: null },
  phoneVerificationAttempts: { type: Number, default: 0 },
  address: { type: Object, default: {} },
  addresses: { type: [Object], default: [] },
  paymentDetails: { type: Object, default: {} },
  stripeCustomerId: { type: String, default: null },
  defaultStripePaymentMethodId: { type: String, default: null },
  walletBalance: { type: Number, default: 0, min: 0 },
  walletTransactions: { type: [Object], default: [] },
  loyaltyPoints: { type: Number, default: 0, min: 0 },
  lifetimeLoyaltyPoints: { type: Number, default: 0, min: 0 },
  isDeleted: { type: Boolean, default: false },
  accountStatus: { type: String, enum: ['active', 'restricted'], default: 'active' },
  sellerStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  pushSubscriptions: { type: [Object], default: [] },
  referralCode: { type: String, unique: true, sparse: true, uppercase: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  externalId: { type: Number, unique: true, sparse: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  thumbnail: String,
  images: [String],
  reviews: { type: Array, default: [] },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer: { type: Object, required: true },
  address: { type: Object, required: true },
  items: { type: Array, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  paymentProvider: { type: String, default: null },
  stripeSessionId: { type: String, default: null },
  paypalOrderId: { type: String, default: null },
  paymentEmailSent: { type: Boolean, default: false },
  status: { type: String, default: 'Confirmed' },
  promoCode: String,
  subtotal: Number,
  shipping: Number,
  discount: Number,
  loyaltyPointsRedeemed: { type: Number, default: 0 },
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsRefunded: { type: Boolean, default: false },
  total: Number,
  tracking: { type: Object, default: {} }
}, { timestamps: true })

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true, min: 0 },
  minOrder: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: String,
  link: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
  reviewerName: { type: String, required: true }
}, { timestamps: true })

reviewSchema.index({ product: 1, user: 1 }, { unique: true })


const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'general' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '/' },
  data: { type: Object, default: {} },
  read: { type: Boolean, default: false }
}, { timestamps: true })


const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, default: '' },
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date, default: null }
}, { timestamps: true })

const newsletterCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  sentCount: { type: Number, default: 0 },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true })


const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  code: { type: String, required: true, uppercase: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  bonusPoints: { type: Number, default: 500 },
  completedAt: { type: Date, default: null }
}, { timestamps: true })

const payoutSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { type: String, unique: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Pending', 'Processing', 'Paid', 'Rejected'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
export const Product = mongoose.model('Product', productSchema)
export const Order = mongoose.model('Order', orderSchema)
export const Review = mongoose.model('Review', reviewSchema)
export const Payout = mongoose.model('Payout', payoutSchema)
export const Coupon = mongoose.model('Coupon', couponSchema)
export const Banner = mongoose.model('Banner', bannerSchema)
export const Notification = mongoose.model('Notification', notificationSchema)
export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema)
export const NewsletterCampaign = mongoose.model('NewsletterCampaign', newsletterCampaignSchema)
export const Referral = mongoose.model('Referral', referralSchema)
