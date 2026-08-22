import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { getUser } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();

  // Get the logged-in user's data from auth.js
  const user = getUser();

  // If no user is logged in
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div>
            <span className="profile-tag">
              👤 Account
            </span>

            <h1>My Profile</h1>

            <p>
              Please login to view your profile.
            </p>
          </div>

          <button
            className="profile-back-btn"
            onClick={() => navigate("/login")}
          >
            ← Login
          </button>
        </div>
      </div>
    );
  }

  // Check whether the user is a farmer or buyer
  const isFarmer = user.role?.toLowerCase() === "farmer";

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>

          <span className="profile-tag">
            👤 {isFarmer ? "Farmer Account" : "Buyer Account"}
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your {isFarmer ? "farmer" : "buyer"} account information.
          </p>

        </div>

        <button
          className="profile-back-btn"
          onClick={() =>
            navigate(
              isFarmer
                ? "/farmer-dashboard"
                : "/buyer-dashboard"
            )
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* PROFILE CARD */}

      <div className="profile-container">

        {/* LEFT SIDE */}

        <div className="profile-sidebar">

          <div className="profile-avatar">
            {isFarmer ? "👨‍🌾" : "🛒"}
          </div>

          <h2>
            {user.name || "User"}
          </h2>

          <p>
            BulkBridge {isFarmer ? "Farmer" : "Buyer"}
          </p>

          <span className="profile-status">
            ● Active
          </span>

        </div>


        {/* RIGHT SIDE */}

        <div className="profile-details">

          {/* PERSONAL INFORMATION */}

          <div className="profile-section-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your basic account details
              </p>

            </div>

            <button
              className="edit-profile-btn"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </button>

          </div>


          <div className="profile-grid">

            {/* FULL NAME */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <div>
                {user.name || "Not available"}
              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>
                Email Address
              </label>

              <div>
                {user.email || "Not available"}
              </div>

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <div>
                {user.phone || "Not available"}
              </div>

            </div>


            {/* ROLE */}

            <div className="profile-field">

              <label>
                Role
              </label>

              <div>
                {isFarmer ? "Farmer / Seller" : "Buyer"}
              </div>

            </div>


            {/* LOCATION */}

            <div className="profile-field">

              <label>
                Location
              </label>

              <div>
                {user.location || "Not added"}
              </div>

            </div>


            {/* MEMBER SINCE */}

            <div className="profile-field">

              <label>
                Member Since
              </label>

              <div>
                {user.createdAt
                  ? new Date(user.createdAt).getFullYear()
                  : "2026"}
              </div>

            </div>

          </div>


          {/* FARM INFORMATION */}

          {isFarmer && (

            <div className="farm-section">

              <h2>
                Farm Information
              </h2>

              <p>
                Information about your farm and produce.
              </p>


              <div className="profile-grid">

                {/* FARM NAME */}

                <div className="profile-field">

                  <label>
                    Farm Name
                  </label>

                  <div>
                    {user.farmName || "Not added"}
                  </div>

                </div>


                {/* FARM LOCATION */}

                <div className="profile-field">

                  <label>
                    Farm Location
                  </label>

                  <div>
                    {user.farmLocation || "Not added"}
                  </div>

                </div>


                {/* MAIN PRODUCE */}

                <div className="profile-field">

                  <label>
                    Main Produce
                  </label>

                  <div>
                    {user.mainProduce || "Not added"}
                  </div>

                </div>


                {/* PRODUCE */}

                <div className="profile-field">

                  <label>
                    Total Produce
                  </label>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/my-produce")}
                  >
                    View My Produce →
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* BUYER INFORMATION */}

          {!isFarmer && (

            <div className="farm-section">

              <h2>
                Buyer Information
              </h2>

              <p>
                Information about your buying account.
              </p>


              <div className="profile-grid">

                {/* BUSINESS NAME */}

                <div className="profile-field">

                  <label>
                    Business Name
                  </label>

                  <div>
                    {user.businessName || "Not added"}
                  </div>

                </div>


                {/* BUSINESS LOCATION */}

                <div className="profile-field">

                  <label>
                    Business Location
                  </label>

                  <div>
                    {user.businessLocation || "Not added"}
                  </div>

                </div>


                {/* BUYING CATEGORY */}

                <div className="profile-field">

                  <label>
                    Buying Category
                  </label>

                  <div>
                    {user.buyingCategory || "Not added"}
                  </div>

                </div>


                {/* ORDERS */}

                <div className="profile-field">

                  <label>
                    Orders
                  </label>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/orders")}
                  >
                    View Orders →
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ACTIONS */}

          <div className="profile-actions">

            {isFarmer && (

              <button
                className="profile-produce-btn"
                onClick={() => navigate("/my-produce")}
              >
                🥬 My Produce
              </button>

            )}

            <button
              className="profile-settings-btn"
              onClick={() => navigate("/settings")}
            >
              ⚙️ Settings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}