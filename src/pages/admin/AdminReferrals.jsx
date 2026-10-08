import React, { useEffect, useState } from "react";
import { Share2, Users, Gift, CheckCircle2, Clock, Search } from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoReferrals = [
  {
    id: "REF-101",
    referrer: "Sarah Ahmed",
    invitedCustomer: "Nour Mahmoud",
    code: "SARAH-REF",
    status: "Completed",
    reward: "500 pts",
    date: "2026-09-18",
  },
  {
    id: "REF-102",
    referrer: "Khaled Omar",
    invitedCustomer: "Hassan Ali",
    code: "KHALED-REF",
    status: "Pending",
    reward: "500 pts",
    date: "2026-09-27",
  },
  {
    id: "REF-103",
    referrer: "Ayman Ali",
    invitedCustomer: "Youssef Ahmed",
    code: "AYMAN-REF",
    status: "Completed",
    reward: "500 pts",
    date: "2026-08-14",
  },
  {
    id: "REF-104",
    referrer: "Mona Mahmoud",
    invitedCustomer: "Dina Khaled",
    code: "MONA-REF",
    status: "Pending",
    reward: "500 pts",
    date: "2026-09-30",
  },
];

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState(initialDemoReferrals);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminApi && adminApi.getAdminReferrals) {
      adminApi
        .getAdminReferrals()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setReferrals(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(
    (r) => r.status === "Completed",
  ).length;
  const pendingReferrals = referrals.filter(
    (r) => r.status === "Pending",
  ).length;

  const filtered = referrals.filter(
    (r) =>
      r.referrer.toLowerCase().includes(search.toLowerCase()) ||
      r.invitedCustomer.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading referral management...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
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
            REFERRAL PROGRAM
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Customer Referrals
          </h1>
          <p
            style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}
          >
            A referral is completed when the invited customer reaches their
            first Delivered order. Both customers receive the configured loyalty
            reward.
          </p>
        </div>
        <div
          style={{
            background: "#e0e7ff",
            color: "#4338ca",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          500 points per success
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
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
              background: "#e0e7ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              TOTAL REFERRALS
            </span>
            <strong
              style={{ fontSize: "20px", color: "#0f172a", fontWeight: "bold" }}
            >
              {totalReferrals}
            </strong>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
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
              background: "#dcfce7",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              COMPLETED
            </span>
            <strong
              style={{ fontSize: "20px", color: "#0f172a", fontWeight: "bold" }}
            >
              {completedReferrals}
            </strong>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
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
              background: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              PENDING
            </span>
            <strong
              style={{ fontSize: "20px", color: "#0f172a", fontWeight: "bold" }}
            >
              {pendingReferrals}
            </strong>
          </div>
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
            placeholder="Search referrer, customer or code..."
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
              <th style={{ padding: "12px 16px" }}>REFERRER</th>
              <th style={{ padding: "12px 16px" }}>INVITED CUSTOMER</th>
              <th style={{ padding: "12px 16px" }}>REFERRAL CODE</th>
              <th style={{ padding: "12px 16px" }}>REWARD</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "13px",
                  }}
                >
                  {r.referrer}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#334155",
                    fontSize: "13px",
                  }}
                >
                  {r.invitedCustomer}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "bold",
                    color: "#4f46e5",
                    fontSize: "12px",
                  }}
                >
                  {r.code}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#16a34a",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Gift size={14} /> {r.reward}
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background:
                        r.status === "Completed" ? "#dcfce7" : "#fef3c7",
                      color: r.status === "Completed" ? "#15803d" : "#d97706",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  {r.date}
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
                  No referral records found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
