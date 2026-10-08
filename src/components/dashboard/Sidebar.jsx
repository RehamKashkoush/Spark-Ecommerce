import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  UserCheck,
  Ticket,
  FileText,
  Mail,
  Award,
  Gift,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../common/Logo";

export default function Sidebar({ type = "seller" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    navigate("/profile");
  };

  const sellerLinks = [
    { path: "/seller", label: "Dashboard", icon: LayoutDashboard },
    { path: "/seller/products", label: "Products", icon: Package },
    { path: "/seller/orders", label: "Orders", icon: ShoppingBag },
    { path: "/seller/payouts", label: "Payouts", icon: DollarSign },
  ];

  const adminLinks = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/sellers", label: "Sellers", icon: UserCheck },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/coupons", label: "Coupons", icon: Ticket },
    { path: "/admin/content", label: "Content", icon: FileText },
    { path: "/admin/newsletter", label: "Email Marketing", icon: Mail },
    { path: "/admin/loyalty", label: "Loyalty & Rewards", icon: Award },
    { path: "/admin/referrals", label: "Referrals", icon: Gift },
  ];

  const links = type === "seller" ? sellerLinks : adminLinks;

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "20px 16px",
      }}
    >
      <div>
        <div style={{ padding: "0 12px 24px 12px" }}>
          <Logo />
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "#94a3b8",
            padding: "0 12px 8px 12px",
            letterSpacing: "0.05em",
          }}
        >
          {type === "seller" ? "VENDOR HUB" : "EXECUTIVE TERMINAL"}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#4f46e5" : "#475569",
                  background: isActive ? "#eeeefd" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          borderTop: "1px solid #f1f5f9",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <button
          type="button"
          onClick={handleSettingsClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#475569",
            background: "transparent",
            border: "none",
            width: "100%",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#ef4444",
            background: "transparent",
            border: "none",
            width: "100%",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
