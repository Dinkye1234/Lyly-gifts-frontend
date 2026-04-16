import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://lyly-gifts-backend.onrender.com/api/auth";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1); // 1: И-мэйл илгээх, 2: Код оруулах
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailForReset, setEmailForReset] = useState("");
  const [otp, setOtp] = useState(""); // 6 оронтой код хадгалах
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgot(false);
    setStep(1);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setErrors({ confirmPassword: "Нууц үг таарахгүй байна" });
    }

    try {
      setLoading(true);
      if (isLogin) {
        const res = await axios.post(`${API}/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        const userData = res.data.user || {
          email: formData.email,
          name: res.data.name || "Хэрэглэгч",
        };
        localStorage.setItem("userInfo", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage"));

        alert("Амжилттай нэвтэрлээ");
        navigate("/");
        window.location.reload();
      } else {
        const res = await axios.post(`${API}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        alert(res.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/forgot-password`, { email: emailForReset });
      alert("Баталгаажуулах код и-мэйл рүү илгээгдлээ.");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setErrors({ confirmPassword: "Нууц үг таарахгүй байна" });
    }

    try {
      setLoading(true);
      await axios.post(`${API}/reset-password/${otp}`, {
        password: formData.password,
      });
      alert("Нууц үг амжилттай сэргээгдлээ. Одоо нэвтэрнэ үү.");
      setIsForgot(false);
      setIsLogin(true);
      setStep(1);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Баталгаажуулах код буруу эсвэл хугацаа дууссан",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {isForgot
          ? "Нууц үг сэргээх"
          : isLogin
            ? "Тавтай морилно уу"
            : "Бүртгэл үүсгэх"}
      </h2>

      {isForgot ? (
        /* --- НУУЦ ҮГ СЭРГЭЭХ ЛОГИК   --- */
        <div className="space-y-4">
          {step === 1 ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-gray-500 mb-4 text-center">
                Бүртгэлтэй и-мэйл хаягаа оруулна уу. Бид танд 6 оронтой код
                илгээх болно.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={emailForReset}
                  onChange={(e) => setEmailForReset(e.target.value)}
                  placeholder="И-мэйл хаяг"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                {loading ? "Илгээж байна..." : "Код авах"}
              </button>
            </form>
          ) : (
            /*     Код болон шинэ нууц үг оруулах */
            <form onSubmit={handleResetWithOTP} className="space-y-4">
              <p className="text-sm text-green-600 mb-4 text-center font-medium">
                Таны {emailForReset} хаяг руу ирсэн кодыг оруулна уу.
              </p>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6 оронтой код"
                  maxLength="6"
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-500 rounded-lg text-center text-xl font-bold tracking-widest outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Шинэ нууц үг"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Шинэ нууц үг давтах"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                {loading ? "Боловсруулж байна..." : "Нууц үг шинэчлэх"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setIsForgot(false);
              setStep(1);
            }}
            className="w-full flex items-center justify-center text-sm text-gray-500 hover:text-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Буцах
          </button>
        </div>
      ) : (
        /* --- НЭВТРЭХ / БҮРТГҮҮЛЭХ ФОРМ --- */
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Бүтэн нэр"
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="И-мэйл хаяг"
              className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Нууц үг"
              className="w-full pl-10 pr-10 py-3 border rounded-lg outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Нууц үг давтах"
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-purple-600 hover:underline"
              >
                Нууц үг мартсан?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Түр хүлээнэ үү..." : isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Бүртгэл байхгүй юу?" : "Та бүртгэлтэй юу?"}
          <button
            onClick={toggleMode}
            className="font-semibold text-purple-600 ml-2 hover:underline"
          >
            {isLogin ? "Шинээр бүртгүүлэх" : "Нэвтрэх"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
