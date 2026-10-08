import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import Stripe from 'stripe'
import webpush from 'web-push'
import { Product, User, Order, Review, Payout, Coupon, Banner, Notification, NewsletterSubscriber, NewsletterCampaign, Referral } from './models.js'
import { auth, optionalAuth, roles, securityHeaders, createRateLimiter } from './middleware.js'
import { sendEmailVerification, sendOrderConfirmation, sendPaymentConfirmation, sendOrderStatusEmail, sendNewsletterEmail } from './email.js'

const app = express()
const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' } })
const PORT = process.env.PORT || 5000
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null
const pushConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT)
if (pushConfigured) webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.disable('x-powered-by')
app.use(securityHeaders)

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send('Stripe webhook is not configured.')
  const signature = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (orderId) {
        const order = await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          paymentProvider: 'stripe',
          stripeSessionId: session.id,
          status: 'Confirmed'
        }, { new: true })
        if (order && !order.paymentEmailSent) { await sendPaymentConfirmation(order); await Order.findByIdAndUpdate(order._id, { paymentEmailSent: true }) }
      }
    }

    if (event.type === 'checkout.session.async_payment_failed' || event.type === 'payment_intent.payment_failed') {
      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (orderId) await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' })
    }

    return res.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook processing failed:', error.message)
    return res.status(500).json({ message: 'Webhook processing failed.' })
  }
})

app.use(express.json({ limit: '2mb' }))
app.post('/api/ai/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(503).json({ message: 'AI service is not configured. Add OPENROUTER_API_KEY to server/.env.' })
  const baseUrl = process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions'
  const model = process.env.OPENROUTER_MODEL || (process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'openrouter/free')
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(baseUrl.includes('openrouter.ai') ? { 'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173', 'X-Title': 'Spark AI Concierge' } : {}),
      },
      body: JSON.stringify({ model, messages: req.body?.messages || [], temperature: 0.7, max_tokens: 500 }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ message: data?.error?.message || 'AI request failed.' })
    return res.json({ text: data?.choices?.[0]?.message?.content || '' })
  } catch (error) {
    return res.status(502).json({ message: error.message || 'AI service is unavailable.' })
  }
})
const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 })
const publicRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 120 })
app.use('/api/auth', authRateLimiter)
app.use('/api/newsletter/subscribe', publicRateLimiter)
app.use('/api/newsletter/unsubscribe', publicRateLimiter)

const signToken = (user) => jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, verified: user.verified, phone: user.phone || user.address?.phone || '', phoneVerified: Boolean(user.phoneVerified), address: user.address, addresses: user.addresses || [], paymentDetails: user.paymentDetails || {}, loyaltyPoints: Number(user.loyaltyPoints || 0), lifetimeLoyaltyPoints: Number(user.lifetimeLoyaltyPoints || 0), referralCode: user.referralCode || null })
const generateCode = () => String(crypto.randomInt(100000, 1000000))
const hashCode = (code) => crypto.createHash('sha256').update(String(code)).digest('hex')
const normalizePhone = (phone) => String(phone || '').replace(/[^0-9+]/g, '').replace(/^00/, '+')
const codeIsValid = (user, hashField, expiryField, code) => Boolean(code && user[hashField] && user[expiryField] && user[expiryField].getTime() > Date.now() && user[hashField] === hashCode(code))

async function sendSmsOtp(phone, code) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) throw new Error('Twilio Verify is not configured.')
  const body = new URLSearchParams({ To: phone, Channel: 'sms' })
  const response = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  if (!response.ok) { const detail = await response.text(); throw new Error(`Twilio verification request failed: ${detail}`) }
  return response.json()
}

async function checkSmsOtp(phone, code) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) throw new Error('Twilio Verify is not configured.')
  const body = new URLSearchParams({ To: phone, Code: String(code) })
  const response = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  if (!response.ok) { const detail = await response.text(); throw new Error(`Twilio verification check failed: ${detail}`) }
  return response.json()
}
const discountedPrice = (product) => Number((product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2))

const trackingProgress = { Confirmed: 1, Processing: 2, Shipped: 3, 'Out for Delivery': 4, Delivered: 5, Cancelled: 0 }
const loyaltyValuePerPoint = 0.01
const loyaltyMaxPercent = 50
const referralBonusPoints = 500
const makeReferralCode = (name = '') => `${String(name).replace(/[^a-z0-9]/gi, '').slice(0, 5).toUpperCase() || 'SPARK'}${crypto.randomInt(10000, 100000)}`

async function ensureReferralCode(user) {
  if (user.referralCode) return user.referralCode
  for (let i = 0; i < 5; i += 1) {
    const code = makeReferralCode(user.name)
    const exists = await User.exists({ referralCode: code })
    if (!exists) { user.referralCode = code; await user.save(); return code }
  }
  throw new Error('Unable to generate referral code.')
}

async function completeReferralForOrder(order) {
  if (!order?.user || order.status !== 'Delivered') return false
  const referral = await Referral.findOne({ referredUser: order.user, status: 'pending' })
  if (!referral) return false
  const [referrer, referee] = await Promise.all([User.findById(referral.referrer), User.findById(referral.referredUser)])
  if (!referrer || !referee) return false
  referrer.loyaltyPoints = Number(referrer.loyaltyPoints || 0) + referralBonusPoints
  referrer.lifetimeLoyaltyPoints = Number(referrer.lifetimeLoyaltyPoints || 0) + referralBonusPoints
  referee.loyaltyPoints = Number(referee.loyaltyPoints || 0) + referralBonusPoints
  referee.lifetimeLoyaltyPoints = Number(referee.lifetimeLoyaltyPoints || 0) + referralBonusPoints
  await Promise.all([referrer.save(), referee.save()])
  referral.status = 'completed'
  referral.bonusPoints = referralBonusPoints
  referral.completedAt = new Date()
  await referral.save()
  await Promise.all([
    createNotification(referrer._id, { type: 'referral', title: 'Referral reward earned', message: `You earned ${referralBonusPoints} loyalty points from a successful referral.`, link: '/referrals' }),
    createNotification(referee._id, { type: 'referral', title: 'Welcome reward unlocked', message: `You earned ${referralBonusPoints} loyalty points from your referral reward.`, link: '/referrals' })
  ])
  return true
}

async function awardLoyaltyForOrder(order) {
  if (!order?.user || order.status !== 'Delivered' || Number(order.loyaltyPointsEarned || 0) > 0) return 0
  const points = Math.max(0, Math.floor(Number(order.total || 0)))
  if (!points) return 0
  const user = await User.findById(order.user)
  if (!user) return 0
  user.loyaltyPoints = Number(user.loyaltyPoints || 0) + points
  user.lifetimeLoyaltyPoints = Number(user.lifetimeLoyaltyPoints || 0) + points
  await user.save()
  order.loyaltyPointsEarned = points
  await order.save()
  return points
}

async function refundReservedLoyalty(order) {
  const points = Number(order?.loyaltyPointsRedeemed || 0)
  if (!order?.user || !points || order.loyaltyPointsRefunded) return
  const user = await User.findById(order.user)
  if (user) { user.loyaltyPoints = Number(user.loyaltyPoints || 0) + points; await user.save() }
  order.loyaltyPointsRefunded = true
  await order.save()
}

const defaultCoordinates = { latitude: 30.0444, longitude: 31.2357 }
const signSocketToken = (token) => { try { return jwt.verify(token, process.env.JWT_SECRET) } catch { return null } }

