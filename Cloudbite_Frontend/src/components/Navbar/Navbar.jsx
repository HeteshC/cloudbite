import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for mobile menu

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate(); // React Router navigation hook

  const handleNavigation = (page, route) => {
    setMenu(page);
    navigate(route);
  };

  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" className="logo" />

      {/* Desktop Navigation */}
      <ul className="navbar-menu">
        <li
          onClick={() => handleNavigation("home", "/")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </li>
        <li
          onClick={() => handleNavigation("cloud kitchens", "/cloud-kitchens")}
          className={menu === "cloud kitchens" ? "active" : ""}
        >
          Cloud Kitchens
        </li>
        <li
        e
          onClick={() => handleNavigation("menu", "/menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </li>
        <li
          onClick={() => handleNavigation("contact-us", "/contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </li>
      </ul>

      {/* Search Field (Always Visible) */}
      <div className="hidden md:flex items-center border rounded-full p-2 px-4 bg-gray-100">
        <input
          type="search"
          className="bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 w-40 md:w-60 lg:w-80"
          placeholder="Search..."
        />
      </div>

      {/* Login / Register (Desktop) */}
      <div className="hidden md:flex space-x-5">
        <Link to="/login" className="text-red-950 text-lg hover:text-red-950 font-semibold">
          Login
        </Link>
        <Link to="/register" className="text-red-950 text-lg hover:text-red-950 font-semibold">
          Register
        </Link>
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
          </nav>

          <div className="border-t pt-4">
            <Link to="/login" className="text-cyan-700 hover:text-cyan-900 font-semibold block">
              Login
            </Link>
            <Link to="/register" className="text-cyan-700 hover:text-cyan-900 font-semibold block">
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

    