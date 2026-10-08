import React from "react";
import { apiRequest } from './api'

export function getProducts({ page = 1, limit = 24, search = '', category = '', minPrice = '', maxPrice = '', sortBy = 'createdAt', order = 'desc' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), sortBy, order })
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (minPrice !== '') params.set('minPrice', String(minPrice))
  if (maxPrice !== '') params.set('maxPrice', String(maxPrice))
  return apiRequest(`/products?${params.toString()}`)
}

export function searchProducts(query) {
  return getProducts({ search: query })
}

export function getProductsByCategory(category) {
  return getProducts({ category })
}

export function getProduct(id) {
  return apiRequest(`/products/${id}`)
}

export function getCategories() {
  return apiRequest('/products/categories')
}
