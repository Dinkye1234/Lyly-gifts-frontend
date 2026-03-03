import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

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

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLyout";
import Comments from "./pages/admin/Comment";
import Products from "./pages/admin/Product";
import Orders from "./pages/admin/Order";
import Delivery from "./pages/admin/Delivery";
import Confirmed from "./pages/admin/confirmed.jsx";

// Хэрэглэгчийн хэсгийн Layout (Header, Footer-тэй)
const UserLayout = () => (
  <>
    <Header />
    <main>
      <Outlet /> {/* Энд Home, Shop, Cart гэх мэт хуудсууд орно */}
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
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("adminAuth") === "true",
  );

  const handleLogin = () => {
    localStorage.setItem("adminAuth", "true");
    setIsAdmin(true);
  };

  const handleLogout = () => {
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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
