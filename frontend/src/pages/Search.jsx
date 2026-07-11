import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Search = ({
  currentSong,
  isPlaying,
  handlePlay,
  handleLike,
  playlists,
  addSongToPlaylist
}) => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await apiClient.get("/music/songs");
        const data = res.data.musics || [];
        setSongs(data);
        setFilteredSongs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const filtered = songs.filter(song => {
      const title = song.title?.toLowerCase() || "";
      const artist = typeof song.artist === "object"
        ? song.artist?.username?.toLowerCase() || ""
        : song.artist?.toLowerCase() || "";
      return title.includes(search.toLowerCase()) || artist.includes(search.toLowerCase());
    });
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
        {
          filteredSongs.length > 0 ?
            filteredSongs.map(song => (
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
                  playlists={playlists}
                  addSongToPlaylist={addSongToPlaylist}
                />
              </div>
            ))
            :
            <p>
              No songs found.
            </p>
        }
      </div>
    </div>
  );
};

export default Search;