import React, { useState, useEffect } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import backendGlobalRoute from '../../config/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodDisplay = ({ category }) => {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/all-foods`);
        console.log('API Response:', response.data); // Log the response to debug
        if (response.data) {
          setFoodList(response.data); // Ensure the correct data structure is used
        } else {
          console.error('Failed to fetch data properly');
        }
      } catch (error) {
        console.error('Error fetching food list:', error.message);
        alert('Unable to fetch food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodList();
  }, []);

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
                <div key={item._id} onClick={() => navigate(`/food/${item._id}`)} style={{ cursor: 'pointer' }}>
                  <FoodItem
                    id={item._id}
                    name={item.product_name}
                    description={item.description}
                    price={item.selling_price}
                    image={`${backendGlobalRoute}/${item.product_image}`}
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
