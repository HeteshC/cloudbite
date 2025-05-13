import React, { useState } from "react";
import { Star, Heart } from "lucide-react";

const FoodItem = ({
  id,
  name,
  description,
  selling_price,
  display_price,
  image,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity, // Add onUpdateQuantity prop
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation
    setQuantity(quantity + 1);
    onAddToCart(id); // Trigger add-to-cart handler
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent navigation
    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (typeof onUpdateQuantity === "function") {
        onUpdateQuantity(id, quantity - 1); // Update the cart with the decremented quantity
      }
    } else if (quantity === 1) {
      setQuantity(0);
      if (typeof onRemoveFromCart === "function") {
        onRemoveFromCart(id); // Remove the item completely from the cart
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col h-full relative">
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
      <div className="h-1/2 w-full cursor-pointer">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover rounded-t-lg"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <div className="flex justify-around">
            <p className="font-semibold text-gray-800 text-lg mb-2">{name}</p>
            <div className="flex justify-center items-center text-yellow-500 mb-3">
              {Array.from({ length: 1 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400" />
              ))}
              <span className="text-sm text-gray-700 ml-1">4.5</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2 text-center">
            {description}
          </p>
          <div className="flex justify-center gap-3 items-center">
            <div className="text-sm text-gray-700 space-x-2">
              {display_price > selling_price && (
                <span className="line-through text-gray-500">
                  ₹{display_price}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                ₹{selling_price}
              </span>
            </div>
            <span className="text-xs text-gray-600 border px-2 py-0.5 border-gray-300 rounded">
              10% OFF
            </span>
          </div>
        </div>

        {/* Add to Cart Section */}
        {quantity === 0 ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full"
            onClick={handleAdd}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex justify-between items-center w-full">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              onClick={handleRemove}
            >
              -
            </button>
            <span className="text-gray-800 font-semibold">{quantity}</span>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              onClick={handleAdd}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
