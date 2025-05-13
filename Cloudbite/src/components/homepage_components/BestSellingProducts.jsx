import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react"; // Import Heart icon
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { useNavigate } from "react-router-dom";

const BestSellingProducts = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track quantities for each product
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-foods`);
        const foods = response.data || [];
        const sortedFoods = foods
          .filter((food) => food.availability_status)
          .slice(0, 8);
        setBestSellers(sortedFoods);
      } catch (error) {
        console.error("Error fetching best-selling foods:", error.message);
      }
    };

    fetchBestSellers();
  }, []);

  const handleNavigateToSingleFood = (id) => {
    navigate(`/food/${id}`);
  };

  const handleAddToCart = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (id) => {
    setQuantities((prev) => {
      if (prev[id] > 1) {
        return { ...prev, [id]: prev[id] - 1 };
      } else {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
    });
  };

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
          <div
            key={index}
            className="relative text-center cursor-pointer group"
            onClick={() => handleNavigateToSingleFood(food._id)}
          >
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
              </span>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              {quantities[food._id] ? (
                <div className="flex items-center gap-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCart(food._id);
                    }}
                  >
                    -
                  </button>
                  <span className="text-white font-semibold">{quantities[food._id]}</span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(food._id);
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(food._id);
                  }}
                >
                  Add to Cart
                </button>
              )}
              <button
                className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
