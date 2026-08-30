import React from "react";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import heroImg from "../assets/images/heroimg.png";

import {
  FaLeaf,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaRupeeSign,
} from "react-icons/fa";

import {
  FiUsers,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

export default function Hero() {

  const navigate = useNavigate();


  // =====================================
  // LANGUAGE (centralized — see src/context/LanguageContext.jsx)
  // =====================================

  const { t: allT } = useLanguage();
  const t = allT.hero;


  return (

    <section
      className="hero"
      id="home"
    >

      <div className="hero-container">


        {/* ==============================
            LEFT
        ============================== */}

        <div className="hero-left">


          {/* TAG */}

          <div className="hero-tag">

            <FaLeaf />

            <span>
              {t.tag}
            </span>

          </div>


          {/* TITLE */}

          <h1>

            {t.title1}

            <br />

            {t.title2}{" "}

            <span>
              {t.title3}
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p>
            {t.description}
          </p>


          {/* BUTTONS */}

          <div className="hero-buttons">


            <button
              className="primary-btn"
              onClick={() =>
                navigate("/signup")
              }
            >

              {t.getStarted}

              <FaArrowRight />

            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/login")
              }
            >

              {t.exploreMarket}

              <FaLeaf />

            </button>


          </div>


          {/* ==============================
              FEATURES
          ============================== */}

          <div className="hero-features">


            {/* FEATURE 1 */}

            <div className="feature">

              <div className="feature-icon">

                <FaLeaf />

              </div>


              <div>

                <h4>
                  {t.freshQuality}
                </h4>

                <span>
                  {t.produce}
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="feature">

              <div className="feature-icon">

                <FaRupeeSign />

              </div>


              <div>

                <h4>
                  {t.fairPrices}
                </h4>

                <span>
                  {t.everyone}
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="feature">

              <div className="feature-icon">

                <FaTruck />

              </div>


              <div>

                <h4>
                  {t.fastSafe}
                </h4>

                <span>
                  {t.delivery}
                </span>

              </div>

            </div>


            {/* FEATURE 4 */}

            <div className="feature">

              <div className="feature-icon">

                <FaShieldAlt />

              </div>


              <div>

                <h4>
                  {t.secure}
                </h4>

                <span>
                  {t.transactions}
                </span>

              </div>

            </div>


          </div>

        </div>


        {/* ==============================
            RIGHT
        ============================== */}

        <div className="hero-right">


          <img
            src={heroImg}
            alt="BulkBridge Hero"
            className="hero-image"
          />


          {/* ==============================
              CARD 1
          ============================== */}

          <div className="floating-card card1">

            <div className="card-icon">

              <FiUsers />

            </div>


            <div>

              <h3>
                500+
              </h3>

              <p>
                {t.farmersOnboarded}
              </p>

              <span>
                {t.thisMonth12}
              </span>

            </div>

          </div>


          {/* ==============================
              CARD 2
          ============================== */}

          <div className="floating-card card2">

            <div className="card-icon">

              <FiShoppingCart />

            </div>


            <div>

              <h3>
                2,400+
              </h3>

              <p>
                {t.ordersDelivered}
              </p>

              <span>
                {t.thisMonth18}
              </span>

            </div>

          </div>


          {/* ==============================
              CARD 3
          ============================== */}

          <div className="floating-card card3">

            <div className="card-icon">

              <FiStar />

            </div>


            <div>

              <h3>
                99%
              </h3>

              <p>
                {t.customerSatisfaction}
              </p>

            </div>

          </div>


        </div>

      </div>

    </section>

  );

}