import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/music/albums").then((res) => {
      setAlbums(res.data.albums);
    });
  }, []);

  return (
    <div className="text-white">
      <h2>📚 Your Library</h2>

      <div className="row mt-3">
        {albums.map((album) => (
          <div
            key={album._id}
            className="col-md-3 mb-3"
            onClick={() => navigate(`/album/${album._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card bg-dark text-white p-3">
              <h5>{album.title}</h5>
              <p style={{ color: "#aaa" }}>
                {album.artist?.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;