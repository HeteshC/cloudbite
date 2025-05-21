import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import globalBackendRoute from "../../config/config";
// Add icons
import {
  FaUserPlus,
  FaShoppingCart,
  FaChartLine,
  FaUtensils,
  FaStore,
  FaPlus,
  FaList,
  FaBoxes,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaRegClock,
  FaCrown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const dataLevel = [
  { name: "", Volume: 6, Service: 3 },
  { name: "", Volume: 7, Service: 4 },
  { name: "", Volume: 9, Service: 5 },
  { name: "", Volume: 5, Service: 2 },
  { name: "", Volume: 6, Service: 3 },
  { name: "", Volume: 5, Service: 2 },
  { name: "", Volume: 8, Service: 4 },
];

const dataCustomer = [
  { name: "", lastMonth: 4000, thisMonth: 5000 },
  { name: "", lastMonth: 3000, thisMonth: 4000 },
  { name: "", lastMonth: 4500, thisMonth: 5600 },
];

const dataVisitor = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 350 },
  { name: "Apr", value: 300 },
  { name: "May", value: 450 },
  { name: "Jun", value: 580 },
  { name: "Jul", value: 400 },
  { name: "Aug", value: 300 },
  { name: "Sep", value: 200 },
  { name: "Oct", value: 220 },
  { name: "Nov", value: 310 },
  { name: "Dec", value: 400 },
];

