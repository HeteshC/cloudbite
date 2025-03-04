import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../common_components/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import backendGlobalRoute from "../../config/config";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      fetchUserData(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `${backendGlobalRoute}/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(response.data);
      console.log("Fetched user data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center border-b px-6 py-3 bg-gray-100">
      {/* Left Navigation */}
      <ul className="flex space-x-4">
        <li>
          <Link className="text-dark font-semibold" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="text-dark font-semibold" to="/contact-us">
            Contact
          </Link>
        </li>
        <li>
          <Link className="text-dark font-semibold" to="/about-us">
            About
          </Link>
        </li>
      </ul>

      {/* Right Navigation */}
      <ul className="flex space-x-4">
        {!isLoggedIn ? (
          <>
            <li>
              <Link className="text-dark font-semibold" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="text-dark font-semibold" to="/register">
                Register
              </Link>
            </li>
          </>
        ) : (
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-dark font-semibold"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
            >
              <FaUserCircle size={24} />
              <span>{user?.name || user?.email}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <li>
                  <a
                    href={`/profile/${user?._id}`}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </ul>
    </div>
  );
};

export default Header;
