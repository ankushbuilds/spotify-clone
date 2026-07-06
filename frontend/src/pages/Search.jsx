import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Search = ({ currentSong, isPlaying, audioRef, handlePlay, handleLike}) => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get("/music/songs")
      .then((res) => {
        setSongs(res.data.musics || []);
        setFilteredSongs(res.data.musics || []);
      });
  }, []);

  useEffect(() => {
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist?.username?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredSongs(filtered);
  }, [search, songs]);

  return (
    <div className="text-white">

      <h2>Search</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search songs..."
        className="form-control mb-3"
      />

      <div className="row">
        {filteredSongs.map((song) => (
          <div className="col-md-3" key={song._id}>
            <SongCard
              song={song}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onLike={handleLike}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Search;