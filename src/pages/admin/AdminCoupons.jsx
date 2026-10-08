import React, { useEffect, useState } from "react";
import {
  Search,
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  Percent,
  DollarSign,
} from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoCoupons = [
  {
    id: "CPN-101",
    code: "WELCOME20",
    discount: "20%",
    type: "Percentage",
    usageLimit: 500,
    usedCount: 142,
    status: "Active",
    expiry: "2026-12-31",
  },
  {
    id: "CPN-102",
    code: "FLASH50",
    discount: "$50.00",
    type: "Fixed Amount",
    usageLimit: 100,
    usedCount: 100,
    status: "Expired",
    expiry: "2026-08-31",
  },
  {
    id: "CPN-103",
    code: "SPARK10",
    discount: "10%",
    type: "Percentage",
    usageLimit: 1000,
    usedCount: 45,
    status: "Active",
    expiry: "2026-11-15",
  },
];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(initialDemoCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    usageLimit: 100,
    expiry: "2026-12-31",
  });

  useEffect(() => {
    if (adminApi && adminApi.getAdminCoupons) {
      adminApi
        .getAdminCoupons()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setCoupons(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;

    const created = {
      id: `CPN-${Math.floor(100 + Math.random() * 900)}`,
      code: newCoupon.code.toUpperCase(),
      discount:
        newCoupon.type === "Percentage"
          ? `${newCoupon.discount}%`
          : `$${newCoupon.discount}`,
      type: newCoupon.type,
      usageLimit: Number(newCoupon.usageLimit) || 100,
      usedCount: 0,
      status: "Active",
      expiry: newCoupon.expiry,
    };

    setCoupons([created, ...coupons]);
    setShowAddModal(false);
    setNewCoupon({
      code: "",
      discount: "",
      type: "Percentage",
      usageLimit: 100,
      expiry: "2026-12-31",
    });
  };

  const handleDelete = (id) => {
    if (adminApi && adminApi.deleteCoupon) {
      adminApi.deleteCoupon(id).catch(() => {});
    }
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  const filtered = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading promotional coupons...
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
            MARKETING & PROMOTIONS
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Platform Coupons
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "#6366f1",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Create Coupon
        </button>
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
            placeholder="Search coupon code..."
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
          {["All", "Active", "Expired"].map((st) => (
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
              <th style={{ padding: "12px 16px" }}>CODE</th>
              <th style={{ padding: "12px 16px" }}>DISCOUNT</th>
              <th style={{ padding: "12px 16px" }}>TYPE</th>
              <th style={{ padding: "12px 16px" }}>USAGE</th>
              <th style={{ padding: "12px 16px" }}>EXPIRY</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "bold",
                    color: "#4f46e5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Ticket size={16} />
                    {c.code}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  {c.discount}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {c.type}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#334155",
                    fontSize: "13px",
                  }}
                >
                  {c.usedCount} / {c.usageLimit}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {c.expiry}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background: c.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: c.status === "Active" ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
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
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                color: "#0f172a",
              }}
            >
              Create Coupon
            </h3>
            <form
              onSubmit={handleCreateCoupon}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER2026"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Discount Value
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={newCoupon.discount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discount: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, usageLimit: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#6366f1",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
