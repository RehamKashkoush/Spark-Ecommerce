import React from "react";
import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/storefront/CustomerHeader";
import Footer from "../components/common/Footer";

export default function CustomerLayout() {
  return (
    <div
      className="customer-shell"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--page-bg, #f8fafc)",
      }}
    >
      <CustomerHeader />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
