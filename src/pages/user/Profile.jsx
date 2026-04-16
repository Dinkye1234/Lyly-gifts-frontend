import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Package,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Clock,
  Trash2,
  CheckSquare,
  Square,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedOrders, setSelectedOrders] = useState([]);

  // --- Мэдээлэл засахад хэрэгтэй State-үүд ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  }, []);

  const fetchOrders = useCallback(
    async (token) => {
      try {
        setLoadingOrders(true);
        const res = await axios.get(
          "https://lyly-gifts-backend.onrender.com/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (err.response?.status === 401) handleLogout();
      } finally {
        setLoadingOrders(false);
      }
    },
    [handleLogout],
  );

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    if (!userData || !token) {
      navigate("/login");
    } else {
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      fetchOrders(token);
    }
  }, [navigate, fetchOrders]);

  // --- Мэдээлэл шинэчлэх функц ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://lyly-gifts-backend.onrender.com/api/users/profile", // Таны API route
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedData = res.data;
      setUser(updatedData);
      localStorage.setItem("userInfo", JSON.stringify(updatedData));
      setIsEditing(false);
      alert("Мэдээлэл амжилттай шинэчлэгдлээ");
    } catch (err) {
      alert(err.response?.data?.msg || "Шинэчлэхэд алдаа гарлаа");
    } finally {
      setUpdating(false);
    }
  };

  // --- Захиалга устгах функцүүд ---
  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return alert("Сонгосон захиалга алга");
    if (!window.confirm(`${selectedOrders.length} захиалгыг устгах уу?`))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "https://lyly-gifts-backend.onrender.com/api/orders/delete-multiple",
        {
          data: { orderIds: selectedOrders },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      alert("Амжилттай устгалаа");
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Хүлээгдэж буй": "text-yellow-600 bg-yellow-50",
      Баталгаажсан: "text-blue-600 bg-blue-50 border-blue-100",
      Хүргэлтэнд: "text-indigo-600 bg-indigo-50 border-indigo-100",
      Хүргэгдсэн: "text-green-600 bg-green-50 border-green-100",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  if (!user) return <div className="text-center p-20">Ачаалж байна...</div>;

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-10 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 p-6 border-r border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 shadow-inner">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "info" ? "bg-purple-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100"}`}
            >
              <User size={18} /> Хувийн мэдээлэл
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "orders" ? "bg-purple-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100"}`}
            >
              <Package size={18} /> Захиалгын түүх
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition mt-10"
            >
              <LogOut size={18} /> Гарах
            </button>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8">
          {activeTab === "info" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-2xl font-bold dark:text-white">
                  Миний мэдээлэл
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${isEditing ? "bg-gray-100 text-gray-600" : "bg-purple-50 text-purple-600 hover:bg-purple-100"}`}
                >
                  {isEditing ? (
                    <>
                      <X size={16} /> Цуцлах
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} /> Засах
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <form
                  onSubmit={handleUpdateProfile}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Бүтэн нэр
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      И-мэйл хаяг
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Утасны дугаар
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Гэрийн хаяг
                    </label>
                    <textarea
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows="3"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg disabled:bg-purple-300"
                    >
                      <Save size={18} />{" "}
                      {updating ? "Хадгалж байна..." : "Өөрчлөлтийг хадгалах"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard icon={<Mail />} label="И-мэйл" value={user.email} />
                  <InfoCard
                    icon={<Phone />}
                    label="Утас"
                    value={user.phone || "Бүртгэлгүй"}
                  />
                  <InfoCard
                    icon={<MapPin />}
                    label="Хаяг"
                    value={user.address || "Хаяг бүртгэлгүй"}
                    fullWidth
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Захиалгын түүх хэсэг (Өмнөх код хэвээрээ) */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <h3 className="text-2xl font-bold dark:text-white">
                  Захиалгын түүх
                </h3>
                {orders.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleSelectAll}
                      className="text-sm flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition"
                    >
                      {selectedOrders.length === orders.length ? (
                        <CheckSquare size={18} className="text-purple-600" />
                      ) : (
                        <Square size={18} />
                      )}
                      Бүгдийг сонгох
                    </button>
                    {selectedOrders.length > 0 && (
                      <button
                        onClick={handleDeleteSelected}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-bold shadow-sm"
                      >
                        <Trash2 size={16} /> Устгах ({selectedOrders.length})
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Orders List Rendering... */}
              {loadingOrders ? (
                <div className="text-center py-10 text-gray-500">
                  Уншиж байна...
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className={`group relative border dark:border-gray-700 rounded-2xl p-5 transition-all ${selectedOrders.includes(order._id) ? "border-purple-500 bg-purple-50/30" : "bg-white dark:bg-gray-800"}`}
                    >
                      {/* Selector */}
                      <button
                        onClick={() => toggleSelect(order._id)}
                        className="absolute top-5 left-5 z-10"
                      >
                        {selectedOrders.includes(order._id) ? (
                          <CheckSquare className="text-purple-600" size={22} />
                        ) : (
                          <Square className="text-gray-300" size={22} />
                        )}
                      </button>
                      <div className="pl-9">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-mono text-xs text-gray-400">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>

                          <div
                            className={`flex gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                            {order.status === "Хүргэлтэнд" && (
                              <button
                                onClick={() => navigate(`/track/${order._id}`)}
                                className="bg-indigo-500 text-white px-3 py-1 rounded"
                              >
                                Байршил харах
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Items Loop */}
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 mb-3"
                          >
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package size={20} className="text-gray-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold dark:text-gray-200">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity || item.qty} x{" "}
                                {item.price?.toLocaleString()}₮
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="mt-5 pt-4 border-t flex justify-between items-center">
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-black text-purple-600 text-lg">
                            {order.totalPrice?.toLocaleString()}₮
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">
                  <Package size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Танд захиалга байхгүй байна.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, fullWidth }) => (
  <div
    className={`flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-purple-100 transition ${fullWidth ? "md:col-span-2" : ""}`}
  >
    <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-purple-500">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="font-bold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  </div>
);

export default Profile;