io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  const payload = signSocketToken(token)
  if (!payload) return next(new Error('Unauthorized socket connection.'))
  socket.user = payload
  next()
})

io.on('connection', (socket) => {
  socket.on('tracking:join', async ({ orderId }) => {
    if (!orderId) return
    try {
      const order = await Order.findById(orderId).select('user items')
      if (!order) return socket.emit('tracking:error', { message: 'Order not found.' })
      const allowed = socket.user.role === 'admin' || String(order.user) === String(socket.user.id) || (socket.user.role === 'seller' && order.items.some((item) => String(item.seller) === String(socket.user.id)))
      if (!allowed) return socket.emit('tracking:error', { message: 'You are not allowed to track this order.' })
      socket.join(`order:${orderId}`)
      const fullOrder = await Order.findById(orderId)
      socket.emit('tracking:state', { order: fullOrder })
    } catch (error) { socket.emit('tracking:error', { message: 'Unable to join order tracking.' }) }
  })
})

const emitOrderUpdate = (order) => io.to(`order:${order._id}`).emit('tracking:update', { order })

async function createNotification(userId, { type = 'general', title, message, link = '/', data = {} }) {
  if (!userId) return null
  const notification = await Notification.create({ user: userId, type, title, message, link, data })
  const user = await User.findById(userId).select('pushSubscriptions')
  if (pushConfigured && user?.pushSubscriptions?.length) {
    const expired = []
    await Promise.all(user.pushSubscriptions.map(async (subscription) => {
      try { await webpush.sendNotification(subscription, JSON.stringify({ title, body: message, link, data })) }
      catch (error) { if ([404, 410].includes(error.statusCode)) expired.push(subscription.endpoint) }
    }))
    if (expired.length) await User.findByIdAndUpdate(userId, { $pull: { pushSubscriptions: { endpoint: { $in: expired } } } })
  }
  return notification
}

async function notifyOrderParties(order, { title, message, type = 'order', link = `/orders/${order._id}` } = {}) {
  const userIds = new Set()
  if (order.user) userIds.add(String(order.user))
  order.items?.forEach((item) => { if (item.seller) userIds.add(String(item.seller)) })
  await Promise.all([...userIds].map((userId) => createNotification(userId, { type, title: title || 'Order update', message: message || `Order ${order.orderNumber} has been updated.`, link, data: { orderId: String(order._id), status: order.status } })))
}


app.get('/api/notifications', auth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50)
  res.json({ notifications, unreadCount: notifications.filter((item) => !item.read).length })
})

app.patch('/api/notifications/:id/read', auth, async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true })
  if (!notification) return res.status(404).json({ message: 'Notification not found.' })
  res.json(notification)
})

app.patch('/api/notifications/read-all', auth, async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
  res.json({ message: 'Notifications marked as read.' })
})

app.get('/api/notifications/push/public-key', auth, async (req, res) => {
  if (!pushConfigured) return res.status(503).json({ message: 'Push notifications are not configured on the server.' })
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
})

app.post('/api/notifications/push/subscribe', auth, async (req, res) => {
  if (!pushConfigured) return res.status(503).json({ message: 'Push notifications are not configured on the server.' })
  const subscription = req.body
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) return res.status(400).json({ message: 'A valid push subscription is required.' })
  const subscriptions = req.user.pushSubscriptions || []
  const exists = subscriptions.some((item) => item.endpoint === subscription.endpoint)
  if (!exists) req.user.pushSubscriptions = [...subscriptions, subscription].slice(-5)
  await req.user.save()
  res.json({ message: 'Push notifications enabled.' })
})

app.delete('/api/notifications/push/subscribe', auth, async (req, res) => {
  const endpoint = String(req.body.endpoint || '')
  if (endpoint) { req.user.pushSubscriptions = (req.user.pushSubscriptions || []).filter((item) => item.endpoint !== endpoint); await req.user.save() }
  res.json({ message: 'Push notifications disabled.' })
})


app.post('/api/newsletter/subscribe', optionalAuth, async (req, res) => {
  try {
    const email = String(req.body.email || req.user?.email || '').toLowerCase().trim()
    const name = String(req.body.name || req.user?.name || '').trim()
    if (!email || !email.includes('@')) return res.status(400).json({ message: 'A valid email is required.' })
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email, name, user: req.user?._id || null, status: 'subscribed', subscribedAt: new Date(), unsubscribedAt: null },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    res.status(201).json({ message: 'You are subscribed to Spark Store updates.', subscriber })
  } catch (error) { res.status(500).json({ message: 'Unable to subscribe.', error: error.message }) }
})

app.post('/api/newsletter/unsubscribe', optionalAuth, async (req, res) => {
  const email = String(req.body.email || req.user?.email || '').toLowerCase().trim()
  if (!email) return res.status(400).json({ message: 'Email is required.' })
  const subscriber = await NewsletterSubscriber.findOneAndUpdate({ email }, { status: 'unsubscribed', unsubscribedAt: new Date() }, { new: true })
  if (!subscriber) return res.status(404).json({ message: 'Subscriber not found.' })
  res.json({ message: 'You have been unsubscribed.' })
})

app.get('/api/newsletter/status', auth, async (req, res) => {
  const subscriber = await NewsletterSubscriber.findOne({ email: req.user.email })
  res.json({ subscribed: subscriber?.status === 'subscribed', subscriber })
})

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'spark-ecommerce-api', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', stripe: Boolean(stripe), email: Boolean(process.env.RESEND_API_KEY), push: pushConfigured }))

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone = '', role = 'customer', referralCode = '' } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' })
    if (!['customer', 'seller'].includes(role)) return res.status(400).json({ message: 'Invalid registration role.' })
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedPhone = normalizePhone(phone)
    let referrer = null
    if (referralCode && role === 'customer') {
      referrer = await User.findOne({ referralCode: String(referralCode).trim().toUpperCase(), role: 'customer', isDeleted: false })
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code.' })
    }
    const exists = await User.findOne({ $or: [{ email: normalizedEmail }, ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])] })
    if (exists) return res.status(409).json({ message: exists.email === normalizedEmail ? 'An account with this email already exists.' : 'An account with this phone number already exists.' })
    const hashedPassword = await bcrypt.hash(password, 12)
    const emailCode = generateCode()
    const user = await User.create({ name, email: normalizedEmail, phone: normalizedPhone, password: hashedPassword, role, verified: false, phoneVerified: false, emailVerificationCodeHash: hashCode(emailCode), emailVerificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000), sellerStatus: role === 'seller' ? 'pending' : 'approved', referralCode: role === 'customer' ? makeReferralCode(name) : undefined, referredBy: referrer?._id || null })
    if (referrer) await Referral.create({ referrer: referrer._id, referredUser: user._id, code: referrer.referralCode, bonusPoints: referralBonusPoints })
    try {
      await sendEmailVerification(user, emailCode)
    } catch (emailError) {
      await User.findByIdAndDelete(user._id)
      return res.status(503).json({ message: 'Account could not be created because email verification service is unavailable.', error: emailError.message })
    }
    res.status(201).json({ user: publicUser(user), verificationRequired: true, phoneVerificationAvailable: Boolean(normalizedPhone) })
  } catch (error) {
    res.status(500).json({ message: 'Unable to create account.', error: error.message })
  }
})

