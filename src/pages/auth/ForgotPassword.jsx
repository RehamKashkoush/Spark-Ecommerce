import React from "react";
import { ArrowRight, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [demoCode, setDemoCode] = useState('')
  const { requestPasswordReset } = useAuth()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const result = requestPasswordReset(email)
    setMessage(result.message || 'Reset instructions are ready.')
    if (result.code) setDemoCode(result.code)
  }

  return <div className="auth-shell"><div className="auth-brand"><Logo light /><div className="auth-brand-copy"><span>ACCOUNT RECOVERY</span><h1>Need a fresh<br />password?</h1><p>Enter your email and we'll prepare a secure reset flow.</p></div><div className="auth-brand-foot">Secure account recovery</div></div><div className="auth-panel"><div className="auth-content"><div className="mobile-auth-logo"><Link to="/"><Logo /></Link></div><span className="eyebrow">RECOVER ACCOUNT</span><h1>Forgot your password?</h1><p className="auth-subtitle">Enter the email connected to your account.</p>{message && <div className="auth-alert success">{message}</div>}{demoCode && <div className="demo-code">Demo reset code: <strong>{demoCode}</strong></div>}<form onSubmit={submit} className="auth-form"><label>Email address<div className="input-icon"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label><button className="btn btn-primary full" type="submit">Prepare reset <ArrowRight size={17} /></button></form>{demoCode && <button className="btn btn-soft full" type="button" onClick={() => navigate('/reset-password', { state: { email } })}>Continue to reset password</button>}<p className="auth-switch"><Link to="/login">Back to sign in</Link></p></div></div></div>
}
