import React, { useState, useEffect } from "react";
import "./FoodItem.css";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const FoodItem = ({ id, name, price, description, image, costPrice }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async () => {
    try {
      await axios.post(`${backendGlobalRoute}/api/cart/add`, { id });
      setCartCount(cartCount + 1);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const removeFromCart = async () => {
    try {
      await axios.post(`${backendGlobalRoute}/api/cart/remove`, { id });
      setCartCount(cartCount > 0 ? cartCount - 1 : 0);
    } catch (error) {
      console.error("Error removing from cart:", error.message);
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        // Simulate cart count as the API is unavailable
        setCartCount(0); // Default to 0 as the cart count API is not implemented
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
      }
    };

    fetchCartCount();
  }, [id]);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="flex justify-between">
        <div className="price-details">
          <span className="original-price">₹{150}</span>
          <span className="discounted-price">₹{price}</span>
        </div>
        {cartCount === 0 ? (
          <button className="add-to-cart-btn mt-2" onClick={addToCart}>
            ADD
          </button>
        ) : (
          <div className="cart-counter">
            <button className="counter-btn" onClick={removeFromCart}>
              -
            </button>
            <span className="cart-count">{cartCount}</span>
            <button className="counter-btn" onClick={addToCart}>
              +
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
