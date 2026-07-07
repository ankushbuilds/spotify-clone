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
import ArtistDashboard from "./pages/ArtistDashboard"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  // ✅ restore current song
  const [currentSong, setCurrentSong] = useState(() => {
    const savedSong = localStorage.getItem("currentSong");
    return savedSong ? JSON.parse(savedSong) : null;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("likedSongs");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  const audioRef = useRef(new Audio());

  // ================= AUTH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token && token !== "undefined" && token !== "null");
  }, []);

  const handleLoginSuccess = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  setLoggedIn(!!token);

  // new user login => old data clear
  setCurrentSong(null);
  setIsPlaying(false);
  setLikedSongs([]);

  localStorage.removeItem("currentSong");
  localStorage.removeItem("likedSongs");
};

  // ================= PERSIST SONG =================
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    } else {
      localStorage.removeItem("currentSong");
    }
  }, [currentSong]);

  // ================= SIDEBAR =================
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentSong");
    localStorage.removeItem("isPlaying");
      localStorage.removeItem("likedSongs");


    audioRef.current.pause();
    audioRef.current.src = "";

    setCurrentSong(null);
    setIsPlaying(false);
    setLoggedIn(false);
      setLikedSongs([]);


    navigate("/");
  };

  // ================= LIKE SYSTEM =================
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

  // ================= PLAY SYSTEM =================
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

      {/* NAVBAR */}
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

            {/* REGISTER */}
            <Route
              path="/register"
              element={loggedIn ? <Navigate to="/" /> : <Register />}
            />

            {/* ABOUT */}
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />

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
            {/* Artist Dashboard */}
            <Route
  path="/artist/dashboard"
  element={
    loggedIn && JSON.parse(localStorage.getItem("user"))?.role === "artist"
      ? <ArtistDashboard />
      : <Navigate to="/" />
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