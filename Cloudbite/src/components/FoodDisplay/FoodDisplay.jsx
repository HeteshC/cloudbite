import React, { useState, useEffect, useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import backendGlobalRoute from '../../config/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../components/cart_components/CartContext'; // Import CartContext
import { toast } from 'react-toastify';

const FoodDisplay = ({ category }) => {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // Access addToCart from CartContext

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const url = `${backendGlobalRoute}/api/all-foods`; // Fetch all food items
        const response = await axios.get(url);
        console.log('API Response:', response.data);
        if (response.data) {
          const filteredFoodList =
            category === "All"
              ? response.data
              : response.data.filter(
                  (item) => item.kitchen?.name === category // Filter by kitchen name
                );
          setFoodList(filteredFoodList);
        } else {
          console.error('Failed to fetch data properly');
        }
      } catch (error) {
        console.error('Error fetching food list:', error.message);
        if (error.response) {
          console.error('Error response data:', error.response.data); // Log server response
          console.error('Error response status:', error.response.status); // Log HTTP status code
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoodList();
  }, [category]); // Refetch foods when category changes

  const handleAddToCart = (foodItem) => {
    if (foodItem.availability_status) {
      addToCart(foodItem); // Use addToCart from CartContext
      toast.success(`${foodItem.product_name} added to cart!`);
      navigate(`/food/${foodItem._id}`); // Navigate to SingleFood page
    } else {
      toast.error('Cannot add. Product is Out of Stock!', { autoClose: 1200 });
    }
  };

  return (
    <div className='food-display' id='food-display'>
      {/* <h2>Top Dishes Near You</h2> */}
      <div className="food-display-list">
        {loading ? (
          <p>Loading...</p>
        ) : foodList.length > 0 ? (
          foodList.map((item) => (
            <div
              key={item._id}
              style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
            >
              <FoodItem
                id={item._id}
                name={item.product_name}
                description={item.description}
                selling_price={item.selling_price} // Pass selling price
                display_price={item.display_price} // Pass display price
                image={`${backendGlobalRoute}/${item.product_image}`}
                onAddToCart={() => handleAddToCart(item)} // Pass add-to-cart handler
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
