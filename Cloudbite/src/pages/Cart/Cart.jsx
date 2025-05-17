import React, { useContext } from "react";
import "../../styles/Cart.css";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/config";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartLoading } =
    useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext); // Get login status

  const getImageUrl = (img) => {
    if (img) {
      const normalized = img.replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/food_images/${normalized}`;
    }
    return "https://via.placeholder.com/150";
  };

  const getTotalCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.selling_price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Please login first to proceed to checkout.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    navigate("/place-order");
  };

  return (
    <div className="cart px-10"> {/* Added padding on both sides */}
      <div className="cart-items">
        <div className="cart-items-title ">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {cartLoading ? (
          <p>Loading...</p>
        ) : cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img
                  src={getImageUrl(item.product_image)}
                  alt={item.product_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <p>{item.product_name}</p>
                <p>₹{item.selling_price}</p>
                <p>{item.quantity}</p>
                <p>₹{item.selling_price * item.quantity}</p>
                <button onClick={() => removeFromCart(item._id)}>
                  <FaTrash />
                </button>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No items in the cart.</p>
        )}
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
          <button onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;