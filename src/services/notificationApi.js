import React from "react";
import { apiRequest } from './api'

export const getNotifications = () => apiRequest('/notifications')
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
export const markAllNotificationsRead = () => apiRequest('/notifications/read-all', { method: 'PATCH' })
export const getPushPublicKey = () => apiRequest('/notifications/push/public-key')
export const subscribeToPush = (subscription) => apiRequest('/notifications/push/subscribe', { method: 'POST', body: JSON.stringify(subscription) })
export const unsubscribeFromPush = (endpoint) => apiRequest('/notifications/push/subscribe', { method: 'DELETE', body: JSON.stringify({ endpoint }) })
