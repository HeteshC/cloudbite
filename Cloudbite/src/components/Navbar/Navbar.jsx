import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for mobile menu
import cartIcon from "../../assets/cart_icon.png"; // Import the cart icon

import { AuthContext } from "../auth_components/AuthManager"; // Import AuthContext

const Navbar = ({ setShowLogin }) => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate(); // React Router navigation hook
  const { isLoggedIn, logout } = useContext(AuthContext); // Access authentication state and logout function

  return (
    <div className="navbar px-4 py-2">
      {/* Wrap the logo with a Link to redirect to the home page */}
      <Link to="/">
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
      <div className="hidden md:flex items-center border rounded-full p-2 px-4 bg-gray-100">
        <input
          type="search"
          className="bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 w-40 md:w-60 lg:w-80"
          placeholder="Search..."
        />
      </div>

      {/* Login / Register (Desktop) */}
      <div className="hidden md:flex space-x-5 items-center">
        {/* Cart Icon */}
        <Link to="/cart" className="flex items-center">
          <img src={cartIcon} alt="Cart" className="w-16 h-16 mr-2" />
        </Link>
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
          <button onClick={logout} className="text-red-950 text-lg hover:text-red-950 font-semibold">
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-cyan-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-5 space-y-4 absolute top-16 right-0 w-full">
          <input type="search" className="w-full p-2 border rounded-md" placeholder="Search..." />
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