import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Серверээс захиалгыг татаж авах
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Захиалгыг татаж чадсангүй");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Захиалга устгах
  const deleteOrder = async (id) => {
    if (!window.confirm("Энэ захиалгыг устгах уу?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Устгаж чадсангүй");

      // Frontend дээр устгах
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setSelectedOrders((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Сонгосон бүх захиалгыг устгах
  const deleteSelected = async () => {
    if (!window.confirm("Сонгосон захиалгуудыг устгах уу?")) return;

    for (const id of selectedOrders) {
      await deleteOrder(id);
    }
    setSelectedOrders([]);
  };

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((sid) => sid !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const updateStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "Баталгаажсан" }),
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        alert("Захиалга баталгаажлаа!");
      }
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  if (loading) return <p className="p-4">Захиалгыг татаж байна...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl font-bold">Захиалгууд</h1>
        {selectedOrders.length > 0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 text-sm sm:text-base"
          >
            Сонгосон {selectedOrders.length} захиалгыг устгах
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          Захиалга байхгүй байна.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">
                  Захиалга #{o._id.slice(-5)}
                </h2>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(o._id)}
                  onChange={() => toggleSelect(o._id)}
                  className="h-4 w-4"
                />
              </div>

              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Хэрэглэгчийн нэр:</span>{" "}
                  {o.address?.name || o.userId || "Мэдээлэл алга"}
                </p>
                <p>
                  <span className="font-medium">Утас:</span>{" "}
                  {o.address?.phone || "Мэдээлэл алга"}
                </p>
                <p>
                  <span className="font-medium">Хаяг:</span>{" "}
                  {o.address?.location || "Мэдээлэл алга"}
                </p>
                <p>
                  <span className="font-medium">Бараа:</span>{" "}
                  {o.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
                </p>
                <p>
                  <span className="font-medium">Нийт:</span> ₮
                  {o.totalPrice.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Төлөв:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      o.status === "pending"
                        ? "bg-green-500"
                        : o.status === "processing"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {o.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-1 mt-3">
                <button
                  onClick={() => deleteOrder(o._id)}
                  className="w-1/2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-all duration-200"
                >
                  Устгах
                </button>
                <button
                  onClick={() =>
                    updateStatus(
                      o._id,
                      o.status === "pending" ? "processing" : "completed"
                    )
                  }
                  className="w-1/2 bg-green-500 text-white py-2 rounded hover:bg-hreen-600 transition-all duration-200"
                >
                  Баталгаажуулах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
