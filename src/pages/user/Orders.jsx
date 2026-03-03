import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock order data
  const orders = [
    {
      id: "ORD-2025-001",
      date: "2025-01-10",
      status: "delivered",
      total: 89.99,
      items: [
        {
          id: "1",
          name: "Romantic Valentine Package",
          image:
            "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=300",
          quantity: 1,
          price: 89.99,
        },
      ],
      shippingAddress: {
        name: "Jane Smith",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      tracking: "TRK123456789",
    },
    {
      id: "ORD-2025-002",
      date: "2025-01-08",
      status: "in-transit",
      total: 155.98,
      items: [
        {
          id: "2",
          name: "Birthday Celebration Box",
          image:
            "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=300",
          quantity: 1,
          price: 65.99,
        },
        {
          id: "3",
          name: "Luxury Spa Experience",
          image:
            "https://images.pexels.com/photos/3992204/pexels-photo-3992204.jpeg?auto=compress&cs=tinysrgb&w=300",
          quantity: 1,
          price: 89.99,
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
      },
      tracking: "TRK987654321",
    },
    {
      id: "ORD-2025-003",
      date: "2025-01-05",
      status: "processing",
      total: 45.99,
      items: [
        {
          id: "4",
          name: "Sweet Treats Collection",
          image:
            "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=300",
          quantity: 1,
          price: 45.99,
        },
      ],
      shippingAddress: {
        name: "Emily Johnson",
        street: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
      tracking: null,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in-transit":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "in-transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "in-transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Please Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to be signed in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your gift orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              When you place your first order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order {order.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-2">
                        {getStatusText(order.status)}
                      </span>
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 rounded-xl p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order.id ? null : order.id
                      )
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>

                  {order.tracking && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300">
                      <Truck className="h-4 w-4" />
                      <span>Track Package</span>
                    </button>
                  )}

                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300">
                    <Download className="h-4 w-4" />
                    <span>Download Invoice</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 btn-gradient text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Package className="h-4 w-4" />
                    <span>Reorder</span>
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Shipping Address
                        </h4>
                        <div className="text-gray-600 dark:text-gray-400 space-y-1">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zip}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal:</span>
                            <span>${(order.total - 9.99).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Shipping:</span>
                            <span>$9.99</span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {order.tracking && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                              Tracking Number
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {order.tracking}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
