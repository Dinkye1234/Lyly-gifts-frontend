import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Нэвтэрсэн эсэхийг localStorage-оос шалгаж байна
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";

  // Хэрэв нэвтэрсэн бол доторх хуудсуудыг (Outlet) харуулна,
  // үгүй бол /admin/login хуудас руу үсэргэнэ.
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
