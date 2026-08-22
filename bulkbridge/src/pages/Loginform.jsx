import React, { useEffect, useState } from "react";
import "../styles/Loginform.css";
import { Link, useNavigate } from "react-router-dom";

import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";

import farmer from "../assets/images/farmer.png";
import fruits from "../assets/images/fruits.png";
import cerals from "../assets/images/cerals.png";
import spices from "../assets/images/spices.png";
import market from "../assets/images/market.png";
import vegetables from "../assets/images/vegetables.png";
import seeds from "../assets/images/seeds.png";
import about from "../assets/images/about.png";
import logo from "../assets/images/logo.png";

import { saveUser, dashboardPathForRole } from "../utils/auth";

const images = [
  farmer,
  vegetables,
  fruits,
  seeds,
  cerals,
  spices,
  market,
  about,
];

export default function Loginform() {
  const [currImg, setCurrImg] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrImg((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      saveUser(response.data.user);

      navigate(dashboardPathForRole(response.data.user.role));

    } catch (err) {

      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server is not connected");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-row">

        {/* LEFT SIDE */}

        <div className="login-left">

          <img
            src={images[currImg]}
            alt="Bulkbridge"
          />

        </div>



        {/* RIGHT SIDE */}

        <div className="login-right">

          <form className="login-card" onSubmit={handleSubmit}>

            <div className="logo-title">

              <img
                src={logo}
                alt="Bulkbridge Logo"
                className="logo"
              />

            </div>


            <h2>
              Welcome Back to
              <br />
              <span>BulkBridge</span>
            </h2>


            <p className="subtitle">
              Login to continue your journey
            </p>

            {error && (
              <p style={{ color: "#c62828", fontSize: "13px", margin: "0 0 10px" }}>
                {error}
              </p>
            )}

            <div className="input-box">

              <FiMail className="icon"/>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                required
              />

            </div>



            <div className="input-box">

              <FiLock className="icon" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                required
              />

            </div>



            <div className="forgot">

              <a href="#">
                Forgot Password?
              </a>

            </div>



            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>



        <p className="signup">
            Don't have an account?
            <Link to="/signup">
            Sign Up
            </Link>
        </p>

          </form>

        </div>

      </div>
    </div>
  );
}
