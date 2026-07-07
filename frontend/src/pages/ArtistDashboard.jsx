import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

const ArtistDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // 🔥 IMPORTANT FIX

  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [songs, setSongs] = useState(() => {
    return JSON.parse(localStorage.getItem("mySongs")) || [];
  });

  // ================= HANDLE IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file); // 🔥 store file, NOT base64
  };

  // ================= UPLOAD SONG =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !audio) {
      alert("Title and audio required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);

    // 🔥 MUST MATCH BACKEND FIELD NAME
    formData.append("music", audio);
    formData.append("image", imageFile);

    try {
      const res = await axiosClient.post("/music/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 🔥 FIX 403 ERROR
        },
      });

      const newSong = res.data?.music || res.data;

      const updatedSongs = [newSong, ...songs];

      setSongs(updatedSongs);
      localStorage.setItem("mySongs", JSON.stringify(updatedSongs));

      alert("🎵 Uploaded successfully!");

      setTitle("");
      setAudio(null);
      setImageFile(null);
    } catch (err) {
      console.log("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="container text-white py-4">
      <h2>🎤 Artist Dashboard</h2>
      <p className="text-secondary">
        Upload your songs (Title + Audio + Image)
      </p>

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="mt-4">
        {/* TITLE */}
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="premium-input mb-2"
        />

        {/* AUDIO */}
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          className="premium-input mb-2"
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="premium-input mb-2"
        />

        <button className="premium-btn">Upload Song 🎵</button>
      </form>

      {/* SONG LIST */}
      <div className="mt-5">
        <h4>Your Songs</h4>

        {songs.length === 0 && (
          <p className="text-secondary">No songs uploaded yet</p>
        )}

        {songs.map((song) => (
          <div
            key={song._id || song.title}
            className="d-flex align-items-center justify-content-between p-2 border-bottom"
          >
            <div className="d-flex align-items-center gap-3">
              {/* IMAGE */}
              {song.image ? (
                <img
                  src={song.image}
                  alt="cover"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "#333",
                    borderRadius: "5px",
                  }}
                />
              )}

              {/* INFO */}
              <div>
                <b>{song.title}</b>
                <div className="text-secondary small">
                  {typeof song.artist === "object"
                    ? song.artist?.username
                    : song.artist}
                </div>
              </div>
            </div>

            {/* AUDIO */}
            <audio controls style={{ width: 150 }}>
              <source src={song.uri} />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDashboard;