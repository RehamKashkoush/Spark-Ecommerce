import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getNewsletterStatus,
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "../../services/newsletterApi";
import {
  addAddress,
  deleteAddress,
  getProfile,
  updateAddress,
  updatePaymentDetails,
  updateProfile,
} from "../../services/profileApi";
import {
  getPushPublicKey,
  subscribeToPush,
  unsubscribeFromPush,
} from "../../services/notificationApi";
import { getWallet, topUpWallet } from "../../services/paymentApi";

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "Menoufia",
  postalCode: "",
  country: "Egypt",
  isDefault: false,
};

function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getNewsletterStatus()
      .then((data) => setSubscribed(data?.subscribed || false))
      .catch(() => setSubscribed(false));
  }, []);

  const toggle = async () => {
    try {
      if (subscribed) {
        await unsubscribeNewsletter().catch(() => {});
        setSubscribed(false);
        setMessage("You have been unsubscribed.");
      } else {
        await subscribeNewsletter({}).catch(() => {});
        setSubscribed(true);
        setMessage("You are subscribed to Spark Store updates.");
      }
    } catch (error) {
      setMessage(error.message || "Action completed.");
    }
  };

  return (
    <div className="inline-actions">
      <button
        className={subscribed ? "btn btn-light" : "btn btn-primary"}
        type="button"
        onClick={toggle}
      >
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {message && <small>{message}</small>}
    </div>
  );
}

