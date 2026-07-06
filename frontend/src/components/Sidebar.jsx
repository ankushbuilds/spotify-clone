import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaBook,
  FaHeart,
  FaSpotify,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState("");

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      path: "/",
    },
    {
      name: "Search",
      icon: <FaSearch />,
      path: "/search",
    },
    {
      name: "Library",
      icon: <FaBook />,
      path: "/library",
    },
    {
      name: "Liked Songs",
      icon: <FaHeart />,
      path: "/liked",
    },
  ];

  // 🔥 SYNC ACTIVE STATE WITH URL
  useEffect(() => {
    const path = location.pathname;

    if (path === "/") setActive("Home");
    else if (path === "/search") setActive("Search");
    else if (path === "/library") setActive("Library");
    else if (path === "/liked") setActive("Liked Songs");
  }, [location.pathname]);

  const handleClick = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      
      {/* LOGO */}
      <div className="sidebar-logo">
        <FaSpotify className="spotify-icon" />
        {isOpen && <span className="sidebar-title">Spotify</span>}
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${
              active === item.name ? "active" : ""
            }`}
            onClick={() => handleClick(item)}
          >
            <span className="menu-icon">{item.icon}</span>

            {isOpen && (
              <span className="menu-text">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;