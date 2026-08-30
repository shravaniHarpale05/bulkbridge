import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, getToken } from "../utils/auth";

// Wrap a page with this to require login (and optionally a specific role).
// Usage: <ProtectedRoute role="farmer"><Farmerdashboard /></ProtectedRoute>

export default function ProtectedRoute({ role, children }) {

  const user = getUser();

  if (!user || !getToken()) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Logged in, but wrong role for this page — send them to their own dashboard.
    return <Navigate to={user.role === "farmer" ? "/farmer-dashboard" : user.role === "buyer" ? "/retailer-dashboard" : "/admin-dashboard"} replace />;
  }

  return children;
}
