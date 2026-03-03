// ProductCard.js
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    // product.id эсвэл product._id (таны өгөгдлийн баазаас хамаарна) ашиглана
    <Link to={`/product/${product._id || product.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-purple-600 font-bold">{product.price}₮</span>
            {product.isSale && (
              <span className="text-red-500 font-semibold text-sm">
                Хямдрал
              </span>
            )}
            {product.isNew && (
              <span className="text-green-500 font-semibold text-sm">Шинэ</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
