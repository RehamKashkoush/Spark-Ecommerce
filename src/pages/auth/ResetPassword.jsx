import React from "react";
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [form, setForm] = useState({ email: location.state?.email || '', code: '', password: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const result = resetPassword(form.email, form.code, form.password)
    if (!result.ok) return setError(result.message)
    setDone(true)
    setTimeout(() => navigate('/login', { replace: true }), 700)
  }

  return <div className="auth-shell"><div className="auth-brand"><Logo light /><div className="auth-brand-copy"><span>NEW PASSWORD</span><h1>Make it strong.<br />Keep it private.</h1><p>Set a new password for your Spark account.</p></div><div className="auth-brand-foot">Account security</div></div><div className="auth-panel"><div className="auth-content"><div className="mobile-auth-logo"><Link to="/"><Logo /></Link></div><span className="eyebrow">RESET PASSWORD</span><h1>Create a new password</h1><p className="auth-subtitle">Use the reset code prepared in the previous step.</p>{error && <div className="auth-alert error">{error}</div>}{done && <div className="auth-alert success">Password updated. Redirecting to sign in...</div>}<form onSubmit={submit} className="auth-form"><label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>Reset code<input className="code-input" inputMode="numeric" maxLength={6} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, '') })} placeholder="000000" required /></label><label>New password<div className="input-icon"><LockKeyhole size={17} /><input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required /></div></label><button className="btn btn-primary full" type="submit" disabled={done}>Update password <ArrowRight size={17} /></button></form><p className="auth-switch"><Link to="/login">Back to sign in</Link></p></div></div></div>
}
