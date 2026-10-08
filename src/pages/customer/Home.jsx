import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Star,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Home() {
  const navigate = useNavigate();
  const store = useStore() || {};
  const addToCart = store.addToCart || store.cart?.addToCart;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDealTab, setActiveDealTab] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        background: "var(--page-bg, #f8fafc)",
        paddingBottom: "40px",
      }}
    >
      
      <div
        style={{
          background: "#4f46e5",
          color: "#ffffff",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        <span>
          ✨ 450 Spark Rewards Points in your balance — Redeem for $15 discount
          instantly!
        </span>
        <button
          onClick={() => navigate("/loyalty")}
          style={{
            background: "#ffffff",
            color: "#4f46e5",
            border: "none",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Redeem Now
        </button>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: "24px",
            padding: "48px",
            color: "#ffffff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.1)",
                width: "fit-content",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              <Sparkles size={14} color="#818cf8" />
              <span>SPARK EXCLUSIVE • LIMITED 50% OFF OFFER</span>
            </div>

            <h1
              style={{
                fontSize: "36px",
                fontWeight: "800",
                lineHeight: "1.2",
                margin: 0,
              }}
            >
              Elevate Your Digital Lifestyle with Premium Curated Tech
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Exquisite craftsmanship meets modern engineering. Discover
              seasonal deals and exclusive product drops.
            </p>

            
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                padding: "12px 16px",
                borderRadius: "12px",
                width: "fit-content",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "18px", display: "block" }}>
                  04
                </strong>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Days</span>
              </div>
              <span style={{ color: "#64748b" }}>:</span>
              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "18px", display: "block" }}>
                  27
                </strong>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                  Hours
                </span>
              </div>
              <span style={{ color: "#64748b" }}>:</span>
              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "18px", display: "block" }}>
                  59
                </strong>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Mins</span>
              </div>
              <span style={{ color: "#64748b" }}>:</span>
              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "18px", display: "block" }}>
                  22
                </strong>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Secs</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/products")}
                style={{
                  padding: "12px 24px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4338ca")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#4f46e5")
                }
              >
                Shop Exclusive Deals <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/products")}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Browse Full Catalog
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", zIndex: 2 }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "20px",
                color: "#0f172a",
                width: "100%",
                maxWidth: "320px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              }}
            >
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                Save 25%
              </span>
              <div
                style={{
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "12px 0",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
                  alt="Headphones"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 4px 0",
                }}
              >
                Spark Acoustic Pro-Max
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                }}
              >
                <strong style={{ fontSize: "18px", color: "#4f46e5" }}>
                  $129
                </strong>
                <button
                  onClick={() => navigate("/products/1")}
                  style={{
                    padding: "8px 16px",
                    background: "#0f172a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Browse by Category
            </h2>
            <Link
              to="/products"
              style={{
                fontSize: "13px",
                color: "#4f46e5",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              View All Categories →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { name: "Smart Devices", items: "24 items" },
              { name: "Smart Watches", items: "18 items" },
              { name: "Premium Audio", items: "32 items" },
              { name: "Fashion & Apparel", items: "45 items" },
              { name: "Luxury Fragrance", items: "12 items" },
              { name: "Desk & Workspace", items: "29 items" },
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/products")}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#4f46e5";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(79,70,229,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.02)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#eef2ff",
                    borderRadius: "50%",
                    margin: "0 auto 12px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f46e5",
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    margin: "0 0 4px 0",
                  }}
                >
                  {cat.name}
                </h4>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {cat.items}
                </span>
              </div>
            ))}
          </div>
        </div>

        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Spark Super Deals
            </h2>

            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Bestsellers", "Wireless", "Luxury"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDealTab(tab)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border:
                      activeDealTab === tab
                        ? "1px solid #4f46e5"
                        : "1px solid #cbd5e1",
                    background: activeDealTab === tab ? "#4f46e5" : "#ffffff",
                    color: activeDealTab === tab ? "#ffffff" : "#475569",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredProduct(p.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(`/products/${p.id}`)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.25s ease",
                  transform:
                    hoveredProduct === p.id
                      ? "translateY(-6px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredProduct === p.id
                      ? "0 12px 20px -5px rgba(0,0,0,0.08)"
                      : "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                      transform:
                        hoveredProduct === p.id ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    -20%
                  </span>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: "0 0 6px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#eab308",
                      fontSize: "12px",
                    }}
                  >
                    <Star size={12} fill="#eab308" /> {p.rating || 4.8}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  <strong style={{ fontSize: "16px", color: "#4f46e5" }}>
                    ${p.price}
                  </strong>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (addToCart) addToCart(p);
                    }}
                    style={{
                      padding: "8px 12px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4f46e5";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#eef2ff";
                      e.currentTarget.style.color = "#4f46e5";
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              border: "1px solid #c7d2fe",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#4f46e5",
                textTransform: "uppercase",
              }}
            >
              Curated Accessories
            </span>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Seamless Digital Workspace
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
              Premium magnetic charging station & ergonomics, double designed
              for elevated productivity.
            </p>
            <button
              onClick={() => navigate("/products")}
              style={{
                width: "fit-content",
                padding: "10px 20px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Explore Collection →
            </button>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              border: "1px solid #bbf7d0",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#166534",
                textTransform: "uppercase",
              }}
            >
              Luxury Fundamentals
            </span>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Handcrafted Italian Leather Wallets & Cases
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
              Handmade from glossulus full grain leather with integrated RFID
              protection technology.
            </p>
            <button
              onClick={() => navigate("/products")}
              style={{
                width: "fit-content",
                padding: "10px 20px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Shop Collection →
            </button>
          </div>
        </div>

        
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Truck size={24} color="#4f46e5" />
            <h5
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Ultra Fast Shipping
            </h5>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Free delivery on orders above $100
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={24} color="#4f46e5" />
            <h5
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              100% Authentic Guarantee
            </h5>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Fully certified & original batches
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RotateCcw size={24} color="#4f46e5" />
            <h5
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Hassle-free 14-Day Returns
            </h5>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Seamless and instant returns
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={24} color="#4f46e5" />
            <h5
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              100% Secure Encrypted Payment
            </h5>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              PCI-DSS bank grade security
            </span>
          </div>
        </div>

        
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
            borderRadius: "24px",
            padding: "40px",
            color: "#ffffff",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            Join the Exclusive Spark Club
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#c7d2fe",
              margin: 0,
              maxWidth: "500px",
            }}
          >
            Subscribe now to receive an extra 10% off your first order with code{" "}
            <strong style={{ color: "#fff" }}>SPARK10</strong>.
          </p>

          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
              maxWidth: "400px",
              marginTop: "8px",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Subscribe Now
            </button>
          </form>

          {subscribed && (
            <span
              style={{ fontSize: "12px", color: "#86efac", fontWeight: "bold" }}
            >
              ✓ Thank you for subscribing! Check your inbox for code SPARK10.
            </span>
          )}
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            We respect your privacy. Unsubscribe at any time.
          </span>
        </div>
      </div>
    </div>
  );
}
