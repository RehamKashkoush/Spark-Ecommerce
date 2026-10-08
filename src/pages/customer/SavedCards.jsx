import React from "react";
import { useEffect, useState } from 'react'
import { CreditCard, Plus, Star, Trash2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createCardSetupIntent, deleteSavedCard, getSavedCards, setDefaultSavedCard } from '../../services/paymentApi'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function CardSetupForm({ onSaved }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    try {
      const { clientSecret } = await createCardSetupIntent()
      const result = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: elements.getElement(CardElement) } })
      if (result.error) throw new Error(result.error.message)
      await onSaved()
      elements.getElement(CardElement)?.clear()
    } catch (requestError) { setError(requestError.message || 'Unable to save card.') }
    finally { setLoading(false) }
  }
  return <form className="form-card saved-card-form" onSubmit={submit}><h2><Plus /> Add a saved card</h2><p className="secure-payment-note">Card details are sent directly to Stripe. Spark Commerce does not store the full card number or CVV.</p><div className="stripe-card-element"><CardElement options={{ hidePostalCode: false }} /></div>{error && <div className="auth-alert error">{error}</div>}<button className="btn btn-primary" disabled={loading || !stripe}>{loading ? 'Saving card...' : 'Save card securely'}</button></form>
}

export default function SavedCards() {
  const [cards, setCards] = useState([])
  const [defaultId, setDefaultId] = useState(null)
  const [error, setError] = useState('')
  const load = async () => { try { const result = await getSavedCards(); setCards(result.cards || []); setDefaultId(result.defaultPaymentMethodId || null); setError('') } catch (requestError) { setError(requestError.message || 'Unable to load saved cards.') } }
  useEffect(() => { load() }, [])
  const makeDefault = async (id) => { try { const result = await setDefaultSavedCard(id); setDefaultId(result.defaultPaymentMethodId); } catch (requestError) { setError(requestError.message || 'Unable to set default card.') } }
  const remove = async (id) => { try { await deleteSavedCard(id); await load() } catch (requestError) { setError(requestError.message || 'Unable to remove card.') } }
  return <section className="section"><div className="container narrow"><div className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>Saved Cards</h1><p>Manage the cards securely saved with Stripe.</p></div></div>{error && <div className="profile-notice error">{error}</div>}<Elements stripe={stripePromise}><CardSetupForm onSaved={load} /></Elements><div className="saved-cards-list">{cards.map((card) => <div className={`saved-card ${defaultId === card.id ? 'default' : ''}`} key={card.id}><div className="saved-card-icon"><CreditCard /></div><div className="saved-card-main"><strong>{card.brand.toUpperCase()} •••• {card.last4}</strong><span>Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}</span>{defaultId === card.id && <small><Star size={13} /> Default card</small>}</div><div className="saved-card-actions">{defaultId !== card.id && <button className="btn btn-light" type="button" onClick={() => makeDefault(card.id)}>Set default</button>}<button className="icon-btn danger" type="button" onClick={() => remove(card.id)} aria-label="Remove saved card"><Trash2 size={16} /></button></div></div>)}{!cards.length && <div className="empty-state"><CreditCard size={35} /><strong>No saved cards</strong><span>Add a card above and Stripe will securely store the payment method reference.</span></div>}</div></div></section>
}
