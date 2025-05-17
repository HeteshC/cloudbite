import React, { useState, useEffect, useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import backendGlobalRoute from "../../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/cart_components/CartContext"; // Import CartContext
import { toast } from "react-toastify";

const FoodDisplay = ({ category, filterType }) => {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, updateQuantity } = useContext(CartContext); // Access updateQuantity from CartContext

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const url = `${backendGlobalRoute}/api/all-foods`; // Fetch all food items
        const response = await axios.get(url);
        if (response.data) {
          const filteredFoodList =
            filterType === "kitchen"
              ? response.data.filter((item) => item.kitchen?.name === category) // Filter by kitchen name
              : response.data.filter((item) => item.subcategory?._id === category); // Filter by subcategory ID
          setFoodList(filteredFoodList);
        }
      } catch (error) {
        console.error("Error fetching food list:", error.message);
        if (error.response) {
          console.error("Error response data:", error.response.data); // Log server response
          console.error("Error response status:", error.response.status); // Log HTTP status code
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoodList();
  }, [category, filterType]); // Refetch foods when category or filterType changes

  const handleAddToCart = async (foodItem) => {
    if (foodItem && foodItem._id) {
      try {
        await addToCart(foodItem); // Pass the entire foodItem object
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart.", { autoClose: 1200 });
      }
    } else {
      console.error("Invalid food item:", foodItem);
      toast.error("Invalid food item. Cannot add to cart.", { autoClose: 1200 });
    }
  };

  const handleNavigateToSingleFood = (slug) => {
    navigate(`/food/${slug}`); // Navigate to the single food page with the product slug
  };

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-list">
        {loading ? (
          <p>Loading...</p>
        ) : foodList.length > 0 ? (
          foodList.map((item) => (
            <div
              key={item._id}
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateToSingleFood(item.slug)} // Use slug instead of _id
            >
              <FoodItem
                id={item._id}
                name={item.product_name}
                description={item.description}
                selling_price={item.selling_price}
                display_price={item.display_price}
                image={`${backendGlobalRoute}/${item.product_image}`}
                onAddToCart={() => handleAddToCart(item)}
                onRemoveFromCart={() => removeFromCart(item._id)}
                onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity)}
              />
            </div>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
