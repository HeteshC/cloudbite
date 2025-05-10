import React, { useState, useEffect } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import backendGlobalRoute from '../../config/config';

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [foodList, setFoodList] = useState([]);
  const backendUrl = `${backendGlobalRoute}/uploads/`; // Define the backend URL for images

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await axios.get(`${backendGlobalRoute}/api/cart`);
        setCartItems(cartResponse.data.cartItems || {});
        const foodResponse = await axios.get(`${backendGlobalRoute}/api/food/list`);
        setFoodList(foodResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching cart or food data:', error.message);
      }
    };

    fetchCartData();
  }, []);

  const removeFromCart = async (id) => {
    try {
      await axios.post(`${backendGlobalRoute}/api/cart/remove`, { id });
      setCartItems((prev) => {
        const updatedCart = { ...prev };
        delete updatedCart[id];
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, id) => {
      const item = foodList.find((food) => food._id === id);
      return total + (item ? item.price * cartItems[id] : 0);
    }, 0);
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Tiles</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${backendUrl}${item.image}`} alt={item.name} /> {/* Ensure correct image URL */}
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
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
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
