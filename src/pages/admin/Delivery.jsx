import React, { useState } from "react";

const DeliveryAdmin = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      orderId: "ORD-001",
      customer: "Болор",
      address: "Улаанбаатар, Сүхбаатар дүүрэг",
      status: "Шинэ",
    },
    {
      id: 2,
      orderId: "ORD-002",
      customer: "Тэмүүлэн",
      address: "Улаанбаатар, Чингэлтэй дүүрэг",
      status: "Хүргэлтэнд",
    },
    {
      id: 3,
      orderId: "ORD-003",
      customer: "Мөнх-Эрдэнэ",
      address: "Улаанбаатар, Баянзүрх дүүрэг",
      status: "Хүргэгдсэн",
    },
  ]);

  const statusOptions = ["Шинэ", "Хүргэлтэнд", "Хүргэгдсэн"];

  const updateStatus = (id, newStatus) => {
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Шинэ":
        return "bg-yellow-100 text-yellow-800";
      case "Хүргэлтэнд":
        return "bg-blue-100 text-blue-800";
      case "Хүргэгдсэн":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Хүргэлт удирдах</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{d.customer}</h2>
              <p className="text-gray-600 mb-2">{d.address}</p>
              <p className="text-gray-700 font-medium">Захиалга: {d.orderId}</p>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <span
                className={`px-2 py-1 inline-block rounded-full text-sm font-medium ${getStatusColor(
                  d.status
                )}`}
              >
                {d.status}
              </span>

              {/* Status select */}
              <select
                className="border p-1 rounded"
                value={d.status}
                onChange={(e) => updateStatus(d.id, e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryAdmin;