app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()
    const code = String(req.body.code || '')
    const user = await User.findOne({ email, isDeleted: false })
    if (!user) return res.status(404).json({ message: 'Account not found.' })
    if (user.verified) return res.json({ message: 'Email is already verified.', user: publicUser(user) })
    if (!codeIsValid(user, 'emailVerificationCodeHash', 'emailVerificationExpiresAt', code)) return res.status(400).json({ message: 'Invalid or expired verification code.' })
    user.verified = true
    user.emailVerificationCodeHash = null
    user.emailVerificationExpiresAt = null
    await user.save()
    res.json({ message: 'Email verified successfully.', user: publicUser(user), token: signToken(user) })
  } catch (error) { res.status(500).json({ message: 'Unable to verify email.', error: error.message }) }
})

app.post('/api/auth/resend-email-verification', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()
    const user = await User.findOne({ email, isDeleted: false })
    if (!user) return res.status(404).json({ message: 'Account not found.' })
    if (user.verified) return res.json({ message: 'Email is already verified.' })
    const code = generateCode()
    user.emailVerificationCodeHash = hashCode(code)
    user.emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()
    await sendEmailVerification(user, code)
    res.json({ message: 'A new verification code was sent to your email.' })
  } catch (error) { res.status(503).json({ message: 'Unable to send verification email.', error: error.message }) }
})

app.post('/api/auth/phone/send', auth, async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone || req.user.phone)
    if (!/^\+?[1-9]\d{7,14}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number in international format, for example +2010xxxxxxxx.' })
    const existing = await User.findOne({ phone, _id: { $ne: req.user._id }, isDeleted: false })
    if (existing) return res.status(409).json({ message: 'This phone number is already linked to another account.' })
    req.user.phone = phone
    req.user.phoneVerified = false
    req.user.phoneVerificationAttempts = 0
    req.user.phoneVerificationCodeHash = hashCode('twilio-managed')
    req.user.phoneVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await req.user.save()
    await sendSmsOtp(phone, 'twilio')
    res.json({ message: 'A verification code was sent by SMS.', user: publicUser(req.user) })
  } catch (error) { res.status(503).json({ message: 'Unable to send phone verification code.', error: error.message }) }
})

app.post('/api/auth/phone/verify', auth, async (req, res) => {
  try {
    const code = String(req.body.code || '')
    const result = await checkSmsOtp(req.user.phone, code)
    if (result.status !== 'approved') return res.status(400).json({ message: 'Invalid or expired phone verification code.' })
    req.user.phoneVerified = true
    req.user.phoneVerificationCodeHash = null
    req.user.phoneVerificationExpiresAt = null
    req.user.phoneVerificationAttempts = 0
    await req.user.save()
    res.json({ message: 'Phone number verified successfully.', user: publicUser(req.user) })
  } catch (error) { res.status(400).json({ message: 'Unable to verify phone number.', error: error.message }) }
})

app.post('/api/auth/phone/request-login', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone)
    if (!/^\+?[1-9]\d{7,14}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number in international format.' })
    const user = await User.findOne({ phone, isDeleted: false })
    if (!user) return res.status(404).json({ message: 'No account is linked to this phone number.' })
    await sendSmsOtp(phone, 'twilio')
    res.json({ message: 'A login code was sent by SMS.' })
  } catch (error) { res.status(503).json({ message: 'Unable to send phone login code.', error: error.message }) }
})

app.post('/api/auth/phone/login', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone)
    const code = String(req.body.code || '')
    const user = await User.findOne({ phone, isDeleted: false })
    if (!user) return res.status(404).json({ message: 'Account not found.' })
    const result = await checkSmsOtp(phone, code)
    if (result.status !== 'approved') return res.status(401).json({ message: 'Invalid or expired phone login code.' })
    if (user.accountStatus === 'restricted') return res.status(403).json({ message: 'This account is restricted.' })
    if (!user.verified) return res.status(403).json({ message: 'Please verify your email before signing in.', code: 'UNVERIFIED', user: publicUser(user) })
    if (user.role === 'seller' && user.sellerStatus === 'rejected') return res.status(403).json({ message: 'Seller account was not approved.' })
    user.phoneVerified = true
    await user.save()
    res.json({ user: publicUser(user), token: signToken(user) })
  } catch (error) { res.status(401).json({ message: 'Unable to sign in with phone.', error: error.message }) }
})

app.post('/api/auth/google', async (req, res) => {
  try {
    if (!googleClient || !process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google login is not configured.' })
    const credential = String(req.body.credential || '')
    if (!credential) return res.status(400).json({ message: 'Google credential is required.' })
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload?.sub || !payload.email || !payload.email_verified) return res.status(401).json({ message: 'Google account email could not be verified.' })
    const email = payload.email.toLowerCase().trim()
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }], isDeleted: false })
    if (user) {
      if (user.accountStatus === 'restricted') return res.status(403).json({ message: 'This account is restricted.' })
      if (user.googleId && user.googleId !== payload.sub) return res.status(409).json({ message: 'This email is already linked to another Google account.' })
      user.googleId = payload.sub
      user.authProvider = 'google'
      user.verified = true
      if (!user.name && payload.name) user.name = payload.name
      await user.save()
    } else {
      const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12)
      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email,
        password,
        googleId: payload.sub,
        authProvider: 'google',
        verified: true,
        phoneVerified: false,
        sellerStatus: 'approved'
      })
    }
    if (user.role === 'seller' && user.sellerStatus === 'rejected') return res.status(403).json({ message: 'Seller account was not approved.' })
    res.json({ user: publicUser(user), token: signToken(user), provider: 'google' })
  } catch (error) {
    res.status(401).json({ message: 'Unable to sign in with Google.', error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase().trim(), isDeleted: false })
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' })
    if (user.accountStatus === 'restricted') return res.status(403).json({ message: 'This account is restricted.' })
    if (!user.verified) return res.status(403).json({ message: 'Please verify your email before signing in.', code: 'UNVERIFIED', user: publicUser(user) })
    if (user.role === 'seller' && user.sellerStatus === 'rejected') return res.status(403).json({ message: 'Seller account was not approved.' })
    const valid = await bcrypt.compare(password || '', user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' })
    const token = signToken(user)
    res.json({ user: publicUser(user), token })
  } catch (error) {
    res.status(500).json({ message: 'Unable to login.', error: error.message })
  }
})

app.get('/api/auth/me', auth, async (req, res) => res.json({ user: publicUser(req.user) }))
app.post('/api/auth/logout', auth, async (req, res) => res.json({ message: 'Logged out.' }))

app.get('/api/profile', auth, async (req, res) => {
  res.json({ user: publicUser(req.user) })
})

app.patch('/api/profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ message: 'Name and email are required.' })
    const normalizedEmail = email.toLowerCase().trim()
    const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } })
    if (exists) return res.status(409).json({ message: 'This email is already in use.' })
    req.user.name = name.trim()
    req.user.email = normalizedEmail
    const normalizedPhone = normalizePhone(phone)
    if (normalizedPhone !== req.user.phone) {
      if (normalizedPhone) {
        const phoneExists = await User.findOne({ phone: normalizedPhone, _id: { $ne: req.user._id }, isDeleted: false })
        if (phoneExists) return res.status(409).json({ message: 'This phone number is already in use.' })
      }
      req.user.phone = normalizedPhone
      req.user.phoneVerified = false
    }
    req.user.address = { ...(req.user.address || {}), phone: normalizedPhone }
    await req.user.save()
    res.json({ user: publicUser(req.user) })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile.', error: error.message })
  }
})

