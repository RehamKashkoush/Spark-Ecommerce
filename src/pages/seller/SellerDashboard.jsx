import React, { useState } from "react";
import {
  DollarSign,
  Clock,
  Package,
  Star,
  Download,
  RefreshCw,
  Plus,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function SellerDashboard() {
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
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"
              alt="Store"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Valence Labs Audio
              </h2>
              <span
                style={{
                  fontSize: "11px",
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Verified Merchant
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Merchant ID: VLR-GLOBAL-8812 • Tier: Tier-1 Platinum Seller
            </span>
          </div>
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
              showNotification("Tax report generated successfully.")
            }
            style={{
              padding: "8px 14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <Download size={14} /> Export Tax Report
          </button>
          <button
            onClick={() => showNotification("Feeds synchronized successfully.")}
            style={{
              padding: "8px 14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <RefreshCw size={14} /> Sync Feeds
          </button>
          <button
            onClick={() => showNotification("Product creation modal opened.")}
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
              transition: "all 0.2s",
            }}
          >
            <Plus size={14} /> Add New Product
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
            gap: "12px",
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
              TOTAL NET EARNINGS
            </span>
            <DollarSign size={16} color="#4f46e5" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            $34,820
          </strong>
          <span style={{ fontSize: "12px", color: "#166534" }}>
            ↑ +14.8% Available for immediate withdrawal
          </span>
          <button
            onClick={() => showNotification("Payout requested successfully.")}
            style={{
              marginTop: "auto",
              padding: "8px",
              background: "#eef2ff",
              color: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Request Payout
          </button>
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
            gap: "12px",
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
              PENDING CLEARANCE
            </span>
            <Clock size={16} color="#f59e0b" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            $4,150
          </strong>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Held in 14-day escrow buffer
          </span>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <span>Release cycle (72h)</span>
              <span style={{ fontWeight: "bold" }}>68% released</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "#e2e8f0",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{ width: "68%", height: "100%", background: "#4f46e5" }}
              ></div>
            </div>
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
            gap: "12px",
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
              TOTAL SOLD UNITS
            </span>
            <Package size={16} color="#4f46e5" />
          </div>
          <strong
            style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
          >
            842
          </strong>
          <span style={{ fontSize: "12px", color: "#166534" }}>
            ↑ 94 units ahead of target
          </span>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
              height: "30px",
            }}
          >
            {[40, 60, 50, 70, 85, 90, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: "#4f46e5",
                  borderRadius: "2px",
                }}
              ></div>
            ))}
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
            gap: "12px",
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
              STORE REPUTATION
            </span>
            <Star size={16} color="#eab308" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <strong
              style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}
            >
              4.9
            </strong>
            <span style={{ fontSize: "12px", color: "#eab308" }}>★★★★★</span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Dispute rate: 0.02% (Superlative)
          </span>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#4f46e5",
              fontWeight: "bold",
            }}
          >
            <span style={{ cursor: "pointer" }}>Read recent feedback</span>
            <span>Top 1% Seller</span>
          </div>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
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
                Order Processing Queue
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Fulfillment pipeline pending merchant handover
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              6 pending actions
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                id: "#ORD-9941-DX",
                title: "Pro Sound ANC (Matte Black)",
                dest: "Brooklyn, NY",
                status: "Packaging",
                price: "$349.00",
                color: "#fef9c3",
                text: "#854d0e",
              },
              {
                id: "#ORD-9938-TX",
                title: "DAC Streamer Mark II",
                dest: "Zurich, CH",
                status: "Ready for Dispatch",
                price: "$980.00",
                color: "#dcfce7",
                text: "#166534",
              },
              {
                id: "#ORD-9932-EU",
                title: "Pure Silver Audio Loom",
                dest: "FedEx Ground",
                status: "Handed to Courier",
                price: "$129.00",
                color: "#eef2ff",
                text: "#4f46e5",
              },
            ].map((order, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f8fafc",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                      {order.id}
                    </strong>
                    <span
                      style={{
                        fontSize: "10px",
                        background: order.color,
                        color: order.text,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {order.title} • Destination: {order.dest}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                    {order.price}
                  </strong>
                  <button
                    onClick={() =>
                      showNotification(`Action processed for ${order.id}`)
                    }
                    style={{
                      padding: "6px 12px",
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {order.status === "Ready for Dispatch"
                      ? "Dispatch"
                      : "Print Slip"}
                  </button>
                </div>
              </div>
            ))}
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
              Payout Account
            </h3>
            <CheckCircle2 size={16} color="#22c55e" />
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                Stripe Connect
              </strong>
              <span
                style={{
                  fontSize: "10px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Primary
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              JPMorgan Chase •••• 4092
            </span>
            <span
              style={{ fontSize: "11px", color: "#22c55e", fontWeight: "bold" }}
            >
              Active • Instant Payouts Enabled
            </span>
          </div>

          <div
            style={{
              background: "#f5f3ff",
              border: "1px solid #c7d2fe",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{ fontSize: "11px", color: "#4f46e5", fontWeight: "bold" }}
            >
              NEXT SCHEDULED PAYOUT
            </span>
            <strong
              style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}
            >
              $12,450.00
            </strong>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Mon, Nov 3 • Est. Arrival 9:00 AM
            </span>
          </div>

          <button
            onClick={() => showNotification("Payout settings saved.")}
            style={{
              width: "100%",
              padding: "10px",
              background: "#f8fafc",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Manage Payout Settings
          </button>
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
            flexWrap: "wrap",
            gap: "12px",
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
              Product & Inventory Catalog
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Manage SKUs, dynamic pricing tiers, and stock replenishment.
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Filter SKU or name..."
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              style={{
                padding: "8px 12px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              All Categories ▾
            </button>
          </div>
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
                <th style={{ padding: "12px 16px" }}>PRODUCT & SKU</th>
                <th style={{ padding: "12px 16px" }}>CATEGORY</th>
                <th style={{ padding: "12px 16px" }}>STOCK QUANTITY</th>
                <th style={{ padding: "12px 16px" }}>RETAIL PRICE</th>
                <th style={{ padding: "12px 16px" }}>SALES VOL.</th>
                <th style={{ padding: "12px 16px" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Pro Sound ANC Studio Mk II",
                  sku: "VLR-992-ANC",
                  cat: "Over-Ear Audio",
                  stock: "6 (Low Stock)",
                  price: "$349.00",
                  sales: "412 sold",
                  status: "Live",
                },
                {
                  name: "DAC Streamer Mark II (Reference)",
                  sku: "VLR-771-DAC",
                  cat: "Desktop DAC/Amps",
                  stock: "84 (Healthy)",
                  price: "$490.00",
                  sales: "210 sold",
                  status: "Live",
                },
                {
                  name: "Heritage Tuscan Leather Case",
                  sku: "VLR-204-ACC",
                  cat: "Accessories",
                  stock: "0 (Sold Out)",
                  price: "$115.00",
                  sales: "160 sold",
                  status: "Out of Stock",
                },
                {
                  name: "Monolith Magnetic Audio Stand",
                  sku: "VLR-019-STD",
                  cat: "Accessories",
                  stock: "50 (Unpublished)",
                  price: "$180.00",
                  sales: "0 sold",
                  status: "Draft",
                },
              ].map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "#f8fafc",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    ></div>
                    <div>
                      <strong style={{ display: "block", color: "#0f172a" }}>
                        {item.name}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        SKU: {item.sku}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#475569" }}>
                    {item.cat}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: "bold",
                      color: item.stock.includes("0") ? "#ef4444" : "#166534",
                    }}
                  >
                    {item.stock}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: "bold",
                      color: "#0f172a",
                    }}
                  >
                    {item.price}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#475569" }}>
                    {item.sales}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background:
                          item.status === "Live" ? "#dcfce7" : "#fee2e2",
                        color: item.status === "Live" ? "#166534" : "#991b1b",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
