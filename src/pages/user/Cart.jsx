import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";

function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  const shippingCost = totalPrice >= 75 ? 0 : 9.99;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 animate-scale-in">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Таны сагс хоосон байна
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Та одоогоор сагсандаа ямар ч бэлэг нэмээгүй байна.
            </p>
            <Link
              to="/shop"
              className="btn-gradient text-white font-semibold px-8 py-4 rounded-full inline-flex items-center space-x-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Бусад бүтээгдэхүүн үзэх</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Сагс
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} Таны сагсанд
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {item.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.color && (
                            <p>
                              Өнгө:{" "}
                              <span className="capitalize">
                                {item.color.replace("-", " ")}
                              </span>
                            </p>
                          )}
                          {item.wrapping && (
                            <p>
                              Бэлгийн баглаа:{" "}
                              <span className="capitalize">
                                {item.wrapping.replace("-", " ")}
                              </span>
                            </p>
                          )}
                          {item.message && <p>Message: "{item.message}"</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(item.price * item.quantity).toFixed(2)}₮
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.price.toFixed(2)}₮ Нэг бүр нь
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6 sticky top-24 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Захиалгын мэдээлэл
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Нийт дүн ({totalItems} items)</span>
                  <span>{totalPrice.toFixed(2)}₮</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Хүргэлт</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>НӨАТ</span>
                  <span>{tax.toFixed(2)}₮</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Төлөх дүн</span>
                    <span>{finalTotal.toFixed(2)}₮</span>
                  </div>
                </div>
              </div>

              {totalPrice < 75 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Add {(75 - totalPrice).toFixed(2)}₮ more to get free
                    shipping!
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Худалдан авалтаа үргэлжлүүлэх</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/shop"
                className="w-full mt-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 flex items-center justify-center"
              >
                Бэлэгнүүдийг үргэлжлүүлэн үзэх
              </Link>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Нууцлалтай, баталгаатай төлбөр</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>30 хоногийн буцаалт</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Бэлэг боолт үнэгүй багтсан</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
