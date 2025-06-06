import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for mobile menu
import cartIcon from "../../assets/cart_icon.png"; // Import the cart icon
import { AuthContext } from "../auth_components/AuthManager"; // Import AuthContext
import { CartContext } from "../cart_components/CartContext"; // Import CartContext
import axios from "axios";
import globalBackendRoute from "../../config/config";

const Navbar = ({ setShowLogin }) => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate(); // React Router navigation hook
  const { isLoggedIn, logout, user } = useContext(AuthContext); // Access authentication state, logout, and user
  const { cartItems } = useContext(CartContext);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch initial foods for dropdown
  useEffect(() => {
    const fetchInitialFoods = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-foods`);
        setSearchResults(res.data.slice(0, 5));
      } catch {
        setSearchResults([]);
      }
    };
    fetchInitialFoods();
  }, []);

  // Search foods by name or kitchen
  useEffect(() => {
    if (!search) {
      setShowDropdown(false);
      return;
    }
    const fetchSearch = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-foods`);
        const foods = res.data || [];
        const filtered = foods.filter(
          (food) =>
            (food.product_name &&
              food.product_name.toLowerCase().includes(search.toLowerCase())) ||
            (food.kitchen &&
              ((typeof food.kitchen === "object" && food.kitchen.name && food.kitchen.name.toLowerCase().includes(search.toLowerCase())) ||
                (typeof food.kitchen === "string" && food.kitchen.toLowerCase().includes(search.toLowerCase())))
            )
        );
        setSearchResults(filtered.slice(0, 8));
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };
    fetchSearch();
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowDropdown(!!e.target.value);
  };

  const handleResultClick = (food) => {
    setShowDropdown(false);
    setSearch("");
    navigate(`/food/${food.slug || food._id}`);
  };

  return (
    <div className="navbar px-4 py-2 relative">
      {/* Wrap the logo with a Link to redirect to the home page */}
      <Link to="/home">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <Link to="/menu" className="text-red-950 hover:text-red-950 font-semibold">
        Menu
      </Link>
      <Link to="/contact-us" className="text-red-950 hover:text-red-950 font-semibold">
        Contact Us
      </Link>
      <Link to="/about-us" className="text-red-950 hover:text-red-950 font-semibold">
        About Us
      </Link>

      {/* Search Field (Always Visible) */}
      <div className="hidden md:flex items-center border rounded-full p-2 px-4 bg-gray-100 relative">
        <input
          type="search"
          className="bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 w-40 md:w-60 lg:w-80"
          placeholder="Search food or kitchen..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && (
          <div className="absolute left-0 top-12 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm">No results found.</div>
            ) : (
              searchResults.map((food) => (
                <div
                  key={food._id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#f9f6f6] cursor-pointer"
                  onClick={() => handleResultClick(food)}
                >
                  <img
                    src={
                      food.product_image
                        ? `${globalBackendRoute}/${food.product_image}`
                        : "https://via.placeholder.com/40"
                    }
                    alt={food.product_name}
                    className="w-8 h-8 rounded object-cover border border-[#e0cfc2]"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-[#6b3f1d]">{food.product_name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {food.kitchen && typeof food.kitchen === "object" && food.kitchen.name
                        ? food.kitchen.name
                        : typeof food.kitchen === "string"
                        ? food.kitchen
                        : ""}
                    </span>
                  </div>
                  <span className="text-xs text-[#a97c50] font-semibold">₹{food.selling_price}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Login / Register (Desktop) */}
      <div className="hidden md:flex space-x-5 items-center relative">
        {/* Cart Icon */}
        <div
          className="flex items-center relative"
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer" }}
        >
          <img src={cartIcon} alt="Cart" className="w-16 h-16 mr-2" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-red-950 text-lg hover:text-red-950 font-semibold">
              Login
            </Link>
            <Link to="/register" className="text-red-950 text-lg hover:text-red-950 font-semibold">
              Register
            </Link>
          </>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <span
              className="text-[#6b3f1d] text-lg font-semibold px-4 py-2 rounded cursor-pointer  border-[#a97c50] transition"
              style={{ minWidth: 100, display: "inline-block" }}
            >
              {user?.name || "User"}
            </span>
            {showUserMenu && (
              <div
                className="absolute right-0 w-40  border-[#a97c50] rounded-lg  z-50"
                style={{ minWidth: 150 }}
              >
                <button
                  className="block w-full mb-2 text-left px-4 py-2 text-[#6b3f1d] hover:bg-[#f9f6f6] font-medium"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-[#a97c50] hover:bg-[#f9f6f6] font-medium border-t border-[#e0cfc2]"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-cyan-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-5 space-y-4 absolute top-16 right-0 w-full">
          <div className="relative">
            <input
              type="search"
              className="w-full p-2 border rounded-md"
              placeholder="Search food or kitchen..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {showDropdown && (
              <div className="absolute left-0 top-12 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-gray-500 text-sm">No results found.</div>
                ) : (
                  searchResults.map((food) => (
                    <div
                      key={food._id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#f9f6f6] cursor-pointer"
                      onClick={() => handleResultClick(food)}
                    >
                      <img
                        src={
                          food.product_image
                            ? `${globalBackendRoute}/${food.product_image}`
                            : "https://via.placeholder.com/40"
                        }
                        alt={food.product_name}
                        className="w-8 h-8 rounded object-cover border border-[#e0cfc2]"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-[#6b3f1d]">{food.product_name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {food.kitchen && typeof food.kitchen === "object" && food.kitchen.name
                            ? food.kitchen.name
                            : typeof food.kitchen === "string"
                            ? food.kitchen
                            : ""}
                        </span>
                      </div>
                      <span className="text-xs text-[#a97c50] font-semibold">₹{food.selling_price}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <nav className="flex flex-col space-y-4">
            <Link to="/cloud-kitchens" className="text-red-950 hover:text-red-950 font-semibold">
              Cloud Kitchens
            </Link>
            <Link to="/menu" className="text-red-950 hover:text-red-950 font-semibold">
              Menu
            </Link>
            <Link to="/contact-us" className="text-red-950 hover:text-red-950 font-semibold">
              Contact
            </Link>
            <Link to="/about-us" className="text-red-950 hover:text-red-950 font-semibold">
              About
            </Link>
            <Link to="/cart" className="flex items-center">
              <img src={cartIcon} alt="Cart" className="w-6 h-6 mr-2" />
              Cart
            </Link>
          </nav>

          <div className="border-t pt-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-cyan-700 hover:text-cyan-900 font-semibold block">
                  Login
                </Link>
                <Link to="/register" className="text-cyan-700 hover:text-cyan-900 font-semibold block">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={logout} className="text-cyan-700 hover:text-cyan-900 font-semibold block">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;