import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout, dashboardPathForRole } from "../utils/auth";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUser());

  const navigate = useNavigate();
  const location = useLocation();


  // =====================================
  // LANGUAGE
  // =====================================

  const getLanguage = () => {
    return localStorage.getItem("bulkbridge_language") || "English";
  };

  const [language, setLanguage] = useState(getLanguage());


  // =====================================
  // RE-CHECK USER AND LANGUAGE
  // =====================================

  useEffect(() => {

    setUser(getUser());

    setLanguage(getLanguage());

  }, [location]);


  // =====================================
  // HANDLE LOGOUT
  // =====================================

  const handleLogout = () => {

    logout();

    setUser(null);

    navigate("/");

  };


  // =====================================
  // TRANSLATIONS
  // =====================================

  const translations = {

    English: {
      home: "Home",
      about: "About",
      services: "Services",
      categories: "Categories",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      tagline: "Bridging Farms. Connecting Markets."
    },

    Marathi: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      services: "सेवा",
      categories: "श्रेणी",
      contact: "संपर्क",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      tagline: "शेतांना जोडणे. बाजारपेठांना जोडणे."
    },

    Hindi: {
      home: "होम",
      about: "हमारे बारे में",
      services: "सेवाएँ",
      categories: "श्रेणियाँ",
      contact: "संपर्क",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      tagline: "खेतों को जोड़ना। बाजारों को जोड़ना।"
    }

  };


  // =====================================
  // CURRENT TRANSLATION
  // =====================================

  const t = translations[language] || translations.English;


  return (

    <nav className="navbar">


      {/* =====================================
          LOGO
      ===================================== */}

      <div className="nav-logo">

        <img
          src={logo}
          alt="BulkBridge Logo"
        />

        <div className="logo-text">

          <h2>
            BulkBridge
          </h2>

          <p>
            {t.tagline}
          </p>

        </div>

      </div>


      {/* =====================================
          HAMBURGER
      ===================================== */}

      <div
        className="menu-icon"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        ☰
      </div>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <div
        className={`nav-menu ${
          menuOpen ? "active" : ""
        }`}
      >


        {/* NAVIGATION LINKS */}

        <ul className="nav-links">

          <li>
            <Link to="/">
              {t.home}
            </Link>
          </li>


          <li>
            <Link to="/about">
              {t.about}
            </Link>
          </li>


          <li>
            <Link to="/services">
              {t.services}
            </Link>
          </li>


          <li>
            <Link to="/categories">
              {t.categories}
            </Link>
          </li>


          <li>
            <Link to="/contact">
              {t.contact}
            </Link>
          </li>

        </ul>


        {/* =====================================
            LOGIN / LOGOUT BUTTONS
        ===================================== */}

        <div className="nav-buttons">


          {user ? (

            <>

              <Link
                to={dashboardPathForRole(user.role)}
              >

                <button className="login-btn">

                  Hi,{" "}
                  {user.name
                    ?.split(" ")[0]}

                </button>

              </Link>


              <button
                className="signup-btn"
                onClick={handleLogout}
              >

                {t.logout}

              </button>

            </>

          ) : (

            <>

              <Link to="/login">

                <button className="login-btn">

                  {t.login}

                </button>

              </Link>


              <Link to="/signup">

                <button className="signup-btn">

                  {t.signup}

                </button>

              </Link>

            </>

          )}

        </div>

      </div>

    </nav>

  );

}