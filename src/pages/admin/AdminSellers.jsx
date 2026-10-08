import React, { useEffect, useState } from "react";
import { Search, Store, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoSellers = [
  {
    id: "SEL-201",
    storeName: "TechZone Store",
    owner: "Mohamed Ali",
    email: "techzone@spark.test",
    status: "Approved",
    productsCount: 18,
    joined: "2026-02-10",
  },
  {
    id: "SEL-202",
    storeName: "Fashion Hub",
    owner: "Nour El Din",
    email: "fashionhub@spark.test",
    status: "Pending",
    productsCount: 0,
    joined: "2026-09-01",
  },
  {
    id: "SEL-203",
    storeName: "Home Essentials",
    owner: "Ayman Khaled",
    email: "home@spark.test",
    status: "Approved",
    productsCount: 34,
    joined: "2025-12-15",
  },
  {
    id: "SEL-204",
    storeName: "Gadget Express",
    owner: "Hassan Mahmoud",
    email: "gadgets@spark.test",
    status: "Rejected",
    productsCount: 0,
    joined: "2026-08-25",
  },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(initialDemoSellers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminApi && adminApi.getAdminSellers) {
      adminApi
        .getAdminSellers()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setSellers(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (adminApi && adminApi.updateSellerStatus) {
      adminApi.updateSellerStatus(id, newStatus).catch(() => {});
    }
    setSellers(
      sellers.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
  };

  const filtered = sellers.filter((s) => {
    const matchesSearch =
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.owner.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading seller directory...
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
            SELLER MANAGEMENT
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Registered Sellers
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
            placeholder="Search by store name, owner or email..."
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

        <div style={{ display: "flex", gap: "8px" }}>
          {["All", "Approved", "Pending", "Rejected"].map((st) => (
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
              <th style={{ padding: "12px 16px" }}>STORE</th>
              <th style={{ padding: "12px 16px" }}>OWNER</th>
              <th style={{ padding: "12px 16px" }}>PRODUCTS</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px" }}>JOINED</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
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
                    <Store size={16} color="#6366f1" />
                    {s.storeName}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontSize: "13px",
                  }}
                >
                  <div>{s.owner}</div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {s.email}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  {s.productsCount} items
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background:
                        s.status === "Approved"
                          ? "#dcfce7"
                          : s.status === "Pending"
                            ? "#fef3c7"
                            : "#fee2e2",
                      color:
                        s.status === "Approved"
                          ? "#15803d"
                          : s.status === "Pending"
                            ? "#d97706"
                            : "#b91c1c",
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {s.joined}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <select
                    value={s.status}
                    onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
