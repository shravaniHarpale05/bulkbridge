import React from "react";
import "../styles/About.css";
import { useNavigate } from "react-router-dom";
import aboutImg from "../assets/images/about.png";

import { FaLeaf, FaHandshake, FaTruck, FaRupeeSign } from "react-icons/fa";
import { FiUsers, FiPackage } from "react-icons/fi";
import { BsCartCheck } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";

export default function About() {
  const navigate = useNavigate();
  return (
    <section className="about-section">

      <div className="about-container">

        {/* LEFT IMAGE */}

        <div className="about-left">
          <img src={aboutImg} alt="BulkBridge Warehouse" />
        </div>

        {/* RIGHT CONTENT */}

        <div className="about-right">

          <span className="about-tag">
            🌿 ABOUT BULKBRIDGE
          </span>

          <h1>
            Building a Smarter Bridge <br />
            Between <span>Farmers & Buyers</span>
          </h1>

          <p className="about-desc">
            BulkBridge is a digital marketplace that connects farmers
            directly with retailers, wholesalers, hotels,
            restaurants and bulk buyers.

            Our platform helps farmers sell fresh produce at fair
            prices while enabling buyers to source products
            quickly, safely and conveniently.
          </p>

          {/* FEATURES */}

          <div className="features">

            <div className="card">
              <FaLeaf className="feature-icon"/>
              <h3>Fresh Produce</h3>
              <p>Directly sourced from farms with premium quality.</p>
            </div>

            <div className="card">
              <FaHandshake className="feature-icon"/>
              <h3>Direct Connection</h3>
              <p>No middlemen. Farmers connect directly with buyers.</p>
            </div>

            <div className="card">
              <FaTruck className="feature-icon"/>
              <h3>Fast Delivery</h3>
              <p>Reliable delivery for every bulk order.</p>
            </div>

            <div className="card">
              <FaRupeeSign className="feature-icon"/>
              <h3>Fair Pricing</h3>
              <p>Transparent pricing that benefits everyone.</p>
            </div>

          </div>

          {/* STATS */}

          <div className="stats">

            <div className="stat-box">
              <FiUsers className="stat-icon"/>
              <h2>500+</h2>
              <p>Farmers</p>
            </div>

            <div className="stat-box">
              <FiPackage className="stat-icon"/>
              <h2>2000+</h2>
              <p>Products</p>
            </div>

            <div className="stat-box">
              <BsCartCheck className="stat-icon"/>
              <h2>2400+</h2>
              <p>Orders</p>
            </div>

            <div className="stat-box">
              <AiOutlineStar className="stat-icon"/>
              <h2>99%</h2>
              <p>SatisfactionNNNNN</p>
            </div>

          </div>

          <button
            className="about-btn"
            onClick={() => navigate("/login")}
          >
            Explore Marketplace →
          </button>

        </div>

      </div>

    </section>
  );
}