import React, { useState } from "react";
import {
  Bell,
  LogOut,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader({ title, subtitle, type }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New order received (#ORD-1004)",
      time: "5m ago",
      icon: Package,
      read: false,
    },
    {
      id: 2,
      text: "Product stock running low (Gaming Mouse)",
      time: "1h ago",
      icon: AlertTriangle,
      read: false,
    },
    {
      id: 3,
      text: "System backup completed successfully",
      time: "1d ago",
      icon: CheckCircle,
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const headerTitle =
    title || (type === "admin" ? "Admin Control Panel" : "Seller Hub");
  const headerSubtitle =
    subtitle ||
    (type === "admin"
      ? "Platform overview and controls."
      : "Manage your products, orders and payouts.");

  return (
    <header
      className="dashboard-header"
      style={{
        display: "flex",
        justify: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
            color: "#0f172a",
          }}
        >
          {headerTitle}
        </h2>
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          {headerSubtitle}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "6px 12px 6px 32px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              width: "200px",
            }}
          />
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              background: showNotifications ? "#e0e7ff" : "#f1f5f9",
              border: "none",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            aria-label="Notifications"
          >
            <Bell size={18} color={showNotifications ? "#4f46e5" : "#475569"} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "45px",
                width: "300px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                  Notifications
                </strong>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4f46e5",
                        fontSize: "11px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "8px",
                        background: n.read ? "#ffffff" : "#f8fafc",
                        borderRadius: "8px",
                        borderLeft: n.read ? "none" : "3px solid #6366f1",
                      }}
                    >
                      <div style={{ marginTop: "2px", color: "#6366f1" }}>
                        <Icon size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            fontWeight: n.read ? "400" : "600",
                            color: "#334155",
                          }}
                        >
                          {n.text}
                        </p>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                          {n.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#6366f1",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-light"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            fontSize: "13px",
          }}
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </header>
  );
}
