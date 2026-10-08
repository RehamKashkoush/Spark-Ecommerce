import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Package,
  Truck,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

const demoOrderDetails = {
  id: "SPK-23942899",
  date: "Sep 30, 2026",
  status: "Shipped",
  paymentMethod: "Cash on Delivery",
  paymentStatus: "Pending",
  shippingAddress: "15 El-Gesh Street, Tanta, Egypt",
  customerName: "Ahmed Hassan",
  customerEmail: "ahmed.hassan@example.com",
  subtotal: 175.0,
  shippingFee: 11.53,
  total: 186.53,
  items: [
    {
      id: "PROD-1",
      name: "Wireless Noise-Canceling Headphones",
      price: 99.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
    },
    {
      id: "PROD-2",
      name: "Ergonomic Precision Wireless Mouse",
      price: 37.51,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150",
    },
  ],
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const savedOrders = localStorage.getItem("spark_user_orders");
    let found = null;

    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        found = parsed.find((o) => o.id === id || o.id === `SPK-${id}`);
      } catch (e) {}
    }

    if (found) {
      setOrder(found);
    } else {
      
      setOrder({
        ...demoOrderDetails,
        id: id ? id.toUpperCase() : demoOrderDetails.id,
      });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "0 16px",
          color: "#64748b",
        }}
      >
        Loading order details...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "32px auto",
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      
      <div>
        <Link
          to="/orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#6366f1",
            textDecoration: "none",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#6366f1",
                letterSpacing: "0.05em",
              }}
            >
              ORDER DETAILS
            </span>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "4px 0 0 0",
              }}
            >
              {order.id}
            </h1>
          </div>
          <Link
            to="/tracking"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Truck size={16} /> Track Shipment
          </Link>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div>
          <span
            style={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}
          >
            ORDER DATE
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0f172a",
              marginTop: "4px",
            }}
          >
            {order.date}
          </div>
        </div>
        <div>
          <span
            style={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}
          >
            STATUS
          </span>
          <div style={{ marginTop: "4px" }}>
            <span
              style={{
                background: "#fef3c7",
                color: "#d97706",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {order.status}
            </span>
          </div>
        </div>
        <div>
          <span
            style={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}
          >
            PAYMENT METHOD
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#334155",
              marginTop: "4px",
            }}
          >
            {order.paymentMethod}
          </div>
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0f172a",
            margin: "0 0 16px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Package size={18} color="#6366f1" /> Purchased Items (
          {order.items?.length || 0})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {order.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    background: "#f1f5f9",
                  }}
                />
                <div>
                  <strong
                    style={{
                      fontSize: "14px",
                      color: "#0f172a",
                      display: "block",
                    }}
                  >
                    {item.name}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                ${(item.quantity * item.price).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MapPin size={16} color="#6366f1" /> Shipping Address
          </h4>
          <strong
            style={{ fontSize: "13px", color: "#334155", display: "block" }}
          >
            {order.customerName}
          </strong>
          <p
            style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}
          >
            {order.shippingAddress}
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "0 0 12px 0",
            }}
          >
            Payment Summary
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#64748b",
              }}
            >
              <span>Subtotal</span>
              <span>${Number(order.subtotal || 175).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#64748b",
              }}
            >
              <span>Shipping Fee</span>
              <span>${Number(order.shippingFee || 11.53).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#0f172a",
                fontWeight: "bold",
                fontSize: "15px",
                paddingTop: "8px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <span>Total Amount</span>
              <span style={{ color: "#4f46e5" }}>
                ${Number(order.total || 186.53).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
