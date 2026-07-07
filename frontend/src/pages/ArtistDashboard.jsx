import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const ArtistDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

 const fetchSongs = async () => {
  try {
    const res = await axiosClient.get("/music/songs", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    setSongs(res.data.musics || []);

  } catch (err) {
    console.log(err.response?.data);
  }
};
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !audio) {
      alert("Title and audio required");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("music", audio);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);

      await axiosClient.post(
        "/music/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("🎵 Song uploaded");

      setTitle("");
      setAudio(null);
      setImageFile(null);

      fetchSongs();

    } catch (err) {
      console.log(
        "Upload error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message || "Upload failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id) => {
    if (!window.confirm("Delete this song?")) return;

    try {
      await axiosClient.delete(`/music/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSongs(prev =>
        prev.filter(song => song._id !== id)
      );

      alert("Song deleted");

    } catch (err) {
      console.log(
        "Delete error:",
        err.response?.data
      );

      alert("Delete failed");
    }
  };

  return (
    <div className="container text-white py-4">

      <h2>🎤 Artist Dashboard</h2>

      <p className="text-secondary">
        Welcome {user?.username}
      </p>

      <div className="premium-card p-4 mt-4">

        <h4>Upload New Song</h4>

        <form onSubmit={handleUpload}>

          <input
            className="premium-input mb-2"
            type="text"
            placeholder="Song title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            className="premium-input mb-2"
            type="file"
            accept="audio/*"
            onChange={e => setAudio(e.target.files[0])}
          />

          <input
            className="premium-input mb-2"
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
          />

          <button
            className="premium-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Song 🎵"}
          </button>

        </form>

      </div>


      <div className="mt-5">

        <h4>Your Songs</h4>

        {songs.length === 0 && (
          <p className="text-secondary">
            No songs uploaded
          </p>
        )}


        {songs.map(song => (

          <div
            key={song._id}
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
          >

            <div className="d-flex align-items-center gap-3">

              {song.image ? (
                <img
                  src={song.image}
                  alt="cover"
                  width="50"
                  height="50"
                  style={{
                    borderRadius:"8px",
                    objectFit:"cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width:"50px",
                    height:"50px",
                    background:"#333",
                    borderRadius:"8px",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                  }}
                >
                  🎵
                </div>
              )}


              <div>
                <h6>{song.title}</h6>

                <small className="text-secondary">
                  {song.artist?.username || user?.username}
                </small>

              </div>

            </div>


            <div className="d-flex gap-3 align-items-center">

              <audio controls>
                <source src={song.uri}/>
              </audio>


              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteSong(song._id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ArtistDashboard;