import React from "react";
import { apiRequest } from './api'

export function createStripeCheckout(orderId) {
  return apiRequest('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ orderId })
  })
}

export function verifyStripePayment(sessionId) {
  return apiRequest(`/payments/verify-session/${encodeURIComponent(sessionId)}`)
}

export function createPayPalOrder(orderId) { return apiRequest('/payments/paypal/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }) }
export function capturePayPalOrder(paypalOrderId) { return apiRequest('/payments/paypal/capture-order', { method: 'POST', body: JSON.stringify({ paypalOrderId }) }) }
export function getWallet() { return apiRequest('/wallet') }
export function topUpWallet(amount) { return apiRequest('/wallet/top-up', { method: 'POST', body: JSON.stringify({ amount }) }) }

export function createCardSetupIntent() { return apiRequest('/payments/setup-intent', { method: 'POST' }) }
export function getSavedCards() { return apiRequest('/payments/saved-cards') }
export function deleteSavedCard(paymentMethodId) { return apiRequest(`/payments/saved-cards/${encodeURIComponent(paymentMethodId)}`, { method: 'DELETE' }) }
export function setDefaultSavedCard(paymentMethodId) { return apiRequest('/payments/saved-cards/default', { method: 'PATCH', body: JSON.stringify({ paymentMethodId }) }) }
