import React from "react";
import { useAuth } from '../../context/AuthContext'

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth()

  if (!user) return null

  return (
    <select className="role-switcher" value={user.role} onChange={(e) => switchRole(e.target.value)} aria-label="Demo role">
      <option value="customer">Customer</option>
      <option value="seller">Seller</option>
      <option value="admin">Admin</option>
    </select>
  )
}
