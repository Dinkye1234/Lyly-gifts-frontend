import { useState } from "react";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://lyly-gifts-backend.onrender.com/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            items,
            totalPrice,
            address,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Захиалга амжилттай илгээгдлээ!");
        // Энд сагс хоослох функц дуудаж болно
      } else {
        alert(data.message || "Алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      alert("Сервертэй холбогдож чадсангүй");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 pt-24">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        {step === 1 && (
          <OrderReview
            items={items}
            totalPrice={totalPrice}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <AddressForm
            address={address}
            setAddress={setAddress}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <PaymentInfo
            totalPrice={totalPrice}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;

/* -------------------- Sub Components -------------------- */

function OrderReview({ items, totalPrice, onNext }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Таны захиалга</h2>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between bg-gray-50 p-4 rounded-lg"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span className="font-semibold">{item.price * item.quantity}₮</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-lg font-bold border-t pt-4">
        <span>Нийт:</span>
        <span>{totalPrice}₮</span>
      </div>
      <button
        onClick={onNext}
        className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
      >
        Захиалга зөв байна
      </button>
    </div>
  );
}

function AddressForm({ address, setAddress, onNext, onBack }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    // Утасны дугаар 8 оронтой тоо мөн эсэхийг шалгах
    const phoneRegex = /^\d{8}$/;

    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.location.trim()
    ) {
      setError("Бүх талбарыг бөглөнө үү!");
      return;
    }

    if (!phoneRegex.test(address.phone)) {
      setError("Утасны дугаар 8 оронтой тоо байх ёстой!");
      return;
    }

    setError("");
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Хүргүүлэх хаяг</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          placeholder="Нэр"
          value={address.name}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          placeholder="Утасны дугаар (8 оронтой)"
          value={address.phone}
          maxLength={8}
          onChange={(e) => {
            // Зөвхөн тоо бичдэг болгох
            const val = e.target.value.replace(/\D/g, "");
            setAddress({ ...address, phone: val });
          }}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          placeholder="Хаяг (Дүүрэг, хороо, тоот)"
          value={address.location}
          onChange={(e) => setAddress({ ...address, location: e.target.value })}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Буцах
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Дараах
        </button>
      </div>
    </div>
  );
}

function PaymentInfo({ totalPrice, onBack, onSubmit }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Төлбөр хийх</h2>
      <p className="mb-4">
        Та дараах дансанд <b className="text-purple-600">{totalPrice}₮</b>{" "}
        шилжүүлснээр таны захиалга баталгаажна.
      </p>

      <div className="bg-gray-50 p-5 rounded-xl space-y-2 mb-6 border border-gray-100">
        <p className="flex justify-between">
          <span>Банк:</span> <b>Хаан банк</b>
        </p>
        <p className="flex justify-between">
          <span>Данс:</span> <b>123456789</b>
        </p>
        <p className="flex justify-between">
          <span>Нэр:</span> <b>My Shop LLC</b>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Буцах
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 text-white font-bold transition"
        >
          Гүйлгээ хийсэн
        </button>
      </div>
    </div>
  );
}
