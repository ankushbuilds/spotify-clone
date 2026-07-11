import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaInfoCircle,
  FaUser,
  FaMicrophone
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, loggedIn, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      <div className="nav-left">
        <FaBars
          className="icon menu"
          onClick={toggleSidebar}
        />
        <span className="logo">
          Spotify Clone
        </span>
      </div>

      <div className="nav-center"></div>

      <div className="nav-right">
        {!loggedIn ? (
          <>
            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-link"
            >
              Register
            </Link>
          </>
        ) : (
          <div
            className="profile-wrapper"
            ref={dropdownRef}
          >
            <div
              className="profile-trigger"
              onClick={() => setOpen(!open)}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="nav-profile-image"
                />
              ) : (
                <FaUserCircle className="icon user" />
              )}

              <div className="nav-user-info">
                <span className="user-text">
                  {user?.username || "User"}
                </span>

                <span
                  className={`role-badge ${user?.role === "artist"
                    ? "artist-badge"
                    : "user-badge"
                    }`}
                >
                  {user?.role === "artist"
                    ? "🎤 Artist"
                    : "👤 User"}
                </span>
              </div>
            </div>

            {open && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="profile"
                      className="profile-avatar-image"
                    />
                  ) : (
                    <FaUserCircle className="profile-avatar" />
                  )}

                  <div>
                    <h4>{user?.username}</h4>

                    <p>{user?.email}</p>

                    <span
                      className={`role-badge ${user?.role === "artist"
                        ? "artist-badge"
                        : "user-badge"
                        }`}
                    >
                      {user?.role === "artist"
                        ? "🎤 Artist Account"
                        : "👤 User Account"}
                    </span>
                  </div>
                </div>

                <hr />

                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/profile")}
                >
                  <FaUser />
                  Profile
                </div>

                {user?.role === "artist" && (
                  <div
                    className="profile-item"
                    onClick={() =>
                      handleNavigate("/artist/dashboard")
                    }
                  >
                    <FaMicrophone />
                    Artist Dashboard
                  </div>
                )}

                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/account")}
                >
                  <FaCog />
                  Account
                </div>

                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/settings")}
                >
                  <FaCog />
                  Settings
                </div>

                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/help")}
                >
                  <FaQuestionCircle />
                  Help
                </div>

                <div
                  className="profile-item"
                  onClick={() => handleNavigate("/about")}
                >
                  <FaInfoCircle />
                  About
                </div>

                <hr />

                <div
                  className="profile-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
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