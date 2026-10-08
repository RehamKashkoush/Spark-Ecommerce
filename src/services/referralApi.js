import React from "react";
import { apiRequest } from './api'

export const getReferrals = () => apiRequest('/referrals')
export const ensureReferralCode = () => apiRequest('/referrals/ensure-code', { method: 'POST' })
export const getAdminReferrals = () => apiRequest('/admin/referrals')
