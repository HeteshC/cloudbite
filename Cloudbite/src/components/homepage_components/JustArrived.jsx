import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../cart_components/CartContext";

const VISIBLE_COUNT = 4;

const JustArrived = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext);

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

  const handleNavigateToSingleFood = (slug) => {
    navigate(`/food/${slug}`); // Navigate using the slug
  };

  const getQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Just Arrived</h2>
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
          <div
            key={index}
            className="bg-white shadow-md rounded-lg flex flex-col h-full relative"
          >
            <div className="absolute top-4 right-4">
              <button
                className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
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
              {getQuantity(food._id) > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(food._id);
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
                      e.stopPropagation();
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
                    e.stopPropagation();
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

export default JustArrived;
