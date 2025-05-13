import React, { useState, useEffect, useContext } from "react";
import { Star, Heart } from "lucide-react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../cart_components/CartContext"; // Import CartContext

const BestSellingProducts = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext); // Use CartContext

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

  const handleNavigateToSingleFood = (slug) => {
    navigate(`/food/${slug}`); // Navigate using the slug
  };

  const getQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    return item ? item.quantity : 0;
  };

  const handleRemoveFromCart = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
    if (item && item.quantity > 1) {
      // Decrement quantity if more than 1
      removeFromCart(productId, item.quantity - 1);
    } else {
      // Remove item completely if quantity is 1
      removeFromCart(productId);
    }
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
            className="bg-white shadow-md rounded-lg flex flex-col h-full relative"
          >
            {/* Heart Icon at the Top-Right */}
            <div className="absolute top-4 right-4">
              <button
                className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300"
                onClick={(e) => e.stopPropagation()} // Prevent triggering navigation
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Image Section */}
            <div
              className="h-1/2 w-full cursor-pointer"
              onClick={() => handleNavigateToSingleFood(food.slug)} // Use slug for navigation
            >
              <img
                src={`${globalBackendRoute}/${food.product_image}`}
                alt={food.food_name}
                className="h-full w-full object-cover rounded-t-lg"
              />
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between flex-grow p-4">
              <div>
                <div className="flex justify-around">
                  <p className="font-semibold text-gray-800 text-lg mb-2">
                    {food.product_name}
                  </p>
                  <div className="flex justify-center items-center text-yellow-500 mb-3">
                    {Array.from({ length: 1 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-700 ml-1">4.5</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 truncate mb-2 text-center">
                  {food.description}
                </p>
                <div className="flex justify-center gap-3 items-center ">
                  <div className="text-sm text-gray-700 space-x-2">
                    {food.display_price > food.selling_price && (
                      <span className="line-through text-gray-500">
                        ₹{food.display_price}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">
                      ₹{food.selling_price}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 border px-2 py-0.5 border-gray-300 rounded">
                    {food.discount || "0% OFF"}
                  </span>
                </div>
              </div>

              {/* Add to Cart Section */}
              {getQuantity(food._id) > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering navigation
                      handleRemoveFromCart(food._id);
                    }}
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-semibold">
                    {getQuantity(food._id)}
                  </span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering navigation
                      addToCart(food);
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering navigation
                    addToCart(food);
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
