import React, { useEffect, useState } from "react";
import { Search, ShoppingBag, Eye, User, Calendar } from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoOrders = [
  {
    id: "ORD-501",
    customer: "Ahmed Hassan",
    seller: "TechZone Store",
    total: 199.99,
    status: "Confirmed",
    date: "2026-09-28",
    items: 2,
  },
  {
    id: "ORD-502",
    customer: "Mona Ali",
    seller: "Fashion Hub",
    total: 89.5,
    status: "Processing",
    date: "2026-09-29",
    items: 1,
  },
  {
    id: "ORD-503",
    customer: "Omar Khaled",
    seller: "Home Essentials",
    total: 310.0,
    status: "Shipped",
    date: "2026-09-25",
    items: 4,
  },
  {
    id: "ORD-504",
    customer: "Sara Ibrahim",
    seller: "TechZone Store",
    total: 450.0,
    status: "Delivered",
    date: "2026-09-20",
    items: 3,
  },
  {
    id: "ORD-505",
    customer: "Khaled Mahmoud",
    seller: "Gadget Express",
    total: 120.0,
    status: "Cancelled",
    date: "2026-09-15",
    items: 1,
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialDemoOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminApi && adminApi.getAdminOrders) {
      adminApi
        .getAdminOrders()
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
    if (adminApi && adminApi.updateOrderStatus) {
      adminApi.updateOrderStatus(id, newStatus).catch(() => {});
    }
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading orders queue...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            ORDER FULFILLMENT
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Platform Orders
          </h1>
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search by Order ID, customer or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px 8px 34px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              width: "100%",
              outline: "none",
            }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            "All",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                border: "1px solid #e2e8f0",
                background: statusFilter === st ? "#6366f1" : "#ffffff",
                color: statusFilter === st ? "#ffffff" : "#475569",
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
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
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>ORDER ID</th>
              <th style={{ padding: "12px 16px" }}>CUSTOMER</th>
              <th style={{ padding: "12px 16px" }}>SELLER</th>
              <th style={{ padding: "12px 16px" }}>TOTAL</th>
              <th style={{ padding: "12px 16px" }}>DATE</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                UPDATE STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ShoppingBag size={16} color="#6366f1" />
                    {o.id}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#334155",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  {o.customer}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {o.seller}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  ${Number(o.total).toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {o.date}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background:
                        o.status === "Delivered"
                          ? "#dcfce7"
                          : o.status === "Cancelled"
                            ? "#fee2e2"
                            : "#fef3c7",
                      color:
                        o.status === "Delivered"
                          ? "#15803d"
                          : o.status === "Cancelled"
                            ? "#b91c1c"
                            : "#d97706",
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
