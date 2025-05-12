import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";
import globalBackendRoute from "../../config/config";

const VISIBLE_COUNT = 4;

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-foods`);
        const foods = response.data || [];
        setAllProducts(foods);
      } catch (error) {
        console.error("Error fetching featured products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = allProducts.slice(startIndex, startIndex + VISIBLE_COUNT);

  const handleNext = () => {
    if (startIndex + VISIBLE_COUNT < allProducts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Most Popular Foods</h2>
        <div className="flex gap-2 items-center">
          <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">
            View All
          </button>
          <button
            onClick={handlePrev}
            className={`p-2 rounded-full border border-gray-300 text-gray-600 ${
              startIndex === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className={`p-2 rounded-full border border-gray-300 text-gray-600 ${
              startIndex + VISIBLE_COUNT >= allProducts.length
                ? "opacity-0 pointer-events-none"
                : ""
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleProducts.map((food, index) => (
          <div key={index} className="text-center">
            
            <img
              src={`${globalBackendRoute}/${food.product_image}`}
              alt={food.food_name}
              className="mx-auto h-40 object-contain mb-3"
            />
            
            <div className="flex justify-around mx-10">
                <p className="font-medium text-gray-800 mb-1">{food.product_name}</p>
            <div className="flex justify-center items-center text-yellow-500 mb-1">
              {Array.from({ length: 1 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400" />
              ))}
              <span className="text-sm text-gray-700 ml-1">4.5</span>
            </div>
            </div>

            <p className="text-sm font-light truncate mx-16">{food.description}</p>
        
            <div className="flex justify-around mx-20 mt-2">
                <div className="text-sm text-gray-700 space-x-2 mb-1">
              {food.display_price > food.selling_price && (
                <span className="line-through text-gray-500">₹{food.display_price}</span>
              )}
              <span className="font-semibold text-gray-900">₹{food.selling_price}</span>
            </div>
            <span className="text-xs text-gray-600 border px-2 py-0.5 border-gray-300 rounded">
              {food.discount}
            </span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
