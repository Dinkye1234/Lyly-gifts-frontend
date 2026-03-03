import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }

    navigate("/admin/login");
  };

  const menu = [
    { name: "Бүтээгдэхүүн", path: "/admin/products" },
    { name: "Захиалга", path: "/admin/orders" },
    { name: "Баталгаажсан", path: "/admin/confirmed" },
    { name: "Сэтгэгдэл", path: "/admin/comments" },
    { name: "Хүргэлт", path: "/admin/delivery" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-pink-600 to-purple-700 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/30 lg:border-none">
          <h2 className="text-2xl font-bold text-center">LylyGifts Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl lg:hidden"
          >
            <HiX />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Гарах товч handleLogout функцийг дуудна */}
        <button
          onClick={handleLogout}
          className="m-4 py-2 px-4 rounded-lg bg-white text-pink-600 font-semibold hover:bg-gray-200"
        >
          Гарах
        </button>
      </aside>

      {/* Mobile Hamburger - баруун биш зүүн талд байрлуулсан */}
      <div className="lg:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-3xl text-pink-600 p-2 rounded-md bg-white shadow-lg"
        >
          <HiMenu />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
