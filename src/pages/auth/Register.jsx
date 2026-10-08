import React from "react";
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function Register() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer', referralCode: searchParams.get('ref')?.toUpperCase() || '' })
  const [error, setError] = useState('')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    const result = await register(form)
    if (!result.ok) return setError(result.message)
    navigate('/verify-email', { state: { email: form.email, phone: form.phone, phoneAvailable: result.phoneVerificationAvailable } })
  }

  return <div className="auth-shell"><div className="auth-brand"><Logo light /><div className="auth-brand-copy"><span>SPARK COMMERCE</span><h1>Everything you need.<br />One beautiful place.</h1><p>Create a customer or seller account and continue into the right workspace.</p></div><div className="auth-brand-foot">Customer · Seller · Secure account access</div></div><div className="auth-panel"><div className="auth-content"><div className="mobile-auth-logo"><Link to="/"><Logo /></Link></div><span className="eyebrow">GET STARTED</span><h1>Create your account</h1><p className="auth-subtitle">A real email verification is required before signing in. Add a phone number for SMS OTP.</p>{error && <div className="auth-alert error">{error}</div>}<form onSubmit={submit} className="auth-form"><label>Full name<div className="input-icon"><UserRound size={17} /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required /></div></label><label>Email address<div className="input-icon"><Mail size={17} /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div></label><label>Phone number<div className="input-icon"><Phone size={17} /><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+2010xxxxxxxx" /></div></label><label>Password<div className="input-icon"><LockKeyhole size={17} /><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required /></div></label><label>Referral code (optional)<div className="input-icon"><input value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value.toUpperCase() })} placeholder="SPARK12345" /></div></label><label>Account type<select className="auth-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="customer">Customer</option><option value="seller">Seller</option></select></label><button className="btn btn-primary full" type="submit" disabled={loading}>{loading ? 'Creating account...' : <>Create account <ArrowRight size={17} /></>}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></div></div>
}
