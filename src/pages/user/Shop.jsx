import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Filter, Grid, List, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../../Components/ProductCard";
const API = "https://lyly-gifts-backend.onrender.com/api/product";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.log("Бүтээгдэхүүн авахдаа алдаа гарлаа", err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const categories = [
    "Бүгд",
    "Валентины багц",
    "Төрсөн өдөр",
    "Өөрийгөө энхрийлэх",
    "Хоол хүнс ба амттан",
    "Шинэхэн хүүхдийн угталтын бэлэг",
    "Ой тэмдэглэх өдөр",
    "Эхийн өдөр",
    "Гэрлэлтийн бэлэг",
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "Бүгд") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  return (
    <div className="mt-20 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            LylyGifts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Бүх баяр ёслолд тохирох төгс бэлэг
          </p>
        </div>

        <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Хайх..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              >
                <option value="featured">Онцлох</option>
                <option value="price-low">Үнэ: Багаас их</option>
                <option value="price-high">Үнэ: Ихээс бага</option>
                <option value="rating">Шилдэг үнэлгээтэй</option>
                <option value="newest">Шинэ бүтээгдэхүүн</option>
              </select>

              <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6 space-y-6 animate-fade-in sticky top-24">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Ангилалууд
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {category === "all" ? "All Categories" : category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Үнэний сонголтууд
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{priceRange[0]}₮</span>
                    <span>{priceRange[1]}₮</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 200,
                        ])
                      }
                      className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <Search className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Бүгд");
                    setPriceRange([0, 200]);
                  }}
                  className="btn-gradient text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
