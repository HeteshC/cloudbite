import { Store } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css'; // Assuming you have a CSS file for styles
import globalBackendRoute from '../../config/config'; // Adjust the import based on your project structure

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Ensure cartItems is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error("User is not authenticated.");
        }

        const response = await axios.get(`${globalBackendRoute}/api/get-cart-items`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setCartItems(response.data.items || []); // Ensure items is always an array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError(err.response?.data?.message || 'Failed to load cart items.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const getTotalCartAmount = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0; // Handle empty or undefined cartItems
    return cartItems.reduce(
      (total, item) => total + (item.selling_price || 0) * (item.quantity || 0),
      0
    );
  };

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
        </div>
        <input type="email" placeholder="Email address" />
        <input type="text" placeholder="Address" />
        <div className="multi-fields">
          <input type="text" placeholder="City" />
          <input type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="Pin Code" />
          <input type="text" placeholder="Country" />
        </div>
        <input type="text" placeholder="Phone Number" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{30}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() + 30}</b>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/thank-you')}
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
