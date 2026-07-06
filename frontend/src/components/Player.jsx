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

  // ▶️ PLAY / PAUSE TOGGLE
  const togglePlay = async () => {
    const audio = audioRef?.current;
    if (!audio || !currentSong) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Play error:", err);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // 📊 LIVE PROGRESS UPDATE
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  // ⏭️ AUTO NEXT SONG
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleEnd = () => {
      onNext?.();
    };

    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("ended", handleEnd);
    };
  }, [onNext, audioRef]);

  // 🎵 LOAD NEW SONG (FIXED + SAFE PLAY)
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio || !currentSong) return;

    const src = currentSong.uri || currentSong.src || "";
    if (!src) return;

    audio.src = src;
    audio.load();

    const playSong = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Auto play error:", err);
        setIsPlaying(false);
      }
    };

    playSong();
  }, [currentSong, audioRef, setIsPlaying]);

  // 🎚️ SEEK BAR
  const handleSeek = (e) => {
    const audio = audioRef?.current;
    if (!audio || !audio.duration) return;

    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

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
          src={
            currentSong?.image ||
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='%23fff' font-size='10' font-family='Arial' text-anchor='middle' dy='.3em'%3ENo Img%3C/text%3E%3C/svg%3E"
          }
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
  {currentSong?.artist?.username || "Unknown Artist"}
</small>
        </div>
      </div>

      {/* CENTER CONTROLS */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "40%" }}
      >
        <div className="d-flex align-items-center gap-3">
          <FaStepBackward
            onClick={onPrev}
            style={{ cursor: "pointer", color: "#b3b3b3" }}
          />

          <div onClick={togglePlay} style={styles.playBtn}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </div>

          <FaStepForward
            onClick={onNext}
            style={{ cursor: "pointer", color: "#b3b3b3" }}
          />
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

      {/* RIGHT (EMPTY FOR NOW) */}
      <div style={{ width: "30%" }} />
    </div>
  );
};

const styles = {
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