export default function Dashboard() {
  // Dynamic state for orders and users
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editedOrders, setEditedOrders] = useState({});
  const [kitchens, setKitchens] = useState([]); // Store all kitchens
  const navigate = useNavigate();

  // Fetch orders, users, and kitchens
  useEffect(() => {
    setOrdersLoading(true);
    axios
      .get(`${globalBackendRoute}/api/order/all-orders`)
      .then((res) => {
        setOrders(res.data || []);
        // Calculate top products
        const productMap = {};
        (res.data || []).forEach((order) => {
          (order.foods || []).forEach((f) => {
            const foodId = f.food?._id || f.food;
            const foodName = f.food?.product_name || "Unknown";
            if (!productMap[foodId]) {
              productMap[foodId] = { name: foodName, count: 0 };
            }
            productMap[foodId].count += f.quantity || 1;
          });
        });
        // Sort by count descending and take top 4
        const sorted = Object.values(productMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 4)
          .map((item) => ({
            name: item.name,
            percent: item.count,
          }));
        setTopProducts(sorted);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
    axios
      .get(`${globalBackendRoute}/api/getUserCounts`)
      .then((res) => setUsersCount(res.data?.totalUsers || 0))
      .catch(() => setUsersCount(0));
    // Fetch all kitchens for robust kitchen name mapping
    axios
      .get(`${globalBackendRoute}/api/all-kitchens`)
      .then((res) => setKitchens(res.data || []))
      .catch(() => setKitchens([]));
  }, []);

  // Update order status handler
  const handleOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${globalBackendRoute}/api/order/update-order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      setEditedOrders((prev) => ({ ...prev, [orderId]: true }));
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6 min-h-screen font-sans space-y-6 bg-white text-[#6b3f1d]">
      {/* Fix alignment of header and buttons */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ gap: "2rem" }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 text-[#a97c50] drop-shadow">
            <FaCrown className="text-[#d6ad7b] animate-bounce" /> SuperAdmin Dashboard
          </h1>
          <p className="text-[#6b3f1d] mt-2 text-lg font-medium">
            Welcome back, SuperAdmin! Here’s a quick overview of your platform’s performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0 md:ml-8">
          <motion.button
            className="flex items-center gap-2 bg-[#a97c50] text-white px-4 py-2 rounded shadow hover:bg-[#6b3f1d] transition text-sm font-semibold"
            onClick={() => navigate("/add-kitchen")}
            whileHover={{ scale: 1.07 }}
          >
            <FaStore /> Add Kitchen
          </motion.button>
          <motion.button
            className="flex items-center gap-2 bg-[#a97c50] text-white px-4 py-2 rounded shadow hover:bg-[#6b3f1d] transition text-sm font-semibold"
            onClick={() => navigate("/add-food")}
            whileHover={{ scale: 1.07 }}
          >
            <FaUtensils /> Add Food
          </motion.button>
          <motion.button
            className="flex items-center gap-2 bg-[#a97c50] text-white px-4 py-2 rounded shadow hover:bg-[#6b3f1d] transition text-sm font-semibold"
            onClick={() => navigate("/add-category")}
            whileHover={{ scale: 1.07 }}
          >
            <FaList /> Add Category
          </motion.button>
          <motion.button
            className="flex items-center gap-2 bg-[#a97c50] text-white px-4 py-2 rounded shadow hover:bg-[#6b3f1d] transition text-sm font-semibold"
            onClick={() => navigate("/add-sub-category")}
            whileHover={{ scale: 1.07 }}
          >
            <FaBoxes /> Add Sub Category
          </motion.button>
          <motion.button
            className="flex items-center gap-2 bg-[#e0cfc2] text-[#a97c50] px-4 py-2 rounded border border-[#a97c50] hover:bg-[#f9f6f6] transition text-sm font-semibold"
            onClick={() => navigate("/view-all")}
            whileHover={{ scale: 1.07 }}
          >
            <FaEye /> View All
          </motion.button>
        </div>
      </motion.div>
    

      {/* Today's Sales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-[#e0cfc2] flex flex-col items-center"
          whileHover={{ scale: 1.03 }}
        >
          <FaChartLine className="text-3xl text-[#a97c50] mb-2 animate-pulse" />
          <p className="text-[#a97c50] text-sm font-semibold">Total Sales</p>
          <h2 className="text-2xl font-bold text-[#6b3f1d]">
            ₹{orders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              .toLocaleString()}
          </h2>
          <p className="text-xs text-green-700 mt-1">+15% from yesterday</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-[#e0cfc2] flex flex-col items-center"
          whileHover={{ scale: 1.03 }}
        >
          <FaShoppingCart className="text-3xl text-[#a97c50] mb-2 animate-bounce" />
          <p className="text-[#a97c50] text-sm font-semibold">Total Orders</p>
          <h2 className="text-2xl font-bold text-[#6b3f1d]">{orders.length}</h2>
          <p className="text-xs text-green-700 mt-1">+12% from yesterday</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-[#e0cfc2] flex flex-col items-center group"
          whileHover={{ scale: 1.03, rotate: 2 }}
        >
          <FaUtensils className="text-3xl text-[#a97c50] mb-2 group-hover:scale-125 transition-transform duration-300" />
          <p className="text-[#a97c50] text-sm font-semibold">Product Sold</p>
          <h2 className="text-2xl font-bold text-[#6b3f1d] group-hover:text-[#a97c50] transition-colors duration-300">
            {orders.reduce(
              (sum, o) =>
                sum +
                (Array.isArray(o.foods)
                  ? o.foods.reduce((s, f) => s + (f.quantity || 0), 0)
                  : 0),
              0
            )}
          </h2>
          <p className="text-xs text-red-700 mt-1">-2% from yesterday</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-[#e0cfc2] flex flex-col items-center"
          whileHover={{ scale: 1.03 }}
        >
          <FaUserPlus className="text-3xl text-[#a97c50] mb-2 animate-bounce" />
          <p className="text-[#a97c50] text-sm font-semibold">New Customers</p>
          <h2 className="text-2xl font-bold text-[#6b3f1d]">{usersCount}</h2>
          <p className="text-xs text-green-700 mt-1">+18% from yesterday</p>
        </motion.div>
      </motion.div>

      

      {/* Mid Section */}
      <div className="grid grid-cols-4 gap-4">
        {/* Top Products */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 col-span-1 border border-[#e0cfc2]"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="font-semibold mb-4 text-[#a97c50] flex items-center gap-2">
            <FaCrown className="text-[#d6ad7b]" /> Top Products
          </h3>
          {topProducts.length > 0 ? (
            topProducts.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b3f1d]">{item.name}</span>
                  <span className="text-[#a97c50]">{item.percent}</span>
                </div>
                <div className="w-full h-2 bg-[#e0cfc2] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#a97c50] to-[#f9f6f6]"
                    style={{ width: `${Math.min(item.percent * 10, 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.percent * 10, 100)}%` }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                  ></motion.div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#a97c50]">No data</div>
          )}
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 col-span-1 border border-[#e0cfc2]"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="font-semibold mb-4 text-[#a97c50] flex items-center gap-2">
            <FaChartLine /> Order Status
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={[
                {
                  name: "Orders",
                  Pending: orders.filter((o) => o.status === "pending").length,
                  Confirmed: orders.filter((o) => o.status === "confirmed").length,
                  Preparing: orders.filter((o) => o.status === "preparing").length,
                  Delivered: orders.filter((o) => o.status === "delivered").length,
                  Cancelled: orders.filter((o) => o.status === "cancelled").length,
                },
              ]}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip />
              <Bar dataKey="Pending" stackId="a" fill="#e0cfc2" />
              <Bar dataKey="Confirmed" stackId="a" fill="#a97c50" />
              <Bar dataKey="Preparing" stackId="a" fill="#d6ad7b" />
              <Bar dataKey="Delivered" stackId="a" fill="#6b3f1d" />
              <Bar dataKey="Cancelled" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <span className="inline-flex items-center gap-1">
              <FaRegClock className="text-[#e0cfc2]" /> Pending
            </span>
            <span className="inline-flex items-center gap-1">
              <FaCheckCircle className="text-[#a97c50]" /> Confirmed
            </span>
            <span className="inline-flex items-center gap-1">
              <FaTruck className="text-[#d6ad7b]" /> Preparing
            </span>
            <span className="inline-flex items-center gap-1">
              <FaCheckCircle className="text-[#6b3f1d]" /> Delivered
            </span>
            <span className="inline-flex items-center gap-1">
              <FaTimesCircle className="text-[#f87171]" /> Cancelled
            </span>
          </div>
        </motion.div>

        {/* Customer Fulfilment */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 col-span-2 border border-[#e0cfc2]"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="font-semibold mb-2 text-[#a97c50] flex items-center gap-2">
            <FaShoppingCart /> Customer Fulfilment
          </h3>
          {ordersLoading ? (
            <div className="text-center text-[#a97c50] py-8">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto">
                <thead className="text-left text-[#a97c50] text-xs border-b">
                  <tr>
                    <th className="py-2">Order ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.tr
                        key={order._id}
                        className="border-b hover:bg-[#f9f6f6] transition"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="py-2">{order._id.slice(-6).toUpperCase()}</td>
                        <td>
                          {order.user?.name || "N/A"}
                          <br />
                          <span className="text-xs text-gray-500">
                            {order.user?.email || ""}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status || "N/A"}
                          </span>
                        </td>
                        <td>₹{order.totalAmount || "N/A"}</td>
                        <td>
                          {editedOrders[order._id] ||
                          ["delivered", "cancelled", "rejected"].includes(order.status) ? (
                            <span className="text-xs text-gray-500">Status set</span>
                          ) : (
                            <select
                              className="border border-[#e0cfc2] rounded px-2 py-1 text-xs"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleOrderStatus(order._id, e.target.value);
                                }
                              }}
                            >
                              <option value="" disabled>
                                Change Status
                              </option>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Expenses */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 col-span-1 border border-[#e0cfc2] flex flex-col items-center group"
          whileHover={{ scale: 1.02, rotate: -2 }}
        >
          <FaChartLine className="text-3xl text-[#a97c50] mb-2 group-hover:scale-125 transition-transform duration-300" />
          <p className="text-sm text-[#a97c50] font-semibold">Total Expenses</p>
          <h2 className="text-2xl font-bold text-[#6b3f1d] group-hover:text-[#a97c50] transition-colors duration-300">
            ₹
            {orders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.totalAmount || 0) * 0.7, 0)
              .toLocaleString()}
          </h2>
          <p className="text-xs text-green-700">
            Estimated at 70% of total sales (cost of goods, logistics, etc.)
          </p>
          <div className="w-full h-20 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[6px] border-[#e0cfc2]"></div>
              <div className="absolute inset-0 rounded-full border-[6px] border-[#a97c50] border-t-transparent group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#a97c50]">
                {orders.length > 0
                  ? `${Math.round(
                      (orders
                        .filter((o) => o.status !== "cancelled")
                        .reduce((sum, o) => sum + (o.totalAmount || 0) * 0.7, 0) /
                        orders
                          .filter((o) => o.status !== "cancelled")
                          .reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 1) *
                        100
                    )}%`
                  : "0%"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kitchen Insights */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 col-span-3 border border-[#e0cfc2]"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="font-semibold mb-2 text-[#a97c50] flex items-center gap-2">
            <FaStore /> Kitchen Insights
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={
                (() => {
                  // Robust: Aggregate food sold per kitchen by matching kitchen id to name from kitchens list
                  const kitchenMap = {};
                  orders.forEach((order) => {
                    if (order.status === "cancelled") return;
                    (order.foods || []).forEach((f) => {
                      let kitchenId = null;
                      // Try to extract kitchen id from food
                      if (f.food && f.food.kitchen) {
                        if (typeof f.food.kitchen === "object" && f.food.kitchen._id) {
                          kitchenId = f.food.kitchen._id;
                        } else if (typeof f.food.kitchen === "string") {
                          kitchenId = f.food.kitchen;
                        }
                      }
                      // Find kitchen name from kitchens list
                      let kitchenName = "Unknown";
                      if (kitchenId && kitchens.length > 0) {
                        const kitchenObj = kitchens.find((k) => k._id === kitchenId);
                        if (kitchenObj && kitchenObj.name) {
                          kitchenName = kitchenObj.name;
                        }
                      }
                      if (!kitchenMap[kitchenName]) kitchenMap[kitchenName] = 0;
                      kitchenMap[kitchenName] += f.quantity || 0;
                    });
                  });
                  return Object.entries(kitchenMap).map(([kitchen, sold]) => ({
                    kitchen,
                    sold,
                  }));
                })()
              }
              margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            >
              <XAxis dataKey="kitchen" stroke="#a97c50" fontSize={12} angle={-20} dy={20} />
              <YAxis stroke="#a97c50" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sold" fill="#a97c50" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-right text-[#a97c50] mt-2">
            {orders.length > 0
              ? "Showing total food sold per kitchen (excluding cancelled orders)"
              : "No data"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