app.post('/api/profile/addresses', auth, async (req, res) => {
  try {
    const { label, fullName, phone, address, city, postalCode, country = 'Egypt', isDefault = false } = req.body
    if (!fullName || !phone || !address || !city) return res.status(400).json({ message: 'Full name, phone, address and city are required.' })
    const entry = { id: new mongoose.Types.ObjectId().toString(), label: label?.trim() || 'Home', fullName: fullName.trim(), phone: phone.trim(), address: address.trim(), city: city.trim(), postalCode: postalCode?.trim() || '', country: country.trim(), isDefault: Boolean(isDefault) }
    const addresses = Array.isArray(req.user.addresses) ? req.user.addresses : []
    if (!addresses.length) entry.isDefault = true
    if (entry.isDefault) addresses.forEach((item) => { item.isDefault = false })
    addresses.push(entry)
    req.user.addresses = addresses
    if (entry.isDefault) req.user.address = entry
    await req.user.save()
    res.status(201).json({ user: publicUser(req.user), address: entry })
  } catch (error) {
    res.status(500).json({ message: 'Unable to add address.', error: error.message })
  }
})

app.patch('/api/profile/addresses/:addressId', auth, async (req, res) => {
  try {
    const addresses = Array.isArray(req.user.addresses) ? req.user.addresses : []
    const target = addresses.find((item) => item.id === req.params.addressId)
    if (!target) return res.status(404).json({ message: 'Address not found.' })
    const fields = ['label', 'fullName', 'phone', 'address', 'city', 'postalCode', 'country']
    fields.forEach((field) => { if (req.body[field] !== undefined) target[field] = String(req.body[field]).trim() })
    if (req.body.isDefault) addresses.forEach((item) => { item.isDefault = item.id === target.id })
    if (!addresses.some((item) => item.isDefault)) target.isDefault = true
    const currentDefault = addresses.find((item) => item.isDefault)
    if (currentDefault) req.user.address = currentDefault
    req.user.addresses = addresses
    await req.user.save()
    res.json({ user: publicUser(req.user), address: target })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update address.', error: error.message })
  }
})

app.delete('/api/profile/addresses/:addressId', auth, async (req, res) => {
  try {
    let addresses = Array.isArray(req.user.addresses) ? req.user.addresses : []
    const removed = addresses.find((item) => item.id === req.params.addressId)
    if (!removed) return res.status(404).json({ message: 'Address not found.' })
    addresses = addresses.filter((item) => item.id !== req.params.addressId)
    if (removed.isDefault && addresses.length) addresses[0].isDefault = true
    req.user.addresses = addresses
    req.user.address = addresses.find((item) => item.isDefault) || addresses[0] || {}
    await req.user.save()
    res.json({ user: publicUser(req.user) })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete address.', error: error.message })
  }
})

app.patch('/api/profile/payment-details', auth, async (req, res) => {
  try {
    const { cardholderName, brand, last4, expiryMonth, expiryYear, paypalEmail } = req.body
    if (last4 && !/^\d{4}$/.test(String(last4))) return res.status(400).json({ message: 'Card last 4 digits must contain exactly 4 numbers.' })
    if (expiryMonth && (Number(expiryMonth) < 1 || Number(expiryMonth) > 12)) return res.status(400).json({ message: 'Invalid expiry month.' })
    if (expiryYear && Number(expiryYear) < new Date().getFullYear()) return res.status(400).json({ message: 'Invalid expiry year.' })
    req.user.paymentDetails = {
      ...(req.user.paymentDetails || {}),
      ...(cardholderName !== undefined ? { cardholderName: String(cardholderName).trim() } : {}),
      ...(brand !== undefined ? { brand: String(brand).trim() } : {}),
      ...(last4 !== undefined ? { last4: String(last4) } : {}),
      ...(expiryMonth !== undefined ? { expiryMonth: Number(expiryMonth) } : {}),
      ...(expiryYear !== undefined ? { expiryYear: Number(expiryYear) } : {}),
      ...(paypalEmail !== undefined ? { paypalEmail: String(paypalEmail).trim() } : {})
    }
    await req.user.save()
    res.json({ user: publicUser(req.user) })
  } catch (error) {
    res.status(500).json({ message: 'Unable to save payment details.', error: error.message })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = 1, limit = 24 } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }
    if (minPrice || maxPrice) filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 }
    const skip = (Number(page) - 1) * Number(limit)
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter)
    ])
    res.json({
      products: products.map((product) => ({ ...product, id: String(product._id) })),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    })
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products.', error: error.message })
  }
})

app.get('/api/products/categories', async (req, res) => {
  const categories = await Product.distinct('category')
  res.json(categories.filter(Boolean).sort().map((slug) => ({ slug, name: slug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) })))
})

const buildReviewSummary = async (product) => {
  const customerReviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).lean()
  const legacyReviews = Array.isArray(product.reviews) ? product.reviews : []
  const legacyTotal = legacyReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
  const customerTotal = customerReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
  const count = legacyReviews.length + customerReviews.length
  const average = count ? Number(((legacyTotal + customerTotal) / count).toFixed(1)) : 0
  return { average, count, customerReviews }
}

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null)
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  const summary = await buildReviewSummary(product)
  res.json({ ...product.toObject(), id: String(product._id), rating: summary.average, reviewCount: summary.count, customerReviews: summary.customerReviews })
})

app.get('/api/products/:id/reviews', async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null)
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  const summary = await buildReviewSummary(product)
  res.json(summary)
})

app.get('/api/products/:id/review-eligibility', auth, async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null)
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  const existing = await Review.findOne({ product: product._id, user: req.user._id })
  const deliveredOrder = await Order.findOne({ user: req.user._id, status: 'Delivered', 'items.product._id': product._id }).sort({ createdAt: -1 })
  res.json({ eligible: Boolean(deliveredOrder && !existing), alreadyReviewed: Boolean(existing), orderId: deliveredOrder?._id || null })
})

app.post('/api/products/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    const numericRating = Number(rating)
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' })
    if (!comment?.trim() || comment.trim().length < 3) return res.status(400).json({ message: 'Please write a review with at least 3 characters.' })
    const deliveredOrder = await Order.findOne({ user: req.user._id, status: 'Delivered', 'items.product._id': product._id }).sort({ createdAt: -1 })
    if (!deliveredOrder) return res.status(403).json({ message: 'You can review this product after receiving your order.' })
    const exists = await Review.findOne({ product: product._id, user: req.user._id })
    if (exists) return res.status(409).json({ message: 'You have already reviewed this product.' })
    const review = await Review.create({ product: product._id, user: req.user._id, order: deliveredOrder._id, rating: numericRating, comment: comment.trim(), reviewerName: req.user.name })
    const summary = await buildReviewSummary(product)
    await Product.findByIdAndUpdate(product._id, { rating: summary.average, reviewCount: summary.count })
    res.status(201).json({ review, summary })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'You have already reviewed this product.' })
    res.status(500).json({ message: 'Unable to submit review.', error: error.message })
  }
})

async function paypalAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal is not configured on the server.')
  const base = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  })
  if (!response.ok) throw new Error(`PayPal authentication failed: ${await response.text()}`)
  return { token: (await response.json()).access_token, base }
}

