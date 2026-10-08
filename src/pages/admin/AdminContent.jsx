import React, { useEffect, useState } from "react";
import { Layout, Image, Plus, Trash2, Edit3, Save, Eye } from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoBanners = [
  {
    id: "BNR-1",
    title: "Grand Summer Sale",
    subtitle: "Up to 50% off on premium electronics",
    buttonText: "Shop Deals",
    status: "Active",
    position: "Hero Slider",
  },
  {
    id: "BNR-2",
    title: "New Fashion Collection",
    subtitle: "Discover the latest apparel trends",
    buttonText: "Explore Collection",
    status: "Active",
    position: "Homepage Middle",
  },
  {
    id: "BNR-3",
    title: "Free Shipping Weekend",
    subtitle: "On all orders over $100 across the store",
    buttonText: "Learn More",
    status: "Inactive",
    position: "Top Notice Bar",
  },
];

export default function AdminContent() {
  const [banners, setBanners] = useState(initialDemoBanners);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    buttonText: "Shop Now",
    position: "Hero Slider",
  });

  useEffect(() => {
    if (adminApi && adminApi.getAdminContent) {
      adminApi
        .getAdminContent()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setBanners(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title) return;

    const created = {
      id: `BNR-${banners.length + 1}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      buttonText: newBanner.buttonText,
      status: "Active",
      position: newBanner.position,
    };

    setBanners([created, ...banners]);
    setShowAddModal(false);
    setNewBanner({
      title: "",
      subtitle: "",
      buttonText: "Shop Now",
      position: "Hero Slider",
    });
  };

  const toggleStatus = (id) => {
    setBanners(
      banners.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" }
          : b,
      ),
    );
  };

  const handleDelete = (id) => {
    if (adminApi && adminApi.deleteContent) {
      adminApi.deleteContent(id).catch(() => {});
    }
    setBanners(banners.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading content manager...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
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
          <span
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#6366f1",
              letterSpacing: "0.05em",
            }}
          >
            STORE CMS
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Content & Banners
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "#6366f1",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>POSITION</th>
              <th style={{ padding: "12px 16px" }}>BANNER TITLE</th>
              <th style={{ padding: "12px 16px" }}>SUBTITLE</th>
              <th style={{ padding: "12px 16px" }}>BUTTON TEXT</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#6366f1",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Layout size={16} />
                    {b.position}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  {b.title}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {b.subtitle}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#334155",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  {b.buttonText}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(b.id)}
                    style={{
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      background: b.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: b.status === "Active" ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {b.status}
                  </button>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!banners.length && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No active homepage banners configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                color: "#0f172a",
              }}
            >
              Add Promotional Banner
            </h3>
            <form
              onSubmit={handleCreateBanner}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Banner Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mega Clearance Sale"
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, title: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Up to 70% discount on selected items"
                  value={newBanner.subtitle}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, subtitle: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={newBanner.buttonText}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, buttonText: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Placement
                  </label>
                  <select
                    value={newBanner.position}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, position: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="Hero Slider">Hero Slider</option>
                    <option value="Homepage Middle">Homepage Middle</option>
                    <option value="Top Notice Bar">Top Notice Bar</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#6366f1",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
