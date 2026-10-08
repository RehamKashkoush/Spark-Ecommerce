import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Lock,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Checkout() {
  const navigate = useNavigate();
  const store = useStore() || {};

  const cartItems = store.cart || store.cartItems || [];
  const clearCart = store.clearCart || store.resetCart || (() => {});

  const [step, setStep] = useState(2); 
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [shippingMethod, setShippingMethod] = useState("express");
  const [paymentTab, setPaymentTab] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0,
  );
  const discountAmount = discountApplied ? subtotal * 0.2 : 0;
  const shippingFee = shippingMethod === "express" ? 15.0 : 0.0;
  const vat = (subtotal - discountAmount) * 0.15;
  const total = subtotal - discountAmount + shippingFee + vat;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "DISCOUNT20") {
      setDiscountApplied(true);
    } else {
      alert("Invalid Coupon Code. Try DISCOUNT20");
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newOrder = {
        id: "SPARK-" + Math.floor(10000000 + Math.random() * 90000000),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "Processing",
        total: total > 0 ? total : 268.0,
        itemsCount:
          cartItems.length > 0
            ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 1)
            : 3,
        paymentMethod:
          paymentTab === "card"
            ? "Credit Card"
            : paymentTab === "apple"
              ? "Apple Pay"
              : paymentTab === "paypal"
                ? "PayPal"
                : "Cash on Delivery",
        shippingAddress:
          selectedAddress === "Home"
            ? "Riyadh, King Fahd Road, Al-Woroud"
            : "Riyadh, King Abdullah Financial District",
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("spark_orders") || "[]",
      );
      localStorage.setItem(
        "spark_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );

      try {
        clearCart();
      } catch (err) {
        
      }

      setLoading(false);
      navigate("/orders");
    }, 1200);
  };

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        minHeight: "85vh",
        background: "#f8fafc",
      }}
    >
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "20px 32px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#22c55e",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            ✓
          </span>
          <span
            style={{ fontSize: "14px", fontWeight: "bold", color: "#334155" }}
          >
            1. Shopping Cart
          </span>
        </div>
        <div
          style={{
            height: "2px",
            flex: 1,
            background: "#6366f1",
            maxWidth: "100px",
            minWidth: "40px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#6366f1",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            2
          </span>
          <span
            style={{ fontSize: "14px", fontWeight: "bold", color: "#6366f1" }}
          >
            2. Shipping & Delivery
          </span>
        </div>
        <div
          style={{
            height: "2px",
            flex: 1,
            background: "#cbd5e1",
            maxWidth: "100px",
            minWidth: "40px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#e2e8f0",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            3
          </span>
          <span
            style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}
          >
            3. Payment & Confirmation
          </span>
        </div>
      </div>

      
      <div
        style={{
          background: "#dcfce7",
          border: "1px solid #bbf7d0",
          color: "#166534",
          padding: "12px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🎉 Free express shipping unlocked! Order exceeded minimum threshold
        ($200.00).
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MapPin size={18} color="#6366f1" /> Fast Delivery Address
              </h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                onClick={() => setSelectedAddress("Home")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border:
                    selectedAddress === "Home"
                      ? "2px solid #6366f1"
                      : "1px solid #cbd5e1",
                  background:
                    selectedAddress === "Home" ? "#f5f3ff" : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                    Home (Default)
                  </strong>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#6366f1",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Primary
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  Riyadh, King Fahd Road, Al-Woroud, Bldg 42, Apt 104
                </p>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#334155",
                    fontWeight: "600",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  +966 50 123 4567
                </span>
              </div>

              <div
                onClick={() => setSelectedAddress("Work")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border:
                    selectedAddress === "Work"
                      ? "2px solid #6366f1"
                      : "1px solid #cbd5e1",
                  background:
                    selectedAddress === "Work" ? "#f5f3ff" : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                    Workplace - Office
                  </strong>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#cbd5e1",
                      color: "#334155",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Work
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  Riyadh, King Abdullah Financial District, Tower 2
                </p>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#334155",
                    fontWeight: "600",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  +966 55 987 6543
                </span>
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
                Cart Items ({cartItems.length > 0 ? cartItems.length : 3}{" "}
                selected items)
              </h3>
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
                Ready to Ship
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {cartItems.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "#cbd5e1",
                      borderRadius: "8px",
                    }}
                  ></div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      Studio Pro Wireless Headphones
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Color: Navy / 2024 Edition
                    </span>
                  </div>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                    $180.00
                  </strong>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <img
                      src={item.thumbnail || item.image || ""}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </h4>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Qty: {item.quantity || 1}
                      </span>
                    </div>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </strong>
                  </div>
                ))
              )}
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
              gap: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Truck size={18} color="#6366f1" /> Shipping Method
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                onClick={() => setShippingMethod("express")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border:
                    shippingMethod === "express"
                      ? "2px solid #6366f1"
                      : "1px solid #cbd5e1",
                  background:
                    shippingMethod === "express" ? "#f5f3ff" : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                    Express Delivery (Same Day)
                  </strong>
                  <span
                    style={{
                      fontSize: "11px",
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Free over $200
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  Estimated arrival: Today within 4 - 6 hours via dedicated
                  direct courier.
                </p>
              </div>

              <div
                onClick={() => setShippingMethod("standard")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border:
                    shippingMethod === "standard"
                      ? "2px solid #6366f1"
                      : "1px solid #cbd5e1",
                  background:
                    shippingMethod === "standard" ? "#f5f3ff" : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                    Standard Scheduled Delivery
                  </strong>
                  <span
                    style={{
                      fontSize: "11px",
                      background: "#e2e8f0",
                      color: "#334155",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Always Free
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  Estimated arrival: Within 2 to 3 business days with real-time
                  tracking.
                </p>
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
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CreditCard size={18} color="#6366f1" /> Encrypted Payment
                Method
              </h3>
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Lock size={12} /> 256-bit SSL Secure
              </span>
            </div>

            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              {[
                { id: "card", label: "Credit Card" },
                { id: "apple", label: "Apple Pay" },
                { id: "paypal", label: "PayPal" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPaymentTab(tab.id)}
                  style={{
                    padding: "12px 8px",
                    borderRadius: "8px",
                    border:
                      paymentTab === tab.id
                        ? "2px solid #6366f1"
                        : "1px solid #cbd5e1",
                    background: paymentTab === tab.id ? "#eef2ff" : "#f8fafc",
                    color: paymentTab === tab.id ? "#4f46e5" : "#334155",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {paymentTab === "card" && (
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "8px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4152 8920 4410 8892"
                    value={cardData.number}
                    onChange={(e) =>
                      setCardData({ ...cardData, number: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#334155",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="09/27"
                      value={cardData.expiry}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiry: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#334155",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      CVV Code
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({ ...cardData, cvv: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="MOHAMMED AL-OTAIBI"
                    value={cardData.name}
                    onChange={(e) =>
                      setCardData({ ...cardData, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" defaultChecked /> Save card for future
                  one-click checkout
                </label>
              </form>
            )}

            {paymentTab !== "card" && (
              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                You selected <strong>{paymentTab.toUpperCase()}</strong>. Click
                proceed below to complete verification securely.
              </div>
            )}
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
            position: "sticky",
            top: "90px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Order Summary
          </h3>

          
          <form
            onSubmit={handleApplyCoupon}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="text"
              placeholder="Coupon Code (e.g. DISCOUNT20)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                background: "#334155",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </form>

          {discountApplied && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              ✓ Applied: 20% Off coupon DISCOUNT20
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>${subtotal > 0 ? subtotal.toFixed(2) : "320.00"}</span>
            </div>
            {discountApplied && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#166534",
                }}
              >
                <span>Promo Discount (20%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Express Shipping</span>
              <span style={{ color: "#166534", fontWeight: "bold" }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>VAT (15% included)</span>
              <span>${vat > 0 ? vat.toFixed(2) : "34.95"}</span>
            </div>
          </div>

          <div
            style={{
              background: "#eef2ff",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "13px", color: "#4f46e5", fontWeight: "bold" }}
            >
              Total Saved
            </span>
            <span
              style={{ fontSize: "14px", color: "#4f46e5", fontWeight: "bold" }}
            >
              ${(discountAmount + 12.0).toFixed(2)} Saved
            </span>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a" }}
            >
              Total Amount Due
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}
            >
              ${total > 0 ? total.toFixed(2) : "268.00"}
            </span>
          </div>

          <button
            onClick={handleCompleteOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            {loading ? (
              "Processing Secure Payment..."
            ) : (
              <>
                Proceed to Secure Checkout ($
                {total > 0 ? total.toFixed(2) : "268.00"})
              </>
            )}
          </button>

          
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <ShieldCheck
                size={16}
                color="#4f46e5"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <span>
                <strong>100% Authentic Products</strong>
                <br />
                Sourced directly from authorized official brand distributors
              </span>
            </div>
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <Truck
                size={16}
                color="#4f46e5"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <span>
                <strong>14-Day Easy Returns</strong>
                <br />
                Hassle-free doorstep pickup with instant refunds
              </span>
            </div>
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <Lock
                size={16}
                color="#4f46e5"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <span>
                <strong>PCI-DSS 256-bit Encrypted Checkout</strong>
                <br />
                Sensitive card numbers are never stored on our servers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
