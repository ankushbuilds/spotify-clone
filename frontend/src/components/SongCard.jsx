import React, { useRef } from "react";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const SongCard = ({
  song,
  onPlay,
  onLike,
  currentSong,
  isPlaying,
  isLiked = false,
  playlists,
  addSongToPlaylist
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showPlaylist, setShowPlaylist] = React.useState(false);
  const menuRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowPlaylist(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = () => {
    onLike?.(song);
  };

  const handleAddPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylist?.(playlistId, song._id);
      setShowPlaylist(false);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    }
  };

  const active = currentSong?._id === song?._id && isPlaying;

  const artistName =
    song?.artist?.username ||
    song?.artist?.name ||
    song?.artist ||
    song?.artistName ||
    "Unknown Artist";

  return (
    <div className={`song-card ${active ? "playing" : ""}`}>
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
        <button className={`play-btn ${active ? "active" : ""}`} onClick={() => onPlay?.(song)}>
          {active ? <FaPause className="play-icon" /> : <FaPlay className="play-icon" />}
        </button>
        {active && <div className="playing-indicator"><span></span><span></span><span></span></div>}
      </div>
      <div className="song-info">
        <div className="song-header">
          <h6>{song?.title || "No Title"}</h6>
          <div className="song-actions">
            <span onClick={handleLike} style={{ cursor: "pointer" }}>
              {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
            </span>
            <div className="menu" ref={menuRef}>
              <BsThreeDots onClick={() => setShowMenu(prev => !prev)} style={{ cursor: "pointer" }} />
              {showMenu && (
                <div className="menu-dropdown">
                  <button onClick={() => { onPlay?.(song); setShowMenu(false); }}>
                    {active ? "⏸ Pause" : "▶ Play"}
                  </button>
                  <button onClick={() => { handleLike(); setShowMenu(false); }}>
                    {isLiked ? "💔 Unlike" : "❤️ Like"}
                  </button>
                  <button onClick={() => setShowPlaylist(prev => !prev)}>
                    🎵 Add to Playlist
                  </button>
                  {showPlaylist && (
                    <div className="playlist-dropdown">
                      <h6>Select Playlist</h6>
                      {playlists?.length > 0 ?
                        playlists.map(playlist => (
                          <button key={playlist._id} onClick={() => handleAddPlaylist(playlist._id)}>
                            {playlist.name}
                          </button>
                        ))
                        : <p>No playlists created</p>}
                    </div>
                  )}
                  <button onClick={() => { navigator.clipboard.writeText(song?.uri || ""); setShowMenu(false); }}>
                    📋 Copy Link
                  </button>
                  <button onClick={() => {
                    if (song?.uri) window.open(song.uri, "_blank");
                    setShowMenu(false);
                  }}>
                    🔗 Open Song
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p>{artistName}</p>
      </div>
    </div>
  );
};
export default SongCard;