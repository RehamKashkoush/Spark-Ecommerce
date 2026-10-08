import React from "react";
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!user.verified) return <Navigate to="/verify-email" replace state={{ email: user.email }} />
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
