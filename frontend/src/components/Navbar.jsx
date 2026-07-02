import React from "react";
import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav style={styles.nav}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <FaBars
          size={18}
          style={styles.menuIcon}
          onClick={toggleSidebar}
        />

        <span style={styles.logo}>Spotify Clone</span>
      </div>

      {/* CENTER SEARCH */}
      <div style={styles.searchBox}>
        <FaSearch style={styles.searchIcon} />

        <input
          type="text"
          placeholder="Search songs, artists..."
          style={styles.input}
        />
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <FaUserCircle size={22} style={styles.userIcon} />
        <span style={styles.userText}>User</span>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#000",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  menuIcon: {
    cursor: "pointer",
    color: "#fff",
    transition: "0.2s",
  },

  logo: {
    color: "#1db954",
    fontWeight: "700",
    fontSize: "18px",
    letterSpacing: "0.5px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#121212",
    padding: "8px 12px",
    borderRadius: "25px",
    width: "40%",
    transition: "0.3s",
    border: "1px solid transparent",
  },

  searchIcon: {
    color: "#aaa",
    marginRight: "10px",
  },

  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    width: "100%",
    fontSize: "14px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  userIcon: {
    color: "#fff",
  },

  userText: {
    color: "#fff",
    fontSize: "14px",
  },
};

// 🔥 optional hover effect (pure JS trick)
if (typeof window !== "undefined") {
  document.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "INPUT") {
      const parent = e.target.closest("div");
      if (parent && parent.style) {
        parent.style.border = "1px solid #1db954";
      }
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "INPUT") {
      const parent = e.target.closest("div");
      if (parent && parent.style) {
        parent.style.border = "1px solid transparent";
      }
    }
  });
}

export default Navbar;