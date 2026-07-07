import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const SongCard = ({
  song,
  onPlay,
  onLike,
  currentSong,
  isPlaying,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(song?.liked || false);

  const menuRef = useRef(null);

  const handleLike = () => {
    setLiked((prev) => !prev);
    onLike?.(song);
  };

  const active =
    currentSong?._id === song?._id && isPlaying;

  // 🧠 CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`song-card ${active ? "playing" : ""}`}>

      {/* IMAGE WRAPPER */}
      <div className="song-image-wrapper">

        <img
          src={
            song?.image && song.image.trim() !== ""
              ? song.image
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='12' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
          }
          alt={song?.title || "song"}
          className="song-image"
        />

        {/* PLAY BUTTON */}
        <button
          className={`play-btn ${active ? "active" : ""}`}
          onClick={() => onPlay?.(song)}
        >
          {active ? (
            <FaPause className="play-icon" />
          ) : (
            <FaPlay className="play-icon" />
          )}
        </button>

        {/* 🎵 NOW PLAYING ANIMATION */}
        {active && (
          <div className="playing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="song-info">

        <div className="song-header">
          <h6>{song?.title || "No Title"}</h6>

          <div className="song-actions">

            {/* LIKE */}
            <span onClick={handleLike}>
              {liked ? (
                <FaHeart className="liked" />
              ) : (
                <FaRegHeart />
              )}
            </span>

            {/* MENU */}
            <div className="menu" ref={menuRef}>

              <BsThreeDots
                onClick={() => setShowMenu((prev) => !prev)}
              />

              {showMenu && (
                <div className="menu-dropdown">

                  <button
                    onClick={() => {
                      onPlay?.(song);
                      setShowMenu(false);
                    }}
                  >
                    {active ? "⏸ Pause" : "▶ Play"}
                  </button>

                  <button
                    onClick={() => {
                      handleLike();
                      setShowMenu(false);
                    }}
                  >
                    {liked ? "💔 Unlike" : "❤️ Like"}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(song?.uri || "");
                      alert("Song link copied!");
                      setShowMenu(false);
                    }}
                  >
                    📋 Copy Link
                  </button>

                  <button
                    onClick={() => {
                      if (song?.uri) {
                        window.open(song.uri, "_blank");
                      }
                      setShowMenu(false);
                    }}
                  >
                    🔗 Open Song
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* ARTIST */}
        <p>
          {typeof song?.artist === "object"
            ? song.artist?.username
            : song?.artist || "Unknown Artist"}
        </p>

      </div>
    </div>
  );
};

export default SongCard;