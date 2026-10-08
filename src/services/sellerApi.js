import React from "react";
import { apiRequest } from './api'

export const getSellerDashboard = () => apiRequest('/seller/dashboard')
export const getSellerProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/seller/products${query ? `?${query}` : ''}`)
}
export const createSellerProduct = (payload) => apiRequest('/seller/products', { method: 'POST', body: JSON.stringify(payload) })
export const updateSellerProduct = (id, payload) => apiRequest(`/seller/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
export const deleteSellerProduct = (id) => apiRequest(`/seller/products/${id}`, { method: 'DELETE' })
export const getSellerOrders = () => apiRequest('/seller/orders')
export const updateSellerOrderStatus = (id, status) => apiRequest(`/seller/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const updateOrderStatus = updateSellerOrderStatus
export const getSellerPayouts = () => apiRequest('/seller/payouts')
export const requestSellerPayout = (amount) => apiRequest('/seller/payouts', { method: 'POST', body: JSON.stringify({ amount }) })
