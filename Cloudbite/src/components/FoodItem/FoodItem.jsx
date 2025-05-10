import React from "react";
import "./FoodItem.css";

const FoodItem = ({ id, name, description, price, image, onAddToCart }) => {
  return (
    <div className="food-item">
      <img src={image} alt={name} className="food-item-image" />
      <div className="food-item-details">
        <h3>{name}</h3>
        <p>{description}</p>
        <p>${price}</p>
        <button
          className="add-to-cart-btn"
          onClick={onAddToCart} // Trigger add-to-cart handler
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
