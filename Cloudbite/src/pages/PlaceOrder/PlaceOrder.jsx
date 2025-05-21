import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { CartContext } from "../../components/cart_components/CartContext";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaCreditCard, FaGift, FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext); // Import clearCart from context
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pinCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${globalBackendRoute}/api/get-cart-items`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data.items || []);
      } catch (err) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const getSubtotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.selling_price || 0) * (item.quantity || 0),
      0
    );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Prepare foods array for backend
      const foods = cartItems.map((item) => ({
        food: item._id,
        food_image: item.product_image,
        quantity: item.quantity,
      }));

      // Prepare address object for backend
      const addressObj = {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.pinCode,
        country: address.country,
        phone: address.phone,
      };

      // Prepare card details
      const cardDetails = {
        cardName: payment.cardName || address.name,
        cardNumber: payment.cardNumber,
        cardExpiry: payment.cardExpiry,
        cardCVV: payment.cardCVV,
      };

      const totalAmount = getSubtotal() + 30;

      await axios.post(
        `${globalBackendRoute}/api/order/add`,
        {
          user: user?._id || user?.id,
          email: address.email,
          foods,
          address: addressObj,
          paymentMethod: "card",
          paymentStatus: "paid",
          cardDetails,
          totalAmount, // Send totalAmount to backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear cart after successful purchase
      await clearCart();

      navigate("/thank-you");
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f9f6f6]">
        <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b3f1d]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6f6] p-8 md:p-16 flex flex-col md:flex-row gap-12 font-sans transition-all duration-500">
      {/* Left: Shipping + Payment Form */}
      <motion.div
        className="flex-1 bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-[#6b3f1d] flex items-center gap-2">
          <FaBoxOpen className="text-[#a97c50]" /> Checkout
        </h2>

        {/* Shipping Details */}
        <div className="mb-10">
          <h4 className="text-base font-semibold mb-4 text-[#a97c50] flex items-center gap-2">
            <FaMapMarkerAlt /> SHIPPING DETAILS
          </h4>
          <form className="space-y-4 text-base text-gray-800" onSubmit={handleOrderSubmit}>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-[#a97c50]" />
              <input
                className="w-full border border-[#e0cfc2] px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="name"
                placeholder="Name"
                value={address.name}
                readOnly
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-[#a97c50]" />
              <input
                className="w-full border border-[#e0cfc2] px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="email"
                name="email"
                placeholder="Email"
                value={address.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <FaPhoneAlt className="absolute left-3 top-3 text-[#a97c50]" />
              <input
                className="w-full border border-[#e0cfc2] px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-[#a97c50]" />
              <input
                className="w-full border border-[#e0cfc2] px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="street"
                placeholder="Address"
                value={address.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                className="w-1/2 border border-[#e0cfc2] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required
              />
              <input
                className="w-1/2 border border-[#e0cfc2] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                className="w-1/2 border border-[#e0cfc2] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                value={address.pinCode}
                onChange={handleChange}
                required
              />
              <input
                className="w-1/2 border border-[#e0cfc2] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a97c50] bg-[#f9f6f6] transition"
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
                required
              />
            </div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h4 className="text-base font-semibold mb-4 text-[#a97c50] flex items-center gap-2">
                <FaCreditCard /> PAYMENT DETAILS
              </h4>
              <div>
                <label className="text-xs block mb-1 text-[#6b3f1d]">NAME ON CARD</label>
                <input
                  type="text"
                  name="cardName"
                  value={payment.cardName}
                  onChange={handlePaymentChange}
                  placeholder="Name on Card"
                  className="w-full border border-[#e0cfc2] px-4 py-3 rounded-lg text-sm bg-[#f9f6f6] focus:outline-none focus:ring-2 focus:ring-[#a97c50] transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs block mb-1 text-[#6b3f1d]">CARD NUMBER</label>
                <div className="flex items-center border border-[#e0cfc2] px-4 py-3 rounded-lg bg-[#f9f6f6]">
                  <input
                    type="number"
                    name="cardNumber"
                    value={payment.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="Card Number"
                    maxLength={16} // Limit to 19 characters (16 digits + 3 spaces)
                    pattern="[0-9 ]*"
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="w-8 ml-2"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs block mb-1 text-[#6b3f1d]">VALID MONTH</label>
                    <input
                      type="text"
                      name="cardExpiryMonth"
                      value={payment.cardExpiryMonth || ""}
                      onChange={(e) =>
                        setPayment((prev) => ({
                          ...prev,
                          cardExpiryMonth: e.target.value.replace(/[^0-9]/g, "").slice(0, 2),
                        }))
                      }
                      placeholder="MM"
                      maxLength={2}
                      className="w-full border border-[#e0cfc2] px-4 py-3 rounded-lg text-sm bg-[#f9f6f6] focus:outline-none focus:ring-2 focus:ring-[#a97c50] transition"
                      required
                    />
                  </div>
                  <span className="flex items-center text-[#a97c50] font-bold text-lg mt-6">/</span>
                  <div className="flex-1">
                    <label className="text-xs block mb-1 text-[#6b3f1d]">VALID YEAR</label>
                    <input
                      type="text"
                      name="cardExpiryYear"
                      value={payment.cardExpiryYear || ""}
                      onChange={(e) =>
                        setPayment((prev) => ({
                          ...prev,
                          cardExpiryYear: e.target.value.replace(/[^0-9]/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="YY"
                      maxLength={4}
                      className="w-full border border-[#e0cfc2] px-4 py-3 rounded-lg text-sm bg-[#f9f6f6] focus:outline-none focus:ring-2 focus:ring-[#a97c50] transition"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs block mb-1 text-[#6b3f1d]">CVC CODE</label>
                  <input
                    type="text"
                    name="cardCVV"
                    value={payment.cardCVV}
                    onChange={handlePaymentChange}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full border border-[#e0cfc2] px-4 py-3 rounded-lg text-sm bg-[#f9f6f6] focus:outline-none focus:ring-2 focus:ring-[#a97c50] transition"
                    required
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                className={`w-full mt-4 bg-[#6b3f1d] text-white text-base py-3 rounded-lg hover:bg-[#a97c50] transition-all duration-200 flex items-center justify-center gap-2 shadow ${
                  submitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
              >
                <FaCreditCard className="mr-2" />
                {submitting ? "Processing..." : `PURCHASE ₹${getSubtotal() + 30}`}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Right: Order Summary */}
      <motion.div
        className="w-full md:w-[500px] bg-white rounded-2xl shadow-lg p-8 flex flex-col"
        style={{
          minHeight: "fit-content",
          maxHeight: "none",
          height: "auto",
          alignSelf: "flex-start",
        }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="text-base font-semibold mb-4 text-[#a97c50] uppercase flex items-center gap-2">
          <FaBoxOpen /> YOUR ORDER
        </h4>
        {/* Order Items */}
        <div className="space-y-6 mb-6 flex-shrink-0">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            cartItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 bg-[#f9f6f6] rounded-lg p-3 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <img
                  src={
                    item.product_image
                      ? `${globalBackendRoute}/${item.product_image}`
                      : "https://via.placeholder.com/40x60"
                  }
                  alt={item.product_name}
                  className="w-24 h-16 rounded object-cover border border-[#e0cfc2]"
                />
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-[#6b3f1d]">{item.product_name}</h5>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <div className="text-sm text-[#a97c50] flex flex-col items-end">
                  <span className="font-bold">{item.quantity}x</span>
                  <span>₹{item.selling_price}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {/* Order Totals */}
        <div className="space-y-2 text-base text-[#6b3f1d] border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{getSubtotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹30</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{getSubtotal() + 30}</span>
          </div>
        </div>
        {/* Gift Code */}
        <motion.button
          className="w-full mt-6 border border-[#a97c50] py-2 rounded-lg text-base text-[#6b3f1d] hover:bg-[#f9f6f6] flex items-center justify-center gap-2 transition"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
        >
          <FaGift className="mr-2" />
          ADD GIFT CODE
        </motion.button>
      </motion.div>
    </div>
  );
}
