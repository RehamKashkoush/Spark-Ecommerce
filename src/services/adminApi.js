import React from "react";
import { apiRequest } from './api'

export const getAdminDashboard = () => apiRequest('/admin/dashboard')
export const getAdminUsers = () => apiRequest('/admin/users')
export const updateUserStatus = (id, status) => apiRequest(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const softDeleteUser = (id) => apiRequest(`/admin/users/${id}/soft-delete`, { method: 'PATCH' })
export const restoreUser = (id) => apiRequest(`/admin/users/${id}/restore`, { method: 'PATCH' })
export const getAdminSellers = () => apiRequest('/admin/sellers')
export const reviewSeller = (id, status) => apiRequest(`/admin/sellers/${id}/review`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const updateSellerStatus = reviewSeller
export const getAdminProducts = (params = '') => apiRequest(`/admin/products${params ? `?${params}` : ''}`)
export const updateProductStatus = (id, isActive) => apiRequest(`/admin/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) })
export const deleteProduct = (id) => apiRequest(`/admin/products/${id}`, { method: 'DELETE' })
export const getAdminCategories = () => apiRequest('/admin/categories')
export const updateProductCategory = (id, category) => apiRequest(`/admin/products/${id}/category`, { method: 'PATCH', body: JSON.stringify({ category }) })
export const getAdminCoupons = () => apiRequest('/admin/coupons')
export const createCoupon = (payload) => apiRequest('/admin/coupons', { method: 'POST', body: JSON.stringify(payload) })
export const updateCouponStatus = (id, isActive) => apiRequest(`/admin/coupons/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) })
export const deleteCoupon = (id) => apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' })
export const getAdminBanners = () => apiRequest('/admin/banners')
export const createBanner = (payload) => apiRequest('/admin/banners', { method: 'POST', body: JSON.stringify(payload) })
export const updateBannerStatus = (id, isActive) => apiRequest(`/admin/banners/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) })
export const deleteBanner = (id) => apiRequest(`/admin/banners/${id}`, { method: 'DELETE' })
export const getAdminContent = getAdminBanners
export const deleteContent = deleteBanner
export const updateAdminOrderStatus = (id, status) => apiRequest(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const updateOrderStatus = updateAdminOrderStatus
export const getAdminOrders = () => apiRequest('/admin/orders')
export const getNewsletterSubscribers = () => apiRequest('/admin/newsletter/subscribers')
export const getNewsletterCampaigns = () => apiRequest('/admin/newsletter/campaigns')
export const sendNewsletterCampaign = (payload) => apiRequest('/admin/newsletter/send', { method: 'POST', body: JSON.stringify(payload) })
export const getAdminLoyalty = () => apiRequest('/admin/loyalty')
export const getAdminReferrals = () => apiRequest('/admin/referrals')
