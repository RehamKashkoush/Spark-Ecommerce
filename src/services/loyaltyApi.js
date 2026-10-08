import React from "react";
import { apiRequest } from './api'

export const getLoyalty = () => apiRequest('/loyalty')
export const getLoyaltyHistory = () => apiRequest('/loyalty/history')
export const getAdminLoyaltyUsers = () => apiRequest('/admin/loyalty/users')
export const adjustAdminLoyalty = (id, points) => apiRequest(`/admin/loyalty/users/${id}`, { method: 'PATCH', body: JSON.stringify({ points }) })
