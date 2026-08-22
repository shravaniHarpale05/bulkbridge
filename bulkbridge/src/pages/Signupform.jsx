import React, { useState } from "react";
import "../styles/Signupform.css";
import { Link, useNavigate } from "react-router-dom";

import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { GiFarmer } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";

import axios from "axios";

import logo from "../assets/images/logo.png";
import { saveUser, dashboardPathForRole } from "../utils/auth";

export default function Signupform() {
  const navigate = useNavigate();

  // Role
  const [role, setRole] = useState("farmer");

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

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Terms validation
    if (!formData.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    try {
      // IMPORTANT:
      // Backend route is /register, NOT /signup
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: role,
        }
      );

      console.log("Signup successful:", response.data);

      // Check whether user was returned
      if (!response.data || !response.data.user) {
        alert(
          response.data?.message ||
            "Account created, but user information was not returned."
        );
        return;
      }

      // Save user
      saveUser(response.data.user);

      // Navigate according to role
      navigate(dashboardPathForRole(response.data.user.role));
    } catch (error) {
      console.error("Signup Error:", error);

      // Backend responded
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);

        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.msg ||
          "Signup failed. Please try again.";

        alert(message);
      }

      // Server is not responding
      else if (error.request) {
        console.error("No response from server:", error.request);

        alert(
          "Cannot connect to server. Please make sure your backend server is running on port 5000."
        );
      }

      // Other error
      else {
        console.error("Error:", error.message);

        alert(
          error.message || "Something went wrong. Please try again."
        );
      }
    }
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
            Join <span>BulkBridge</span>
          </h1>

          <p>
            Bridging Farms. Connecting Markets.
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
            I'm a Farmer
          </button>

          <button
            type="button"
            className={role === "buyer" ? "active" : ""}
            onClick={() => setRole("buyer")}
          >
            <HiOutlineShoppingBag />
            I'm a Buyer
          </button>

        </div>

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
          >
            Create{" "}
            {role === "farmer"
              ? "Farmer"
              : "Buyer"
            }{" "}
            Account
          </button>

          {/* LOGIN */}
          <p className="already">

            Already have an account?{" "}

            <Link to="/login">
              Login Here
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}