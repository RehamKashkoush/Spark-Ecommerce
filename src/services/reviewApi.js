import React from "react";
import { apiRequest } from './api'

export function getProductReviews(id) {
  return apiRequest(`/products/${id}/reviews`)
}

export function getReviewEligibility(id) {
  return apiRequest(`/products/${id}/review-eligibility`)
}

export function submitProductReview(id, payload) {
  return apiRequest(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(payload) })
}
