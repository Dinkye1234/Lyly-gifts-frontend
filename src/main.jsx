import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css"; // 👈 ЭНИЙГ НЭМ

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* 2. AuthProvider нь бүх зүйлийн гадна байх ёстой */}
      <AuthProvider>
        <ThemeProvider>
          {/* 3. CartProvider нь AuthProvider-ийн дотор байж гэмээнэ useAuth-ыг уншиж чадна */}
          <CartProvider>
            <App />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
