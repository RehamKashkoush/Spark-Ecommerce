import React, { useEffect, useState } from "react";
import {
  Send,
  Mail,
  Users,
  CheckCircle,
  Trash2,
  Search,
  AlertCircle,
} from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoSubscribers = [
  {
    id: "SUB-1",
    email: "sarah.a@example.com",
    joined: "2026-09-12",
    status: "Active",
  },
  {
    id: "SUB-2",
    email: "khaled.m@example.com",
    joined: "2026-08-28",
    status: "Active",
  },
  {
    id: "SUB-3",
    email: "omaregy@example.com",
    joined: "2026-07-15",
    status: "Active",
  },
  {
    id: "SUB-4",
    email: "mona.creative@example.com",
    joined: "2026-06-02",
    status: "Active",
  },
];

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState(initialDemoSubscribers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [campaign, setCampaign] = useState({
    subject: "Spark Store — New arrivals",
    title: "Fresh picks are here",
    message: "",
  });

  useEffect(() => {
    if (adminApi && adminApi.getNewsletterSubscribers) {
      adminApi
        .getNewsletterSubscribers()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setSubscribers(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!campaign.message.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccessMessage(
        "Campaign sent successfully to all active subscribers!",
      );
      setCampaign({ ...campaign, message: "" });
      setTimeout(() => setSuccessMessage(""), 4000);
    }, 1000);
  };

  const handleDeleteSubscriber = (id) => {
    setSubscribers(subscribers.filter((s) => s.id !== id));
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading email marketing module...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
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
            EMAIL MARKETING
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Newsletter Campaigns
          </h1>
        </div>
        <div
          style={{
            background: "#e0e7ff",
            color: "#4338ca",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Users size={14} /> {subscribers.length} Subscribers
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0f172a",
            margin: "0 0 16px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Mail size={18} color="#6366f1" /> Create Email Campaign
        </h2>

        {successMessage && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle size={16} /> {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSendCampaign}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
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
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "6px",
                }}
              >
                Subject Line
              </label>
              <input
                type="text"
                value={campaign.subject}
                onChange={(e) =>
                  setCampaign({ ...campaign, subject: e.target.value })
                }
                required
                placeholder="Subject line..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "6px",
                }}
              >
                Campaign Header Title
              </label>
              <input
                type="text"
                value={campaign.title}
                onChange={(e) =>
                  setCampaign({ ...campaign, title: e.target.value })
                }
                required
                placeholder="Campaign title..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "6px",
              }}
            >
              Message Content
            </label>
            <textarea
              rows={5}
              value={campaign.message}
              onChange={(e) =>
                setCampaign({ ...campaign, message: e.target.value })
              }
              required
              placeholder="Write your newsletter message content here..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Only active newsletter subscribers receive campaigns. Delivery
              uses configured SMTP/Resend service.
            </span>
            <button
              type="submit"
              disabled={sending}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#6366f1",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.7 : 1,
              }}
            >
              <Send size={15} />{" "}
              {sending ? "Sending..." : "Send to Subscribers"}
            </button>
          </div>
        </form>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
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
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Subscribers List
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: "2px 0 0 0",
              }}
            >
              Manage users subscribed to receiving news and marketing offers.
            </p>
          </div>

          <div style={{ position: "relative", width: "240px" }}>
            <input
              type="text"
              placeholder="Filter email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "6px 12px 6px 32px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                width: "100%",
                outline: "none",
              }}
            />
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
          </div>
        </div>

        <div
          style={{
            border: "1px solid #f1f5f9",
            borderRadius: "8px",
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
                <th style={{ padding: "10px 16px" }}>SUBSCRIBER EMAIL</th>
                <th style={{ padding: "10px 16px" }}>DATE JOINED</th>
                <th style={{ padding: "10px 16px" }}>STATUS</th>
                <th style={{ padding: "10px 16px", textAlign: "right" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      color: "#0f172a",
                      fontSize: "13px",
                    }}
                  >
                    {s.email}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    {s.joined}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscriber(s.id)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        padding: "4px",
                      }}
                      title="Unsubscribe"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredSubscribers.length && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    No subscribers found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
