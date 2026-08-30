import React, { useState, useEffect } from "react";  //react,usestate ani useeffect import kel ahe 
import "../styles/Navbar.css";        //ithe css import keli ahe
import logo from "../assets/images/logo.png";   // img import keli ahe 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout, dashboardPathForRole } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();


  // =====================================
  // LANGUAGE (centralized — see src/context/LanguageContext.jsx)
  // =====================================

  const { t: allT } = useLanguage();
  const t = allT.navbar;


  // =====================================
  // RE-CHECK USER ON ROUTE CHANGE
  // =====================================

  useEffect(() => {

    setUser(getUser());
    if (getUser()) { api.get("/api/notifications").then((r) => { setNotifications(r.data.notifications || []); setUnread(r.data.unread || 0); }).catch(() => {}); }
  }, [location]);


  // =====================================
  // HANDLE LOGOUT
  // =====================================

  const handleLogout = () => {

    logout();

    setUser(null);

    navigate("/");

  };


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

              <button className="notification-btn" onClick={() => setNotificationOpen((v) => !v)} aria-label="Notifications">🔔{unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}</button>
              {notificationOpen && <div className="notification-popover"><div className="notification-head"><strong>Notifications</strong>{unread > 0 && <button onClick={() => { api.patch("/api/notifications/read-all"); setUnread(0); setNotifications((items) => items.map((n) => ({...n, readAt:new Date().toISOString()}))); }}>Mark all read</button>}</div>{notifications.length === 0 ? <p>No notifications yet.</p> : notifications.slice(0,6).map((n) => <button className={`notification-item ${n.readAt ? "" : "unread"}`} key={n._id} onClick={async () => { if (!n.readAt) { await api.patch(`/api/notifications/${n._id}/read`); setUnread((u) => Math.max(0,u-1)); } setNotificationOpen(false); if (n.link) navigate(n.link); }}>{n.title}<small>{n.message}</small></button>)}</div>}

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