import { useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Album from "./pages/Album";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("likedSongs");
    return saved ? JSON.parse(saved) : [];
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token && token !== "undefined" && token !== "null");
  });

  const audioRef = useRef(new Audio());

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLoginSuccess = () => setLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // ❤️ Like / Unlike
  const handleLike = (song) => {
    setLikedSongs((prev) => {
      let updated;

      const exists = prev.some((s) => s._id === song._id);

      if (exists) {
        updated = prev.filter((s) => s._id !== song._id);
      } else {
        updated = [...prev, song];
      }

      localStorage.setItem("likedSongs", JSON.stringify(updated));
      return updated;
    });
  };

  // ▶ Play
  const handlePlay = (song) => {
    if (!song?.uri) return;

    const audio = audioRef.current;
    audio.pause();

    audio.src = song.uri;
    audio.load();

    audio.play()
      .then(() => {
        setCurrentSong(song);
        setIsPlaying(true);
      })
      .catch(console.error);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white">

      <Navbar
        toggleSidebar={toggleSidebar}
        loggedIn={loggedIn}
        onLogout={handleLogout}
      />

      <div className="d-flex flex-grow-1 overflow-hidden">

        {loggedIn && <Sidebar isOpen={isSidebarOpen} />}

        <div className="flex-grow-1 p-4 overflow-auto bg-black">

          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Home
                    setCurrentSong={setCurrentSong}
                    setIsPlaying={setIsPlaying}
                    audioRef={audioRef}
                    onUnauthenticated={handleLogout}
                    handleLike={handleLike}
                  />
                ) : (
                  <Landing />
                )
              }
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                loggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={
                loggedIn ? <Navigate to="/" /> : <Register />
              }
            />

            {/* SEARCH */}
            <Route
              path="/search"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Search />
                </ProtectedRoute>
              }
            />

            {/* LIBRARY */}
            <Route
              path="/library"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Library />
                </ProtectedRoute>
              }
            />

            {/* LIKED SONGS */}
            <Route
              path="/liked"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <LikedSongs
                    likedSongs={likedSongs}
                    onPlay={handlePlay}
                    onLike={handleLike}
                  />
                </ProtectedRoute>
              }
            />

            {/* ALBUM */}
            <Route
              path="/album/:id"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Album
                    audioRef={audioRef}
                    setCurrentSong={setCurrentSong}
                    setIsPlaying={setIsPlaying}
                  />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

        </div>
      </div>

      {/* PLAYER */}
      {loggedIn && (
        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
        />
      )}

    </div>
  );
}

export default App;