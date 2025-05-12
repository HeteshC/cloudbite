import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SingleFood.css';
import backendGlobalRoute from '../../config/config';
import { CartContext } from '../../components/cart_components/CartContext'; // Import CartContext

const SingleFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateQuantity, removeFromCart, cartItems } = useContext(CartContext); // Use updateQuantity and removeFromCart
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/get-food-by-id/${id}`);
        if (response.data) {
          setFood(response.data);
          const cartItem = cartItems.find((item) => item._id === response.data._id);
          setQuantity(cartItem ? cartItem.quantity : 0); // Initialize quantity from cart
        }
      } catch (error) {
        console.error('Error fetching food details:', error.message);
        if (error.response && error.response.status === 404) {
          console.warn('Food item not found. Redirecting to home.');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id, navigate, cartItems]);

  const handleAdd = () => {
    if (food) {
      updateQuantity(food._id, quantity + 1); // Increment quantity in the cart
      setQuantity(quantity + 1);
    }
  };

  const handleRemove = () => {
    if (quantity > 1) {
      updateQuantity(food._id, quantity - 1); // Decrement quantity in the cart
      setQuantity(quantity - 1);
    } else if (quantity === 1) {
      removeFromCart(food._id); // Remove the product entirely if quantity becomes 0
      setQuantity(0);
    }
  };

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
          <p className="food-category">{food.kitchen?.name || 'Kitchen Name'}</p>
          <h2>{food.product_name}</h2>
          <p className="food-description">{food.description || 'No description available.'}</p>
          <div className="price-details">
            {food.display_price && (
              <span className="original-price">₹{food.display_price}</span>
            )}
            <span className="discounted-price">₹{food.selling_price}</span>
          </div>
          <div className="cart-actions">
            <div className="quantity-controls">
              <button onClick={handleRemove} className="decrement">-</button>
              <span className="quantity">{quantity}</span>
              <button onClick={handleAdd} className="increment">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFood;
