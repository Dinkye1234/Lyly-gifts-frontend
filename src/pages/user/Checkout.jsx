import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const generateKhoroos = (count) => {
  return Array.from({ length: count }, (_, i) => `${i + 1}-р хороо`);
};

const UB_DATA = {
  Баянзүрх: generateKhoroos(43),
  Сонгинохайрхан: generateKhoroos(43),
  "Хан-Уул": generateKhoroos(25),
  Баянгол: generateKhoroos(25),
  Чингэлтэй: generateKhoroos(19),
  Сүхбаатар: generateKhoroos(20),
  Налайх: generateKhoroos(8),
  Багануур: generateKhoroos(5),
  Багахангай: generateKhoroos(3),
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    district: "",
    khoroo: "",
    detail: "",
  });

  const handleSubmit = async () => {
    try {
      const fullLocation = `${address.district}, ${address.khoroo}, ${address.detail}`;
      const res = await fetch("http://localhost:8000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items,
          totalPrice,
          address: {
            name: address.name,
            phone: address.phone,
            location: fullLocation,
          },
        }),
      });

      if (res.ok) {
        alert("Захиалга амжилттай илгээгдлээ!");
        if (clearCart) clearCart();
        navigate("/cart");
      } else {
        const data = await res.json();
        alert(data.message || "Алдаа гарлаа");
      }
    } catch (err) {
      alert("Сервертэй холбогдож чадсангүй");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-10 pt-20 sm:pt-28 px-3">
      {/* Progress Steps - Гар утас дээр жижигсүүлсэн */}
      <div className="flex justify-between mb-6 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base transition-all ${
              step >= s
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white shadow-xl rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 border border-gray-50">
        {step === 2 ? (
          <AddressForm
            address={address}
            setAddress={setAddress}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        ) : step === 3 ? (
          <PaymentInfo
            totalPrice={totalPrice}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        ) : (
          <OrderReview
            items={items}
            totalPrice={totalPrice}
            onNext={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
};

/* -------------------- AddressForm Сайжруулсан хувилбар -------------------- */

function AddressForm({ address, setAddress, onNext, onBack }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.district ||
      !address.khoroo ||
      !address.detail
    ) {
      setError("Мэдээллээ бүрэн оруулна уу!");
      return;
    }
    onNext();
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-lg sm:text-2xl font-black mb-4 sm:mb-6 text-gray-800">
        Хүргэлтийн хаяг
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {/* Нэр болон Утас - Гар утас дээр доошоо цуварна */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
              Хүлээн авагч
            </label>
            <input
              placeholder="Нэр"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="w-full bg-gray-50 border-none p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-400 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
              Утас
            </label>
            <input
              placeholder="Дугаар"
              value={address.phone}
              maxLength={8}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              className="w-full bg-gray-50 border-none p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-400 text-sm"
            />
          </div>
        </div>

        {/* Дүүрэг болон Хороо - Гар утас дээр 2 багана хэвээр үлдэх боловч padding багассан */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
              Дүүрэг
            </label>
            <select
              value={address.district}
              onChange={(e) =>
                setAddress({ ...address, district: e.target.value, khoroo: "" })
              }
              className="w-full bg-gray-50 border-none p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-400 text-sm cursor-pointer"
            >
              <option value="">Дүүрэг</option>
              {Object.keys(UB_DATA).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
              Хороо
            </label>
            <select
              disabled={!address.district}
              value={address.khoroo}
              onChange={(e) =>
                setAddress({ ...address, khoroo: e.target.value })
              }
              className="w-full bg-gray-50 border-none p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-400 text-sm disabled:opacity-50"
            >
              <option value="">Хороо</option>
              {address.district &&
                UB_DATA[address.district].map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
            Байр, тоот
          </label>
          <input
            placeholder="Жишээ: 15-р байр, 45 тоот"
            value={address.detail}
            onChange={(e) => setAddress({ ...address, detail: e.target.value })}
            className="w-full bg-gray-50 border-none p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-400 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6 sm:mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-3 text-sm font-bold text-gray-500"
        >
          Буцах
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] bg-gray-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base"
        >
          Дараах
        </button>
      </div>
    </div>
  );
}

// OrderReview болон PaymentInfo-г өмнөх загвараар нь ашиглана уу (Responsive хэвээрээ байгаа)
function OrderReview({ items, totalPrice, onNext }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-lg sm:text-2xl font-black mb-4 text-gray-800">
        Захиалга
      </h2>
      <div className="max-h-52 overflow-y-auto space-y-2 mb-4 pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
          >
            <div className="max-w-[65%]">
              <p className="font-bold text-gray-700 text-xs sm:text-sm truncate">
                {item.name}
              </p>
              <p className="text-[10px] text-gray-500">{item.quantity} ш</p>
            </div>
            <span className="font-black text-purple-600 text-xs sm:text-sm">
              {(item.price * item.quantity).toLocaleString()}₮
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-base sm:text-xl font-black border-t-2 border-dashed pt-4 mb-6">
        <span>Нийт:</span>
        <span className="text-purple-600">{totalPrice.toLocaleString()}₮</span>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm"
      >
        Үргэлжлүүлэх
      </button>
    </div>
  );
}

function PaymentInfo({ totalPrice, onBack, onSubmit }) {
  return (
    <div className="animate-fadeIn text-center">
      <h2 className="text-lg sm:text-2xl font-black mb-2 text-gray-800">
        Төлбөр
      </h2>
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-5 sm:p-8 rounded-[1.5rem] text-white shadow-xl mb-6 text-left">
        <div className="flex justify-between items-center mb-3">
          <span className="opacity-70 text-[10px] uppercase">Дүн:</span>
          <b className="text-xl font-black">{totalPrice.toLocaleString()}₮</b>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <b>Банк:</b> Хаан банк
          </p>
          <p>
            <b>Данс:</b> 123456789
          </p>
          <p>
            <b>Нэр:</b> My Shop LLC
          </p>
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="w-full bg-emerald-500 text-white py-3 sm:py-4 rounded-xl font-bold mb-3"
      >
        Гүйлгээ хийсэн
      </button>
      <button onClick={onBack} className="text-gray-400 text-sm font-bold">
        Буцах
      </button>
    </div>
  );
}

export default Checkout;
