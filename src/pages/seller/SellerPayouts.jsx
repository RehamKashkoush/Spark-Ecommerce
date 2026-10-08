import React, { useEffect, useState } from "react";
import { DollarSign, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import * as sellerApi from "../../services/sellerApi";

const demoPayouts = [
  {
    id: "PAY-801",
    amount: 450.0,
    method: "Bank Transfer",
    date: "2026-09-15",
    status: "Completed",
  },
  {
    id: "PAY-802",
    amount: 850.0,
    method: "PayPal",
    date: "2026-09-28",
    status: "Pending",
  },
];

export default function SellerPayouts() {
  const [payouts, setPayouts] = useState(demoPayouts);
  const [loading, setLoading] = useState(true);
  const [requestAmount, setRequestAmount] = useState("200");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (sellerApi.getSellerPayouts) {
      sellerApi
        .getSellerPayouts()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setPayouts(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleRequestPayout = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(requestAmount) || 0;
    if (amountNum <= 0) return;

    const newPayout = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      amount: amountNum,
      method: "Bank Transfer",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setPayouts([newPayout, ...payouts]);
    setNotice(
      `Payout request of $${amountNum.toFixed(2)} submitted successfully!`,
    );
    setRequestAmount("");
    setTimeout(() => setNotice(""), 4000);
  };

  if (loading) {
    return <div className="loading-card">Loading payouts...</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FINANCE</span>
          <h1>Seller Payouts</h1>
          <p>Manage your earnings, payout history and request withdrawals.</p>
        </div>
      </div>

      {notice && (
        <div
          className="profile-notice success"
          style={{ marginBottom: "16px" }}
        >
          {notice}
        </div>
      )}

      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={20} />
          </div>
          <div className="stat-info">
            <span>Available Balance</span>
            <strong>$1,250.00</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span>Pending Payouts</span>
            <strong>$850.00</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span>Total Paid Out</span>
            <strong>$3,450.00</strong>
          </div>
        </div>
      </div>

      <div
        className="form-card"
        style={{ marginBottom: "24px", padding: "20px" }}
      >
        <h3>Request Payout</h3>
        <form
          onSubmit={handleRequestPayout}
          className="inline-actions"
          style={{ marginTop: "12px", gap: "12px" }}
        >
          <input
            type="number"
            min="10"
            step="0.01"
            placeholder="Amount ($)"
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            required
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              maxWidth: "200px",
            }}
          />
          <button className="btn btn-primary" type="submit">
            Request Withdrawal <ArrowUpRight size={16} />
          </button>
        </form>
      </div>

      <div className="form-card" style={{ padding: "0", overflow: "hidden" }}>
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
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>PAYOUT ID</th>
              <th style={{ padding: "12px 16px" }}>AMOUNT</th>
              <th style={{ padding: "12px 16px" }}>METHOD</th>
              <th style={{ padding: "12px 16px" }}>DATE</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((pay) => (
              <tr key={pay.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  {pay.id}
                </td>
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  ${Number(pay.amount).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {pay.method}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {pay.date}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    className={`status-pill ${pay.status === "Completed" ? "success" : "warning"}`}
                  >
                    {pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
