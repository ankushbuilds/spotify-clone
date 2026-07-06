import { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import About from "./components/About";
import Help from "./components/Help";
import Settings from "./components/Settings";
import Account from "./components/Account";
import Profile from "./components/Profile";



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
  const navigate = useNavigate();

  // 🔥 AUTH STATE (FIXED)
  const [loggedIn, setLoggedIn] = useState(false);

  // sync auth on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token && token !== "undefined" && token !== "null");
  }, []);

  const audioRef = useRef(new Audio());

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ✅ LOGIN SUCCESS FIX
  const handleLoginSuccess = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setLoggedIn(false);

  navigate("/"); // 
};

  // ❤️ Like system
  const handleLike = (song) => {
    setLikedSongs((prev) => {
      const exists = prev.some((s) => s._id === song._id);

      const updated = exists
        ? prev.filter((s) => s._id !== song._id)
        : [...prev, song];

      localStorage.setItem("likedSongs", JSON.stringify(updated));
      return updated;
    });
  };

  // ▶ Play system
  const handlePlay = (song) => {
    const audio = audioRef.current;

    if (currentSong?._id === song._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
      return;
    }

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
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    handlePlay={handlePlay}
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
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* About */}
            <Route path="/about" element={<About />} />
            {/* Help */}
            <Route path="/help" element={<Help />} />

               {/* Settings */}
            <Route path="/settings" element={<Settings />} />

             {/* Account */}
            <Route path="/account" element={<Account />} />

              {/* Profile */}
            <Route path="/profile" element={<Profile />} />

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
                loggedIn ? (
                  <Search
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    handlePlay={handlePlay}
                    handleLike={handleLike}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* LIBRARY */}
            <Route
              path="/library"
              element={
                loggedIn ? <Library /> : <Navigate to="/login" />
              }
            />

            {/* LIKED */}
            <Route
              path="/liked"
              element={
                loggedIn ? (
                  <LikedSongs
                    likedSongs={likedSongs}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={handlePlay}
                    onLike={handleLike}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* ALBUM */}
            <Route
              path="/album/:id"
              element={
                loggedIn ? (
                  <Album
                    audioRef={audioRef}
                    setCurrentSong={setCurrentSong}
                    setIsPlaying={setIsPlaying}
                  />
                ) : (
                  <Navigate to="/login" />
                )
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