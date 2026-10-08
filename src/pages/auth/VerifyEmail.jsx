import React from "react";
import { ArrowRight, CheckCircle2, MailCheck, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmail, resendVerification, sendPhoneVerification, verifyPhone, user } = useAuth()
  const pending = JSON.parse(localStorage.getItem('spark-pending-verification') || 'null')
  const email = location.state?.email || pending?.email || user?.email || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [emailVerified, setEmailVerified] = useState(Boolean(user?.verified))
  const [phone, setPhone] = useState(location.state?.phone || user?.phone || '')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneSent, setPhoneSent] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')

  useEffect(() => {
    if (!email) navigate('/register', { replace: true })
  }, [email, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await verifyEmail(email, code)
    if (!result.ok) return setError(result.message)
    setEmailVerified(true)
  }

  const resend = async () => {
    const result = await resendVerification(email)
    if (!result.ok) return setError(result.message)
    setError('')
  }

  const sendPhone = async () => {
    setPhoneMessage('')
    const result = await sendPhoneVerification(phone)
    if (!result.ok) return setPhoneMessage(result.message)
    setPhoneSent(true)
    setPhoneMessage(result.message)
  }

  const submitPhone = async (e) => {
    e.preventDefault()
    const result = await verifyPhone(phoneCode)
    setPhoneMessage(result.message)
    if (result.ok) setPhoneSent(false)
  }

  const finish = () => navigate('/', { replace: true })

  return <div className="auth-shell"><div className="auth-brand"><Logo light /><div className="auth-brand-copy"><span>ACCOUNT VERIFICATION</span><h1>One more step.<br />Then you're in.</h1><p>Verify your email and secure your account with phone OTP.</p></div><div className="auth-brand-foot">Email verification · SMS OTP</div></div><div className="auth-panel"><div className="auth-content"><div className="mobile-auth-logo"><Link to="/"><Logo /></Link></div><div className="auth-icon-circle"><MailCheck size={24} /></div><span className="eyebrow">EMAIL VERIFICATION</span><h1>{emailVerified ? 'Email verified' : 'Verify your email'}</h1><p className="auth-subtitle">{emailVerified ? <>Your email <strong>{email}</strong> is verified.</> : <>Enter the 6-digit code sent to <strong>{email}</strong>.</>}</p>{error && <div className="auth-alert error">{error}</div>}{emailVerified ? <div className="auth-alert success"><CheckCircle2 size={16} /> Email verification completed successfully.</div> : <><form onSubmit={submit} className="auth-form"><label>Verification code<input className="code-input" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" required /></label><button className="btn btn-primary full" type="submit">Verify email <ArrowRight size={17} /></button></form><button className="text-button" type="button" onClick={resend}>Resend code</button></>}
{(phone || location.state?.phoneAvailable) && <div className="verification-section"><div className="verification-section-head"><Phone size={18} /><div><span className="eyebrow">PHONE VERIFICATION</span><h2>Verify your phone</h2></div></div><label>Phone number<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2010xxxxxxxx" /></label>{phoneSent && <form onSubmit={submitPhone} className="auth-form"><label>SMS code<input className="code-input" inputMode="numeric" maxLength={6} value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" required /></label><button className="btn btn-primary full" type="submit">Verify phone</button></form>}{phoneMessage && <div className={`auth-alert ${phoneMessage.includes('successfully') || phoneMessage.includes('sent') ? 'success' : 'error'}`}>{phoneMessage}</div>}{!phoneSent && !user?.phoneVerified && <button className="btn btn-light full" type="button" onClick={sendPhone}>Send SMS code</button>}</div>}
{emailVerified && <button className="btn btn-primary full" type="button" onClick={finish}>Continue to Spark Store <ArrowRight size={17} /></button>}<p className="auth-switch"><Link to="/login">Back to sign in</Link></p></div></div></div>
}
