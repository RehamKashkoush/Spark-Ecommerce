import React from "react";
import { apiRequest } from './api'

export const getProfile = () => apiRequest('/profile')
export const updateProfile = (payload) => apiRequest('/profile', { method: 'PATCH', body: JSON.stringify(payload) })
export const addAddress = (payload) => apiRequest('/profile/addresses', { method: 'POST', body: JSON.stringify(payload) })
export const updateAddress = (id, payload) => apiRequest(`/profile/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
export const deleteAddress = (id) => apiRequest(`/profile/addresses/${id}`, { method: 'DELETE' })
export const updatePaymentDetails = (payload) => apiRequest('/profile/payment-details', { method: 'PATCH', body: JSON.stringify(payload) })
