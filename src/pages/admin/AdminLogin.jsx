import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, Lock } from "lucide-react";

const AdminLogin = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1); // 1: И-мэйл илгээх, 2: Код & Шинэ нууц үг
  const [emailForReset, setEmailForReset] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://lyly-gifts-backend.onrender.com/api/admin";

  // --- Ердийн нэвтрэх ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.msg);

      localStorage.setItem("adminAuth", "true");
      if (onLogin) onLogin();
      navigate("/admin/products");
    } catch (err) {
      alert("Сервертэй холбогдоход алдаа гарлаа!");
    }
  };

  // --- Алхам 1: Код авах ---
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("Баталгаажуулах код и-мэйл рүү илгээгдлээ.");
      setStep(2);
    } catch (err) {
      alert("Алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  // --- Алхам 2: Нууц үг шинэчлэх ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // otp утгыг string болгож, хоосон зайг арилгах
    const cleanOtp = otp.trim();

    try {
      // URL-д : тэмдэг байж болохгүй! Зөвхөн утга нь очих ёстой.
      const res = await fetch(
        `https://lyly-gifts-backend.onrender.com/api/admin/reset-password/${cleanOtp}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }), // password нь state-д байгаа шинэ нууц үг
        },
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("Нууц үг амжилттай шинэчлэгдлээ!");
      setIsForgot(false);
    } catch (err) {
      alert("Алдаа гарлаа!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isForgot ? "Нууц үг сэргээх" : "Админ нэвтрэх"}
        </h2>

        {!isForgot ? (
          /* НЭВТРЭХ ФОРМ */
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Админ нэр"
              className="border w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Нууц үг"
              className="border w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-purple-600 hover:underline"
              >
                Нууц үг мартсан?
              </button>
            </div>
            <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
              Нэвтрэх
            </button>
          </form>
        ) : (
          /* СЭРГЭЭХ ЛОГИК */
          <div className="space-y-4">
            {step === 1 ? (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <input
                  type="email"
                  placeholder="Бүртгэлтэй и-мэйл"
                  className="border w-full p-3 rounded-xl outline-none"
                  onChange={(e) => setEmailForReset(e.target.value)}
                  required
                />
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl"
                >
                  {loading ? "Илгээж байна..." : "Код авах"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="text"
                  placeholder="6 оронтой код"
                  maxLength="6"
                  className="border-2 border-purple-500 w-full p-3 rounded-xl text-center text-xl font-bold tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplate="one-time-code"
                  required
                />
                <input
                  type="password"
                  placeholder="Шинэ нууц үг"
                  className="border w-full p-3 rounded-xl outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                  Нууц үг шинэчлэх
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setIsForgot(false);
                setStep(1);
              }}
              className="w-full flex items-center justify-center text-gray-500 text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Буцах
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
