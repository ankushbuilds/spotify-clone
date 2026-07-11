import { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import apiClient from "./api/axiosClient";
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
import ArtistDashboard from "./pages/ArtistDashboard";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentSong, setCurrentSong] = useState(() => {
        const savedSong = localStorage.getItem("currentSong");
        return savedSong ? JSON.parse(savedSong) : null;
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [likedSongs, setLikedSongs] = useState(() => {
        const saved = localStorage.getItem("likedSongs");
        return saved ? JSON.parse(saved) : [];
    });
    const [playlists, setPlaylists] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoggedIn(!!token && token !== "undefined" && token !== "null");
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "likedSongs",
            JSON.stringify(likedSongs)
        );
    }, [likedSongs]);

    const fetchPlaylists = async () => {
        try {
            const res = await apiClient.get("/music/playlist/my");
            setPlaylists(res.data.playlists || []);
        } catch (error) {
            console.log("Playlist fetch error:", error);
        }
    };

    useEffect(() => {
        if (loggedIn) {
            fetchPlaylists();
        }
    }, [loggedIn]);

    const handleLoginSuccess = async () => {
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);

        const savedSong = JSON.parse(localStorage.getItem("currentSong")) || null;
        setCurrentSong(savedSong);
        setIsPlaying(false);

        const savedLikes = JSON.parse(localStorage.getItem("likedSongs")) || [];
        setLikedSongs(savedLikes);

        if (token) {
            await fetchPlaylists();
        }
    };

    useEffect(() => {
        if (currentSong) {
            localStorage.setItem(
                "currentSong",
                JSON.stringify(currentSong)
            );
        } else {
            localStorage.removeItem("currentSong");
        }
    }, [currentSong]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentSong");
        localStorage.removeItem("isPlaying");

        audioRef.current.pause();
        audioRef.current.src = "";

        setCurrentSong(null);
        setIsPlaying(false);
        setPlaylists([]);
        setLoggedIn(false);

        navigate("/");
    };

    const handleLike = (song) => {
        setLikedSongs(prev => {
            const exists = prev.some(
                item => item._id === song._id
            );

            if (exists) {
                return prev.filter(
                    item => item._id !== song._id
                );
            }

            return [...prev, song];
        });
    };

    const addSongToPlaylist = async (playlistId, songId) => {
        try {
            await apiClient.post(
                `/music/playlist/${playlistId}/add-song/${songId}`
            );
            alert("Song added to playlist");
            fetchPlaylists();
        } catch (error) {
            console.log("Add song error:", error);
        }
    };

    const removeSongFromPlaylist = async (playlistId, songId) => {
        try {
            await apiClient.delete(
                `/music/playlist/${playlistId}/remove-song/${songId}`
            );
            await fetchPlaylists();
        } catch (error) {
            console.log("Remove song error:", error);
        }
    };

    const deletePlaylist = async (id) => {
        try {
            await apiClient.delete(
                `/music/playlist/${id}`
            );
            alert("Playlist removed");
            fetchPlaylists();
        } catch (error) {
            console.log("Delete playlist error:", error);
        }
    };

    const handlePlay = (song) => {
        const audio = audioRef.current;

        if (currentSong?._id === song._id) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(console.error);
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
                        <Route
                            path="/"
                            element={
                                loggedIn ?
                                    <Home
                                        currentSong={currentSong}
                                        isPlaying={isPlaying}
                                        handlePlay={handlePlay}
                                        handleLike={handleLike}
                                        likedSongs={likedSongs}
                                        playlists={playlists}
                                        addSongToPlaylist={addSongToPlaylist}
                                    />
                                    :
                                    <Landing />
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                loggedIn ?
                                    <Navigate to="/" />
                                    :
                                    <Login onLoginSuccess={handleLoginSuccess} />
                            }
                        />
                        <Route
                            path="/liked"
                            element={
                                loggedIn ?
                                    <LikedSongs
                                        likedSongs={likedSongs}
                                        onPlay={handlePlay}
                                        onLike={handleLike}
                                    />
                                    :
                                    <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="/search"
                            element={
                                loggedIn ?
                                    <Search
                                        currentSong={currentSong}
                                        isPlaying={isPlaying}
                                        handlePlay={handlePlay}
                                        handleLike={handleLike}
                                        likedSongs={likedSongs}
                                        playlists={playlists}
                                        addSongToPlaylist={addSongToPlaylist}
                                    />
                                    :
                                    <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="/library"
                            element={
                                loggedIn ?
                                    <Library
                                        likedSongs={likedSongs}
                                        onLike={handleLike}
                                        playlists={playlists}
                                        fetchPlaylists={fetchPlaylists}
                                        addSongToPlaylist={addSongToPlaylist}
                                        removeSongFromPlaylist={removeSongFromPlaylist}
                                        deletePlaylist={deletePlaylist}
                                    />
                                    :
                                    <Navigate to="/login" />
                            }
                        />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/album/:id"
                            element={
                                <Album
                                    audioRef={audioRef}
                                    setCurrentSong={setCurrentSong}
                                    setIsPlaying={setIsPlaying}
                                />
                            }
                        />
                        <Route
                            path="/artist/dashboard"
                            element={
                                loggedIn && JSON.parse(localStorage.getItem("user"))?.role === "artist"
                                    ?
                                    <ArtistDashboard />
                                    :
                                    <Navigate to="/" />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
            {loggedIn &&
                <Player
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    audioRef={audioRef}
                />
            }
        </div>
    );
}
export default App;