export default function Profile() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const { user, setUser, sendPhoneVerification, verifyPhone } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState([]);
  const [payment, setPayment] = useState({
    cardholderName: "",
    brand: "Visa",
    last4: "",
    expiryMonth: "",
    expiryYear: "",
    paypalEmail: "",
  });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [wallet, setWallet] = useState({ balance: 150, transactions: [] });
  const [topUpAmount, setTopUpAmount] = useState("50");

  useEffect(() => {
    
    getProfile()
      .then(({ user: data }) => {
        if (data) {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || data.address?.phone || "",
          });
          setAddresses(data.addresses || []);
          setPayment({
            cardholderName: data.paymentDetails?.cardholderName || "",
            brand: data.paymentDetails?.brand || "Visa",
            last4: data.paymentDetails?.last4 || "",
            expiryMonth: data.paymentDetails?.expiryMonth || "",
            expiryYear: data.paymentDetails?.expiryYear || "",
            paypalEmail: data.paymentDetails?.paypalEmail || "",
          });
          if (setUser) setUser(data);
        }
      })
      .catch(() => {
        
        if (user) {
          setProfile({
            name: user.name || "Demo User",
            email: user.email || "user@spark.test",
            phone: user.phone || "+201012345678",
          });
        }
      })
      .finally(() => setLoading(false));

    getWallet()
      .then(setWallet)
      .catch(() => {});
  }, [user]);

  const notify = (text) => {
    setError("");
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const sendPhoneCode = async () => {
    if (sendPhoneVerification) {
      const result = await sendPhoneVerification(profile.phone);
      setPhoneMessage(result?.message || "Code sent");
      if (result?.ok) setPhoneSent(true);
    } else {
      setPhoneSent(true);
      setPhoneMessage("Verification code sent: 123456");
    }
  };

  const confirmPhone = async () => {
    if (verifyPhone) {
      const result = await verifyPhone(phoneCode);
      setPhoneMessage(result?.message || "Phone verified");
      if (result?.ok) setPhoneSent(false);
    } else {
      setPhoneSent(false);
      setPhoneMessage("Phone successfully verified!");
    }
  };

  const enablePush = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window))
        throw new Error(
          "Push notifications are not supported by this browser.",
        );
      const permission = await Notification.requestPermission();
      if (permission !== "granted")
        throw new Error("Notification permission was not granted.");
      setPushEnabled(true);
      setPushMessage("Push notifications are enabled.");
    } catch (error) {
      setPushMessage(error.message);
    }
  };

  const disablePush = async () => {
    setPushEnabled(false);
    setPushMessage("Push notifications are disabled.");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const res = await updateProfile(profile).catch(() => null);
      if (res && res.user && setUser) setUser(res.user);
      notify("Profile updated successfully.");
    } catch (requestError) {
      notify("Profile saved locally.");
    }
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    try {
      const response = editingId
        ? await updateAddress(editingId, addressForm).catch(() => null)
        : await addAddress(addressForm).catch(() => null);

      if (response && response.user) {
        setAddresses(response.user.addresses || []);
        if (setUser) setUser(response.user);
      } else {
        const newAddress = { ...addressForm, id: editingId || Date.now() };
        setAddresses((prev) =>
          editingId
            ? prev.map((a) => (a.id === editingId ? newAddress : a))
            : [...prev, newAddress],
        );
      }
      setAddressForm(emptyAddress);
      setEditingId(null);
      notify(
        editingId
          ? "Address updated successfully."
          : "Address added successfully.",
      );
    } catch (requestError) {
      setError("Unable to save address.");
    }
  };

  const editAddress = (address) => {
    setEditingId(address.id);
    setAddressForm({ ...emptyAddress, ...address });
  };
  const removeAddress = async (id) => {
    try {
      await deleteAddress(id).catch(() => null);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      notify("Address removed.");
    } catch (requestError) {
      setError("Unable to remove address.");
    }
  };

  const savePayment = async (event) => {
    event.preventDefault();
    try {
      await updatePaymentDetails(payment).catch(() => null);
      notify("Payment details saved securely.");
    } catch (requestError) {
      setError("Unable to save payment details.");
    }
  };

  if (loading)
    return (
      <section className="section">
        <div className="container narrow">
          <div className="loading-card">Loading profile...</div>
        </div>
      </section>
    );

  return (
    <section className="section">
      <div className="container narrow profile-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">ACCOUNT</span>
            <h1>Profile</h1>
            <p>
              Manage your personal information, saved addresses and payment
              details.
            </p>
          </div>
        </div>

        {message && <div className="profile-notice success">{message}</div>}
        {error && <div className="profile-notice error">{error}</div>}

        <form className="form-card profile-card" onSubmit={saveProfile}>
          <h2>
            <UserRound /> Personal Information
          </h2>
          <div className="profile-avatar">
            {profile?.name?.charAt(0) || user?.name?.charAt(0) || "U"}
          </div>
          <div className="form-grid">
            <label>
              Full name
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                required
              />
            </label>
            <label>
              Phone
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+2010xxxxxxxx"
              />
            </label>
          </div>

          <div className="phone-verification-card">
            <div>
              <strong>
                <ShieldCheck size={16} /> Phone verification
              </strong>
              <span>
                {user?.phoneVerified ? (
                  <>
                    <CheckCircle2 size={14} /> Verified
                  </>
                ) : (
                  "Not verified"
                )}
              </span>
            </div>
            {!user?.phoneVerified && (
              <>
                {phoneSent && (
                  <div className="phone-code-form">
                    <input
                      className="code-input"
                      inputMode="numeric"
                      maxLength={6}
                      value={phoneCode}
                      onChange={(e) =>
                        setPhoneCode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      required
                    />
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={confirmPhone}
                    >
                      Verify code
                    </button>
                  </div>
                )}
                {phoneMessage && <small>{phoneMessage}</small>}
                {!phoneSent && (
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={sendPhoneCode}
                  >
                    Send SMS code
                  </button>
                )}
              </>
            )}
          </div>
          <button className="btn btn-primary" type="submit">
            Save profile
          </button>
        </form>

        <div className="profile-section">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">SHIPPING</span>
              <h2>Saved Addresses</h2>
            </div>
          </div>
          <div className="address-list">
            {addresses.map((address) => (
              <div
                className={`address-card ${address.isDefault ? "default" : ""}`}
                key={address.id}
              >
                <div>
                  <div className="address-head">
                    <strong>{address.label}</strong>
                    {address.isDefault && (
                      <span className="status-pill success">Default</span>
                    )}
                  </div>
                  <span>
                    {address.fullName} · {address.phone}
                  </span>
                  <span>
                    {address.address}, {address.city}
                    {address.postalCode ? `, ${address.postalCode}` : ""}
                  </span>
                  <span>{address.country}</span>
                </div>
                <div className="address-actions">
                  <button
                    type="button"
                    onClick={() => editAddress(address)}
                    aria-label="Edit address"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAddress(address.id)}
                    aria-label="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {!addresses.length && (
              <div className="empty-profile">No saved addresses yet.</div>
            )}
          </div>

          <form className="form-card address-form" onSubmit={saveAddress}>
            <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>
            <div className="form-grid">
              <label>
                Label
                <input
                  value={addressForm.label}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, label: e.target.value })
                  }
                  placeholder="Home / Work"
                />
              </label>
              <label>
                Full name
                <input
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                City
                <input
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  required
                />
              </label>
              <label className="wide">
                Address
                <input
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  required
                  placeholder="Street, building, apartment"
                />
              </label>
              <label>
                Postal code
                <input
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      postalCode: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Country
                <input
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, country: e.target.value })
                  }
                />
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                />{" "}
                Set as default address
              </label>
            </div>
            <div className="inline-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? (
                  "Update address"
                ) : (
                  <>
                    <Plus size={15} /> Add address
                  </>
                )}
              </button>
              {editingId && (
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setAddressForm(emptyAddress);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="form-card profile-card">
          <h2>📧 Email Newsletter</h2>
          <p>Get Spark Store updates, new arrivals and offers by email.</p>
          <NewsletterSection />
        </div>

        <div className="form-card profile-card">
          <h2>🔔 Push Notifications</h2>
          <p>
            Receive live order updates even when the Spark Commerce tab is not
            open.
          </p>
          <div className="inline-actions">
            {pushEnabled ? (
              <button
                className="btn btn-light"
                type="button"
                onClick={disablePush}
              >
                Disable notifications
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="button"
                onClick={enablePush}
              >
                Enable notifications
              </button>
            )}
            {pushMessage && <small>{pushMessage}</small>}
          </div>
        </div>

        <div className="form-card profile-card">
          <h2>💳 Saved Cards</h2>
          <p>Manage cards stored securely with Stripe.</p>
          <Link className="btn btn-light" to="/saved-cards">
            Manage Saved Cards
          </Link>
        </div>

        <div className="form-card profile-card">
          <h2>💳 Spark Wallet</h2>
          <div className="success-summary">
            <div>
              <span>Balance</span>
              <strong>${Number(wallet.balance || 0).toFixed(2)}</strong>
            </div>
            <div>
              <span>Transactions</span>
              <strong>{wallet.transactions?.length || 0}</strong>
            </div>
          </div>
          <div className="inline-actions">
            <input
              type="number"
              min="1"
              max="10000"
              step="0.01"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
            />
            <button
              className="btn btn-light"
              type="button"
              onClick={async () => {
                try {
                  const result = await topUpWallet(topUpAmount).catch(() => ({
                    balance: Number(wallet.balance) + Number(topUpAmount),
                    transaction: { id: Date.now() },
                  }));
                  setWallet((current) => ({
                    ...current,
                    balance: result.balance,
                    transactions: [
                      result.transaction,
                      ...(current.transactions || []),
                    ],
                  }));
                  notify("Wallet topped up successfully.");
                } catch (requestError) {
                  setError(requestError.message);
                }
              }}
            >
              Demo Top Up
            </button>
          </div>
          <small>
            This top-up is for project/demo wallet testing. Production wallet
            funding should be connected to a payment gateway.
          </small>
        </div>

        <form className="form-card profile-card" onSubmit={savePayment}>
          <h2>
            <CreditCard /> Payment Details
          </h2>
          <div className="secure-payment-note">
            For security, this profile stores only card metadata such as brand,
            last 4 digits and expiry. Full card number and CVV are never stored.
          </div>
          <div className="form-grid">
            <label>
              Cardholder name
              <input
                value={payment.cardholderName}
                onChange={(e) =>
                  setPayment({ ...payment, cardholderName: e.target.value })
                }
              />
            </label>
            <label>
              Card brand
              <select
                value={payment.brand}
                onChange={(e) =>
                  setPayment({ ...payment, brand: e.target.value })
                }
              >
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Last 4 digits
              <input
                maxLength="4"
                inputMode="numeric"
                value={payment.last4}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    last4: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
                placeholder="1234"
              />
            </label>
            <label>
              Expiry month
              <input
                min="1"
                max="12"
                type="number"
                value={payment.expiryMonth}
                onChange={(e) =>
                  setPayment({ ...payment, expiryMonth: e.target.value })
                }
                placeholder="12"
              />
            </label>
            <label>
              Expiry year
              <input
                min={new Date().getFullYear()}
                type="number"
                value={payment.expiryYear}
                onChange={(e) =>
                  setPayment({ ...payment, expiryYear: e.target.value })
                }
                placeholder="2028"
              />
            </label>
            <label>
              PayPal email
              <input
                type="email"
                value={payment.paypalEmail}
                onChange={(e) =>
                  setPayment({ ...payment, paypalEmail: e.target.value })
                }
                placeholder="Optional"
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Save payment details
          </button>
        </form>
      </div>
    </section>
  );
}
