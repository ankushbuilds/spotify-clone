import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Home = ({
  setCurrentSong,
  setIsPlaying,
  audioRef,
  onUnauthenticated,
  handleLike,
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

        console.log("SUCCESS:", res.status);
        console.log(res.data);

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

  // PLAY SONG
  let currentAudio;

  const handlePlay = (song) => {
    if (!song?.uri) return;

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = audioRef.current;
    currentAudio = audio;

    audio.src = song.uri;
    audio.load();

    audio
      .play()
      .then(() => {
        setCurrentSong(song);
        setIsPlaying(true);
      })
      .catch(console.log);
  };

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