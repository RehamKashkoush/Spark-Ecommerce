import React, { useState } from "react";
import { Search, Download, UserPlus, CheckCircle2 } from "lucide-react";

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState({
    name: "Zainab Al-Mansoor",
    email: "zainab.mansoor@qatar.net",
    phone: "+974 5512 8890",
    role: "Customer",
    rating: 4.9,
    orders: 42,
    spent: "$14,890",
    wishlist: 12,
    status: "Active",
  });

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const usersList = [
    {
      id: "#SPK-90412",
      name: "Zainab Al-Mansoor",
      email: "zainab.mansoor@qatar.net",
      phone: "+974 5512 8890",
      role: "Customer",
      status: "Active",
    },
    {
      id: "#SPK-90413",
      name: "Marcello Rossi",
      email: "marcello@rossi-leather.it",
      phone: "+39 02 8940 112",
      role: "Seller",
      status: "Active",
    },
    {
      id: "#SPK-90414",
      name: "Sarah Jenkins",
      email: "s.jenkins@spark.internal",
      phone: "+1 (415) 880-9214",
      role: "Admin",
      status: "Active",
    },
    {
      id: "#SPK-90415",
      name: "Tariq Haddad",
      email: "tariq.haddad@dubai.ae",
      phone: "+971 50 339 4910",
      role: "Customer",
      status: "Active",
    },
    {
      id: "#SPK-90416",
      name: "Elena Rostova",
      email: "contact@elysian-botanics.com",
      phone: "+44 20 7946 0991",
      role: "Seller",
      status: "Inactive",
    },
    {
      id: "#SPK-90417",
      name: "Kenji Sato",
      email: "k.sato@kyotocraft.jp",
      phone: "+81 90 2811 0042",
      role: "Seller",
      status: "Active",
    },
    {
      id: "#SPK-90418",
      name: "Liam Vance",
      email: "liam.vance@archival.ca",
      phone: "+1 (604) 555-0193",
      role: "Customer",
      status: "Archived",
    },
  ];

  const handleChangeRole = () => {
    const newRole =
      selectedUser.role === "Customer"
        ? "Seller"
        : selectedUser.role === "Seller"
          ? "Admin"
          : "Customer";
    setSelectedUser({ ...selectedUser, role: newRole });
    showNotification(
      `Successfully changed ${selectedUser.name}'s role to ${newRole}`,
    );
  };

  const handleSuspendUser = () => {
    const newStatus =
      selectedUser.status === "Suspended" ? "Active" : "Suspended";
    setSelectedUser({ ...selectedUser, status: newStatus });
    showNotification(
      `User ${selectedUser.name} status updated to ${newStatus}`,
    );
  };

  const handleExportCSV = () => {
    showNotification("User database successfully exported to CSV file.");
  };

  const handleInviteMember = () => {
    showNotification("Invitation modal opened. Enter member details.");
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
            <span>ACCESS & GOVERNANCE</span>
            <span>•</span>
            <span style={{ color: "#4f46e5", fontWeight: "bold" }}>
              Tier-1 Authority
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
            User Management & Role Control
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
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
            <span>
              Verified Email Rate{" "}
              <strong style={{ color: "#0f172a" }}>94.2%</strong>
            </span>
          </div>
          <div
            style={{
              background: "#ffffff",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "#4f46e5",
                borderRadius: "50%",
              }}
            ></span>
            <span>
              2FA Adoption <strong style={{ color: "#0f172a" }}>68.0%</strong>{" "}
              (+4.1%)
            </span>
          </div>

          <button
            onClick={handleExportCSV}
            style={{
              padding: "8px 16px",
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
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handleInviteMember}
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
            <UserPlus size={14} /> Invite Member
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          background: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            background: "#eef2ff",
            borderRadius: "8px",
            border: "1px solid #c7d2fe",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "#4f46e5",
              display: "block",
              fontWeight: "bold",
            }}
          >
            All Users
          </span>
          <strong style={{ fontSize: "18px", color: "#0f172a" }}>18,920</strong>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "#64748b",
              display: "block",
              fontWeight: "bold",
            }}
          >
            Customers
          </span>
          <strong style={{ fontSize: "18px", color: "#0f172a" }}>17,450</strong>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "#64748b",
              display: "block",
              fontWeight: "bold",
            }}
          >
            Verified Sellers
          </span>
          <strong style={{ fontSize: "18px", color: "#0f172a" }}>1,420</strong>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "#64748b",
              display: "block",
              fontWeight: "bold",
            }}
          >
            Admin Staff
          </span>
          <strong style={{ fontSize: "18px", color: "#0f172a" }}>50</strong>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search name, email, phone"
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                outline: "none",
                minWidth: "200px",
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
              Status: All Statuses ▾
            </button>
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
              Role: All Roles ▾
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
                  <th style={{ padding: "12px 16px" }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: "12px 16px" }}>User Identity</th>
                  <th style={{ padding: "12px 16px" }}>Contact</th>
                  <th style={{ padding: "12px 16px" }}>Role Badge</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedUser(u)}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      cursor: "pointer",
                      background:
                        selectedUser.name === u.name
                          ? "#f5f3ff"
                          : "transparent",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <input
                        type="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
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
                          width: "32px",
                          height: "32px",
                          background: "#cbd5e1",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <div>
                        <strong
                          style={{
                            display: "block",
                            fontSize: "13px",
                            color: "#0f172a",
                          }}
                        >
                          {u.name}
                        </strong>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          UID: {u.id}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>
                      <span style={{ display: "block" }}>{u.email}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {u.phone}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background:
                            u.role === "Admin"
                              ? "#eef2ff"
                              : u.role === "Seller"
                                ? "#f0fdf4"
                                : "#f1f5f9",
                          color:
                            u.role === "Admin"
                              ? "#4f46e5"
                              : u.role === "Seller"
                                ? "#166534"
                                : "#334155",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          display: "inline-block",
                          background:
                            u.status === "Active" ? "#22c55e" : "#ef4444",
                          borderRadius: "50%",
                        }}
                      ></span>
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
            borderRadius: "12px",
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
            <span
              style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b" }}
            >
              USER DOSSIER {selectedUser.role}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "8px",
              paddingBottom: "12px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#cbd5e1",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                {selectedUser.name}
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {selectedUser.email}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#334155",
                  display: "block",
                  marginTop: "2px",
                }}
              >
                {selectedUser.phone}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <span
                style={{
                  fontSize: "11px",
                  background:
                    selectedUser.status === "Suspended" ? "#fee2e2" : "#dcfce7",
                  color:
                    selectedUser.status === "Suspended" ? "#991b1b" : "#166534",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                {selectedUser.status}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  background: "#fef9c3",
                  color: "#854d0e",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                ⭐ {selectedUser.rating || 4.9} rating
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <span
                style={{ fontSize: "10px", color: "#64748b", display: "block" }}
              >
                Orders Placed
              </span>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                {selectedUser.orders || 42}
              </strong>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <span
                style={{ fontSize: "10px", color: "#64748b", display: "block" }}
              >
                Wishlist Items
              </span>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                {selectedUser.wishlist || 12} saved
              </strong>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <span
              style={{ fontWeight: "bold", color: "#64748b", fontSize: "11px" }}
            >
              IDENTITY & CONNECTED ACCOUNTS
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              <span style={{ color: "#334155" }}>
                Google Workspace (OAuth 2.0)
              </span>
              <CheckCircle2 color="#22c55e" size={14} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              <span style={{ color: "#334155" }}>Apple ID (Biometric)</span>
              <CheckCircle2 color="#22c55e" size={14} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              <span style={{ color: "#334155" }}>SMS OTP 2-Factor</span>
              <CheckCircle2 color="#22c55e" size={14} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", paddingTop: "8px" }}>
            <button
              onClick={handleChangeRole}
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
              }}
            >
              Change Role
            </button>
            <button
              onClick={handleSuspendUser}
              style={{
                flex: 1,
                padding: "10px",
                background: "#fff1f2",
                color: "#e11d48",
                border: "1px solid #fecdd3",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {selectedUser.status === "Suspended" ? "Unsuspend" : "Suspend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
