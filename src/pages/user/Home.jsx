import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Gift,
  Heart,
  Truck,
  Shield,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react";
import ProductCard from "../../Components/ProductCard";

const API = "http://localhost:8000/api/product";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error("Бүтээгдэхүүн авахдаа алдаа гарлаа", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    {
      name: "Валентины өдөр",
      image:
        "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-pink-500 to-red-500",
    },
    {
      name: "Төрсөн өдөр",
      image:
        "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Эмэгтэйчүүдийн өдөр",
      image:
        "https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Ойн баяр",
      image:
        "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-blue-500 to-purple-500",
    },
  ];

  const features = [
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Онцгой цуглуулга",
      description: "Бүх арга хэмжээ, зан чанарт нийцсэн онцгой бэлгүүд",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Хурдан хүргэлт",
      description: "Түргэн хүргэлт: нэг өдрийн дотор таны гэрт.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Чанарын баталгаа",
      description: "Бүх бэлэгт сэтгэл ханамжийг 100% баталгаажуулна.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Хувь хүний сэтгэл",
      description: "Тусгай мэндчилгээ ба үзэсгэлэнтэй баглаа орсон.",
    },
  ];

  return (
    <div className="animate-fade-in scroll-smooth">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-mint-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800" />

        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Таны мөч бүрийг
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent block">
                гэрэлтүүлэх бэлэг
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Сэтгэлд үлдсэн мөчүүдийг бүтээх гайхалтай бэлгийн багцууд –
              хайртай бүх хүнд тань зориулагдсан.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/shop"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full inline-flex items-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span>Захиалгаа өгөөрэй</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="glassmorphism dark:glassmorphism-dark rounded-3xl p-8 max-w-2xl mx-auto animate-scale-in border border-white/40 shadow-2xl">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-500 animate-bounce" />
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Lily AI Туслах
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Яамар бэлэг авахаа сонгож байна уу? Манай AI танд 10 секундэд
                тусална."
              </p>
              <Link
                to="/lily-ai"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
              >
                <Zap className="h-5 w-5 mr-2 fill-current" />
                Төгс бэлэг хайх
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 italic">
              Мөч бүрт тохирсон ангилал
            </h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name}`}
                className="group relative overflow-hidden rounded-3xl h-80 shadow-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 flex items-end p-8">
                  <h3 className="text-white font-bold text-2xl tracking-wide">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Онцлох бэлгүүд
              </h2>
              <p className="text-gray-500">Хамгийн их эрэлттэй багцууд</p>
            </div>
            <Link
              to="/shop"
              className="text-purple-600 font-semibold flex items-center hover:underline"
            >
              Бүгдийг харах <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products
                .filter((p) => p.featured)
                .slice(0, 4)
                .map((p, index) => (
                  <div
                    key={p._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <div key={i} className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Онцгой мөчийг хэзээ ч бүү алдаарай
            </h2>
            <p className="text-pink-100 mb-8 max-w-xl mx-auto">
              Шинэ бүтээгдэхүүн, тусгай урамшууллыг хамгийн түрүүнд аваарай.
            </p>
            <form
              className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="И-мейл хаяг..."
                className="flex-1 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-pink-100 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-10 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-pink-50 transition-colors">
                Илгээх
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
