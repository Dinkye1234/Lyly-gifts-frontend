import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  MapPin,
  Package,
  CheckCircle,
  Navigation,
  LogOut,
  Phone,
  User,
} from "lucide-react";

const socket = io("https://lyly-gifts-backend.onrender.com/api");

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // localStorage-оос нэвтэрсэн хүргэгчийн мэдээллийг авах
  const deliveryId = localStorage.getItem("deliveryId");
  const deliveryName = localStorage.getItem("deliveryName");

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(
        "https://lyly-gifts-backend.onrender.com/api/delivery/list",
      );
      setDeliveries(res.data.filter((d) => d.status !== "completed"));
    } catch (err) {
      console.error("Жагсаалт авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  // DeliveryDashboard.jsx дотор:
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Хэрэв хүргэгч идэвхтэй захиалгатай бол:
        deliveries.forEach((d) => {
          if (d.status === "processing") {
            socket.emit("locationUpdate", {
              orderId: d.orderId,
              lat: latitude,
              lng: longitude,
            });
          }
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [deliveries]);
  useEffect(() => {
    fetchDeliveries();
  }, []);

  // DeliveryDashboard.jsx доторх updateStatus функцийг ингэж шинэчил:

  const updateStatus = async (id, status, orderId) => {
    const currentDeliveryId = localStorage.getItem("deliveryId");
    if (!currentDeliveryId) return alert("Дахин нэвтэрнэ үү.");

    try {
      await axios.patch(
        `https://lyly-gifts-backend.onrender.com/api/delivery/${id}`,
        {
          status,
          deliveryManId: currentDeliveryId,
        },
      );

      if (status === "processing") {
        // 1. Socket өрөөндөө нэгдэх
        socket.emit("joinOrderRoom", orderId);

        // 2. Байршил дамжуулж эхлэх
        if ("geolocation" in navigator) {
          navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // Зөвхөн энэ orderId-д зориулж байршил илгээх
              socket.emit("locationUpdate", {
                orderId: orderId,
                lat: latitude,
                lng: longitude,
              });
            },
            (err) => console.error("GPS Error:", err),
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              distanceFilter: 5, // 5 метр тутамд шинэчлэх
            },
          );
        }
      }
      fetchDeliveries();
    } catch (err) {
      console.error("Алдаа гарлаа:", err);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/delivery";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header-т хүргэгчийн нэрийг харуулах */}
      <div className="bg-indigo-600 p-6 text-white shadow-lg flex justify-between items-center rounded-b-[40px]">
        <div>
          <h1 className="text-2xl font-black">Сайн уу, {deliveryName}!</h1>
          <p className="text-indigo-100 text-xs uppercase tracking-widest font-bold">
            Таны өнөөдрийн ажил
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition"
        >
          <LogOut size={22} />
        </button>
      </div>

      <div className="p-4 max-w-xl mx-auto space-y-4 -mt-4">
        {loading ? (
          <p className="text-center py-10">Ачаалж байна...</p>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400 font-bold">
              Одоогоор хүргэх бараа алга
            </p>
          </div>
        ) : (
          deliveries.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 space-y-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight">
                      {item.customer}
                    </h3>
                    <p className="text-indigo-600 font-bold flex items-center text-sm">
                      <Phone size={14} className="mr-1" /> {item.phone}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700 animate-pulse"}`}
                >
                  {item.status === "pending" ? "ШИНЭ" : "ЗАМДАА"}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex gap-3 italic text-gray-600">
                <MapPin size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold leading-relaxed">
                  {item.address}
                </p>
              </div>

              <div className="flex gap-2">
                {item.status === "pending" ? (
                  <button
                    onClick={() =>
                      updateStatus(item._id, "processing", item.orderId)
                    }
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                  >
                    <Navigation size={20} /> БАРААГ ХҮЛЭЭЖ АВАХ
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      updateStatus(item._id, "completed", item.orderId)
                    }
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                  >
                    <CheckCircle size={20} /> ХҮРГЭЖ ДУУСГАХ
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
