import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Search = ({ setCurrentSong, setIsPlaying, audioRef }) => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient
      .get("/music/songs")
      .then((res) => {
        setSongs(res.data.musics);
        setFilteredSongs(res.data.musics);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||  song.artist?.username?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredSongs(filtered);
  }, [search, songs]);

  const handlePlay = (song) => {
    const audio = audioRef.current;

    audio.src = song.uri;

    audio.play().then(() => {
      setCurrentSong(song);
      setIsPlaying(true);
    });
  };

  return (
    <div className="text-white">

      <h2 className="mb-4">Search</h2>

      <input
        type="text"
        placeholder="Search songs, artists..."
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div className="col-md-3 mb-4" key={song._id}>
              <SongCard
                song={song}
                onPlay={handlePlay}
              />
            </div>
          ))
        ) : (
          <h5>No songs found</h5>
        )}
      </div>

    </div>
  );
};

export default Search;