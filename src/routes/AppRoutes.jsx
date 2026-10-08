import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Tracking from "../pages/customer/Tracking";
import Profile from "../pages/customer/Profile";
import SavedCards from "../pages/customer/SavedCards";
import Loyalty from "../pages/customer/Loyalty";
import Referrals from "../pages/customer/Referrals";
import Wishlist from "../pages/customer/Wishlist";
import Orders from "../pages/customer/Orders";
import OrderDetails from "../pages/customer/OrderDetails";
import OrderSuccess from "../pages/customer/OrderSuccess";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerPayouts from "../pages/seller/SellerPayouts";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSellers from "../pages/admin/AdminSellers";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminCoupons from "../pages/admin/AdminCoupons";
import AdminContent from "../pages/admin/AdminContent";
import AdminNewsletter from "../pages/admin/AdminNewsletter";
import AdminLoyalty from "../pages/admin/AdminLoyalty";
import AdminReferrals from "../pages/admin/AdminReferrals";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="category/:category" element={<Products />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:id" element={<OrderSuccess />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="wishlist" element={<Wishlist />} />

        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="loyalty" element={<Loyalty />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="saved-cards" element={<SavedCards />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/seller" element={<DashboardLayout type="seller" />}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="payouts" element={<SellerPayouts />} />
      </Route>

      <Route path="/admin" element={<DashboardLayout type="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="loyalty" element={<AdminLoyalty />} />
        <Route path="referrals" element={<AdminReferrals />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
