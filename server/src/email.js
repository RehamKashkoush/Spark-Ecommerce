import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const from = process.env.RESEND_FROM_EMAIL || 'Spark Store <onboarding@resend.dev>'
const resend = apiKey ? new Resend(apiKey) : null

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])
}


export async function sendEmailVerification(user, code) {
  if (!resend || !user?.email) throw new Error('Resend email service is not configured.')
  await resend.emails.send({
    from,
    to: [user.email],
    subject: 'Spark Store — Verify your email',
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h1>Verify your email</h1><p>Hi ${escapeHtml(user.name)},</p><p>Use this 6-digit code to verify your Spark Store account:</p><div style="font-size:32px;font-weight:800;letter-spacing:8px;padding:18px 0">${escapeHtml(code)}</div><p>This code expires in 10 minutes.</p><p>If you did not create this account, you can ignore this email.</p></div>`
  })
}

export async function sendOrderConfirmation(order) {
  if (!resend || !order?.customer?.email) return
  const items = (order.items || []).map(({ product, quantity }) => `<li>${escapeHtml(product.title)} × ${quantity}</li>`).join('')
  try {
    await resend.emails.send({
      from,
      to: [order.customer.email],
      subject: `Spark Store — Order ${order.orderNumber} confirmed`,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h1>Order confirmed</h1><p>Hi ${escapeHtml(order.customer.name)},</p><p>Your order <strong>${escapeHtml(order.orderNumber)}</strong> has been received.</p><ul>${items}</ul><p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p><p>Payment: ${escapeHtml(order.paymentMethod)}</p><p>We'll keep you updated as your order moves through fulfillment.</p></div>`
    })
  } catch (error) {
    console.error('Resend order confirmation failed:', error.message)
  }
}

export async function sendPaymentConfirmation(order) {
  if (!resend || !order?.customer?.email) return
  try {
    await resend.emails.send({
      from,
      to: [order.customer.email],
      subject: `Spark Store — Payment received for ${order.orderNumber}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h1>Payment received</h1><p>Hi ${escapeHtml(order.customer.name)},</p><p>We've received your payment for order <strong>${escapeHtml(order.orderNumber)}</strong>.</p><p>Total paid: <strong>$${Number(order.total).toFixed(2)}</strong></p><p>Your order is now being processed.</p></div>`
    })
  } catch (error) {
    console.error('Resend payment email failed:', error.message)
  }
}

export async function sendOrderStatusEmail(order) {
  if (!resend || !order?.customer?.email) return
  try {
    await resend.emails.send({
      from,
      to: [order.customer.email],
      subject: `Spark Store — ${order.orderNumber} is ${order.status}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h1>Order update</h1><p>Hi ${escapeHtml(order.customer.name)},</p><p>Your order <strong>${escapeHtml(order.orderNumber)}</strong> is now <strong>${escapeHtml(order.status)}</strong>.</p><p>Track your order from your Spark Store account.</p></div>`
    })
  } catch (error) {
    console.error('Resend status email failed:', error.message)
  }
}


export async function sendNewsletterEmail({ email, name, subject, title, message }) {
  if (!resend || !email) throw new Error('Resend email service is not configured.')
  const safeName = escapeHtml(name || 'there')
  const safeTitle = escapeHtml(title)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
  await resend.emails.send({
    from,
    to: [email],
    subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px"><p>Hi ${safeName},</p><h1>${safeTitle}</h1><p>${safeMessage}</p><hr/><p style="color:#777;font-size:12px">You are receiving this email because you subscribed to Spark Store updates.</p></div>`
  })
}
