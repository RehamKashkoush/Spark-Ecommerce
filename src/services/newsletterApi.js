import React from "react";
import { apiRequest } from './api'

export const subscribeNewsletter = (payload) => apiRequest('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(payload) })
export const unsubscribeNewsletter = (email = '') => apiRequest('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) })
export const getNewsletterStatus = () => apiRequest('/newsletter/status')
