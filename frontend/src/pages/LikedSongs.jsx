import React from "react";
import SongCard from "../components/SongCard";

const LikedSongs = ({ likedSongs, onPlay, onLike }) => {
  return (
    <div className="container mt-4">
      <h2 className="text-white mb-4">❤️ Liked Songs</h2>

      {likedSongs.length === 0 ? (
        <p className="text-secondary">No liked songs yet.</p>
      ) : (
        <div className="row">
          {likedSongs.map((song) => (
            <div className="col-md-3 mb-4" key={song._id}>
              <SongCard
                song={song}
                onPlay={onPlay}
                onLike={onLike}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;