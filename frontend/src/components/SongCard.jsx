import React, { useState } from "react";
import { FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const SongCard = ({ song, onPlay, onLike }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(song.liked || false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(song);
  };

  return (
    <div className="song-card">
      <div className="song-image-wrapper">
        <img
          src={song.image}
          alt={song.title}
          className="song-image"
        />

        {/* Spotify Style Play Button */}
        <button
          className="play-btn"
          onClick={() => onPlay(song)}
        >
          <FaPlay className="play-icon" />
        </button>
      </div>

      <div className="song-info">
        <div className="song-header">
          <h6>{song.title}</h6>

          <div className="song-actions">
            <span onClick={handleLike}>
              {liked ? (
                <FaHeart className="liked" />
              ) : (
                <FaRegHeart />
              )}
            </span>

            <div className="menu">
              <BsThreeDots
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="menu-dropdown">
                  <button onClick={() => onPlay(song)}>
                    ▶ Play
                  </button>

                  <button onClick={handleLike}>
                    {liked ? "💔 Unlike" : "❤️ Like"}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(song.uri);
                      alert("Song link copied!");
                      setShowMenu(false);
                    }}
                  >
                    📋 Copy Link
                  </button>

                  <button
                    onClick={() => {
                      window.open(song.uri, "_blank");
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

        <p>
          {song.artist?.username ||
            song.artist ||
            "Unknown Artist"}
        </p>
      </div>
    </div>
  );
};

export default SongCard;