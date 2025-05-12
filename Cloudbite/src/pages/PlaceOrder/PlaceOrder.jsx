import { Store } from 'lucide-react';
import React, { useContext } from 'react';
import { CartContext } from '../../components/cart_components/CartContext'; // Import CartContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PlaceOrder = () => {
  const { cartItems } = useContext(CartContext); // Access cartItems from CartContext
  const navigate = useNavigate(); // Initialize navigate

  const getTotalCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.selling_price * item.quantity,
      0
    );
  };

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
            onClick={() => navigate('/place-order')}
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
