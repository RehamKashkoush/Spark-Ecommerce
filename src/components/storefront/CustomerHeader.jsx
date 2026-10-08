import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, LogOut, LogIn } from "lucide-react";
import Logo from "../common/Logo";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";

export default function CustomerHeader() {
  const { user, logout } = useAuth();
  const store = useStore() || {};
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const ownerKey = user?.id || "guest";
      const savedCart = JSON.parse(
        localStorage.getItem(`spark-cart-${ownerKey}`) || "[]",
      );
      const total = savedCart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0,
      );
      setLiveCount(total);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    const interval = setInterval(updateCartCount, 300);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, [user, store.cart]);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("shop"), path: "/products" },
    { name: t("categories"), path: "/category/electronics" },
    { name: t("orders"), path: "/orders" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Logo />

          <nav
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  color: hoveredLink === link.name ? "#4f46e5" : "#475569",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  paddingBottom: "2px",
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to="/wishlist"
            onMouseEnter={() => setHoveredIcon("wishlist")}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              color: hoveredIcon === "wishlist" ? "#4f46e5" : "#475569",
              padding: "6px",
              borderRadius: "50%",
              background:
                hoveredIcon === "wishlist" ? "#eef2ff" : "transparent",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={20} />
          </Link>

          <Link
            to="/cart"
            onMouseEnter={() => setHoveredIcon("cart")}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              position: "relative",
              color: hoveredIcon === "cart" ? "#4f46e5" : "#475569",
              padding: "6px",
              borderRadius: "50%",
              background: hoveredIcon === "cart" ? "#eef2ff" : "transparent",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBag size={20} />
            {liveCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                {liveCount}
              </span>
            )}
          </Link>

          <LanguageSwitcher />
          <ThemeToggle />

          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                onMouseEnter={() => setHoveredIcon("user")}
                onMouseLeave={() => setHoveredIcon(null)}
                style={{
                  border: "none",
                  background:
                    hoveredIcon === "user" ? "#eef2ff" : "transparent",
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: hoveredIcon === "user" ? "#4f46e5" : "#475569",
                  transition: "all 0.2s ease",
                }}
              >
                <User size={20} />
              </button>

              {showUserDropdown && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    width: "180px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    padding: "8px 0",
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#334155",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    {t("profile")}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#334155",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    {t("orders")}
                  </Link>
                  <Link
                    to="/tracking"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#334155",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    {language === "ar" ? "تتبع الطلب" : "Track Order"}
                  </Link>
                  <div
                    style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }}
                  ></div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      border: "none",
                      background: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <LogOut size={14} /> {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {user ? (
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "transparent",
                color: "#334155",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0f172a";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#334155";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
            >
              {t("signOut")}
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid #4f46e5",
                background: "#4f46e5",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
            >
              <LogIn size={14} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
