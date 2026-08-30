import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Aboutpage from "./pages/Aboutpage";
import Servicepage from "./pages/Servicepage";
import Categoriespage from "./pages/Categoriespage";
import Contactpage from "./pages/Contactpage";
import Loginform from "./pages/Loginform";
import Signupform from "./pages/Signupform";
import Farmerdashboard from "./pages/Farmerdashboard";
import MyProduce from "./pages/MyProduce";
import Orders from "./pages/Orders";
import SalesEarnings from "./pages/SalesEarnings";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import RetailerDashboard from "./pages/RetailerDashboard";
import BrowseProduce from "./pages/BrowseProduce";
import ProduceDetail from "./pages/ProduceDetail";
import RetailerOrders from "./pages/RetailerOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import LanguagePopup from "./Components/LanguagePopup";

export default function App() {
  return (
    <>
    <LanguagePopup />
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<Aboutpage />} />

      <Route path="/services" element={<Servicepage />} />

      <Route path="/categories" element={<Categoriespage />} />

      <Route path="/contact" element={<Contactpage />} />

      <Route path="/login" element={<Loginform />} />

      <Route path="/signup" element={<Signupform />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      {/* FARMER ROUTES */}

      <Route
        path="/farmer-dashboard"
        element={<ProtectedRoute role="farmer"><Farmerdashboard /></ProtectedRoute>}
      />

      <Route
        path="/my-produce"
        element={<ProtectedRoute role="farmer"><MyProduce /></ProtectedRoute>}
      />

      <Route
        path="/orders"
        element={<ProtectedRoute role="farmer"><Orders /></ProtectedRoute>}
      />

      <Route
        path="/sales-earnings"
        element={<ProtectedRoute role="farmer"><SalesEarnings /></ProtectedRoute>}
      />

      {/* RETAILER ROUTES */}

      <Route
        path="/retailer-dashboard"
        element={<ProtectedRoute role="buyer"><RetailerDashboard /></ProtectedRoute>}
      />

      <Route
        path="/browse-produce"
        element={<ProtectedRoute role="buyer"><BrowseProduce /></ProtectedRoute>}
      />

      <Route
        path="/produce/:id"
        element={<ProtectedRoute role="buyer"><ProduceDetail /></ProtectedRoute>}
      />

      <Route
        path="/retailer-orders"
        element={<ProtectedRoute role="buyer"><RetailerOrders /></ProtectedRoute>}
      />

      {/* SHARED (either role, just needs login) */}

      <Route
        path="/messages"
        element={<ProtectedRoute><Messages /></ProtectedRoute>}
      />

      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />

      <Route
        path="/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
    </>
  );
}
