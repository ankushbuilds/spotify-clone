import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaBook,
  FaHeart,
  FaSpotify,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const [active, setActive] = useState("Home");

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