import React, { useEffect, useState } from "react";

const Confirmed = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const fetchConfirmedOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/orders/confirmed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm("Устгахдаа итгэлтэй байна уу?")) return;
    try {
      await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((o) => o._id !== id));
      setSelectedOrders(selectedOrders.filter((sid) => sid !== id));
    } catch (err) {
      alert("Устгаж чадсангүй");
    }
  };
  const DeliverOrder = async (order) => {
    // id-ийн оронд order объектыг дамжуулна
    if (!window.confirm("Энэ захиалгыг хүргэлт рүү шилжүүлэх үү?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/orders/deliver/${order._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // ЭНЭ ХЭСГИЙГ НЭМЭХ: Хэрэгцээт мэдээллийг илгээх
          body: JSON.stringify({
            customer: order.address?.name,
            phone: order.address?.phone,
            address: order.address?.location,
            orderId: order._id,
          }),
        },
      );

      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== order._id));
        alert("Хүргэлт рүү шилжлээ!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Хүргэлт рүү шилжүүлж чадсангүй");
    }
  };
  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) return;
    if (
      !window.confirm(
        `${selectedOrders.length} захиалгыг устгахдаа итгэлтэй байна уу?`,
      )
    )
      return;

    try {
      await Promise.all(
        selectedOrders.map((id) =>
          fetch(`http://localhost:8000/api/orders/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ),
      );
      setOrders(orders.filter((o) => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      alert("Амжилттай устгагдлаа");
    } catch (err) {
      alert("Зарим захиалгыг устгахад алдаа гарлаа");
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  if (loading) return <p className="p-4 text-center text-lg">Уншиж байна...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Баталгаажсан захиалгууд
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          Баталгаажсан захиалга одоогоор байхгүй байна.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length}
                onChange={toggleSelectAll}
                className="h-5 w-5 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                Бүгдийг сонгох ({orders.length})
              </span>
            </div>

            {selectedOrders.length > 0 && (
              <button
                onClick={deleteSelectedOrders}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Сонгосон ({selectedOrders.length}) устгах
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className={`border rounded-lg p-4 shadow-sm transition-all ${
                  selectedOrders.includes(o._id)
                    ? "ring-2 ring-green-400 bg-green-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-lg text-green-700">
                    Захиалга #{o._id.slice(-5)}
                  </h2>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(o._id)}
                    onChange={() => toggleSelect(o._id)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 text-gray-700 text-sm">
                  <p>
                    <span className="font-medium text-gray-900">
                      Хэрэглэгч:
                    </span>{" "}
                    {o.address?.name || "Тодорхойгүй"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Утас:</span>{" "}
                    {o.address?.phone}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Нийт:</span> ₮
                    {o.totalPrice?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Хаяг:</span>{" "}
                    {o.address?.location || "Мэдээлэл алга"}
                  </p>
                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 italic">
                    {o.items
                      ?.map((i) => `${i.name} x ${i.quantity}`)
                      .join(", ")}
                  </div>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full uppercase">
                      {o.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteOrder(o._id)}
                    className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    Устгах
                  </button>
                  <button
                    onClick={() => DeliverOrder(o)}
                    className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    Хүргэлт
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Confirmed;
