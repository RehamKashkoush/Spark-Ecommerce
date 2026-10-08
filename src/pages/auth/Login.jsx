import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [portal, setPortal] = useState("customer");
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSocialLogin = (provider) => {
    const roleEmailMap = {
      admin: "admin@spark.test",
      seller: "seller@spark.test",
      customer: "customer@spark.test",
    };
    const mockEmail =
      roleEmailMap[portal] ||
      `user.${provider.toLowerCase()}@spark-global.store`;
    if (login) {
      login({ email: mockEmail, password: "Admin123!", role: portal });
    }
    showNotification(`Successfully authenticated with ${provider}!`);
    setTimeout(() => {
      navigate(
        portal === "admin" ? "/admin" : portal === "seller" ? "/seller" : "/",
      );
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification("Please enter valid credentials.");
      return;
    }
    if (login) {
      login({ email, password, role: portal });
    }
    showNotification("Successfully signed in!");
    setTimeout(() => {
      navigate(
        portal === "admin" ? "/admin" : portal === "seller" ? "/seller" : "/",
      );
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "inherit",
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
          width: "700px",
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          color: "#ffffff",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                background: "rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: "20px",
                letterSpacing: "1px",
              }}
            >
              VERIFIED GLOBAL COMMERCE
            </span>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "800",
                lineHeight: "1.2",
                margin: "16px 0 0 0",
              }}
            >
              Curated Luxury, Seamless Delivery.
            </h1>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#c7d2fe",
                fontStyle: "italic",
              }}
            >
              "The authentication assurance and instant VIP checkout elevate
              online shopping to white-glove tier."
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>
              Elena von Berg • Verified Collector
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                margin: "0 0 4px 0",
              }}
            >
              100% Certified Sellers
            </h4>
            <span style={{ fontSize: "11px", color: "#c7d2fe" }}>
              Stringent provenance & authenticity protocols
            </span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                margin: "0 0 4px 0",
              }}
            >
              256-Bit Vault Security
            </h4>
            <span style={{ fontSize: "11px", color: "#c7d2fe" }}>
              Enterprise tokenized multi-factor transactions
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#eef2ff",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #c7d2fe",
              fontSize: "12px",
              color: "#4f46e5",
            }}
          >
            <strong>Email Verification Reward:</strong> Check your inbox after
            signing in for your secret 15% VIP welcome code.
          </div>

          <div
            style={{
              display: "flex",
              background: "#e2e8f0",
              padding: "4px",
              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => setPortal("customer")}
              style={{
                flex: 1,
                padding: "10px",
                background: portal === "customer" ? "#ffffff" : "transparent",
                color: portal === "customer" ? "#0f172a" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Customer Portal
            </button>
            <button
              type="button"
              onClick={() => setPortal("admin")}
              style={{
                flex: 1,
                padding: "10px",
                background: portal === "admin" ? "#ffffff" : "transparent",
                color: portal === "admin" ? "#0f172a" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => setPortal("seller")}
              style={{
                flex: 1,
                padding: "10px",
                background: portal === "seller" ? "#ffffff" : "transparent",
                color: portal === "seller" ? "#0f172a" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Seller Portal
            </button>
          </div>

          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              Welcome to Spark Commerce
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Access curated catalogs, live bidding, and priority order
              tracking.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              style={{
                padding: "10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              style={{
                padding: "10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              Apple
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Phone OTP")}
              style={{
                padding: "10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              Phone OTP
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", background: "#e2e8f0" }}
            ></div>
            <span>OR CONTINUE WITH EMAIL</span>
            <div
              style={{ flex: 1, height: "1px", background: "#e2e8f0" }}
            ></div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#334155",
                }}
              >
                Work or Personal Email
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#334155",
                  }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "12px",
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" defaultChecked /> Keep me signed in for
                30 days
              </label>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <ShieldCheck size={14} color="#22c55e" /> Encrypted
              </span>
            </div>

            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Sign In to {portal} Hub <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}
          >
            Don't have an account yet?{" "}
            <Link
              to="/register"
              style={{
                color: "#4f46e5",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Create an account
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "16px",
            }}
          >
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Security Safeguards
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