app.get('/api/wallet', auth, async (req, res) => {
  res.json({ balance: Number(req.user.walletBalance || 0), transactions: req.user.walletTransactions || [] })
})

app.post('/api/wallet/top-up', auth, async (req, res) => {
  try {
    const amount = Number(req.body.amount)
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000) return res.status(400).json({ message: 'Top-up amount must be between $1 and $10,000.' })
    const transaction = { id: `WAL-${Date.now()}`, type: 'credit', amount: Number(amount.toFixed(2)), description: 'Wallet top-up', createdAt: new Date() }
    req.user.walletBalance = Number(((req.user.walletBalance || 0) + transaction.amount).toFixed(2))
    req.user.walletTransactions = [transaction, ...(req.user.walletTransactions || [])].slice(0, 100)
    await req.user.save()
    res.json({ balance: req.user.walletBalance, transaction })
  } catch (error) { res.status(500).json({ message: 'Unable to top up wallet.', error: error.message }) }
})

app.post('/api/payments/paypal/create-order', auth, async (req, res) => {
  try {
    const { orderId } = req.body
    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    if (order.paymentMethod !== 'paypal') return res.status(400).json({ message: 'This order does not require PayPal.' })
    const { token, base } = await paypalAccessToken()
    const response = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: order.orderNumber, custom_id: order._id.toString(), amount: { currency_code: 'USD', value: Number(order.total).toFixed(2) } }], application_context: { brand_name: 'Spark Store', user_action: 'PAY_NOW', return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-success/${order._id}?paypal=success`, cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?payment=cancelled` } })
    })
    const data = await response.json()
    if (!response.ok) return res.status(502).json({ message: data.message || 'Unable to create PayPal order.' })
    order.paymentProvider = 'paypal'
    order.paypalOrderId = data.id
    await order.save()
    const approval = data.links?.find((link) => link.rel === 'approve')
    res.json({ id: data.id, url: approval?.href || null })
  } catch (error) { res.status(500).json({ message: 'Unable to create PayPal order.', error: error.message }) }
})

app.post('/api/payments/paypal/capture-order', auth, async (req, res) => {
  try {
    const { paypalOrderId } = req.body
    const order = await Order.findOne({ paypalOrderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    const { token, base } = await paypalAccessToken()
    const response = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
    const data = await response.json()
    if (!response.ok) return res.status(502).json({ message: data.message || 'Unable to capture PayPal payment.' })
    if (data.status === 'COMPLETED') {
      order.paymentStatus = 'paid'; order.paymentProvider = 'paypal'; order.status = 'Confirmed'; await order.save()
      if (!order.paymentEmailSent) { await sendPaymentConfirmation(order); order.paymentEmailSent = true; await order.save() }
      await notifyOrderParties(order, { title: 'Payment confirmed', message: `Payment for order ${order.orderNumber} was confirmed.` })
    }
    res.json({ order, status: data.status })
  } catch (error) { res.status(500).json({ message: 'Unable to capture PayPal payment.', error: error.message }) }
})

app.post('/api/orders', optionalAuth, async (req, res) => {
  try {
    const { customer, address, items, paymentMethod, promoCode = null, discount = 0, loyaltyPointsRedeemed = 0 } = req.body
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Your cart is empty.' })
    if (!['card', 'paypal', 'cod', 'wallet'].includes(paymentMethod)) return res.status(400).json({ message: 'Invalid payment method.' })
    if (!req.user && paymentMethod !== 'cod') return res.status(401).json({ message: 'Please sign in to use online payment or Wallet.' })
    if (!customer?.name || !customer?.email || !customer?.phone || !address) return res.status(400).json({ message: 'Complete your shipping information.' })

    const productIds = items.map((item) => item.product?._id || item.product?.id).filter(Boolean)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })
    const productMap = new Map(products.map((product) => [String(product._id), product]))
    const normalizedItems = []

    for (const item of items) {
      const productId = String(item.product?._id || item.product?.id || '')
      const product = productMap.get(productId)
      if (!product) return res.status(400).json({ message: 'One or more products are no longer available.' })
      const quantity = Math.max(1, Number(item.quantity) || 1)
      if (quantity > product.stock) return res.status(400).json({ message: `${product.title} does not have enough stock.` })
      normalizedItems.push({ product: product.toObject(), quantity, seller: product.seller || null })
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + discountedPrice(item.product) * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 12
    let loyaltyRedeemed = 0
    if (req.user) {
      const requestedPoints = Math.max(0, Math.floor(Number(loyaltyPointsRedeemed || 0)))
      const maxPointsByOrder = Math.floor((subtotal * loyaltyMaxPercent / 100) / loyaltyValuePerPoint)
      loyaltyRedeemed = Math.min(requestedPoints, Number(req.user.loyaltyPoints || 0), maxPointsByOrder)
    }
    const loyaltyDiscount = Number((loyaltyRedeemed * loyaltyValuePerPoint).toFixed(2))
    const total = Math.max(0, subtotal + shipping - Number(discount || 0) - loyaltyDiscount)
    if (loyaltyRedeemed && req.user) {
      req.user.loyaltyPoints = Number(req.user.loyaltyPoints || 0) - loyaltyRedeemed
      await req.user.save()
    }
    if (paymentMethod === 'wallet') {
      if (Number(req.user.walletBalance || 0) < total) return res.status(400).json({ message: 'Insufficient wallet balance.' })
      req.user.walletBalance = Number((Number(req.user.walletBalance || 0) - total).toFixed(2))
      req.user.walletTransactions = [{ id: `WAL-${Date.now()}`, type: 'debit', amount: Number(total.toFixed(2)), description: 'Order payment', createdAt: new Date() }, ...(req.user.walletTransactions || [])].slice(0, 100)
      await req.user.save()
    }
    const order = await Order.create({
      orderNumber: `SPK-${Date.now().toString().slice(-8)}`,
      user: req.user?._id || null,
      customer,
      address,
      items: normalizedItems,
      paymentMethod,
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
      status: 'Confirmed',
      promoCode,
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      discount: Number((Number(discount || 0) + loyaltyDiscount).toFixed(2)),
      loyaltyPointsRedeemed: loyaltyRedeemed,
      total: Number(total.toFixed(2)),
      tracking: { courier: 'Spark Courier', progress: 1, eta: 'Today, 1:30–2:00 PM', latitude: defaultCoordinates.latitude, longitude: defaultCoordinates.longitude, lastUpdated: new Date() }
    })

    await Promise.all(normalizedItems.map((item) => Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })))
    await sendOrderConfirmation(order)
    await notifyOrderParties(order, { title: 'Order placed', message: `Order ${order.orderNumber} was placed successfully.` })
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Unable to create order.', error: error.message })
  }
})

app.get('/api/referrals', auth, async (req, res) => {
  try {
    const code = await ensureReferralCode(req.user)
    const [sent, received] = await Promise.all([
      Referral.find({ referrer: req.user._id }).populate('referredUser', 'name email createdAt').sort({ createdAt: -1 }),
      Referral.find({ referredUser: req.user._id }).populate('referrer', 'name email').sort({ createdAt: -1 })
    ])
    res.json({ code, bonusPoints: referralBonusPoints, sent, received, completed: sent.filter((item) => item.status === 'completed').length })
  } catch (error) { res.status(500).json({ message: 'Unable to load referral data.', error: error.message }) }
})

