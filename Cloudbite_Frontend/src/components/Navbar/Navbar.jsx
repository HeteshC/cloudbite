import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const navigate = useNavigate(); // React Router navigation hook

  const handleNavigation = (page, route) => {
    setMenu(page);
    navigate(route);
  };

  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" className="logo" />

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

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="basket" />
          <div className="dot"></div>
        </div>
        <button className="sign-in-btn" onClick={() => setShowLogin(true)}>Sign In</button>
        <img 
          src={assets.profile_icon} 
          alt="profile" 
          className="profile-icon" 
          onClick={() => handleNavigation("profile", "/profile")}
        />
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
