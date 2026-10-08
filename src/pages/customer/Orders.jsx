import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle2, ArrowRight } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("spark_orders") || "[]",
    );

    if (savedOrders.length > 0) {
      setOrders(savedOrders);
    } else {
      const defaultOrders = [
        {
          id: "SPARK-23942899",
          date: "Sep 30, 2026",
          status: "Shipped",
          total: 186.53,
          itemsCount: 3,
          paymentMethod: "Cash on Delivery",
        },
        {
          id: "SPARK-10492811",
          date: "Sep 25, 2026",
          status: "Delivered",
          total: 89.0,
          itemsCount: 1,
          paymentMethod: "Credit Card",
        },
      ];
      setOrders(defaultOrders);
      localStorage.setItem("spark_orders", JSON.stringify(defaultOrders));
    }
  }, []);

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
        <span
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "#6366f1",
            letterSpacing: "0.05em",
          }}
        >
          ACCOUNT
        </span>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#0f172a",
            margin: "2px 0 0 0",
          }}
        >
          My Orders
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
          View your recent purchases and order status.
        </p>
      </div>

      {orders.length === 0 ? (
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
            <Package size={28} />
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
              No orders found
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              You haven't placed any orders yet.
            </p>
          </div>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#6366f1",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const isDelivered = order.status === "Delivered";
            return (
              <div
                key={order.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6366f1",
                      }}
                    >
                      <Package size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        {order.id}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Placed on {order.date || "Today"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background: isDelivered ? "#dcfce7" : "#fef9c3",
                        color: isDelivered ? "#166534" : "#854d0e",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {isDelivered ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Truck size={14} />
                      )}
                      {order.status}
                    </span>
                    <strong style={{ fontSize: "18px", color: "#0f172a" }}>
                      ${Number(order.total).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "1px solid #f1f5f9",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    <span>
                      Items: <strong>{order.itemsCount || 1}</strong>
                    </span>
                    <span>
                      Payment:{" "}
                      <strong>
                        {order.paymentMethod || "Cash on Delivery"}
                      </strong>
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => navigate("/tracking")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#334155",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Truck size={14} /> Track Order
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#6366f1",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Order Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
