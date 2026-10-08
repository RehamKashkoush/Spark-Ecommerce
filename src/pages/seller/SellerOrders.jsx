import React, { useEffect, useState } from "react";
import * as sellerApi from "../../services/sellerApi";

const demoOrders = [
  {
    id: "ORD-1001",
    customer: "Ahmed Hassan",
    items: "2 items",
    total: 174.99,
    status: "Confirmed",
    courier: "Aramex",
  },
  {
    id: "ORD-1002",
    customer: "Mona Ali",
    items: "1 item",
    total: 89.5,
    status: "Processing",
    courier: "Bosta",
  },
  {
    id: "ORD-1003",
    customer: "Omar Khaled",
    items: "3 items",
    total: 310.0,
    status: "Shipped",
    courier: "FedEx",
  },
];

export default function SellerOrders() {
  const [orders, setOrders] = useState(demoOrders);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerApi.getSellerOrders) {
      sellerApi
        .getSellerOrders()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setOrders(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (sellerApi.updateOrderStatus) {
      sellerApi.updateOrderStatus(id, newStatus).catch(() => {});
    }
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return <div className="loading-card">Loading orders...</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FULFILLMENT</span>
          <h1>Order processing queue</h1>
        </div>
      </div>

      <div
        className="form-card"
        style={{ marginBottom: "20px", padding: "12px" }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["All", "Confirmed", "Processing", "Shipped", "Delivered"].map(
            (status) => (
              <button
                key={status}
                type="button"
                className={`btn ${filter === status ? "btn-primary" : "btn-light"}`}
                onClick={() => setFilter(status)}
                style={{ padding: "6px 14px", fontSize: "13px" }}
              >
                {status} (
                {status === "All"
                  ? orders.length
                  : orders.filter((o) => o.status === status).length}
                )
              </button>
            ),
          )}
        </div>
      </div>

      <div className="form-card" style={{ padding: "0", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>ORDER</th>
              <th style={{ padding: "12px 16px" }}>CUSTOMER</th>
              <th style={{ padding: "12px 16px" }}>ITEMS</th>
              <th style={{ padding: "12px 16px" }}>TOTAL</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px" }}>UPDATE</th>
              <th style={{ padding: "12px 16px" }}>COURIER</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  {order.id}
                </td>
                <td style={{ padding: "14px 16px" }}>{order.customer}</td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {order.items}
                </td>
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  ${Number(order.total).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    className={`status-pill ${order.status === "Delivered" ? "success" : "warning"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {order.courier}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No orders match this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
