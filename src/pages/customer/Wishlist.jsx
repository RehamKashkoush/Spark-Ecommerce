import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Wishlist() {
  const store = useStore() || {};
  const addToCart = store.addToCart || store.cart?.addToCart;

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    
    const savedWishlist = JSON.parse(
      localStorage.getItem("spark_wishlist") || "[]",
    );
    setWishlistItems(savedWishlist);
  }, []);

  const handleRemove = (productId) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem("spark_wishlist", JSON.stringify(updated));
  };

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minHeight: "80vh",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Wishlist
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
          Keep products you love close for later.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "64px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
            }}
          >
            <Heart size={28} />
          </div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              Your wishlist is empty
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Save products while browsing and find them here.
            </p>
          </div>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              color: "#4f46e5",
              border: "1px solid #cbd5e1",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <button
                onClick={() => handleRemove(product.id)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  zIndex: 2,
                  color: "#ef4444",
                }}
              >
                <Trash2 size={16} />
              </button>

              <Link
                to={`/products/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    height: "200px",
                    background: "#f8fafc",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={
                      product.thumbnail ||
                      (product.images && product.images[0]) ||
                      ""
                    }
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                      height: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <strong style={{ fontSize: "18px", color: "#4f46e5" }}>
                      ${Number(product.price).toFixed(2)}
                    </strong>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (addToCart) addToCart(product);
                      }}
                      style={{
                        padding: "8px 12px",
                        background: "#6366f1",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
