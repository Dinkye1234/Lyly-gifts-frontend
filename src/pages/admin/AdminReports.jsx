import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  PackageCheck,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import customAPI from "../../config/api";

const AdminReport = () => {
  // Өгөгдлийн бүтцэд topProducts нэмэв
  const [data, setData] = useState({
    chartData: [],
    orderList: [],
    topProducts: [], // Хамгийн их борлуулалттай
    mostLiked: [], // Хамгийн их Like-тай
  });
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(false);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // AdminReport.jsx доторх useEffect-ийг ингэж шинэчил:
  useEffect(() => {
    const fetchData = async () => {
      const adminToken = localStorage.getItem("adminToken");

      // Хэрэв токен байхгүй бол хүсэлт явуулах хэрэггүй
      if (!adminToken) {
        console.error("Админ токен олдсонгүй!");
        return;
      }

      setLoading(true);
      try {
        const res = await customAPI.get(`/orders/sales-report?range=${range}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Зөв форматтай эсэхийг нягтал
          },
        });
        setData(res.data);
      } catch (err) {
        // 403 алдаа ирвэл консол дээр дэлгэрэнгүй харах
        console.error(
          "Дата авахад алдаа гарлаа:",
          err.response?.data || err.message,
        );
      }
      setLoading(false);
    };
    fetchData();
  }, [range]);
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sales & Product Report", 14, 20);
    // ... (өмнөх PDF код хэвээрээ)
    doc.save(`Full_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalRevenue = Array.isArray(data.orderList)
    ? data.orderList.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
    : 0;

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase">
            Тайлан & Аналитик
          </h1>
          <p className="text-gray-500">Борлуулалт болон бүтээгдэхүүний идэвх</p>
        </div>

        <div className="flex gap-3 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          {["week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${range === r ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {r === "week" ? "7 хоног" : r === "month" ? "Сар" : "Жил"}
            </button>
          ))}
          <button
            onClick={generatePDF}
            className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* ҮНДСЭН КАРТУУД */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100">
          <TrendingUp className="text-purple-600 mb-2" size={24} />
          <p className="text-gray-500 text-xs">Нийт борлуулалт</p>
          <h3 className="text-2xl font-black">
            {totalRevenue.toLocaleString()}₮
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100">
          <PackageCheck className="text-green-500 mb-2" size={24} />
          <p className="text-gray-500 text-xs">Захиалгын тоо</p>
          <h3 className="text-2xl font-black">{data.orderList.length} ш</h3>
        </div>

        {/* Хамгийн их Like-тай бүтээгдэхүүн (Quick View) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100">
          <Heart className="text-red-500 mb-2" size={24} />
          <p className="text-gray-500 text-xs">Хамгийн их Like-тай</p>
          <h3 className="text-xl font-bold truncate">
            {data.mostLiked?.[0]?.name || "Дата алга"}
          </h3>
          {/* <span className="text-xs text-red-500 font-bold">
            {data.mostLiked?.[0]?.likes} likes
          </span> */}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100">
          <ArrowUpRight className="text-blue-500 mb-2" size={24} />
          <p className="text-gray-500 text-xs">Шилдэг бүтээгдэхүүн</p>
          <h3 className="text-xl font-bold truncate">
            {data.topProducts?.[0]?.name || "Дата алга"}
          </h3>
          <span className="text-xs text-blue-500 font-bold">
            {data.topProducts?.[0]?.salesCount} борлуулалт
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Борлуулалтын үзүүлэл</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="totalSales"
                  fill="#9333ea"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Борлуулалтаар тэргүүлэгч</h2>
          <div className="space-y-5">
            {data.topProducts?.length > 0 ? (
              data.topProducts.slice(0, 5).map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold text-sm">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">{product.salesCount} ш</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-10">
                Өгөгдөл олдсонгүй
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LIKE-ТАЙ БҮТЭЭГДЭХҮҮНҮҮД */}
      {/* LIKE-ТАЙ БҮТЭЭГДЭХҮҮНҮҮД */}
      {/* <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-red-500 flex items-center gap-2">
          <Heart size={20} fill="currentColor" /> Хамгийн их Like-тай
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.mostLiked && data.mostLiked.length > 0 ? (
            data.mostLiked.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-50 dark:border-gray-800 rounded-2xl text-center hover:shadow-md transition-shadow"
              >
                <h4 className="text-sm font-bold truncate text-gray-800 dark:text-gray-200">
                  {item.name}
                </h4>
                <p className="text-xs text-red-500 font-black mt-1">
                  {typeof item.likes === "number" ? item.likes : 0} Likes
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 text-sm py-4">
              Like-тай бүтээгдэхүүн олдсонгүй
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default AdminReport;
