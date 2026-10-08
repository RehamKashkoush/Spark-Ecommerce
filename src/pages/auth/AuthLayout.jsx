import React from "react";
import { Outlet } from 'react-router-dom'
import Logo from '../../components/common/Logo'

export default function AuthLayout() {
  return <div className="auth-shell"><div className="auth-brand"><Logo light /><div className="auth-brand-copy"><span>SPARK COMMERCE</span><h1>Everything you need.<br />One beautiful place.</h1><p>A modern commerce experience connecting customers, sellers and platform teams.</p></div><div className="auth-brand-foot">Trusted shopping · Secure payments · Fast delivery</div></div><div className="auth-panel"><Outlet /></div></div>
}
