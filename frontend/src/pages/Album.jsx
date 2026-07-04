import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/axiosClient";

const Album = ({ audioRef, setCurrentSong, setIsPlaying }) => {
    const { id } = useParams();

    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        setLoading(true);
        setError("");
        setAlbum(null);

        apiClient
            .get(`/music/albums/${id}`)
            .then((res) => {
                if (!isMounted) return;

                console.log("ALBUM DATA:", res.data.album);
                setAlbum(res.data.album);
            })
            .catch((err) => {
                if (!isMounted) return;

                console.log(err);
                setError("Failed to load album");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const playSong = (song) => {
        const audio = audioRef?.current;

        if (!audio) return console.log("Audio ref not found");
        if (!song?.uri) return console.log("Invalid song URL");

        try {
            audio.pause();
            audio.src = song.uri;
            audio.load();

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setCurrentSong(song);
                        setIsPlaying(true);
                    })
                    .catch((err) => {
                        console.log("Play error:", err);
                    });
            }
        } catch (err) {
            console.log("Audio error:", err);
        }
    };

    if (loading) {
        return <p className="text-white">Loading album...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!album) {
        return <p className="text-white">No album found</p>;
    }

    return (
        <div className="text-white">

            <h2>{album.title}</h2>

            <p style={{ color: "#aaa" }}>
                {album.artist?.username}
            </p>

            <div className="row mt-4">
                {album.musics?.length > 0 ? (
                    album.musics.map((song, index) => (
                        <div className="col-md-3 mb-3" key={song._id || index}>
                            <div className="card bg-dark text-white p-3">

                                <h5>{song.title}</h5>

                                <button
                                    className="btn btn-success btn-sm mt-2"
                                    onClick={() => playSong(song)}
                                >
                                    Play
                                </button>

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No songs in this album</p>
                )}
            </div>

        </div>
    );
};

export default Album;