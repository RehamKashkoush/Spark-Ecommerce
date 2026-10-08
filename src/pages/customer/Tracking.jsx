import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Download,
  ArrowRight,
  Package,
  Lock,
} from "lucide-react";

export default function Tracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      const savedOrders = JSON.parse(
        localStorage.getItem("spark_orders") || "[]",
      );
      const foundOrder = savedOrders.find((o) => o.id === id) ||
        savedOrders[0] || {
          id: "SPK-89241",
          date: "Oct 24, 2026",
          status: "Out for Delivery",
          total: 268.0,
          itemsCount: 3,
          paymentMethod: "Credit Card ending in 8892",
          shippingAddress:
            "Al Olaya District, King Fahd Rd, Lotus Tower, Floor 4, Apt 402",
        };
      setOrder(foundOrder);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
        Loading live tracking data...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        background: "#f8fafc",
        minHeight: "85vh",
      }}
    >
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link to="/orders" style={{ color: "#64748b", textDecoration: "none" }}>
          My Orders
        </Link>
        <span>/</span>
        <span style={{ color: "#0f172a", fontWeight: "600" }}>
          Live Order Tracking
        </span>
      </div>

      
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          borderRadius: "16px",
          padding: "24px 32px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#c7d2fe",
            }}
          >
            <span>Order Confirmed</span>
            <span>•</span>
            <span>Payment Successful</span>
            <span>•</span>
            <span>October 24, 2026</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            Order Confirmed & Preparing for Dispatch!
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#e0e7ff",
              margin: 0,
              maxWidth: "600px",
            }}
          >
            All items are secured and transferred to fast, secure packaging. The
            delivery courier is en route to your destination.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "12px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "right",
          }}
        >
          <span
            style={{ fontSize: "11px", color: "#c7d2fe", display: "block" }}
          >
            Shipment Reference Number:
          </span>
          <strong
            style={{
              fontSize: "16px",
              color: "#fff",
              display: "block",
              margin: "2px 0",
            }}
          >
            #{order.id}
          </strong>
          <span
            style={{ fontSize: "12px", color: "#86efac", fontWeight: "bold" }}
          >
            Estimated Delivery: Today between 5:00 - 6:00 PM
          </span>
        </div>
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Truck size={18} color="#4f46e5" />
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Live Courier Tracking
                </h3>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                ⚡ 8 mins remaining
              </span>
            </div>

            
            <div
              style={{
                width: "100%",
                height: "220px",
                background: "#e2e8f0",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.3,
                  backgroundImage:
                    "radial-gradient(#4f46e5 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#22c55e",
                    borderRadius: "50%",
                  }}
                ></span>
                Vehicle in Al Olaya Zone • 2.4 km away
              </div>
            </div>

            
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#cbd5e1",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                    alt="Captain"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Captain Ahmed Al-Shahri
                  </h4>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Vehicle: White Toyota Yaris • Plate: ABD-4108
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "8px 12px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#334155",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <MessageSquare size={14} /> Live Chat
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    background: "#4f46e5",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Phone size={14} /> Call Driver
                </button>
              </div>
            </div>
          </div>

          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
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
                Shipment Journey Details
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Carrier: Spark Express Fleet
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
                paddingLeft: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#0f172a",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Order Placed & Verified
                    </h4>
                    <p
                      style={{ fontSize: "12px", color: "#64748b", margin: 0 }}
                    >
                      Invoice verified and bank payment successfully authorized
                      via encrypted mada card.
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Completed
                    <br />
                    10:30 AM
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#0f172a",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Packaging & Quality Inspection
                    </h4>
                    <p
                      style={{ fontSize: "12px", color: "#64748b", margin: 0 }}
                    >
                      Products checked and packed in custom protective box with
                      tamper-evident security tape.
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Completed
                    <br />
                    02:15 PM
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#4f46e5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  •
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    background: "#f5f3ff",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#4f46e5",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Out for Delivery with Courier
                    </h4>
                    <p
                      style={{ fontSize: "12px", color: "#475569", margin: 0 }}
                    >
                      Captain has collected your package and is approaching your
                      delivery destination on Al Olaya Street.
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#4f46e5",
                      fontWeight: "bold",
                    }}
                  >
                    Active
                    <br />
                    Now (2.4 km away)
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  4
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#94a3b8",
                        margin: "0 0 2px 0",
                      }}
                    >
                      Estimated Delivery & Handover
                    </h4>
                    <p
                      style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}
                    >
                      Verification via secret one-time delivery code (OTP) and
                      hand-delivery to customer.
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Scheduled
                    <br />
                    Today, 06:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
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
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <MapPin size={14} color="#4f46e5" /> Delivery Address
              </span>
              <span
                style={{
                  fontSize: "10px",
                  background: "#e2e8f0",
                  color: "#334155",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                Home
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Riyadh, Kingdom of Saudi Arabia
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              Al Olaya District, King Fahd Rd, Lotus Tower, Floor 4, Apt 402
            </p>
            <span
              style={{ fontSize: "12px", color: "#334155", fontWeight: "600" }}
            >
              📞 +966 54 810 2940
            </span>
          </div>

          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#64748b",
                }}
              >
                Payment Method
              </span>
              <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                Credit Card ending in 8892
              </strong>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Ref: TXN-99812-44
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                background: "#dcfce7",
                color: "#166534",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              Paid
            </span>
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
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Items in Package ({order.itemsCount || 3})
              </h4>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Total weight: 1.2 kg
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
                  alt=""
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "contain",
                    background: "#f8fafc",
                    borderRadius: "6px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h5
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Pro Sound ANC Wireless Headp...
                  </h5>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Color: Dark Navy • Qty: 1
                  </span>
                </div>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                  $149.00
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                  alt=""
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "contain",
                    background: "#f8fafc",
                    borderRadius: "6px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h5
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Titanium Smart Watch Series 5
                  </h5>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Size: 44mm • Qty: 1
                  </span>
                </div>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                  $95.00
                </strong>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100"
                  alt=""
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "contain",
                    background: "#f8fafc",
                    borderRadius: "6px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h5
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    65W Fast GaN Charger
                  </h5>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Dual USB-C • Qty: 1
                  </span>
                </div>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                  $45.00
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
                paddingTop: "10px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>$320.00</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#166534",
                }}
              >
                <span>Promo Code (DISCOUNT20)</span>
                <span>-$64.00 (20%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Express Shipping</span>
                <span style={{ color: "#166534", fontWeight: "bold" }}>
                  Free
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>VAT (15% included)</span>
                <span>$34.95</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingTop: "10px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                Total Paid
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#4f46e5",
                }}
              >
                ${order.total ? order.total.toFixed(2) : "268.00"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Download size={14} /> Download PDF Invoice
              </button>
              <button
                onClick={() => (window.location.href = "/products")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                Continue Shopping <ArrowRight size={14} />
              </button>
            </div>

            <span
              style={{
                fontSize: "11px",
                color: "#64748b",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Lock size={10} /> Encrypted transaction protected by 2-year
              merchant guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
