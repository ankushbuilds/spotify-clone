import { useEffect, useState, useCallback } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Home = ({
  currentSong,
  isPlaying,
  handlePlay,
  handleLike,
  likedSongs = [],
  onUnauthenticated,
  playlists,
  addSongToPlaylist
}) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const normalizeSong = (song) => ({
    _id: song._id,
    title: song.title || "Untitled",
    image: song.image || "",
    artist:
      typeof song.artist === "object"
        ? song.artist?.username
        : song.artist || "Unknown Artist",
    uri: song.uri || song.audioUrl || song.file || "",
  });

  const fetchSongs = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view songs.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.get("/music/songs");

      const backendRaw =
        res.data?.musics ||
        res.data?.songs ||
        res.data?.data ||
        [];

      const backendSongs = backendRaw.map(normalizeSong);

      const localSongs =
        JSON.parse(localStorage.getItem("mySongs")) || [];

      const localNormalized = localSongs.map(normalizeSong);

      const merged = [
        ...backendSongs,
        ...localNormalized.filter(
          (ls) => !backendSongs.some(
            (bs) => bs._id === ls._id
          )
        )
      ];

      setSongs(merged);
      setError("");

    } catch (err) {
      console.log("Home fetch error:", err);

      if (err.response?.status === 401) {
        onUnauthenticated?.();
        setError("Session expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
          "Error fetching songs."
        );
      }

    } finally {
      setLoading(false);
    }

  }, [onUnauthenticated]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    const sync = () => fetchSongs();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [fetchSongs]);

  return (
    <div>
      <h2>🎧 Welcome to Spotify Clone</h2>

      {error && (
        <div className="alert alert-warning mt-3">
          {error}
        </div>
      )}

      {loading && !error && (
        <p className="text-light mt-3">
          🎧 Loading fresh music for you...
        </p>
      )}

      <div className="row mt-3">

        {!loading && songs.length > 0 ?
          songs.map((song) => (
            <div
              className="col-md-3 mb-4"
              key={song._id}
            >

              <SongCard
                song={song}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onLike={handleLike}
                isLiked={
                  likedSongs.some(
                    (item) => item._id === song._id
                  )
                }
                playlists={playlists}
                addSongToPlaylist={addSongToPlaylist}
              />

            </div>
          ))
          :
          !loading && !error && (
            <p className="text-light">
              No songs available.
            </p>
          )
        }

      </div>
    </div>
  );
};

export default Home;