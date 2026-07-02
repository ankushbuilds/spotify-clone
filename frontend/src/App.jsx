import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token && token !== "undefined" && token !== "null");
  });

  const audioRef = useRef(new Audio());

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white">

      <Navbar toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1 overflow-hidden">

        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex-grow-1 p-4 overflow-auto bg-black">
          {loggedIn ? (
            <Home
              setCurrentSong={setCurrentSong}
              setIsPlaying={setIsPlaying}
              audioRef={audioRef}
              onUnauthenticated={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
              }}
            />
          ) : (
            <Login onLoginSuccess={() => setLoggedIn(true)} />
          )}
        </div>

      </div>

      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}   // 🔥 THIS WAS MISSING
      />

    </div>
  );
}

export default App;