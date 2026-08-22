import React, { useState, useEffect } from "react";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";

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
  // LANGUAGE
  // =====================================

  const [language, setLanguage] = useState(
    localStorage.getItem("bulkbridge_language") || "English"
  );


  // =====================================
  // CHECK LANGUAGE WHEN PAGE/ROUTE CHANGES
  // =====================================

  useEffect(() => {

    const checkLanguage = () => {

      setLanguage(
        localStorage.getItem("bulkbridge_language") || "English"
      );

    };

    checkLanguage();

    window.addEventListener(
      "storage",
      checkLanguage
    );

    return () => {

      window.removeEventListener(
        "storage",
        checkLanguage
      );

    };

  }, []);


  // =====================================
  // TRANSLATIONS
  // =====================================

  const translations = {

    English: {

      tag: "From Farm to Market, Seamlessly",

      title1: "Fresh Produce,",
      title2: "Stronger",
      title3: "Connections",

      description:
        "BulkBridge connects farmers and buyers for quality produce, fair prices and reliable delivery. Building a better agri-future together.",

      getStarted: "Get Started",
      exploreMarket: "Explore Market",

      freshQuality: "Fresh & Quality",
      produce: "Produce",

      fairPrices: "Fair Prices",
      everyone: "For Everyone",

      fastSafe: "Fast & Safe",
      delivery: "Delivery",

      secure: "Secure",
      transactions: "Transactions",

      farmersOnboarded: "Farmers Onboarded",
      ordersDelivered: "Orders Delivered",
      customerSatisfaction: "Customer Satisfaction",

      thisMonth12: "↑ 12% this month",
      thisMonth18: "↑ 18% this month"

    },


    Marathi: {

      tag: "शेतापासून बाजारपेठेपर्यंत, सहजपणे",

      title1: "ताजे उत्पादन,",
      title2: "मजबूत",
      title3: "नाती",

      description:
        "BulkBridge शेतकरी आणि खरेदीदारांना दर्जेदार उत्पादन, योग्य किंमत आणि विश्वासार्ह वितरणासाठी जोडते. एकत्रितपणे चांगले कृषी भविष्य घडवूया.",

      getStarted: "सुरुवात करा",
      exploreMarket: "बाजारपेठ पहा",

      freshQuality: "ताजे आणि दर्जेदार",
      produce: "उत्पादन",

      fairPrices: "योग्य किंमती",
      everyone: "सर्वांसाठी",

      fastSafe: "जलद आणि सुरक्षित",
      delivery: "वितरण",

      secure: "सुरक्षित",
      transactions: "व्यवहार",

      farmersOnboarded: "सामील झालेले शेतकरी",
      ordersDelivered: "पूर्ण केलेल्या ऑर्डर्स",
      customerSatisfaction: "ग्राहक समाधान",

      thisMonth12: "↑ या महिन्यात 12%",
      thisMonth18: "↑ या महिन्यात 18%"

    },


    Hindi: {

      tag: "खेत से बाजार तक, आसानी से",

      title1: "ताज़ी उपज,",
      title2: "मजबूत",
      title3: "संबंध",

      description:
        "BulkBridge किसानों और खरीदारों को गुणवत्तापूर्ण उपज, उचित कीमत और विश्वसनीय डिलीवरी के लिए जोड़ता है। मिलकर बेहतर कृषि भविष्य बनाएं।",

      getStarted: "शुरू करें",
      exploreMarket: "बाज़ार देखें",

      freshQuality: "ताज़ा और गुणवत्तापूर्ण",
      produce: "उपज",

      fairPrices: "उचित कीमतें",
      everyone: "सभी के लिए",

      fastSafe: "तेज़ और सुरक्षित",
      delivery: "डिलीवरी",

      secure: "सुरक्षित",
      transactions: "लेन-देन",

      farmersOnboarded: "जुड़े हुए किसान",
      ordersDelivered: "डिलीवर किए गए ऑर्डर",
      customerSatisfaction: "ग्राहक संतुष्टि",

      thisMonth12: "↑ इस महीने 12%",
      thisMonth18: "↑ इस महीने 18%"

    }

  };


  // =====================================
  // CURRENT LANGUAGE
  // =====================================

  const t =
    translations[language] ||
    translations.English;


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