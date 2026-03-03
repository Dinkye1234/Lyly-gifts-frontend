// src/components/Header.js

import React, { useState } from "react";
import { IoGiftOutline, IoSearchOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import LoginRegister from "../pages/user/LoginRegister";
import { useCart } from "../context/CartContext";

function Header() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: "Нүүр", path: "/" },
    { name: "Бүтээгдэхүүн", path: "/shop" },
    { name: "Холбоо барих", path: "/contact" },
  ];

  const user = null; // Хэрэглэгч нэвтрээгүй
  const logout = () => console.log("Logging out...");
  const isActivePath = (path) => location.pathname === path;

  // Mobile menu-г хаахдаа Auth modal-г нээх функц
  const openAuthModalFromMobile = () => {
    setIsMobileMenuOpen(false);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glassmorphism dark:glassmorphism-dark shadow-lg backdrop-blur-[10px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 group-hover:from-pink-500 group-hover:to-purple-600 transition-all">
                <IoGiftOutline className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                LylyGifts
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3 py-2 font-medium transition ${
                      isActivePath(item.path)
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                    }`}
                  >
                    {item.name}
                    {isActivePath(item.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              {/* <IoSearchOutline
                className="text-gray-700 dark:text-gray-300 text-2xl cursor-pointer hover:text-purple-600 transition"
                onClick={() => setSearchModalOpen(true)}
              /> */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20">
                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20"
              >
                <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth / User */}
              {user ? (
                // Нэвтэрсэн хэрэглэгчийн хэсэг
                <div className="relative group">{/* ... */}</div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden md:inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition"
                >
                  Нэвтрэх
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 animate-fadeIn">
            <nav className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-base font-medium transition ${
                    isActivePath(item.path)
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={openAuthModalFromMobile}
                className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-center text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600"
              >
                Нэвтрэх
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MODAL-УУДЫГ PORTAL АШИГЛАН ЭНД БАЙРШУУЛНА */}

      {/* Auth Modal */}
      {isAuthModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAuthModalOpen(false);
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 relative shadow-2xl animate-slide-up">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <LoginRegister />
            </div>
          </div>,
          document.getElementById("modal-root")
        )}

      {/* Search Modal */}
      {/* {isSearchModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchModalOpen(false);
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 relative shadow-2xl animate-slide-up">
              <button
                onClick={() => setSearchModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="relative">
                <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Бэлэг хайх..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent"
                  autoFocus
                />
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")
        )} */}
    </>
  );
}

export default Header;
