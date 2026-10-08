import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function DashboardLayout({ type }) {
  const location = useLocation();
  const isAdmin = type === "admin" || location.pathname.startsWith("/admin");

  const title = isAdmin ? "Admin Control Panel" : "Seller Hub";
  const subtitle = isAdmin
    ? "Platform overview and controls."
    : "Manage your products, orders and payouts.";

  return (
    <div className="dashboard-shell">
      <Sidebar type={isAdmin ? "admin" : "seller"} />
      <section className="dashboard-main">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          key={location.pathname}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
