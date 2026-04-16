import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, KeyRound, Lock, User } from "lucide-react";

const DeliveryLogin = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1); // 1: И-мэйл илгээх, 2: Код & Шинэ нууц үг
  const [emailForReset, setEmailForReset] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Backend endpoint нь админ логинтой ижил боловч role-оор нь ялгана
  const API_URL = "http://localhost:8000/api/delivery-login";

  // ... (бусад import хэвээрээ)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.msg);
      }

      if (data.token) {
        // КРИТИК ХЭСЭГ: Хүргэгчийн мэдээллийг бүрэн хадгалах
        localStorage.setItem("deliveryToken", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("deliveryId", data.user.id); // ID хадгалах
        localStorage.setItem("deliveryName", data.user.name); // НЭР хадгалах

        if (onLogin) onLogin(data.token);

        if (data.user.role === "delivery") {
          navigate("/delivery/dashboard");
        } else {
          alert("Танд хүргэлтийн хэсэгт нэвтрэх эрх байхгүй байна.");
          localStorage.clear();
        }
      }
    } catch (err) {
      alert("Сервертэй холбогдоход алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  // ... (бусад код хэвээрээ)

  // ... (handleForgotRequest болон handleResetPassword функцүүд хэвээрээ үлдэнэ)

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 border border-blue-50">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full text-white mb-3">
            <Truck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isForgot ? "Нууц үг сэргээх" : "Хүргэгч нэвтрэх"}
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Хүргэлтийн системд тавтай морилно уу
          </p>
        </div>

        {!isForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Нэвтрэх нэр"
                className="pl-10 border w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="Нууц үг"
                className="pl-10 border w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Нууц үг мартсан уу?
              </button>
            </div>

            <button
              disabled={loading}
              className={`w-full ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform active:scale-95`}
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>
        ) : (
          /* СЭРГЭЭХ ЛОГИК (Дизайныг нь цэнхэр болгож шинэчилсэн) */
          <div className="space-y-4">
            {step === 1 ? (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <input
                  type="email"
                  placeholder="Бүртгэлтэй и-мэйл"
                  className="border w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setEmailForReset(e.target.value)}
                  required
                />
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
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
                  className="border-2 border-blue-500 w-full p-3 rounded-xl text-center text-xl font-bold tracking-widest outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Шинэ нууц үг"
                  className="border w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
                  Нууц үг шинэчлэх
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setIsForgot(false);
                setStep(1);
              }}
              className="w-full flex items-center justify-center text-gray-500 text-sm hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Буцах
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryLogin;
