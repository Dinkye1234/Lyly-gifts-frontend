import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Хэрэглэгч нэвтэрсэн эсэхийг шалгах
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://lyly-gifts-backend.onrender.com/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token-оо энд нэг удаа дамжуулна
          },
          body: JSON.stringify(formData),
        },
      );

      // 1. Токены хугацаа дууссан эсэхийг хамгийн түрүүнд шалгах
      if (response.status === 401) {
        alert("Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // 2. Бусад алдааг шалгах
      if (!response.ok) throw new Error("Серверт алдаа гарлаа");

      // 3. Амжилттай болсон үед
      setFormData({ name: "", email: "", subject: "", message: "" });
      alert("Таны мессежийг хүлээн авлаа. Баярлалаа!");
    } catch (error) {
      console.error("Error:", error);
      alert("Илгээж чадсангүй. Та дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-20 text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Холбоо барих
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Сэтгэгдэл үлдээх хэсэг */}
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 mr-3 text-purple-500" />
                Мессеж илгээх
              </h2>

              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Таны нэр"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="И-мэйл хаяг"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-xl outline-none"
                  >
                    <option value="">Сэдвийг сонгоно уу</option>
                    <option value="general">Ерөнхий асуулт</option>
                    <option value="order">Захиалгын дэмжлэг</option>
                    <option value="product">Бүтээгдэхүүний тухай</option>
                  </select>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Таны мессеж..."
                    className="w-full px-4 py-3 border rounded-xl outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-400"
                  >
                    <Send className="h-5 w-5" />
                    <span>{isSubmitting ? "Илгээж байна..." : "Илгээх"}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Нэвтрэх шаардлагатай
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Зөвхөн бүртгэлтэй хэрэглэгчид сэтгэгдэл үлдээх боломжтой.
                  </p>
                  <Link
                    to="/login"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Нэвтрэх
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Хаяг, Мэдээллийн хэсэг (Өөрчлөгдөөгүй) */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow">
                <Phone className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <h3 className="font-semibold">Утас</h3>
                <p className="text-gray-600">+(976) 94262044</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow">
                <Mail className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <h3 className="font-semibold">И-мейл</h3>
                <p className="text-gray-600 text-sm">LylyGifts@gmail.com</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow">
              <div className="flex items-start space-x-4">
                <MapPin className="text-green-500 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Байршил</h3>
                  <p className="text-gray-600">БГД, 18-хороо, Буянгийн зам</p>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Даваа-Ням: 10:00-20:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
