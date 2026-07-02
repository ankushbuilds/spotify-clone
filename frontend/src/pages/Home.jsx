import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Home = ({ setCurrentSong, setIsPlaying, audioRef, onUnauthenticated }) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view songs.");
      return;
    }

    apiClient
      .get("/music/songs")
      .then((res) => {
        console.log("SUCCESS:", res.status);
        console.log(res.data);
        setSongs(res.data.musics);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          onUnauthenticated?.();
          setError("Session expired. Please log in again.");
          return;
        }

        setError(err.response?.data?.message || "Error fetching songs.");
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("URL:", err.config?.url);
      });
  }, [token]);

  // 🎧 PLAY SONG
  const handlePlay = (song) => {
    const audio = audioRef?.current;

    if (!audio || !song?.uri) return;

    audio.src = song.uri;

    audio
      .play()
      .then(() => {
        setCurrentSong(song);
        setIsPlaying(true);
      })
      .catch((err) => console.log("Play error:", err));
  };

  return (
    <div>
      <h2>🎧 Welcome to Spotify Clone</h2>

      {error ? (
        <div className="alert alert-warning mt-3" role="alert">
          {error}
        </div>
      ) : null}

      <div className="row mt-3">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div className="col-md-3" key={song._id}>
              <SongCard song={song} onPlay={handlePlay} />
            </div>
          ))
        ) : (
          !error && <p className="text-light">Loading songs...</p>
        )}
      </div>
    </div>
  );
};

export default Home;