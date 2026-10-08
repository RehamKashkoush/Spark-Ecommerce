import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  Truck,
  ArrowRight,
  PackageCheck,
} from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams();
  const orderId = id
    ? `SPK-${id.substring(0, 8).toUpperCase()}`
    : "SPK-23942899";

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "40px auto",
        padding: "0 16px",
        textAlign: "center",
      }}
    >
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#dcfce7",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle2 size={36} />
        </div>
      </div>

      <span
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "#6366f1",
          letterSpacing: "0.05em",
        }}
      >
        ORDER CONFIRMED
      </span>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#0f172a",
          margin: "4px 0 8px 0",
        }}
      >
        Thank you for your order!
      </h1>
      <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 28px 0" }}>
        Your order <strong style={{ color: "#334155" }}>{orderId}</strong> has
        been placed successfully and is being processed.
      </p>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginBottom: "32px",
        }}
      >
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{ padding: "20px 16px", borderRight: "1px solid #f1f5f9" }}
          >
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              TOTAL
            </span>
            <strong
              style={{
                fontSize: "18px",
                color: "#0f172a",
                marginTop: "4px",
                display: "block",
              }}
            >
              $186.53
            </strong>
          </div>

          <div
            style={{ padding: "20px 16px", borderRight: "1px solid #f1f5f9" }}
          >
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              PAYMENT
            </span>
            <strong
              style={{
                fontSize: "14px",
                color: "#334155",
                marginTop: "6px",
                display: "block",
              }}
            >
              Cash on Delivery
            </strong>
          </div>

          <div style={{ padding: "20px 16px" }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              PAYMENT STATUS
            </span>
            <span
              style={{
                display: "inline-block",
                background: "#fef3c7",
                color: "#d97706",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop: "6px",
              }}
            >
              Pending
            </span>
          </div>
        </div>

        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            background: "#f8fafc",
          }}
        >
          <div
            style={{ padding: "20px 16px", borderRight: "1px solid #f1f5f9" }}
          >
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              ITEMS
            </span>
            <strong
              style={{
                fontSize: "18px",
                color: "#0f172a",
                marginTop: "4px",
                display: "block",
              }}
            >
              3 Products
            </strong>
          </div>

          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                }}
              >
                ESTIMATED DELIVERY
              </span>
              <strong style={{ fontSize: "14px", color: "#16a34a" }}>
                3 - 5 Business Days
              </strong>
            </div>
            <Truck size={24} color="#6366f1" />
          </div>
        </div>
      </div>

      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/products"
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#334155",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Continue Shopping
        </Link>

        <Link
          to="/tracking"
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "none",
            background: "#4f46e5",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Truck size={16} /> Track Order
        </Link>

        <Link
          to="/orders"
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "none",
            background: "#6366f1",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <PackageCheck size={16} /> View My Orders
        </Link>
      </div>
    </div>
  );
}
