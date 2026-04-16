import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserPlus,
  Mail,
  Lock,
  Edit2,
  Trash2,
  Users,
  Save,
  X,
} from "lucide-react";

const DeliveryManList = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchDeliveryMen = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/delivery-man", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data); // Хариу response ямар хэлбэртэй байгааг шалгах

      // Array эсэхийг шалгах
      if (Array.isArray(res.data)) {
        setDeliveryMen(res.data);
      } else if (res.data.deliveryMen) {
        setDeliveryMen(res.data.deliveryMen);
      } else {
        setDeliveryMen([]); // Хэрэв ямар ч array олдсонгүй бол хоосон array
      }
    } catch (err) {
      console.error(err);
      setDeliveryMen([]);
    }
  };

  useEffect(() => {
    fetchDeliveryMen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/delivery-man/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post("http://localhost:8000/api/delivery-man", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", email: "", password: "" });
      setEditingId(null);
      fetchDeliveryMen();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (d) => {
    setForm({ name: d.name, email: d.email, password: "" });
    setEditingId(d._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Устгах уу?")) {
      try {
        await axios.delete(`http://localhost:8000/api/delivery-man/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDeliveryMen();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-3 border-b pb-5">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Users size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Хүргэгчдийн удирдлага
          </h2>
          <p className="text-sm text-gray-500">
            Системд шинэ хүргэгч нэмэх болон мэдээллийг хянах
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Форм хэсэг (Зүүн талд) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              {editingId ? (
                <Edit2 size={18} className="text-orange-500" />
              ) : (
                <UserPlus size={18} className="text-blue-500" />
              )}
              {editingId ? "Мэдээлэл засах" : "Шинэ хүргэгч бүртгэх"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Edit2 size={16} />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Нэвтрэх нэр"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Имэйл хаяг"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Нууц үг"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required={!editingId}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    editingId
                      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-100"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                  }`}
                >
                  <Save size={18} />
                  {editingId ? "Хадгалах" : "Бүртгэх"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: "", email: "", password: "" });
                    }}
                    className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Жагсаалт хэсэг (Баруун талд) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Нийт хүргэгчид: {deliveryMen.length}
              </span>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {deliveryMen.length > 0 ? (
                deliveryMen.map((d) => (
                  <li
                    key={d._id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {d.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white leading-none mb-1">
                          {d.name}
                        </h4>
                        <p className="text-xs text-gray-500">{d.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(d)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Засах"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Устгах"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="p-20 text-center text-gray-400 italic">
                  Бүртгэлтэй хүргэгч олдсонгүй.
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManList;
