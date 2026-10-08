import React from "react";
import { apiRequest } from './api'

export function createOrder(payload) {
  return apiRequest('/orders', { method: 'POST', body: JSON.stringify(payload) })
}

export function getMyOrders() {
  return apiRequest('/orders/my')
}

export function getMyOrder(id) {
  return apiRequest(`/orders/${id}`)
}

export function updateCourierLocation(id, payload) {
  return apiRequest(`/seller/orders/${id}/tracking`, { method: 'PATCH', body: JSON.stringify(payload) })
}
