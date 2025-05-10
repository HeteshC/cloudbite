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
        const response = await axios.get(`${backendGlobalRoute}/api/all-foods`);
        console.log('API Response:', response.data);
        if (response.data) {
          setFoodList(response.data);
        } else {
          console.error('Failed to fetch data properly');
        }
      } catch (error) {
        console.error('Error fetching food list:', error.message);
        toast.error('Unable to fetch food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodList();
  }, []);

  const handleAddToCart = (foodItem) => {
    if (foodItem.availability_status) {
      addToCart(foodItem); // Use addToCart from CartContext
      toast.success(`${foodItem.product_name} added to cart!`);
    } else {
      toast.error('Cannot add. Product is Out of Stock!', { autoClose: 1200 });
    }
  };

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes Near You</h2>
      <div className="food-display-list">
        {loading ? (
          <p>Loading...</p>
        ) : foodList.length > 0 ? (
          foodList.map((item) => {
            if (category === "All" || category === item.category?._id) {
              return (
                <div key={item._id} style={{ cursor: 'pointer' }}>
                  <FoodItem
                    id={item._id}
                    name={item.product_name}
                    description={item.description}
                    price={item.selling_price}
                    image={`${backendGlobalRoute}/${item.product_image}`}
                    onAddToCart={() => handleAddToCart(item)} // Pass add-to-cart handler
                  />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