app.post('/api/referrals/ensure-code', auth, async (req, res) => {
  try { res.json({ referralCode: await ensureReferralCode(req.user) }) }
  catch (error) { res.status(500).json({ message: 'Unable to create referral code.', error: error.message }) }
})

app.get('/api/admin/referrals', auth, roles('admin'), async (req, res) => {
  try {
    const [referrals, completed, customers] = await Promise.all([
      Referral.find().populate('referrer', 'name email').populate('referredUser', 'name email').sort({ createdAt: -1 }),
      Referral.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'customer', isDeleted: false })
    ])
    res.json({ referrals, stats: { total: referrals.length, completed, pending: referrals.length - completed, customers } })
  } catch (error) { res.status(500).json({ message: 'Unable to load referral data.', error: error.message }) }
})

app.get('/api/loyalty', auth, async (req, res) => {
  res.json({ points: Number(req.user.loyaltyPoints || 0), lifetimePoints: Number(req.user.lifetimeLoyaltyPoints || 0), value: Number((Number(req.user.loyaltyPoints || 0) * loyaltyValuePerPoint).toFixed(2)), valuePerPoint: loyaltyValuePerPoint, maxPercent: loyaltyMaxPercent })
})

app.get('/api/loyalty/history', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id, $or: [{ loyaltyPointsEarned: { $gt: 0 } }, { loyaltyPointsRedeemed: { $gt: 0 } }] }).sort({ createdAt: -1 }).limit(50)
  const history = orders.map((order) => ({ id: order._id, orderNumber: order.orderNumber, createdAt: order.createdAt, earned: Number(order.loyaltyPointsEarned || 0), redeemed: Number(order.loyaltyPointsRedeemed || 0), status: order.status }))
  res.json(history)
})

app.get('/api/admin/loyalty/users', auth, roles('admin'), async (req, res) => {
  const users = await User.find({ role: 'customer', isDeleted: false }).select('name email loyaltyPoints lifetimeLoyaltyPoints').sort({ loyaltyPoints: -1 })
  res.json(users)
})

app.patch('/api/admin/loyalty/users/:id', auth, roles('admin'), async (req, res) => {
  const points = Math.trunc(Number(req.body.points))
  if (!Number.isFinite(points) || points === 0) return res.status(400).json({ message: 'Enter a non-zero whole number of points.' })
  const user = await User.findOne({ _id: req.params.id, role: 'customer', isDeleted: false })
  if (!user) return res.status(404).json({ message: 'Customer not found.' })
  if (points < 0 && Number(user.loyaltyPoints || 0) + points < 0) return res.status(400).json({ message: 'Points cannot become negative.' })
  user.loyaltyPoints = Number(user.loyaltyPoints || 0) + points
  if (points > 0) user.lifetimeLoyaltyPoints = Number(user.lifetimeLoyaltyPoints || 0) + points
  await user.save()
  res.json({ id: user._id, name: user.name, email: user.email, loyaltyPoints: user.loyaltyPoints, lifetimeLoyaltyPoints: user.lifetimeLoyaltyPoints })
})

app.get('/api/orders/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})

app.get('/api/orders/:id', auth, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found.' })
  res.json(order)
})

app.post('/api/payments/setup-intent', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    let customerId = req.user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name, metadata: { user_id: req.user._id.toString() } })
      customerId = customer.id
      req.user.stripeCustomerId = customerId
      await req.user.save()
    }
    const setupIntent = await stripe.setupIntents.create({ customer: customerId, payment_method_types: ['card'], usage: 'off_session' })
    res.json({ clientSecret: setupIntent.client_secret, customerId })
  } catch (error) {
    res.status(500).json({ message: 'Unable to start secure card setup.', error: error.message })
  }
})

app.get('/api/payments/saved-cards', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    if (!req.user.stripeCustomerId) return res.json({ cards: [], defaultPaymentMethodId: req.user.defaultStripePaymentMethodId || null })
    const methods = await stripe.paymentMethods.list({ customer: req.user.stripeCustomerId, type: 'card' })
    const cards = methods.data.map((method) => ({ id: method.id, brand: method.card.brand, last4: method.card.last4, expMonth: method.card.exp_month, expYear: method.card.exp_year }))
    res.json({ cards, defaultPaymentMethodId: req.user.defaultStripePaymentMethodId || null })
  } catch (error) {
    res.status(500).json({ message: 'Unable to load saved cards.', error: error.message })
  }
})

app.delete('/api/payments/saved-cards/:paymentMethodId', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    if (!req.user.stripeCustomerId) return res.status(404).json({ message: 'No saved cards found.' })
    const method = await stripe.paymentMethods.retrieve(req.params.paymentMethodId)
    if (method.customer !== req.user.stripeCustomerId) return res.status(403).json({ message: 'You cannot remove this card.' })
    await stripe.paymentMethods.detach(req.params.paymentMethodId)
    if (req.user.defaultStripePaymentMethodId === req.params.paymentMethodId) {
      req.user.defaultStripePaymentMethodId = null
      await req.user.save()
    }
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ message: 'Unable to remove saved card.', error: error.message })
  }
})

app.patch('/api/payments/saved-cards/default', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    if (!req.user.stripeCustomerId) return res.status(404).json({ message: 'No saved cards found.' })
    const { paymentMethodId } = req.body
    const method = await stripe.paymentMethods.retrieve(paymentMethodId)
    if (method.customer !== req.user.stripeCustomerId) return res.status(403).json({ message: 'You cannot select this card.' })
    await stripe.customers.update(req.user.stripeCustomerId, { invoice_settings: { default_payment_method: paymentMethodId } })
    req.user.defaultStripePaymentMethodId = paymentMethodId
    await req.user.save()
    res.json({ ok: true, defaultPaymentMethodId: paymentMethodId })
  } catch (error) {
    res.status(500).json({ message: 'Unable to set default card.', error: error.message })
  }
})

