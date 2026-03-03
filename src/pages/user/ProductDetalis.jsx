import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import customAPI from "../../config/api.js";
const API = "https://lyly-gifts-backend.onrender.com/api/product";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Та эхлээд нэвтэрнэ үү!");
      navigate("/login");
      return;
    }

    try {
      const res = await customAPI.post(
        "/cart/add",
        { productId: product._id },
        // { headers: { Authorization: `Bearer ${token}` } },
      );

      addItem({
        ...product,
        id: product._id,
      });

      alert(`${product.name} сагсанд нэмэгдлээ!`);
    } catch (err) {
      // if (err.response && err.response.status === 401) {
      //   alert("Таны нэвтрэх эрхийн хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
      //   localStorage.removeItem("token");
      //   navigate("/login");
      // } else {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Сагсанд нэмэхэд алдаа гарлаа");
      // }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Бүтээгдэхүүн татахад алдаа гарлаа", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Уншиж байна...</div>;
  if (!product)
    return <div className="text-center py-20">Бүтээгдэхүүн олдсонгүй.</div>;

  return (
    <div className="min-h-screen py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Буцах товч */}
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Дэлгүүр рүү буцах</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Зураг */}
          <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          {/* Мэдээлэл */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-purple-600">
              {product.price}₮
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Дэлгэрэнгүй:
              {product.about || "Энэ бүтээгдэхүүнд тайлбар байхгүй байна."}
            </p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Сагсанд нэмэх</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
