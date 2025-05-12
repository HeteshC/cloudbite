import React, { useState, useEffect } from "react";
import { Star } from "lucide-react"; // Using lucide icons, or replace with your own star icons
import axios from "axios";
import globalBackendRoute from "../../config/config";

const BestSellingProducts = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-foods`);
        const foods = response.data || [];
        // Sort foods by availability and price (or any other logic for best-selling)
        const sortedFoods = foods
          .filter((food) => food.availability_status) // Only include available foods
          .slice(0, 8); // Limit to top 8 items (2 rows of 4 items each)
        setBestSellers(sortedFoods);
      } catch (error) {
        console.error("Error fetching best-selling foods:", error.message);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Best Selling Foods</h2>
        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((food, index) => (
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

export default BestSellingProducts;
