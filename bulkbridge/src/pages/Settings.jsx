import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Settings.css";
import { getUser, saveUser } from "../utils/auth";

export default function Settings() {

  const navigate = useNavigate();

  // Get logged-in user
  const user = getUser();


  // ==============================
  // NOTIFICATION SETTINGS
  // ==============================

  const [notifications, setNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [messages, setMessages] = useState(true);


  // ==============================
  // LANGUAGE
  // ==============================

  const [language, setLanguage] = useState(
    localStorage.getItem("bulkbridge_language") || "English"
  );


  // ==============================
  // FARM INFORMATION
  // ==============================

  const [farmName, setFarmName] = useState(
    user?.farmName || ""
  );

  const [farmLocation, setFarmLocation] = useState(
    user?.farmLocation || ""
  );

  const [mainProduce, setMainProduce] = useState(
    user?.mainProduce || ""
  );

  const [saving, setSaving] = useState(false);


  // ==============================
  // LANGUAGE CHANGE
  // ==============================

  const handleLanguageChange = (event) => {

    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    localStorage.setItem(
      "bulkbridge_language",
      selectedLanguage
    );

    alert(
      `Language changed to ${selectedLanguage}`
    );
  };


  // ==============================
  // SAVE FARM INFORMATION
  // ==============================

  const handleSaveFarm = async () => {

    if (!user) {

      alert("Please login first.");

      navigate("/login");

      return;
    }

    try {

      setSaving(true);

      await axios.put(
        `http://localhost:5000/api/users/update/${user._id}`,
        {
          farmName,
          farmLocation,
          mainProduce
        }
      );


      // Update localStorage user data

      const updatedUser = {
        ...user,
        farmName,
        farmLocation,
        mainProduce
      };

      saveUser(updatedUser);

      alert(
        "Farm information updated successfully!"
      );

    } catch (error) {

      console.error(
        "Error updating farm information:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update farm information."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==============================
  // IF USER NOT LOGGED IN
  // ==============================

  if (!user) {

    return (

      <div className="settings-page">

        <div className="settings-header">

          <div>

            <span className="settings-tag">
              ⚙️ Account Settings
            </span>

            <h1>Settings</h1>

            <p>
              Please login to manage your account settings.
            </p>

          </div>

          <button
            className="settings-back-btn"
            onClick={() => navigate("/login")}
          >
            ← Login
          </button>

        </div>

      </div>

    );

  }


  // ==============================
  // CHECK FARMER
  // ==============================

  const isFarmer =
    user.role?.toLowerCase() === "farmer";


  return (

    <div className="settings-page">


      {/* ==============================
          HEADER
      ============================== */}

      <div className="settings-header">

        <div>

          <span className="settings-tag">
            ⚙️ Account Settings
          </span>

          <h1>Settings</h1>

          <p>
            Manage your BulkBridge account preferences.
          </p>

        </div>

        <button
          className="settings-back-btn"
          onClick={() =>
            navigate(
              isFarmer
                ? "/farmer-dashboard"
                : "/retailer-dashboard"
            )
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* ==============================
          SETTINGS CONTAINER
      ============================== */}

      <div className="settings-container">


        {/* ==============================
            NOTIFICATIONS
        ============================== */}

        <section className="settings-section">

          <div className="settings-section-title">

            <div className="settings-section-icon">
              🔔
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Choose what notifications you want to receive.
              </p>

            </div>

          </div>


          {/* PUSH NOTIFICATIONS */}

          <div className="setting-row">

            <div>

              <strong>
                Push Notifications
              </strong>

              <span>
                Receive important updates from BulkBridge.
              </span>

            </div>

            <button
              className={`toggle ${
                notifications ? "active" : ""
              }`}
              onClick={() =>
                setNotifications(!notifications)
              }
            >

              <span></span>

            </button>

          </div>


          {/* ORDER UPDATES */}

          <div className="setting-row">

            <div>

              <strong>
                Order Updates
              </strong>

              <span>
                Get notified when buyers place or update orders.
              </span>

            </div>

            <button
              className={`toggle ${
                orderUpdates ? "active" : ""
              }`}
              onClick={() =>
                setOrderUpdates(!orderUpdates)
              }
            >

              <span></span>

            </button>

          </div>


          {/* MESSAGE NOTIFICATIONS */}

          <div className="setting-row">

            <div>

              <strong>
                Message Notifications
              </strong>

              <span>
                Get notified when buyers send you messages.
              </span>

            </div>

            <button
              className={`toggle ${
                messages ? "active" : ""
              }`}
              onClick={() =>
                setMessages(!messages)
              }
            >

              <span></span>

            </button>

          </div>

        </section>



        {/* ==============================
            ACCOUNT
        ============================== */}

        <section className="settings-section">

          <div className="settings-section-title">

            <div className="settings-section-icon">
              👤
            </div>

            <div>

              <h2>
                Account
              </h2>

              <p>
                Manage your account information.
              </p>

            </div>

          </div>


          <div className="settings-actions">


            {/* PROFILE */}

            <button
              onClick={() =>
                navigate("/profile")
              }
            >

              👤

              <span>

                <strong>
                  My Profile
                </strong>

                <small>
                  View and manage your profile
                </small>

              </span>

              →

            </button>


            {/* MY PRODUCE */}

            {isFarmer && (

              <button
                onClick={() =>
                  navigate("/my-produce")
                }
              >

                🥬

                <span>

                  <strong>
                    My Produce
                  </strong>

                  <small>
                    Manage your listed produce
                  </small>

                </span>

                →

              </button>

            )}

          </div>

        </section>



        {/* ==============================
            FARM INFORMATION
        ============================== */}

        {isFarmer && (

          <section className="settings-section">

            <div className="settings-section-title">

              <div className="settings-section-icon">
                🚜
              </div>

              <div>

                <h2>
                  Farm Information
                </h2>

                <p>
                  Add or update information about your farm.
                </p>

              </div>

            </div>


            <div className="farm-edit-form">


              {/* FARM NAME */}

              <div className="form-group">

                <label>
                  Farm Name
                </label>

                <input
                  type="text"
                  value={farmName}
                  onChange={(e) =>
                    setFarmName(e.target.value)
                  }
                  placeholder="Enter your farm name"
                />

              </div>


              {/* FARM LOCATION */}

              <div className="form-group">

                <label>
                  Farm Location
                </label>

                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) =>
                    setFarmLocation(e.target.value)
                  }
                  placeholder="Enter your farm location"
                />

              </div>


              {/* MAIN PRODUCE */}

              <div className="form-group">

                <label>
                  Main Produce
                </label>

                <input
                  type="text"
                  value={mainProduce}
                  onChange={(e) =>
                    setMainProduce(e.target.value)
                  }
                  placeholder="Example: Tomato, Onion, Potato"
                />

              </div>


              {/* SAVE BUTTON */}

              <button
                className="save-farm-btn"
                onClick={handleSaveFarm}
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "💾 Save Farm Information"}

              </button>

            </div>

          </section>

        )}



        {/* ==============================
            PREFERENCES
        ============================== */}

        <section className="settings-section">

          <div className="settings-section-title">

            <div className="settings-section-icon">
              🌐
            </div>

            <div>

              <h2>
                Preferences
              </h2>

              <p>
                Customize your application preferences.
              </p>

            </div>

          </div>


          {/* LANGUAGE */}

          <div className="preference-row">

            <div>

              <strong>
                Language
              </strong>

              <span>
                Select your preferred language.
              </span>

            </div>


            <select
              value={language}
              onChange={handleLanguageChange}
            >

              <option value="English">
                English
              </option>

              <option value="Marathi">
                Marathi
              </option>

              <option value="Hindi">
                Hindi
              </option>

            </select>

          </div>


          {/* ACCOUNT TYPE */}

          <div className="preference-row">

            <div>

              <strong>
                Account Type
              </strong>

              <span>
                Your current BulkBridge role.
              </span>

            </div>

            <span className="farmer-badge">

              {isFarmer
                ? "Farmer / Seller"
                : "Buyer"}

            </span>

          </div>

        </section>



        {/* ==============================
            LOGOUT
        ============================== */}

        <section className="logout-section">

          <div>

            <h2>
              Logout
            </h2>

            <p>
              Sign out from your BulkBridge account.
            </p>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            🚪 Logout

          </button>

        </section>


      </div>

    </div>

  );

}