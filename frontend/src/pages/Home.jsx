import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";

const Home = ({ setCurrentSong, setIsPlaying, audioRef }) => {
  const [songs, setSongs] = useState([]);

  // 🔥 FETCH FROM BACKEND (FIXED)
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/music/songs", {
        withCredentials: true, // ✅ IMPORTANT FIX
      })
      .then((res) => {
        console.log("SUCCESS:", res.status);
        console.log(res.data);
        setSongs(res.data.musics);
      })
      .catch((err) => {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("URL:", err.config?.url);
        console.log("Error fetching songs:", err.response?.data || err.message);
      });
  }, []);

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

      <div className="row mt-3">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div className="col-md-3" key={song._id}>
              <SongCard song={song} onPlay={handlePlay} />
            </div>
          ))
        ) : (
          <p className="text-light">Loading songs...</p>
        )}
      </div>
    </div>
  );
};

export default Home;