import React from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export default function Cart() {
  const {
    cart,
    subtotal,
    shipping,
    cartCount,
    updateQuantity,
    removeFromCart,
  } = useStore();
  const total = subtotal + shipping;

  if (!cart.length)
    return (
      <section className="section">
        <div className="container empty-cart">
          <ShoppingBag size={42} />
          <span className="eyebrow">YOUR BAG</span>
          <h1>Your cart is empty</h1>
          <p>Add products from the live catalog and they will appear here.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </section>
    );

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR BAG</span>
            <h1>Shopping Cart</h1>
            <p>
              {cartCount} item{cartCount !== 1 ? "s" : ""} ready for checkout.
            </p>
          </div>
        </div>
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map(({ product, quantity }) => {
              const price =
                product.price * (1 - (product.discountPercentage || 0) / 100);
              return (
                <div className="cart-item" key={product.id}>
                  <img src={product.thumbnail} alt={product.title} />
                  <div className="cart-item-main">
                    <span className="eyebrow">
                      {product.category.replaceAll("-", " ")}
                    </span>
                    <h3>{product.title}</h3>
                    <div className="cart-item-bottom">
                      <strong>${price.toFixed(2)}</strong>
                      <div className="quantity">
                        <button
                          disabled={quantity <= 1}
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          disabled={quantity >= product.stock}
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="delete-btn"
                        title="Remove item"
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ef4444";
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#94a3b8";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="summary-card">
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </strong>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="btn btn-primary full">
              Proceed to Checkout
            </Link>
            <p className="secure-note">
              Guest checkout available · Secure payment
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
