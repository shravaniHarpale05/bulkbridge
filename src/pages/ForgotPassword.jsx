import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import api from "../services/api";
import logo from "../assets/images/logo.png";
import "../styles/AuthRecovery.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devLink, setDevLink] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage(""); setError(""); setDevLink("");
    try {
      const response = await api.post("/api/users/forgot-password", { email: email.trim() });
      setMessage(response.data.message);
      if (response.data.devResetUrl) setDevLink(response.data.devResetUrl);
    } catch (err) { setError(err.response?.data?.message || "Unable to start password reset."); }
    finally { setLoading(false); }
  };

  return <div className="recovery-page"><div className="recovery-card">
    <Link to="/login" className="recovery-back"><FiArrowLeft /> Back to login</Link>
    <img src={logo} alt="BulkBridge" className="recovery-logo" />
    <div className="recovery-icon"><FiMail /></div>
    <h1>Forgot your password?</h1>
    <p>Enter the email linked to your BulkBridge account. We'll create a secure reset link valid for 15 minutes.</p>
    {message && <div className="recovery-alert success">✓ {message}</div>}
    {error && <div className="recovery-alert error">{error}</div>}
    <form onSubmit={submit}>
      <label>Email address</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <button disabled={loading}>{loading ? "Creating reset link…" : "Send reset link"}</button>
    </form>
    {devLink && <div className="dev-reset"><strong>Local development reset link</strong><a href={devLink}>{devLink}</a><small>Configure SMTP in Backend/.env before production so reset links are delivered by email.</small></div>}
  </div></div>;
}
