import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Truck,
  MapPin,
  User,
  Package,
  Trash2,
  CheckSquare,
  Square,
  RefreshCw,
  Clock,
  CheckCircle2,
  Phone,
} from "lucide-react";

const socket = io("http://localhost:8000");

const DeliveryAdmin = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/delivery/list");
      setDeliveries(res.data);
    } catch (err) {
      console.error("Алдаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    socket.on("statusUpdatedByDelivery", (data) => {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.orderId === data.orderId
            ? {
                ...d,
                status:
                  data.status === "Хүргэлтэнд яваа"
                    ? "processing"
                    : "completed",
                // Илүү найдвартай шинэчлэх:
                deliveryMan: {
                  name: data.deliveryManName,
                },
              }
            : d,
        ),
      );
    });

    return () => socket.off("statusUpdatedByDelivery");
  }, []);

  const toggleSelect = (id) => {
    setSelectedDeliveries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const deleteSelected = async () => {
    if (!window.confirm("Сонгосон хүргэлтүүдийг устгах уу?")) return;
    try {
      await axios.delete("http://localhost:8000/api/delivery/delete-multiple", {
        data: { deliveryIds: selectedDeliveries },
      });
      setDeliveries(
        deliveries.filter((d) => !selectedDeliveries.includes(d._id)),
      );
      setSelectedDeliveries([]);
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black border border-amber-200 uppercase tracking-widest">
            <Clock size={12} className="inline mr-1" /> Шинэ
          </span>
        );
      case "processing":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black border border-blue-200 animate-pulse uppercase tracking-widest">
            <Truck size={12} className="inline mr-1" /> Явц
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-200 uppercase tracking-widest">
            <CheckCircle2 size={12} className="inline mr-1" /> Дууссан
          </span>
        );
      default:
        return null;
    }
  };

  if (loading)
    return <div className="p-20 text-center font-bold">Ачаалж байна...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white">
              <Package size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Хүргэлтийн Хяналт
            </h1>
          </div>
          <div className="flex gap-2">
            {selectedDeliveries.length > 0 && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition"
              >
                <Trash2 size={16} /> Устгах
              </button>
            )}
            <button
              onClick={fetchDeliveries}
              className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleSelect(d._id)}
                className="absolute top-4 left-4 z-10"
              >
                {selectedDeliveries.includes(d._id) ? (
                  <CheckSquare size={22} className="text-indigo-600" />
                ) : (
                  <Square size={22} className="text-gray-200" />
                )}
              </button>

              <div className="p-6 pt-12">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-800 leading-none mb-1">
                      {d.customer}
                    </h2>
                    <div className="flex items-center text-indigo-600 font-bold text-sm">
                      <Phone size={14} className="mr-1" />{" "}
                      {d.phone || "Утасгүй"}
                    </div>
                  </div>
                  {getStatusBadge(d.status)}
                </div>

                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin
                      size={16}
                      className="mt-1 flex-shrink-0 text-red-500"
                    />
                    <p className="text-sm font-medium leading-relaxed">
                      {d.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 border-t pt-3">
                    <User size={16} className="text-indigo-500" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Хүргэгч:{" "}
                      <span className="text-gray-800">
                        {d.deliveryMan?.name ||
                          d.deliveryManName ||
                          "Хүлээгдэж буй"}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 font-mono mb-2">
                  ID: #{d.orderId?.slice(-8).toUpperCase()}
                </p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${d.status === "completed" ? "w-full bg-emerald-500" : d.status === "processing" ? "w-1/2 bg-blue-500" : "w-2 bg-amber-500"}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryAdmin;
