import React from "react";
import { FaPlay, FaHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const SongCard = ({ song, onPlay, onLike }) => {
  return (
    <div
      className="song-card text-white"
      style={{
        background: "#181818",
        borderRadius: "14px",
        padding: "12px",
        cursor: "pointer",
        transition: "0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "scale(1.03)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      {/* IMAGE WRAPPER */}
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <img
          src={song.image}
          alt="song"
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            transition: "0.3s ease",
          }}
        />

        {/* OVERLAY */}
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "rgba(0,0,0,0.4)",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.3s ease",
          }}
        >
          <button
            onClick={() => onPlay(song)}
            style={{
              background: "#1DB954",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "18px",
              color: "black",
            }}
          >
            <FaPlay />
          </button>
        </div>
      </div>

      {/* Hover effect for overlay */}
      <style>
        {`
          .song-card:hover .overlay {
            opacity: 1;
          }
        `}
      </style>

      {/* INFO */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h6 style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>
            {song.title}
          </h6>

          <div style={{ display: "flex", gap: "10px" }}>
            <FaHeart
              onClick={() => onLike?.(song)}
              style={{ cursor: "pointer", color: "#b3b3b3" }}
            />
            <BsThreeDots style={{ cursor: "pointer", color: "#b3b3b3" }} />
          </div>
        </div>

        <p style={{ margin: 0, fontSize: "12px", color: "#b3b3b3" }}>
          {song.artist}
        </p>
      </div>
    </div>
  );
};

export default SongCard;