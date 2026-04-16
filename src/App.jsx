import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Компонентууд болон хуудсууд
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import Cart from "./pages/user/Cart";
import Contact from "./pages/user/Contact";
import ProductDetails from "./pages/user/ProductDetalis";
import Checkout from "./pages/user/Checkout";
import LoginPage from "./pages/user/LoginPage";
import AIAssistant from "./pages/user/AIAssistant";
import Profile from "./pages/user/Profile";
import OrderTracking from "./pages/user/OrderTracking";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLyout";
import Comments from "./pages/admin/Comment";
import Products from "./pages/admin/Product";
import Orders from "./pages/admin/Order";
import Delivery from "./pages/admin/Delivery";
import Confirmed from "./pages/admin/confirmed.jsx";
import AdminReport from "./pages/admin/AdminReports";
import DeliveryAdd from "./pages/admin/DeliveryAdd";

// Delivery
import DeliveryLogin from "./pages/Delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/Delivery/DeliveryDashboard";

const UserLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

// Админы хэсгийг хамгаалах компонент
const ProtectedRoute = ({ isAdmin }) => {
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

function App() {
  // Зөвхөн "true" гэж шалгах биш, токен байгаа эсэхийг давхар шалгана
  const [isAdmin, setIsAdmin] = useState(() => {
    const token = localStorage.getItem("token");
    const auth = localStorage.getItem("adminAuth");
    return token && auth === "true";
  });

  const handleLogin = (token) => {
    // Login хийхэд ирсэн токеныг энд хадгална
    localStorage.setItem("token", token);
    localStorage.setItem("adminAuth", "true");
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminAuth");
    setIsAdmin(false);
  };

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lily-ai" element={<AIAssistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track/:id" element={<OrderTracking />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          isAdmin ? (
            <Navigate to="/admin/products" />
          ) : (
            <AdminLogin onLogin={handleLogin} />
          )
        }
      />

      <Route element={<ProtectedRoute isAdmin={isAdmin} />}>
        <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/admin/products" />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="confirmed" element={<Confirmed />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="comments" element={<Comments />} />
          <Route path="reports" element={<AdminReport />} />
          <Route path="delivery-add" element={<DeliveryAdd />} />
        </Route>
      </Route>
      <Route>
        <Route path="delivery" element={<DeliveryLogin />} />
        <Route path="delivery/dashboard" element={<DeliveryDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
