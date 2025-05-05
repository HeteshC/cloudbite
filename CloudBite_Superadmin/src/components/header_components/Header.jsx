import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../common_components/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Ensure dropdown is closed when user logs in
  useEffect(() => {
    setDropdownOpen(false);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if the logged-in user is an Admin or Super Admin
  const isAdminOrSuperAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  return (
    <div className="flex justify-between items-center border-b px-6 py-2 bg-gray-100">
      {/* Left Navigation */}
      <ul className="flex space-x-4">
          <Link className="text-dark font-semibold" to="/">
            Home
          </Link>
          <Link className="text-dark font-semibold" to="/add">
            Add Items
          </Link>
          <Link className="text-dark font-semibold" to="/list">
            List Items
          </Link>
          <Link className="text-dark font-semibold" to="/orders">
            Orders
          </Link>
        
        {/* Only show for Admin or Super Admin */}
        {isAdminOrSuperAdmin && (
          <>
            <li>
              <Link className="text-dark font-semibold" to="/all-users">
                All Users
              </Link>
            </li>
            <li>
              <Link className="text-dark font-semibold" to="/add-blog">
                Add Blog
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Right Navigation */}
      <ul className="flex space-x-4">
        {!isLoggedIn ? (
          <>
              <Link className="text-dark font-semibold" to="/login">
                Login
              </Link>
              <Link className="text-dark font-semibold" to="/register">
                Register
              </Link>
          </>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(timeoutRef.current);
              setDropdownOpen(true);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(
                () => setDropdownOpen(false),
                200
              );
            }}
          >
            <button className="flex items-center space-x-2 text-dark font-semibold">
              <FaUserCircle size={24} />
              <span>{user?.name || user?.email}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
                <li>
                  <Link
                    to={`/profile/${user?._id}`}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
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
