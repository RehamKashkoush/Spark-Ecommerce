import React, { useState } from "react";
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  Download,
  Plus,
  Tag,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [notification, setNotification] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        position: "relative",
      }}
    >
      {notification && (
        <div
          style={{
            background: "#0f172a",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "bold",
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
          }}
        >
          ✓ {notification}
        </div>
      )}

      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "4px",
            }}
          >
            <span>EXECUTIVE TERMINAL</span>
            <span>•</span>
            <span style={{ color: "#4f46e5", fontWeight: "bold" }}>
              Realtime Data Synchronization
            </span>
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              margin: 0,
              color: "#0f172a",
            }}
          >
            Performance & Fleet Operations
          </h1>
          <p
            style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}
          >
            Global storefront revenue, operational velocity, and merchant
            ecosystem activity.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              showNotification("Promo code creation modal opened.")
            }
            style={{
              padding: "8px 14px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Tag size={14} /> Create Promo
          </button>
          <button
            onClick={() => showNotification("Category added successfully.")}
            style={{
              padding: "8px 14px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={14} /> Add Category
          </button>
          <button
            onClick={() => showNotification("Vendor moderation panel opened.")}
            style={{
              padding: "8px 14px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Shield size={14} /> Moderate Vendors
          </button>
          <button
            onClick={() => showNotification("Executive report exported.")}
            style={{
              padding: "8px 16px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.25s ease",
            transform: hoveredCard === 1 ? "translateY(-4px)" : "translateY(0)",
            boxShadow:
              hoveredCard === 1
                ? "0 10px 20px -5px rgba(0,0,0,0.08)"
                : "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}
            >
              GROSS PLATFORM VOLUME
            </span>
            <TrendingUp size={16} color="#166534" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            $128,450{" "}
            <span style={{ fontSize: "12px", color: "#64748b" }}>USD</span>
          </strong>
          <span style={{ fontSize: "12px", color: "#166534" }}>
            ↑ +18.4% vs. prev. 30 days •+$19,980.40
          </span>
        </div>

        <div
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.25s ease",
            transform: hoveredCard === 2 ? "translateY(-4px)" : "translateY(0)",
            boxShadow:
              hoveredCard === 2
                ? "0 10px 20px -5px rgba(0,0,0,0.08)"
                : "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}
            >
              ACTIVE FULFILLMENT PIPELINE
            </span>
            <Package size={16} color="#4f46e5" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            1,420{" "}
            <span style={{ fontSize: "12px", color: "#64748b" }}>orders</span>
          </strong>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            <span>824 Packing</span>
            <span>454 Dispatched</span>
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>
              142 Attention
            </span>
          </div>
        </div>

        <div
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.25s ease",
            transform: hoveredCard === 3 ? "translateY(-4px)" : "translateY(0)",
            boxShadow:
              hoveredCard === 3
                ? "0 10px 20px -5px rgba(0,0,0,0.08)"
                : "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}
            >
              REGISTERED ECOSYSTEM
            </span>
            <Users size={16} color="#4f46e5" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            18,920{" "}
            <span style={{ fontSize: "12px", color: "#64748b" }}>accounts</span>
          </strong>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            <span>17.4k Cust.</span>
            <span>1,420 Vendors</span>
            <span>38 Admin</span>
          </div>
        </div>

        <div
          onMouseEnter={() => setHoveredCard(4)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.25s ease",
            transform: hoveredCard === 4 ? "translateY(-4px)" : "translateY(0)",
            boxShadow:
              hoveredCard === 4
                ? "0 10px 20px -5px rgba(0,0,0,0.08)"
                : "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}
            >
              LOW STOCK INVENTORY
            </span>
            <AlertTriangle size={16} color="#ef4444" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#ef4444" }}
          >
            14{" "}
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              SKUs below reserve
            </span>
          </strong>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Aura Silk Robe (M) • 2 units left
          </span>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
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
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Revenue Velocity & Throughput
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Hourly transactions recorded across localized multi-currency
                checkouts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                background: "#f8fafc",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  padding: "4px 10px",
                  background: "#ffffff",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                7 Days
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                30 Days
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Quarterly
              </span>
            </div>
          </div>

          <div
            style={{
              height: "180px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "12px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            {[45, 50, 48, 70, 72, 60, 85].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: "#4f46e5",
                  borderRadius: "6px",
                  transition: "height 0.3s",
                }}
              ></div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <span>Mon • Tue • Wed • Thu • Fri • Sat • Sun</span>
            <span>Average Daily Run-rate: $18,350</span>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Category Mix
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              High-margin luxury goods breakdown
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#475569" }}>
                • Haute Couture & Apparel
              </span>
              <strong>$53.9k (42%)</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#475569" }}>• Fine Horology & Gems</span>
              <strong>$39.8k (31%)</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#475569" }}>• Leathergoods & Shoes</span>
              <strong>$34.7k (27%)</strong>
            </div>
          </div>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
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
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Live Orders & Dispatch Desk
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Prioritize shipments awaiting warehouse verification and export
                manifests.
              </span>
            </div>
            <button
              style={{
                padding: "6px 12px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              All Statuses ▾
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    color: "#64748b",
                    fontSize: "11px",
                  }}
                >
                  <th style={{ padding: "10px 12px" }}>ORDER ID</th>
                  <th style={{ padding: "10px 12px" }}>CUSTOMER</th>
                  <th style={{ padding: "10px 12px" }}>ITEMS</th>
                  <th style={{ padding: "10px 12px" }}>TOTAL</th>
                  <th style={{ padding: "10px 12px" }}>PAYMENT</th>
                  <th style={{ padding: "10px 12px" }}>FULFILLMENT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#SPK-89241",
                    cust: "Elena Rostova",
                    items: "3 items",
                    total: "$1,840.00",
                    pay: "Paid",
                    status: "Ready to Dispatch",
                  },
                  {
                    id: "#SPK-89240",
                    cust: "Tariq Al-Mansoor",
                    items: "1 item",
                    total: "$4,250.00",
                    pay: "Paid",
                    status: "In Customs",
                  },
                  {
                    id: "#SPK-89239",
                    cust: "Claire Laurent",
                    items: "5 items",
                    total: "$790.00",
                    pay: "Pending",
                    status: "Awaiting Auth",
                  },
                  {
                    id: "#SPK-89238",
                    cust: "Marcus Vance",
                    items: "2 items",
                    total: "$2,190.00",
                    pay: "Refunded",
                    status: "Cancelled",
                  },
                  {
                    id: "#SPK-89237",
                    cust: "Sophia Lin",
                    items: "4 items",
                    total: "$3,150.00",
                    pay: "Paid",
                    status: "Dispatched",
                  },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontWeight: "bold",
                        color: "#0f172a",
                      }}
                    >
                      {row.id}
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      {row.cust}
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      {row.items}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontWeight: "bold",
                        color: "#0f172a",
                      }}
                    >
                      {row.total}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background:
                            row.pay === "Paid"
                              ? "#dcfce7"
                              : row.pay === "Pending"
                                ? "#fef9c3"
                                : "#fee2e2",
                          color:
                            row.pay === "Paid"
                              ? "#166534"
                              : row.pay === "Pending"
                                ? "#854d0e"
                                : "#991b1b",
                        }}
                      >
                        {row.pay}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#4f46e5",
                      }}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Live Audit Log
            </h3>
            <span
              style={{
                fontSize: "11px",
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View All Logs
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingBottom: "10px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#0f172a" }}>Maison de L'Ombre</strong>
                <span style={{ color: "#64748b" }}>4m ago</span>
              </div>
              <span style={{ color: "#475569" }}>
                Submitted vendor onboarding tier. Luxury Leathercraft. Requires
                KYC approval.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingBottom: "10px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#0f172a" }}>Role Modification</strong>
                <span style={{ color: "#64748b" }}>28m ago</span>
              </div>
              <span style={{ color: "#475569" }}>
                Admin Alex Mercer elevated user Sarah K. to Store Manager.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingBottom: "10px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#0f172a" }}>
                  Promo Surge: VIPSUMMER
                </strong>
                <span style={{ color: "#64748b" }}>1h ago</span>
              </div>
              <span style={{ color: "#475569" }}>
                Redeemed 250 times in 45 minutes. Limit threshold reached at 92%
                capacity.
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#ef4444" }}>
                  Stock Critical Event
                </strong>
                <span style={{ color: "#64748b" }}>2h ago</span>
              </div>
              <span style={{ color: "#475569" }}>
                Automatic low inventory restock ticket generated for Geneva
                Warehouse Hub.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
