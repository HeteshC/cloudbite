import React from "react";
import "./FoodItem.css";

const FoodItem = ({
  id,
  name,
  description,
  selling_price,
  display_price,
  image,
  onAddToCart,
}) => {
  return (
    <div className="food-item">
      <img src={image} alt={name} className="food-item-image" />
      <div className="food-item-details p-3">
        <h3 className="mt-2">{name}</h3>
        <p className="truncate">{description}</p>
        <div className="food-item-prices-and-cart">
          <div className="food-item-prices">
            {display_price > selling_price && (
              <span className="food-item-display-price">₹{display_price}</span>
            )}
            <span className="food-item-selling-price">₹{selling_price}</span>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={onAddToCart} // Trigger add-to-cart handler
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
