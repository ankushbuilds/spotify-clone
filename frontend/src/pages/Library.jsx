import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import apiClient from "../api/axiosClient";
import SongCard from "../components/SongCard";

const Library = ({
  currentSong,
  isPlaying,
  setCurrentSong,
  setIsPlaying,
  likedSongs,
  onLike,
  playlists,
  fetchPlaylists,
  addSongToPlaylist,
  deletePlaylist,
  removeSongFromPlaylist
}) => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchSong, setSearchSong] = useState("");

  const normalizeSong = (song) => ({
    ...song,
    artist:
      typeof song.artist === "object"
        ? song.artist
        : {
          username: song.artist || "Unknown Artist"
        }
  });

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const res = await apiClient.get("/music/recent");
        setRecentSongs(res.data.songs || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentlyPlayed();
  }, []);

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Playlist name required");
      return;
    }
    try {
      await apiClient.post("/music/playlist/create", { name: playlistName });
      await fetchPlaylists();
      setPlaylistName("");
      setShowCreate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = (song) => {
    if (currentSong?._id === song._id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleDeletePlaylist = (id) => {
    if (window.confirm("Delete this playlist?")) {
      deletePlaylist(id);
      if (selectedPlaylist?._id === id) {
        setSelectedPlaylist(null);
      }
    }
  };

  const selectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setSearchSong("");
  };

  const handleAddSong = async (song) => {
    await addSongToPlaylist(
      selectedPlaylist._id,
      song._id
    );
    setSelectedPlaylist(prev => ({
      ...prev,
      songs: [
        ...(prev.songs || []),
        song
      ]
    }));
    await fetchPlaylists();
    setSearchSong("");
  };
  const handleRemoveSong = async (songId) => {
    if (!selectedPlaylist) return;

    try {
      await removeSongFromPlaylist(
        selectedPlaylist._id,
        songId
      );

      setSelectedPlaylist(prev => ({
        ...prev,
        songs: prev.songs.filter(
          song => song._id !== songId
        )
      }));

    } catch (error) {
      console.log(
        "Remove song error:",
        error
      );
    }
  };

  const filteredSongs = recentSongs.filter(song =>
    song.title?.toLowerCase().includes(searchSong.toLowerCase()) &&
    !selectedPlaylist?.songs?.some(
      addedSong => addedSong._id === song._id
    )
  );

  return (
    <div className="text-white">
      <div className="library-header">
        <div>
          <h2 className="fw-bold mb-1">📚 Your Library</h2>
          <p className="text-secondary">
            Manage playlists and recently played music.
          </p>
        </div>
        <button
          className="btn btn-success"
          onClick={() => setShowCreate(!showCreate)}
        >
          + Create Playlist
        </button>
      </div>

      {showCreate && (
        <div className="library-create-card mb-4">
          <h5>Create Playlist</h5>
          <input
            className="form-control"
            placeholder="Playlist name..."
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
          />
          <button
            className="btn btn-success mt-3"
            onClick={createPlaylist}
          >
            Create
          </button>
        </div>
      )}

      <section>
        <div className="playlist-header">
          <h4 className="fw-bold">🎵 My Playlists</h4>
          <span className="text-secondary">
            {playlists?.length || 0} Playlists
          </span>
        </div>

        <div className="row g-4">
          {playlists?.map(playlist => (
            <div
              className="col-lg-3 col-md-4"
              key={playlist._id}
            >
              <div
                className="playlist-card"
                onClick={() => selectPlaylist(playlist)}
                style={{ cursor: "pointer" }}
              >
                <div className="playlist-icon">
                  🎵
                </div>
                <h5>{playlist.name}</h5>
                <p className="text-secondary">
                  {playlist.songs?.length || 0} Songs
                </p>
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlaylist(playlist._id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPlaylist && (
        <section className="mt-5">
          <h3 className="fw-bold">
            🎧 {selectedPlaylist.name}
          </h3>
          <div className="row g-4 mt-2">

            {selectedPlaylist.songs?.length > 0 ?

              selectedPlaylist.songs.map(song => {
                const fixedSong = normalizeSong(song);

                return (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={song._id}
                  >
                    <SongCard
                      song={fixedSong}
                      onPlay={handlePlay}
                      currentSong={currentSong}
                      isPlaying={isPlaying}
                      onLike={onLike}
                      playlists={playlists}
                      addSongToPlaylist={addSongToPlaylist}
                      isLiked={
                        likedSongs?.some(
                          likedSong => likedSong._id === song._id
                        ) || false
                      }
                    />
                    <button
                      className="btn btn-danger btn-sm w-100 mt-2"
                      onClick={() => handleRemoveSong(song._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                );
              })
              :
              <p className="text-secondary">
                No songs added in this playlist.
              </p>
            }
          </div>
          <div className="premium-add-box mt-5">
            <div className="premium-add-header">
              <div>
                <h4>Add Songs</h4>
                <p>Add new tracks to your playlist</p>
              </div>
              <FaPlus />
            </div>

            <div className="premium-search">
              <FaSearch />
              <input
                placeholder="Search songs..."
                value={searchSong}
                onChange={e => setSearchSong(e.target.value)}
              />
            </div>

            <div className="premium-song-list">
              {filteredSongs.length > 0 ? (
                filteredSongs.map(song => (
                  <div
                    className="premium-song-item"
                    key={song._id}
                  >
                    <div>
                      <h6>{song.title}</h6>
                      <small>
                        {song.artist?.username || "Unknown Artist"}
                      </small>
                    </div>

                    <button
                      onClick={() => handleAddSong(song)}
                    >
                      <FaPlus />
                    </button>

                  </div>
                ))
              ) : (
                <p className="text-secondary">
                  No songs available to add.
                </p>
              )}
            </div>
          </div>

        </section>
      )}

      <section className="mt-5">
        <h4 className="fw-bold mb-4">
          🎧 Recently Played
        </h4>

        <div className="row g-4">
          {recentSongs.length > 0 ? (
            recentSongs.map(song => (
              <div
                className="col-lg-3 col-md-4 col-sm-6"
                key={song._id}
              >
                <SongCard
                  song={song}
                  onPlay={handlePlay}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onLike={onLike}
                  playlists={playlists}
                  addSongToPlaylist={addSongToPlaylist}
                  isLiked={
                    likedSongs?.some(
                      likedSong => likedSong._id === song._id
                    ) || false
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-secondary">
              No recently played songs.
            </p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Library;