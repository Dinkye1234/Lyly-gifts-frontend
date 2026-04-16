import React, { useEffect, useState } from "react";
import { User, Mail, MessageSquare, Calendar, Trash2, Box } from "lucide-react";

const Comments = () => {
  const [productReviews, setProductReviews] = useState([]); // Бүтээгдэхүүний сэтгэгдлүүд
  const [contactMessages, setContactMessages] = useState([]); // Холбоо барих мессежүүд
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 1. Сэтгэгдэл болон Мессежүүдийг татах
  const fetchData = async () => {
    setLoading(true);
    try {
      // Бүх бүтээгдэхүүнийг татах (Дотор нь сэтгэгдлүүд байгаа)
      const prodRes = await fetch("http://localhost:8000/api/product");
      const products = await prodRes.json();

      // Бүх бүтээгдэхүүний сэтгэгдлийг нэг массив болгох
      let allReviews = [];
      products.forEach((p) => {
        if (p.reviews) {
          p.reviews.forEach((r) => {
            allReviews.push({ ...r, productName: p.name, productId: p._id });
          });
        }
      });
      setProductReviews(
        allReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );

      // Холбоо барих мессежүүдийг татах
      const contactRes = await fetch("http://localhost:8000/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contactData = await contactRes.json();
      if (contactRes.ok) setContactMessages(contactData);
    } catch (err) {
      console.error("Алдаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Бүтээгдэхүүний сэтгэгдэл устгах функц
  const deleteReview = async (productId, reviewId) => {
    if (!window.confirm("Энэ сэтгэгдлийг устгах уу?")) return;

    try {
      // Таны Backend-д Review устгах endpoint байх ёстой: DELETE /api/product/:prodId/review/:revId
      const res = await fetch(
        `http://localhost:8000/api/product/${productId}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setProductReviews(productReviews.filter((r) => r._id !== reviewId));
        alert("Сэтгэгдэл устгагдлаа");
      }
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-purple-600 font-bold">
        Уншиж байна...
      </div>
    );

  return (
    <div className="p-4 sm:p-8 space-y-12">
      <section>
        <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <Box className="mr-2 text-blue-500" />
          Бүтээгдэхүүний сэтгэгдлүүд
        </h1>

        {productReviews.length === 0 ? (
          <div className="p-10 bg-gray-50 rounded-2xl border-2 border-dashed text-center text-gray-400">
            Сэтгэгдэл байхгүй байна.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white border-l-4 border-blue-500 rounded-xl p-5 shadow-sm relative group"
              >
                <button
                  onClick={() => deleteReview(rev.productId, rev._id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="mb-3">
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold uppercase">
                    {rev.productName}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <User className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {rev.username}
                  </h3>
                </div>

                <p className="text-gray-700 text-sm bg-blue-50/50 p-3 rounded-lg mb-3 italic">
                  "{rev.comment}"
                </p>

                <div className="flex items-center text-[10px] text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(rev.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr />

      <section>
        <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <MessageSquare className="mr-2 text-purple-600" />
          Холбоо барих мессежүүд
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMessages.map((m) => (
            <div
              key={m._id}
              className="bg-white border rounded-2xl p-6 shadow-sm relative"
            >
              <button
                onClick={() => {}}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-sm text-gray-600 mb-2 font-semibold">
                Сэдэв: {m.subject}
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Comments;
