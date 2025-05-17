import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const ThankYou = () => {
  return (
    <div className="containerWidth flex flex-col items-center justify-center min-h-[80vh] text-center animate-fadeIn">
      <FaCheckCircle className="text-orange-700 text-7xl mb-6" />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-gray-600 mb-8">
        We have received your order. We will process and ship it soon.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-800 to-red-700 text-white rounded-full font-bold hover:opacity-90 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default ThankYou;
