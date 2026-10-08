import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "spark-user";
const DEMO_ACCOUNTS = {
  "customer@spark.test": { password: "Customer123!", name: "Demo Customer", role: "customer" },
  "seller@spark.test": { password: "Seller123!", name: "Demo Seller", role: "seller" },
  "admin@spark.test": { password: "Admin123!", name: "Demo Admin", role: "admin" },
};

const normalizeRole = (role) => {
  const value = String(role || "customer").toLowerCase();
  return value === "merchant" ? "seller" : ["customer", "seller", "admin"].includes(value) ? value : "customer";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch (error) { console.warn("Unable to save session:", error); }
  }, [user]);

  const login = async ({ email = "", password = "", role } = {}) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const demo = DEMO_ACCOUNTS[normalizedEmail];
      if (demo && demo.password !== password) return { ok: false, message: "Invalid email or password." };
      const selectedRole = normalizeRole(role || demo?.role || (normalizedEmail.includes("admin") ? "admin" : normalizedEmail.includes("seller") ? "seller" : "customer"));
      const loggedUser = {
        id: demo ? `demo-${selectedRole}` : `${Date.now()}`,
        name: demo?.name || normalizedEmail.split("@")[0] || "Customer",
        email: normalizedEmail,
        role: selectedRole,
        verified: true,
        token: `demo-${selectedRole}-token`,
      };
      setUser(loggedUser);
      return { ok: true, user: loggedUser };
    } finally { setLoading(false); }
  };

  const register = async ({ name, email, password } = {}) => login({ email, password, role: "customer" }).then((result) => result.ok ? { ...result, user: { ...result.user, name: name || result.user.name } } : result);
  const googleLogin = async (_credential, role = "customer") => login({ email: `google.${normalizeRole(role)}@spark.test`, password: "", role });
  const phoneLoginRequest = async () => ({ ok: true, message: "Verification code sent." });
  const phoneLogin = async ({ phone, role = "customer" } = {}) => login({ email: `${phone || "phone"}@spark.test`, password: "", role });
  const sendPhoneVerification = phoneLoginRequest;
  const verifyPhone = async () => ({ ok: true, message: "Phone verified." });
  const verifyEmail = async () => ({ ok: true });
  const resendVerification = async () => ({ ok: true, message: "Verification email sent." });
  const requestPasswordReset = async () => ({ ok: true, message: "Reset link sent." });
  const resetPassword = async () => ({ ok: true, message: "Password reset." });
  const switchRole = (role) => { const nextRole = normalizeRole(role); setUser((current) => current ? { ...current, role: nextRole } : current); };
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, setUser, loading, login, register, googleLogin, phoneLoginRequest, phoneLogin, sendPhoneVerification, verifyPhone, verifyEmail, resendVerification, requestPasswordReset, resetPassword, switchRole, logout, isAuthenticated: Boolean(user) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
