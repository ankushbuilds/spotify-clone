import React, { useEffect, useState, useRef } from "react";
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
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);

  const audio = audioRef?.current;

  // ▶️ PLAY / PAUSE
  const togglePlay = async () => {
    if (!audio || !currentSong) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.log("Play error:", err);
    }
  };

  // ⏭ NEXT (SAFE WRAPPER)
  const handleNext = () => {
    setProgress(0);
    onNext?.();
  };

  // ⏮ PREV (SAFE WRAPPER)
  const handlePrev = () => {
    setProgress(0);
    onPrev?.();
  };

  // 🎡 ROTATION ANIMATION
  useEffect(() => {
    if (!isPlaying) return;

    let last = performance.now();

    const animate = (time) => {
      const delta = time - last;
      last = time;

      setRotation((r) => r + delta * 0.03);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  // 📊 PROGRESS TRACKING
  useEffect(() => {
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
  }, [audio]);

  // ⏭ AUTO NEXT ON END
  useEffect(() => {
    if (!audio) return;

    const handleEnd = () => {
      setProgress(0);
      onNext?.();
    };

    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("ended", handleEnd);
    };
  }, [audio, onNext]);

  // 🎵 LOAD NEW SONG (IMPORTANT FIX)
  useEffect(() => {
    if (!audio || !currentSong) return;

    const src = currentSong.uri || currentSong.src;
    if (!src) return;

    audio.src = src;
    audio.load();

    const playSong = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      }
    };

    playSong();
  }, [currentSong]);

  // 🎚 SEEK
  const handleSeek = (e) => {
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
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='50%' y='50%' fill='white' font-size='10' text-anchor='middle'%3ENo Img%3C/text%3E%3C/svg%3E"
          }
          alt="song"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #1db954",
            transform: `rotate(${rotation}deg)`,
          }}
        />

        <div>
          <h6 className="mb-0" style={{ fontSize: 14 }}>
            {currentSong?.title || "No song"}
          </h6>
          <small className="text-secondary">
            {currentSong?.artist?.username || "Unknown"}
          </small>
        </div>
      </div>

      {/* CENTER */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "40%" }}
      >
        <div className="d-flex align-items-center gap-3">
          <FaStepBackward
            onClick={handlePrev}
            style={{ cursor: "pointer", color: "#b3b3b3" }}
          />

          <div onClick={togglePlay} style={styles.playBtn}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </div>

          <FaStepForward
            onClick={handleNext}
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
            marginTop: 6,
            cursor: "pointer",
          }}
        />
      </div>

      {/* RIGHT */}
      <div style={{ width: "30%" }} />
    </div>
  );
};

const styles = {
  playBtn: {
    width: 42,
    height: 42,
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