app.post('/api/payments/create-checkout-session', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    const { orderId } = req.body
    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    if (order.paymentMethod !== 'card') return res.status(400).json({ message: 'This order does not require Stripe.' })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: order.customer.email,
      client_reference_id: order.orderNumber,
      metadata: { order_id: order._id.toString(), order_number: order.orderNumber },
      line_items: order.items.map(({ product, quantity }) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: product.title, images: product.thumbnail ? [product.thumbnail] : [] },
          unit_amount: Math.round(discountedPrice(product) * 100)
        },
        quantity
      })),
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-success/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?payment=cancelled`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60
    })

    await Order.findByIdAndUpdate(order._id, { stripeSessionId: session.id })
    res.json({ id: session.id, url: session.url })
  } catch (error) {
    res.status(500).json({ message: 'Unable to create Stripe Checkout Session.', error: error.message })
  }
})

app.get('/api/payments/verify-session/:sessionId', auth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server.' })
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    const orderId = session.metadata?.order_id
    if (!orderId) return res.status(400).json({ message: 'Stripe session is not linked to an order.' })
    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    if (session.payment_status === 'paid' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid'
      order.paymentProvider = 'stripe'
      order.stripeSessionId = session.id
      await order.save()
      if (!order.paymentEmailSent) { await sendPaymentConfirmation(order); order.paymentEmailSent = true; await order.save() }
    }
    res.json({ order, paymentStatus: session.payment_status, sessionStatus: session.status })
  } catch (error) {
    res.status(500).json({ message: 'Unable to verify Stripe payment.', error: error.message })
  }
})

app.get('/api/seller/dashboard', auth, roles('seller'), async (req, res) => {
  const sellerId = req.user._id
  const [products, orders, payouts] = await Promise.all([
    Product.find({ seller: sellerId, isActive: true }).sort({ createdAt: -1 }),
    Order.find({ 'items.seller': sellerId }).sort({ createdAt: -1 }),
    Payout.find({ seller: sellerId }).sort({ createdAt: -1 })
  ])
  const deliveredRevenue = orders.filter((order) => ['Delivered', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(order.status)).reduce((sum, order) => sum + order.items.filter((item) => String(item.seller) === String(sellerId)).reduce((s, item) => s + discountedPrice(item.product) * item.quantity, 0), 0)
  const pendingPayouts = payouts.filter((payout) => payout.status !== 'Paid').reduce((sum, payout) => sum + payout.amount, 0)
  const paidPayouts = payouts.filter((payout) => payout.status === 'Paid').reduce((sum, payout) => sum + payout.amount, 0)
  const availableBalance = Math.max(0, deliveredRevenue - paidPayouts - pendingPayouts)
  const lowStock = products.filter((product) => product.stock <= 10).length
  res.json({ stats: { revenue: deliveredRevenue, availableBalance, pendingPayouts, orders: orders.length, products: products.length, lowStock }, orders: orders.slice(0, 8), payouts: payouts.slice(0, 8) })
})

app.get('/api/seller/products', auth, roles('seller'), async (req, res) => {
  const { search = '', category = '' } = req.query
  const filter = { seller: req.user._id, isActive: true }
  if (search) filter.title = { $regex: search, $options: 'i' }
  if (category) filter.category = category
  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json({ products, total: products.length })
})

app.post('/api/seller/products', auth, roles('seller'), async (req, res) => {
  try {
    const { title, description, category, price, discountPercentage = 0, stock = 0, brand = '', thumbnail = '', images = [] } = req.body
    if (!title || !category || price === undefined) return res.status(400).json({ message: 'Title, category and price are required.' })
    const product = await Product.create({ title, description, category, price: Number(price), discountPercentage: Number(discountPercentage), stock: Number(stock), brand, thumbnail, images, seller: req.user._id, rating: 0, reviews: [] })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Unable to create product.', error: error.message })
  }
})

app.patch('/api/seller/products/:id', auth, roles('seller'), async (req, res) => {
  const allowed = ['title', 'description', 'category', 'price', 'discountPercentage', 'stock', 'brand', 'thumbnail', 'images']
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)))
  if ('price' in updates) updates.price = Number(updates.price)
  if ('stock' in updates) updates.stock = Number(updates.stock)
  if ('discountPercentage' in updates) updates.discountPercentage = Number(updates.discountPercentage)
  const product = await Product.findOneAndUpdate({ _id: req.params.id, seller: req.user._id, isActive: true }, updates, { new: true, runValidators: true })
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json(product)
})

app.delete('/api/seller/products/:id', auth, roles('seller'), async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, seller: req.user._id }, { isActive: false }, { new: true })
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json({ message: 'Product archived.' })
})

app.get('/api/seller/orders', auth, roles('seller'), async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id }).sort({ createdAt: -1 })
  const sellerOrders = orders.map((order) => {
    const sellerItems = order.items.filter((item) => String(item.seller) === String(req.user._id))
    const sellerTotal = sellerItems.reduce((sum, item) => sum + discountedPrice(item.product) * item.quantity, 0)
    return { ...order.toObject(), sellerItems, sellerTotal: Number(sellerTotal.toFixed(2)) }
  })
  res.json(sellerOrders)
})

app.patch('/api/seller/orders/:id/status', auth, roles('seller'), async (req, res) => {
  const allowed = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  const { status } = req.body
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid order status.' })
  const order = await Order.findOne({ _id: req.params.id, 'items.seller': req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found.' })
  order.status = status
  order.tracking = { ...(order.tracking || {}), progress: trackingProgress[status] || 0, eta: status === 'Delivered' ? 'Delivered' : order.tracking?.eta, lastUpdated: new Date() }
  await order.save()
  if (status === 'Delivered') { await awardLoyaltyForOrder(order); await completeReferralForOrder(order) }
  if (status === 'Cancelled') await refundReservedLoyalty(order)
  await sendOrderStatusEmail(order)
  emitOrderUpdate(order)
  await notifyOrderParties(order, { title: `Order ${status}`, message: `Order ${order.orderNumber} is now ${status}.` })
  res.json(order)
})

app.patch('/api/seller/orders/:id/tracking', auth, roles('seller'), async (req, res) => {
  try {
    const latitude = Number(req.body.latitude)
    const longitude = Number(req.body.longitude)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return res.status(400).json({ message: 'Valid latitude and longitude are required.' })
    const order = await Order.findOne({ _id: req.params.id, 'items.seller': req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    order.tracking = { ...(order.tracking || {}), latitude, longitude, lastUpdated: new Date() }
    await order.save()
    emitOrderUpdate(order)
    res.json(order)
  } catch (error) { res.status(500).json({ message: 'Unable to update courier location.', error: error.message }) }
})

app.get('/api/seller/payouts', auth, roles('seller'), async (req, res) => {
  const [payouts, orders] = await Promise.all([
    Payout.find({ seller: req.user._id }).sort({ createdAt: -1 }),
    Order.find({ 'items.seller': req.user._id })
  ])
  const gross = orders.reduce((sum, order) => sum + order.items.filter((item) => String(item.seller) === String(req.user._id)).reduce((s, item) => s + discountedPrice(item.product) * item.quantity, 0), 0)
  const paid = payouts.filter((payout) => payout.status === 'Paid').reduce((sum, payout) => sum + payout.amount, 0)
  const pending = payouts.filter((payout) => payout.status !== 'Paid').reduce((sum, payout) => sum + payout.amount, 0)
  res.json({ payouts, gross: Number(gross.toFixed(2)), available: Number(Math.max(0, gross - paid - pending).toFixed(2)), pending: Number(pending.toFixed(2)), paid: Number(paid.toFixed(2)) })
})

app.post('/api/seller/payouts', auth, roles('seller'), async (req, res) => {
  const amount = Number(req.body.amount)
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Enter a valid payout amount.' })
  const [payouts, orders] = await Promise.all([
    Payout.find({ seller: req.user._id }),
    Order.find({ 'items.seller': req.user._id })
  ])
  const gross = orders.reduce((sum, order) => sum + order.items.filter((item) => String(item.seller) === String(req.user._id)).reduce((s, item) => s + discountedPrice(item.product) * item.quantity, 0), 0)
  const committed = payouts.filter((payout) => payout.status !== 'Rejected').reduce((sum, payout) => sum + payout.amount, 0)
  const available = Math.max(0, gross - committed)
  if (amount > available) return res.status(400).json({ message: `Maximum available payout is $${available.toFixed(2)}.` })
  const payout = await Payout.create({ seller: req.user._id, reference: `PAY-${Date.now().toString().slice(-6)}`, amount, status: 'Pending' })
  res.status(201).json(payout)
})

app.get('/api/admin/users', auth, roles('admin'), async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  res.json(users)
})

app.get('/api/admin/orders', auth, roles('admin'), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
})

app.patch('/api/admin/orders/:id/status', auth, roles('admin'), async (req, res) => {
  const allowed = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  const { status } = req.body
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid order status.' })
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found.' })
  order.status = status
  order.tracking = { ...(order.tracking || {}), progress: trackingProgress[status] || 0, eta: status === 'Delivered' ? 'Delivered' : order.tracking?.eta, lastUpdated: new Date() }
  await order.save()
  if (status === 'Delivered') { await awardLoyaltyForOrder(order); await completeReferralForOrder(order) }
  if (status === 'Cancelled') await refundReservedLoyalty(order)
  await sendOrderStatusEmail(order)
  emitOrderUpdate(order)
  await notifyOrderParties(order, { title: `Order ${status}`, message: `Order ${order.orderNumber} is now ${status}.` })
  res.json(order)
})



app.get('/api/admin/dashboard', auth, roles('admin'), async (req, res) => {
  try {
    const [users, sellers, products, orders, revenueAgg, categoryAgg, recentOrders] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'seller', sellerStatus: 'approved', isDeleted: false }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Product.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]),
      Order.find().sort({ createdAt: -1 }).limit(6)
    ])
    const gross = revenueAgg[0]?.total || 0
    const pendingSellers = await User.countDocuments({ role: 'seller', sellerStatus: 'pending', isDeleted: false })
    res.json({ stats: { users, sellers, products, orders, grossVolume: Number(gross.toFixed(2)), pendingSellers }, categories: categoryAgg, recentOrders })
  } catch (error) { res.status(500).json({ message: 'Unable to load admin dashboard.', error: error.message }) }
})

app.patch('/api/admin/users/:id/status', auth, roles('admin'), async (req, res) => {
  const { status } = req.body
  if (!['active', 'restricted'].includes(status)) return res.status(400).json({ message: 'Invalid account status.' })
  const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: status }, { new: true }).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json(user)
})

app.patch('/api/admin/users/:id/soft-delete', auth, roles('admin'), async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot delete your own admin account.' })
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json(user)
})

app.patch('/api/admin/users/:id/restore', auth, roles('admin'), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: false, accountStatus: 'active' }, { new: true }).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json(user)
})

app.get('/api/admin/sellers', auth, roles('admin'), async (req, res) => {
  const sellers = await User.find({ role: 'seller' }).select('-password').sort({ createdAt: -1 })
  res.json(sellers)
})

app.patch('/api/admin/sellers/:id/review', auth, roles('admin'), async (req, res) => {
  const { status } = req.body
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid seller review status.' })
  const seller = await User.findOneAndUpdate({ _id: req.params.id, role: 'seller' }, { sellerStatus: status, accountStatus: status === 'approved' ? 'active' : 'restricted' }, { new: true }).select('-password')
  if (!seller) return res.status(404).json({ message: 'Seller not found.' })
  res.json(seller)
})

app.get('/api/admin/products', auth, roles('admin'), async (req, res) => {
  const { search = '', category = '' } = req.query
  const filter = {}
  if (search) filter.title = { $regex: search, $options: 'i' }
  if (category) filter.category = category
  const products = await Product.find(filter).populate('seller', 'name email').sort({ createdAt: -1 })
  res.json({ products, total: products.length })
})

app.patch('/api/admin/products/:id/status', auth, roles('admin'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true })
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json(product)
})

app.get('/api/admin/categories', auth, roles('admin'), async (req, res) => {
  const categories = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
  res.json(categories.map((item) => ({ name: item._id, count: item.count })))
})

app.patch('/api/admin/products/:id/category', auth, roles('admin'), async (req, res) => {
  const category = String(req.body.category || '').trim()
  if (!category) return res.status(400).json({ message: 'Category is required.' })
  const product = await Product.findByIdAndUpdate(req.params.id, { category }, { new: true })
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json(product)
})

app.get('/api/admin/coupons', auth, roles('admin'), async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.json(coupons)
})

app.post('/api/admin/coupons', auth, roles('admin'), async (req, res) => {
  try {
    const { code, type = 'percentage', value, minOrder = 0, expiresAt = null, usageLimit = null } = req.body
    if (!code || value === undefined) return res.status(400).json({ message: 'Code and value are required.' })
    if (type === 'percentage' && Number(value) > 100) return res.status(400).json({ message: 'Percentage cannot exceed 100.' })
    const coupon = await Coupon.create({ code, type, value: Number(value), minOrder: Number(minOrder), expiresAt: expiresAt || null, usageLimit: usageLimit ? Number(usageLimit) : null })
    res.status(201).json(coupon)
  } catch (error) { res.status(500).json({ message: 'Unable to create coupon.', error: error.message }) }
})

app.patch('/api/admin/coupons/:id/status', auth, roles('admin'), async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true })
  if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })
  res.json(coupon)
})

app.delete('/api/admin/coupons/:id', auth, roles('admin'), async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })
  res.json({ message: 'Coupon deleted.' })
})


app.get('/api/admin/newsletter/subscribers', auth, roles('admin'), async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 })
  res.json({ subscribers, subscribedCount: subscribers.filter((item) => item.status === 'subscribed').length })
})

app.get('/api/admin/newsletter/campaigns', auth, roles('admin'), async (req, res) => {
  res.json(await NewsletterCampaign.find().sort({ sentAt: -1 }).limit(30))
})

app.post('/api/admin/newsletter/send', auth, roles('admin'), async (req, res) => {
  try {
    const { subject, title, message } = req.body
    if (!subject || !title || !message) return res.status(400).json({ message: 'Subject, title and message are required.' })
    if (!process.env.RESEND_API_KEY) return res.status(503).json({ message: 'Resend email service is not configured.' })
    const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' }).select('email name')
    let sentCount = 0
    for (const subscriber of subscribers) {
      try { await sendNewsletterEmail({ email: subscriber.email, name: subscriber.name, subject, title, message }); sentCount += 1 } catch (error) { console.error(`Newsletter delivery failed for ${subscriber.email}:`, error.message) }
    }
    const campaign = await NewsletterCampaign.create({ subject, title, message, sentCount, status: 'sent' })
    res.status(201).json({ campaign, audience: subscribers.length })
  } catch (error) { res.status(500).json({ message: 'Unable to send newsletter campaign.', error: error.message }) }
})

app.get('/api/admin/banners', auth, roles('admin'), async (req, res) => {
  res.json(await Banner.find().sort({ createdAt: -1 }))
})

app.post('/api/admin/banners', auth, roles('admin'), async (req, res) => {
  const { title, subtitle = '', image = '', link = '' } = req.body
  if (!title) return res.status(400).json({ message: 'Banner title is required.' })
  const banner = await Banner.create({ title, subtitle, image, link })
  res.status(201).json(banner)
})

app.patch('/api/admin/banners/:id/status', auth, roles('admin'), async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true })
  if (!banner) return res.status(404).json({ message: 'Banner not found.' })
  res.json(banner)
})

app.delete('/api/admin/banners/:id', auth, roles('admin'), async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id)
  if (!banner) return res.status(404).json({ message: 'Banner not found.' })
  res.json({ message: 'Banner deleted.' })
})


app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found.' }))

app.use((error, req, res, next) => {
  console.error('Unhandled API error:', error.message)
  if (res.headersSent) return next(error)
  res.status(error.status || 500).json({ message: 'Internal server error.' })
})

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    httpServer.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
    const shutdown = async () => { await mongoose.connection.close(); httpServer.close(() => process.exit(0)) }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

start()
