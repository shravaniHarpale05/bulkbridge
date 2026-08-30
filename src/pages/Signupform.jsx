import React, { useState } from "react";
import "../styles/Signupform.css";
import { Link, useNavigate } from "react-router-dom";

import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { GiFarmer } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";

import api from "../services/api";

import logo from "../assets/images/logo.png";
import { saveAuth, dashboardPathForRole } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";

export default function Signupform() {
  const navigate = useNavigate();
  const { t: allT } = useLanguage();
  const t = allT.signup;

  // Role
  const [role, setRole] = useState("farmer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 8) return setError("Password must be at least 8 characters.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (!formData.terms) return setError("Please accept the Terms & Conditions.");
    if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ""))) return setError("Phone number must contain exactly 10 digits.");
    setLoading(true);
    try {
      const response = await api.post("/api/users/register", { name: formData.name.trim(), phone: formData.phone.replace(/\s+/g, ""), email: formData.email.trim(), password: formData.password, role });
      saveAuth(response.data.user, response.data.token);
      navigate(dashboardPathForRole(response.data.user.role), { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || (error.request ? "Cannot connect to the server." : "Signup failed. Please try again."));
    } finally { setLoading(false); }
  };

  return (
    <div className="signup-page">

      {/* Decorative background shapes */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="signup-wrapper">

        {/* HEADER */}
        <div className="signup-header">

          <img
            src={logo}
            alt="BulkBridge Logo"
            className="signup-logo-img"
          />

          <h1>
            {t.title}
          </h1>

          <p>
            {t.subtitle}
          </p>

        </div>

        {/* ROLE SWITCHER */}
        <div className="role-switch">

          <div
            className={`switch-slider ${
              role === "buyer" ? "right" : ""
            }`}
          ></div>

          <button
            type="button"
            className={role === "farmer" ? "active" : ""}
            onClick={() => setRole("farmer")}
          >
            <GiFarmer />
            {t.farmer}
          </button>

          <button
            type="button"
            className={role === "buyer" ? "active" : ""}
            onClick={() => setRole("buyer")}
          >
            <HiOutlineShoppingBag />
            {t.buyer}
          </button>

        </div>

        {error && <div className="signup-error">{error}</div>}

        {/* FORM */}
        <form
          className="signup-form-card"
          onSubmit={handleSubmit}
        >

          {/* NAME + PHONE */}
          <div className="field-row">

            <div className="field-group">

              <label>
                <FiUser />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

            <div className="field-group">

              <label>
                <FiPhone />
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
              />

            </div>

          </div>

          {/* EMAIL */}
          <div className="field-group full">

            <label>
              <FiMail />
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="field-row">

            <div className="field-group">

              <label>
                <FiLock />
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

            </div>

            <div className="field-group">

              <label>
                <FiLock />
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />

            </div>

          </div>

          {/* TERMS */}
          <label className="terms">

            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />

            <span>
              I agree to the{" "}
              <a href="#">
                Terms & Conditions
              </a>
            </span>

          </label>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="create-btn"
            disabled={loading}
          >
            {loading ? t.signingUp : t.signupBtn}
          </button>

          {/* LOGIN */}
          <p className="already">

            {t.haveAccount}{" "}

            <Link to="/login">
              {t.loginLink}
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}