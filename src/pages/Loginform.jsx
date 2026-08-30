import React, { useEffect, useState } from "react";
import "../styles/Loginform.css";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../services/api";
import farmer from "../assets/images/farmer.png";
import fruits from "../assets/images/fruits.png";
import cerals from "../assets/images/cerals.png";
import spices from "../assets/images/spices.png";
import market from "../assets/images/market.png";
import vegetables from "../assets/images/vegetables.png";
import seeds from "../assets/images/seeds.png";
import about from "../assets/images/about.png";
import logo from "../assets/images/logo.png";
import { saveAuth, dashboardPathForRole } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";

const images = [farmer, vegetables, fruits, seeds, cerals, spices, market, about];
export default function Loginform() {
  const [currImg, setCurrImg] = useState(0); const navigate = useNavigate(); const { t: allT } = useLanguage(); const t = allT.login;
  const [formData, setFormData] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { const interval = setInterval(() => setCurrImg((p) => (p + 1) % images.length), 3000); return () => clearInterval(interval); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); setError(""); setLoading(true); try { const r = await api.post("/api/users/login", formData); saveAuth(r.data.user, r.data.token); navigate(dashboardPathForRole(r.data.user.role), { replace: true }); } catch (err) { setError(err.response?.data?.message || (err.request ? "Server is not connected." : "Unable to login.")); } finally { setLoading(false); } };
  return <div className="login-container"><div className="login-row"><div className="login-left"><img src={images[currImg]} alt="Fresh agricultural produce" /><div className="login-image-overlay"><strong>BulkBridge</strong><span>Bridging Farms. Connecting Markets.</span></div></div><div className="login-right"><form className="login-card" onSubmit={handleSubmit}><div className="logo-title"><img src={logo} alt="BulkBridge Logo" className="logo" /></div><h2>{t.welcomeBack}<br/><span>BulkBridge</span></h2><p className="subtitle">{t.subtitle}</p>{error && <div className="auth-inline-error">{error}</div>}<div className="input-box"><FiMail className="icon"/><input type="email" name="email" value={formData.email} onChange={(e) => {setFormData({...formData,email:e.target.value});setError("")}} placeholder={t.emailPlaceholder} autoComplete="email" required /></div><div className="input-box"><FiLock className="icon"/><input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={(e) => {setFormData({...formData,password:e.target.value});setError("")}} placeholder={t.passwordPlaceholder} autoComplete="current-password" required/><button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">{showPassword ? <FiEyeOff/> : <FiEye/>}</button></div><div className="forgot"><Link to="/forgot-password">{t.forgotPassword}</Link></div><button type="submit" disabled={loading}>{loading ? t.loggingIn : t.loginBtn}</button><p className="signup">{t.noAccount} <Link to="/signup">{t.signupLink}</Link></p></form></div></div></div>;
}
