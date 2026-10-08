import React from "react";
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const price = product.price * (1 - (product.discountPercentage || 0) / 100)
  const wished = isWishlisted(product.id)

  return <article className="product-card">
    <div className="product-image-wrap">
      <span className="product-tag">{product.discountPercentage ? `${Math.round(product.discountPercentage)}% OFF` : product.availabilityStatus}</span>
      <button className={`icon-btn product-heart ${wished ? 'active' : ''}`} aria-label="Toggle wishlist" onClick={() => toggleWishlist(product)}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button>
      <Link to={`/products/${product.id}`}><img src={product.thumbnail || product.image} alt={product.title || product.name} className="product-image" /></Link>
    </div>
    <div className="product-info">
      <span className="eyebrow">{(product.category || '').replaceAll('-', ' ')}</span>
      <Link to={`/products/${product.id}`} className="product-name">{product.title || product.name}</Link>
      <div className="rating"><Star size={14} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)} <span>({product.reviews?.length || 0})</span></div>
      <div className="product-bottom">
        <div><strong>${price.toFixed(2)}</strong>{product.discountPercentage > 0 && <del>${product.price.toFixed(2)}</del>}</div>
        <button className="add-mini" aria-label="Add to cart" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingBag size={17} /></button>
      </div>
    </div>
  </article>
}
