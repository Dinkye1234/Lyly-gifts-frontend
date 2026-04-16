import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ArrowLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:8000");

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 1. Эхний удаа ирсэн эсэхийг хянах
  const mapRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    socket.emit("joinOrderRoom", id);

    socket.on("locationUpdate", (data) => {
      setLocation(data);

      // 2. Зөвхөн эхний удаа байршил ирэхэд газрын зургийг тийш нь аваачна
      if (mapRef.current && isFirstLoad) {
        mapRef.current.setView([data.lat, data.lng], 16);
        setIsFirstLoad(false); // Дараагийн удаа автоматаар шилжихгүй
      }
    });

    return () => {
      socket.off("locationUpdate");
    };
  }, [id, isFirstLoad]);

  return (
    <div className="max-w-4xl mx-auto pt-28 pb-10 px-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-purple-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Буцах
      </button>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold dark:text-white">
          Хүргэгчийн байршил
        </h2>
        <p className="text-sm text-gray-500">
          Захиалга #{id?.slice(-6).toUpperCase()}
        </p>
      </div>

      <div className="overflow-hidden shadow-2xl rounded-2xl border border-gray-100">
        <MapContainer
          center={[47.9185, 106.9176]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
          ref={mapRef} // ✅ Ref холболт
          dragging={true} // ✅ Хөдөлгөх боломжтой
          scrollWheelZoom={true} // ✅ Маусын дугуйгаар томруулна
          doubleClickZoom={true} // ✅ Хоёр товшиж томруулна
          touchZoom={true} // ✅ Утсан дээр хуруугаараа томруулна
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {location && (
            <Marker position={[location.lat, location.lng]} icon={deliveryIcon}>
              <Popup>🚚 Хүргэгч энд байна</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {!location && (
        <div className="mt-6 p-4 bg-yellow-50 text-yellow-700 rounded-xl flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          Хүргэгчийн байршил хүлээж байна...
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
