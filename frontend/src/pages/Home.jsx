import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Home = ({
  currentSong,
  isPlaying,
  handlePlay,
  handleLike,
  onUnauthenticated,
}) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view songs.");
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/music/songs");

        setSongs(res.data.musics || []);
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          onUnauthenticated?.();
          setError("Session expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.message || "Error fetching songs."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [onUnauthenticated]);

  return (
    <div>
      <h2>🎧 Welcome to Spotify Clone</h2>

      {error && (
        <div className="alert alert-warning mt-3" role="alert">
          {error}
        </div>
      )}

      {loading && !error && (
        <p className="text-light mt-3">
          🎧 Loading fresh music for you...
        </p>
      )}

      <div className="row mt-3">
        {!loading && songs.length > 0 ? (
          songs.map((song) => (
            <div className="col-md-3 mb-4" key={song._id}>
              <SongCard
                song={song}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onLike={handleLike}
              />
            </div>
          ))
        ) : (
          !loading &&
          !error && (
            <p className="text-light">No songs available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Home;