import React, { useEffect, useState } from "react";
import {
  Award,
  Search,
  Plus,
  Minus,
  Info,
  Users,
  ShieldCheck,
} from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoLoyalty = [
  {
    id: "CUST-101",
    name: "Sarah Ahmed",
    email: "sarah@example.com",
    availablePoints: 450,
    lifetimePoints: 1200,
  },
  {
    id: "CUST-102",
    name: "Khaled Omar",
    email: "khaled@example.com",
    availablePoints: 120,
    lifetimePoints: 350,
  },
  {
    id: "CUST-103",
    name: "Ayman Ali",
    email: "ayman@example.com",
    availablePoints: 890,
    lifetimePoints: 2100,
  },
  {
    id: "CUST-104",
    name: "Mona Mahmoud",
    email: "mona@example.com",
    availablePoints: 50,
    lifetimePoints: 150,
  },
];

export default function AdminLoyalty() {
  const [customers, setCustomers] = useState(initialDemoLoyalty);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminApi && adminApi.getAdminLoyalty) {
      adminApi
        .getAdminLoyalty()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setCustomers(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAdjustPoints = (id, amount) => {
    setCustomers(
      customers.map((c) => {
        if (c.id === id) {
          const updatedAvail = Math.max(0, c.availablePoints + amount);
          const updatedLife =
            amount > 0 ? c.lifetimePoints + amount : c.lifetimePoints;
          return {
            ...c,
            availablePoints: updatedAvail,
            lifetimePoints: updatedLife,
          };
        }
        return c;
      }),
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading loyalty & rewards program...
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
            LOYALTY PROGRAM
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Customer Rewards
          </h1>
          <p
            style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}
          >
            Manage customer reward balances. Customers earn 1 point per $1 on
            delivered orders and each point is worth $0.01 at checkout.
          </p>
        </div>
        <div
          style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Users size={14} /> {customers.length} Customers Enrolled
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
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", minWidth: "280px" }}>
          <input
            type="text"
            placeholder="Search customer name or email..."
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
              <th style={{ padding: "12px 16px" }}>CUSTOMER</th>
              <th style={{ padding: "12px 16px" }}>AVAILABLE POINTS</th>
              <th style={{ padding: "12px 16px" }}>LIFETIME POINTS</th>
              <th style={{ padding: "12px 16px" }}>VALUE IN USD</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ADJUST POINTS
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#0f172a",
                      fontSize: "14px",
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {c.email}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "bold",
                    color: "#4f46e5",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Award size={16} />
                    {c.availablePoints} pts
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "500",
                    fontSize: "13px",
                  }}
                >
                  {c.lifetimePoints} pts
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#16a34a",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  ${(c.availablePoints * 0.01).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyCenter: "flex-end",
                      gap: "6px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(c.id, 50)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                      title="Add 50 points"
                    >
                      <Plus size={14} /> 50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustPoints(c.id, -50)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#fef2f2",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                      title="Deduct 50 points"
                    >
                      <Minus size={14} /> 50
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No customers found matching search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <ShieldCheck size={20} color="#6366f1" />
        <div>
          <strong
            style={{ fontSize: "13px", color: "#0f172a", display: "block" }}
          >
            Rewards are calculated server-side
          </strong>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            The checkout sends the requested points, while the backend validates
            the available balance and redemption limit before creating the
            order.
          </span>
        </div>
      </div>
    </div>
  );
}
