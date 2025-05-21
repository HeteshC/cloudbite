import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/auth_components/AuthManager";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingCart,
  FaFilePdf,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { CartContext } from "../../components/cart_components/CartContext";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function ProfileDashboard() {
  const { user, login } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: null,
  });
  const [preview, setPreview] = useState(
    user?.avatar
      ? (user.avatar.startsWith("http") || user.avatar.startsWith("/") // handle absolute URLs and backend URLs
          ? (user.avatar.startsWith("/")
              ? `${globalBackendRoute}${user.avatar}`
              : user.avatar)
          : `${globalBackendRoute}/${user.avatar}`)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [food, setFood] = useState([]); // Used for best-selling foods, not for cart navigation
  const navigate = useNavigate();

  // Get current time and greeting
  const now = new Date();
  const hours = now.getHours();
  let greeting = "Hello";
  if (hours < 12) greeting = "Good morning";
  else if (hours < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  const formattedTime = now.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleEditClick = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: null,
    });
    setPreview(
      user?.avatar
        ? (user.avatar.startsWith("http") || user.avatar.startsWith("/")
            ? (user.avatar.startsWith("/")
                ? `${globalBackendRoute}${user.avatar}`
                : user.avatar)
            : `${globalBackendRoute}/${user.avatar}`)
        : ""
    );
    setEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setEditData((prev) => ({ ...prev, avatar: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setPreview(
      user?.avatar
        ? (user.avatar.startsWith("http") || user.avatar.startsWith("/")
            ? (user.avatar.startsWith("/")
                ? `${globalBackendRoute}${user.avatar}`
                : user.avatar)
            : `${globalBackendRoute}/${user.avatar}`)
        : ""
    );
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("phone", editData.phone);
      if (editData.avatar) {
        formData.append("avatar", editData.avatar);
      }
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${globalBackendRoute}/api/update-profile/${user.id || user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update user in AuthContext
      login(token);
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        // Only fetch if user._id or user.id exists
        if (!user?._id && !user?.id) {
          setOrders([]);
          setOrdersLoading(false);
          return;
        }
        const res = await axios.get(
          `${globalBackendRoute}/api/orders/user/${user?._id || user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // If backend returns 404, treat as no orders
        if (res.status === 404 || !Array.isArray(res.data)) {
          setOrders([]);
        } else {
          setOrders(res.data || []);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (user?._id || user?.id) fetchOrders();
    else setOrdersLoading(false);
  }, [user]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-foods`);
        const foods = response.data || [];
        const sortedFoods = foods
          .filter((food) => food.availability_status)
          .slice(0, 8);
        setFood(sortedFoods);
      } catch (error) {
        console.error("Error fetching best-selling foods:", error.message);
      }
    };

    fetchFood();
  }, []);

  const handleNavigateToSingleFood = (slugOrId) => {
    navigate(`/food/${slugOrId}`);
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${globalBackendRoute}/api/order/${orderId}/receipt`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Assume res.data contains the receipt data (JSON or HTML/text)
      // For demonstration, let's use a simple text-based PDF
      const doc = new jsPDF();
      if (res.data && typeof res.data === "object") {
        // If backend returns JSON with order details
        doc.text(`Order Receipt`, 10, 10);
        doc.text(`Order ID: ${orderId}`, 10, 20);
        doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);
        doc.text(`---------------------------`, 10, 40);
        let y = 50;
        if (Array.isArray(res.data.foods)) {
          res.data.foods.forEach((item, idx) => {
            doc.text(
              `${idx + 1}. ${item.food?.product_name || item.product_name || "Item"} x${item.quantity}`,
              10,
              y
            );
            y += 10;
          });
        }
        doc.text(`---------------------------`, 10, y);
        y += 10;
        doc.text(`Total: ₹${res.data.totalAmount || "N/A"}`, 10, y);
        y += 10;
        doc.text(`Payment: ${res.data.paymentMethod || "N/A"}`, 10, y);
      } else {
        // If backend returns plain text or HTML
        doc.text(String(res.data), 10, 10);
      }
      doc.save(`order_${orderId}_receipt.pdf`);
    } catch (err) {
      alert("Failed to download receipt.");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 text-gray-800 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {greeting}
            {user?.name ? `, ${user.name}` : ""}!
          </h1>
        </div>
        <div className="text-sm text-gray-600">{formattedTime}</div>
      </div>

      {/* Top Grid */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Profile Card */}
        <motion.div
          className="col-span-2 bg-white rounded-xl p-0 shadow relative overflow-visible flex flex-col md:flex-row"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Division 1: Profile Picture */}
          <div className="flex items-center justify-center bg-[#f9f6f6] rounded-t-xl md:rounded-l-xl md:rounded-tr-none w-full md:w-1/3 min-h-[180px] relative">
            {preview ? (
              <img
                src={preview}
                alt="User"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#a97c50] shadow object-cover"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 md:w-32 md:h-32 text-[#a97c50] bg-[#f9f6f6] rounded-full border-4 border-[#a97c50] shadow" />
            )}
            <AnimatePresence>
              {!editing && hovered && (
                <motion.button
                  className="absolute top-4 right-4 bg-[#a97c50] text-white px-3 py-1 rounded shadow flex items-center gap-2 hover:bg-[#6b3f1d] transition"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleEditClick}
                  style={{ zIndex: 10 }}
                >
                  <FaEdit /> Edit
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {/* Division 2: User Details */}
          <div className="flex-1 flex flex-col justify-center px-6 py-4">
            {!editing ? (
              <>
                <h2 className="text-xl font-bold flex items-center gap-2 text-[#6b3f1d] mb-1">
                  <FaUserCircle className="text-[#a97c50]" />{" "}
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-gray-500 capitalize mb-1">
                  {user?.role ? user.role.replace(/_/g, " ") : "User"}
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <FaEnvelope className="text-[#a97c50]" />
                  <span>
                    Email:{" "}
                    <a
                      href={`mailto:${user?.email || ""}`}
                      className="text-blue-600"
                    >
                      {user?.email || "Not Provided"}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <FaPhone className="text-[#a97c50]" />
                  <span>Phone: {user?.phone || "Not Provided"}</span>
                </div>
              </>
            ) : (
              <form
                className="space-y-3"
                onSubmit={handleEditSave}
                encType="multipart/form-data"
              >
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full border border-[#e0cfc2] px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full border border-[#e0cfc2] px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="w-full border border-[#e0cfc2] px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleEditChange}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                  >
                    <FaSave /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow flex flex-col col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-[#a97c50]">
              <FaShoppingCart className="text-[#a97c50]" /> Upcoming Food Events
            </h3>
            <button className="text-xs text-orange-500 font-medium hover:underline">
              View All
            </button>
          </div>
          <div
            className="flex flex-col gap-4 max-h-56 overflow-x-hidden overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              {
                title: "Pizza Night",
                time: "Today, 7:00 PM",
                desc: "Enjoy 2-for-1 pizzas and free delivery on all orders above ₹499!",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80",
                btn: "Order Now",
                bg: "from-[#ffe5b4] to-[#fff]",
              },
              {
                title: "Dessert Festival",
                time: "Tomorrow, 5:00 PM",
                desc: "Flat 30% off on all cakes, pastries, and sweets. Limited time only!",
                img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80",
                btn: "Grab Deal",
                bg: "from-[#ffe5e5] to-[#fff]",
              },
              {
                title: "Healthy Bites Week",
                time: "Fri, 12:00 PM",
                desc: "Order any salad or bowl and get a free smoothie! Stay fit, eat fresh.",
                img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=80&h=80",
                btn: "Explore",
                bg: "from-[#e5ffe5] to-[#fff]",
              }
            ]
              .slice(0, 2)
              .map((event, idx) => (
                <motion.div
                  key={idx}
                  className={`flex items-center gap-4 bg-gradient-to-r ${event.bg} rounded-lg p-3 shadow group hover:scale-[1.02] transition-transform`}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#a97c50] shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#6b3f1d] truncate">{event.title}</span>
                      <span className="text-xs text-[#a97c50] font-semibold ml-2 whitespace-nowrap">{event.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{event.desc}</p>
                  </div>
                  <button className="bg-[#a97c50] text-white px-3 py-1 rounded text-xs hover:bg-[#6b3f1d] transition whitespace-nowrap">
                    {event.btn}
                  </button>
                </motion.div>
              ))}
          </div>
        </motion.div>
        {/* Calendar (Cart Items List) */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow flex flex-col col-span-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-[#a97c50]">
            <FaShoppingCart className="text-[#a97c50]" /> Your Cart Items
          </h3>
          <div
            className="flex flex-col gap-3 mt-2 max-h-44 overflow-x-hidden overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <motion.div
                  key={item._id}
                  className="flex items-center gap-3 bg-[#f9f6f6] rounded-lg p-2 shadow-sm hover:scale-[1.03] transition-transform cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() =>
                    handleNavigateToSingleFood(
                      item.slug ? item.slug : item._id
                    )
                  }
                >
                  <img
                    src={
                      item.product_image
                        ? (item.product_image.startsWith("http") || item.product_image.startsWith("/")
                            ? (item.product_image.startsWith("/")
                                ? `${globalBackendRoute}${item.product_image}`
                                : item.product_image)
                            : `${globalBackendRoute}/${item.product_image}`)
                        : "https://via.placeholder.com/40x40"
                    }
                    alt={item.product_name}
                    className="w-10 h-10 rounded object-cover border border-[#e0cfc2]"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-[#6b3f1d]">
                      {item.product_name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    x{item.quantity}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                <FaShoppingCart className="w-8 h-8 mb-2" />
                <span>No items in your cart.</span>
              </div>
            )}
          </div>
        </motion.div>
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-4 shadow col-span-1 flex flex-col space-y-4">
          <h3 className="font-semibold text-lg text-[#a97c50] flex items-center gap-2 mb-2">
            <FaUserCircle className="text-[#a97c50]" /> Account Overview
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#a97c50]" />
              <span className="text-sm text-gray-700 break-all">
                {user?.email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-[#a97c50]" />
              <span className="text-sm text-gray-700">
                {user?.phone || "No phone"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-4 h-4 rounded-full bg-green-400 mr-1"></span>
              <span className="text-sm text-gray-700">
                Status: <span className="font-semibold text-green-700">Active</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#a97c50] font-bold">Role:</span>
              <span className="capitalize text-sm text-gray-700">
                {user?.role ? user.role.replace(/_/g, " ") : "User"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Address</span>
              <span className="text-sm text-gray-700">
                {user?.address && (user.address.street || user.address.city || user.address.state)
                  ? [
                      user.address.street,
                      user.address.city,
                      user.address.state,
                      user.address.postalCode,
                      user.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "No address provided"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button className="bg-[#a97c50] text-white px-4 py-2 rounded hover:bg-[#6b3f1d] transition text-sm">
              View Orders
            </button>
            <button className="bg-[#f9f6f6] text-[#a97c50] border border-[#a97c50] px-4 py-2 rounded hover:bg-[#e0cfc2] transition text-sm">
              Manage Addresses
            </button>
          </div>
        </div>

        {/* Orders Section (replaces Onboarding Table) */}
        <div className="col-span-4 bg-white rounded-xl p-4 shadow overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm">Your Orders</h3>
          </div>
          {ordersLoading ? (
            <div className="text-center py-8 text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No orders found.</div>
          ) : (
            <table className="w-full text-sm table-auto">
              <thead className="text-left text-gray-500 text-xs border-b">
                <tr>
                  <th className="py-2">Order ID</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-[#f9f6f6] transition">
                    <td className="py-2">{order._id.slice(-6).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="capitalize">{order.paymentMethod || "N/A"}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status || "N/A"}
                      </span>
                    </td>
                    <td>₹{order.totalAmount || "N/A"}</td>
                    <td>
                      <button
                        className="flex items-center gap-1 text-red-600 hover:underline"
                        onClick={() => handleDownloadReceipt(order._id)}
                        title="Download PDF Receipt"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Add this component inside the same file (below ProfileDashboard)
function EventCarousel() {
  const events = [
    {
      title: "Pizza Night",
      time: "Today, 7:00 PM",
      desc: "Enjoy 2-for-1 pizzas and free delivery on all orders above ₹499!",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80",
      btn: "Order Now",
      bg: "from-[#ffe5b4] to-[#fff]",
    },
    {
      title: "Dessert Festival",
      time: "Tomorrow, 5:00 PM",
      desc: "Flat 30% off on all cakes, pastries, and sweets. Limited time only!",
      img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80",
      btn: "Grab Deal",
      bg: "from-[#ffe5e5] to-[#fff]",
    },
    {
      title: "Healthy Bites Week",
      time: "Fri, 12:00 PM",
      desc: "Order any salad or bowl and get a free smoothie! Stay fit, eat fresh.",
      img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=80&h=80",
      btn: "Explore",
      bg: "from-[#e5ffe5] to-[#fff]",
    },
  ];

  const [current, setCurrent] = useState(0);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === events.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        key={current}
        className={`flex items-center gap-4 bg-gradient-to-r ${events[current].bg} rounded-lg p-3 shadow w-full`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={events[current].img}
          alt={events[current].title}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#a97c50] shadow"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#6b3f1d] truncate">{events[current].title}</span>
            <span className="text-xs text-[#a97c50] font-semibold ml-2 whitespace-nowrap">{events[current].time}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 truncate">{events[current].desc}</p>
        </div>
        <button className="bg-[#a97c50] text-white px-3 py-1 rounded text-xs hover:bg-[#6b3f1d] transition whitespace-nowrap">
          {events[current].btn}
        </button>
      </motion.div>
      <div className="flex justify-center items-center gap-3 mt-3">
        <button
          onClick={handlePrev}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f9f6f6] border border-[#e0cfc2] text-[#a97c50] hover:bg-[#f3e7d9] transition"
          aria-label="Previous"
        >
          &#8592;
        </button>
        {events.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full mx-1 ${current === idx ? "bg-[#a97c50]" : "bg-[#e0cfc2]"}`}
          />
        ))}
        <button
          onClick={handleNext}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f9f6f6] border border-[#e0cfc2] text-[#a97c50] hover:bg-[#f3e7d9] transition"
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
