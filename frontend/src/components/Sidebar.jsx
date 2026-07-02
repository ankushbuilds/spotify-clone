import React, { useState } from "react";
import {
  FaHome,
  FaSearch,
  FaBook,
  FaHeart,
  FaSpotify,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const [active, setActive] = useState("Home");

  const menuItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Search", icon: <FaSearch /> },
    { name: "Library", icon: <FaBook /> },
    { name: "Liked Songs", icon: <FaHeart /> },
  ];

  return (
    <div
      style={{
        width: isOpen ? "240px" : "70px",
        minWidth: isOpen ? "240px" : "70px",
        transition: "0.3s ease",
        background: "#000",
        color: "white",
        borderRight: "1px solid #222",
        padding: "15px",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <FaSpotify style={{ color: "#1db954", fontSize: "24px" }} />

        {isOpen && (
          <span style={{ fontWeight: "600", fontSize: "16px" }}>
            Spotify
          </span>
        )}
      </div>

      {/* MENU */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
              background:
                active === item.name ? "#1a1a1a" : "transparent",
              color: active === item.name ? "#1db954" : "#b3b3b3",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#1a1a1a")
            }
            onMouseLeave={(e) => {
              if (active !== item.name) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>

            {isOpen && (
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;