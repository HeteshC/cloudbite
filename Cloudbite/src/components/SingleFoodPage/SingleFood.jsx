import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SingleFood.css';
import FoodItem from '../FoodItem/FoodItem';
import backendGlobalRoute from '../../config/config';

const SingleFood = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [otherFood, setOtherFood] = useState([]);
  const [similarFood, setSimilarFood] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/get-food-by-id/${id}`);
        if (response.data) {
          setFood(response.data); // Ensure the correct data structure is used
        }
      } catch (error) {
        console.error('Error fetching food details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!food) {
    return <p>Food item not found.</p>;
  }

  return (
    <div className="single-food">
      <div className="food-details">
        <img
          src={food.product_image ? `${backendGlobalRoute}/${food.product_image}` : '/placeholder.png'}
          alt={food.product_name}
        />
        <div className="food-info">
          <p className="food-category">{food.kitchen || 'Kitchen Name'}</p>
          <h2>{food.product_name}</h2>
          <p className="food-description">{food.description}</p>
          <div className="price-details">
            {food.display_price && (
              <span className="original-price">₹{food.display_price}</span>
            )}
            <span className="discounted-price">₹{food.selling_price}</span>
          </div>
          <button>Add to Cart</button>
        </div>
      </div>

      {otherFood.length > 0 && (
        <>
          <h3>Other Food from This Kitchen</h3>
          <div className="other-food">
            {otherFood.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.product_name}
                description={item.description}
                price={item.selling_price}
                image={`${backendGlobalRoute}/${item.product_image}`}
              />
            ))}
          </div>
        </>
      )}

      {similarFood.length > 0 && (
        <>
          <h3>Similar Products</h3>
          <div className="similar-food">
            {similarFood.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.product_name}
                description={item.description}
                price={item.selling_price}
                image={`${backendGlobalRoute}/${item.product_image}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SingleFood;
