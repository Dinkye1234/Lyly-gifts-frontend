import React, { useEffect, useState } from "react";
import { User, Mail, MessageSquare, Calendar, Trash2 } from "lucide-react";

const Comments = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Өгөгдлийн сангаас мессежүүдийг татах

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 401) {
        alert("Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Серверээс ирсэн алдаа:", data);
        setMessages([]);
      }
    } catch (err) {
      console.error("Холболтын алдаа:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Мессеж устгах функц
  const deleteMessage = async (id) => {
    if (!window.confirm("Устгахдаа итгэлтэй байна уу?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        // Сервер дээр амжилттай устсан бол жагсаалтаас хасна
        setMessages(messages.filter((m) => m._id !== id));
        alert("Амжилттай устгагдлаа");
      } else {
        const errorData = await res.json();
        alert(`Алдаа: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Сервертэй холбогдоход алдаа гарлаа");
    }
  };

  if (loading) return <div className="p-10 text-center">Уншиж байна...</div>;

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center">
        <MessageSquare className="mr-2 text-purple-600" />
        Хэрэглэгчийн сэтгэгдэл & Мессеж
      </h1>

      {messages.length === 0 ? (
        <div className="bg-gray-50 p-20 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
          Одоогоор мессеж ирээгүй байна.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((m) => (
            <div
              key={m._id}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <button
                onClick={() => deleteMessage(m._id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{m.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Mail className="h-3 w-3 mr-1" /> {m.email}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-purple-500 uppercase mb-1">
                  Сэдэв: {m.subject}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {m.message}
                </p>
              </div>

              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(m.createdAt).toLocaleDateString()}{" "}
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
