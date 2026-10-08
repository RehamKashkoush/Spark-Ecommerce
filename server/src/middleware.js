import jwt from 'jsonwebtoken'
import { User } from './models.js'

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Authentication required.' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: payload.id, isDeleted: false }).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: payload.id, isDeleted: false }).select('-password')
    if (user) req.user = user
  } catch {}
  next()
}

export function roles(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission to access this resource.' })
    next()
  }
}


export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-XSS-Protection', '0')
  next()
}

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 100 } = {}) {
  const buckets = new Map()
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const current = buckets.get(key)
    if (!current || now - current.startedAt >= windowMs) {
      buckets.set(key, { startedAt: now, count: 1 })
      return next()
    }
    current.count += 1
    if (current.count > max) {
      const retryAfter = Math.ceil((windowMs - (now - current.startedAt)) / 1000)
      res.setHeader('Retry-After', String(retryAfter))
      return res.status(429).json({ message: 'Too many requests. Please try again later.' })
    }
    next()
  }
}
