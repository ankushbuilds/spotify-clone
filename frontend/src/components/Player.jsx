import React, { useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  onNext,
  onPrev,
}) => {
  const [progress, setProgress] = useState(0);

  // ✅ SAFE PLAY / PAUSE
  const togglePlay = () => {
    if (!currentSong || !audioRef?.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // ✅ LIVE PROGRESS UPDATE (SAFE)
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent =
        (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  // ✅ SEEK
  const handleSeek = (e) => {
    const audio = audioRef?.current;
    if (!audio || !audio.duration) return;

    const value = e.target.value;
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  // ✅ AUTO NEXT
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    audio.onended = () => {
      onNext?.();
    };
  }, [onNext, audioRef]);

  // ✅ AUTO PLAY ON SONG CHANGE
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.src;
    audio.play();
    setIsPlaying(true);
  }, [currentSong]);

  return (
    <div
      className="d-flex align-items-center justify-content-between px-4 text-white"
      style={{
        height: "85px",
        background: "#121212",
        borderTop: "1px solid #222",
      }}
    >
      {/* LEFT */}
      <div className="d-flex align-items-center gap-3" style={{ width: "30%" }}>
        <img
          src={currentSong?.image || "https://via.placeholder.com/60"}
          alt="song"
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "6px",
            objectFit: "cover",
          }}
        />

        <div>
          <h6 className="mb-0" style={{ fontSize: "14px" }}>
            {currentSong?.title || "No song playing"}
          </h6>
          <small className="text-secondary">
            {currentSong?.artist || "-"}
          </small>
        </div>
      </div>

      {/* CENTER */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "40%" }}
      >
        <div className="d-flex align-items-center gap-3">
          <FaStepBackward onClick={onPrev} style={styles.icon} />

          <div onClick={togglePlay} style={styles.playBtn}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </div>

          <FaStepForward onClick={onNext} style={styles.icon} />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          style={{
            width: "75%",
            accentColor: "#1db954",
            cursor: "pointer",
            marginTop: "6px",
          }}
        />
      </div>

      {/* RIGHT */}
      <div style={{ width: "30%" }} />
    </div>
  );
};

const styles = {
  icon: {
    cursor: "pointer",
    color: "#b3b3b3",
  },
  playBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#1db954",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "black",
  },
};

export default Player;