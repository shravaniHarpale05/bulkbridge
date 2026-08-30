import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import api from "../services/api";
import logo from "../assets/images/logo.png";
import "../styles/AuthRecovery.css";

export default function ResetPassword() {
  const [params] = useSearchParams(); const token = useMemo(() => params.get("token") || "", [params]);
  const navigate = useNavigate(); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [loading, setLoading] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const submit = async (e) => { e.preventDefault(); setError(""); setMessage(""); if (!token) return setError("This reset link is missing its token."); if (password.length < 8) return setError("Password must be at least 8 characters."); if (password !== confirm) return setError("Passwords do not match."); setLoading(true); try { const r = await api.post("/api/users/reset-password", { token, password }); setMessage(r.data.message); setTimeout(() => navigate("/login"), 1200); } catch (err) { setError(err.response?.data?.message || "Unable to reset password."); } finally { setLoading(false); } };
  return <div className="recovery-page"><div className="recovery-card"><Link to="/login" className="recovery-back"><FiArrowLeft /> Back to login</Link><img src={logo} alt="BulkBridge" className="recovery-logo" /><div className="recovery-icon"><FiLock /></div><h1>Create a new password</h1><p>Choose a strong password with at least 8 characters.</p>{message && <div className="recovery-alert success">✓ {message}</div>}{error && <div className="recovery-alert error">{error}</div>}<form onSubmit={submit}><label>New password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /><label>Confirm password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required /><button disabled={loading}>{loading ? "Updating…" : "Reset password"}</button></form></div></div>;
}
