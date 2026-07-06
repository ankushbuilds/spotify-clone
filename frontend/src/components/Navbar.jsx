import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaSearch,
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, loggedIn, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <nav className="nav">

      {/* LEFT */}
      <div className="nav-left">
        <FaBars className="icon menu" onClick={toggleSidebar} />
        <span className="logo">Spotify Clone</span>
      </div>

      {/* CENTER */}
      {loggedIn && (
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search songs, artists..."
          />
        </div>
      )}

      {/* RIGHT */}
      <div className="nav-right">

        {!loggedIn ? (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        ) : (
          <div className="profile-wrapper" ref={dropdownRef}>

            {/* TRIGGER */}
            <div
              className="profile-trigger"
              onClick={() => setOpen(!open)}
            >
              <FaUserCircle className="icon user" />

              <span className="user-text">
                {user?.username}
              </span>
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="profile-dropdown">

                <div className="profile-header">
                  <FaUserCircle className="profile-avatar" />

                  <div>
                    <h4>{user?.username}</h4>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <hr />

                <div className="profile-item" onClick={() => handleNavigate("/profile")}>
                  <FaUser /> Profile
                </div>

                <div className="profile-item" onClick={() => handleNavigate("/account")}>
                  <FaCog /> Account
                </div>

                <div className="profile-item" onClick={() => handleNavigate("/settings")}>
                  <FaCog /> Settings
                </div>

                <div className="profile-item" onClick={() => handleNavigate("/help")}>
                  <FaQuestionCircle /> Help
                </div>

                {/* ✅ ABOUT FIXED */}
                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/about")}
                >
                  <FaInfoCircle /> About
                </div>

                <hr />

                {/* LOGOUT FIXED */}
                <div
                  className="profile-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </nav>
  );
};

export default Navbar;