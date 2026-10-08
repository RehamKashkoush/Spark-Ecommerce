import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#f8fafc",
        color: "#475569",
        padding: "48px 32px 24px 32px",
        marginTop: "auto",
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          paddingBottom: "40px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Logo />
          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#64748b",
              margin: 0,
            }}
          >
            Curated luxury and everyday elevated essentials engineered for
            timeless aesthetics and seamless cross-border retail.
          </p>
          <span
            style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600" }}
          >
            ✓ Verified Authentic Global Retailer
          </span>
        </div>

        <div>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Shop
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "13px",
            }}
          >
            <li>
              <Link
                to="/products"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/category/electronics"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                Electronics & Audio
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                Private Sale
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Client Care
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "13px",
            }}
          >
            <li>
              <Link
                to="/tracking"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                Track Package
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                style={{ color: "#475569", textDecoration: "none" }}
              >
                My Account
              </Link>
            </li>
            <li>
              <span style={{ color: "#475569", cursor: "pointer" }}>
                Sustainability
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Stay Connected
          </h4>
          <p
            style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}
          >
            Receive exclusive access to private launches.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "13px",
                outline: "none",
                flex: 1,
              }}
            />
            <button
              style={{
                padding: "8px 16px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <span>© 2026 Spark Commerce. All rights reserved.</span>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            fontWeight: "600",
          }}
        >
          <span
            style={{
              border: "1px solid #cbd5e1",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#ffffff",
              color: "#334155",
            }}
          >
            Visa
          </span>
          <span
            style={{
              border: "1px solid #cbd5e1",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#ffffff",
              color: "#334155",
            }}
          >
            Mastercard
          </span>
          <span
            style={{
              border: "1px solid #cbd5e1",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#ffffff",
              color: "#334155",
            }}
          >
            Apple Pay
          </span>
          <span
            style={{
              border: "1px solid #cbd5e1",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#ffffff",
              color: "#334155",
            }}
          >
            PayPal
          </span>
        </div>
      </div>
    </footer>
  );
}
