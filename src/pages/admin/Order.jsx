import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      // Хамгийн сүүлд ирсэн захиалгыг эхэнд нь гаргахын тулд reverse() ашиглав
      setOrders(Array.isArray(data) ? data.reverse() : []);
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

  // Ганцарчилсан устгах функц (alert-гүй хувилбар - дотоод хэрэглээнд)
  const performDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error(`ID: ${id} устгаж чадсангүй`);
    return id;
  };

  // Нэг захиалга устгах
  const deleteOrder = async (id) => {
    if (!window.confirm("Энэ захиалгыг устгах уу?")) return;
    try {
      await performDelete(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setSelectedOrders((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Олноор устгах (Alert зөвхөн 1 удаа ирнэ)
  const deleteSelected = async () => {
    if (
      !window.confirm(
        `Сонгосон ${selectedOrders.length} захиалгыг устгахдаа итгэлтэй байна уу?`,
      )
    )
      return;

    try {
      // Бүх хүсэлтийг зэрэг явуулна
      await Promise.all(selectedOrders.map((id) => performDelete(id)));

      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      alert("Амжилттай устгагдлаа");
    } catch (err) {
      console.error(err);
      alert("Зарим захиалгыг устгахад алдаа гарлаа. Хуудсаа сэргээнэ үү.");
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
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
        // Баталгаажсан захиалгыг жагсаалтаас хасах (хэрэв та өөр таб руу шилжүүлж байгаа бол)
        setOrders((prev) => prev.filter((o) => o._id !== id));
        alert("Захиалга баталгаажлаа!");
      }
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  if (loading) return <p className="p-4">Захиалгыг татаж байна...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Шинэ захиалгууд</h1>
        {selectedOrders.length > 0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-md transition-all"
          >
            Сонгосон ({selectedOrders.length}) устгах
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
              className={`border rounded-xl p-4 shadow-sm transition-all bg-white ${
                selectedOrders.includes(o._id)
                  ? "ring-2 ring-red-400 bg-red-50"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-700 text-lg">
                  Захиалга #{o._id.slice(-5)}
                </h2>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(o._id)}
                  onChange={() => toggleSelect(o._id)}
                  className="h-5 w-5 accent-red-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">
                    Хэрэглэгч:
                  </span>{" "}
                  {o.address?.name || "Мэдээлэл алга"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Утас:</span>{" "}
                  {o.address?.phone || "Мэдээлэл алга"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Хаяг:</span>{" "}
                  {o.address?.location || "Мэдээлэл алга"}
                </p>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                    Бараанууд:
                  </p>
                  {o.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.name}</span>
                      <span>x{i.quantity}</span>
                    </div>
                  ))}
                </div>
                <p className="text-lg font-bold text-green-600 pt-2">
                  Нийт: ₮{o.totalPrice?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Төлөв:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-yellow-100 text-yellow-700">
                    {o.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => deleteOrder(o._id)}
                  className="flex-1 bg-white border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Устгах
                </button>
                <button
                  disabled={o.status !== "Хүлээгдэж буй"}
                  onClick={() => updateStatus(o._id)}
                  className={`flex-1 py-2 rounded-lg text-white shadow-sm transition-colors ${
                    o.status !== "Хүлээгдэж буй"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {o.status === "Баталгаажсан"
                    ? "Баталгаажсан"
                    : "Баталгаажуулах"}
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
