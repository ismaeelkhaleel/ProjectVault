import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import styles from "./CustomVideoPlayer.module.css";

function CustomVideoPlayer({ url }) {
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);

  const skipForward = useCallback(() => {
    if (playerRef.current) {
      const newTime = Math.min(playedSeconds + 10, duration);
      playerRef.current.seekTo(newTime, "seconds");
      setPlayedSeconds(newTime);
    }
  }, [playedSeconds, duration]);

  const skipBackward = useCallback(() => {
    if (playerRef.current) {
      const newTime = Math.max(playedSeconds - 10, 0);
      playerRef.current.seekTo(newTime, "seconds");
      setPlayedSeconds(newTime);
    }
  }, [playedSeconds]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById("player-wrapper");
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const videoEnded = playedSeconds >= duration && duration > 0;

  const showControls = !playing || hover || videoEnded;

  return (
    <div
      id="player-wrapper"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          e.preventDefault();
          togglePlay();
        } else if (e.code === "ArrowRight") {
          skipForward();
        } else if (e.code === "ArrowLeft") {
          skipBackward();
        }
      }}
      className={`${styles.playerWrapper} ${
        fullscreen ? styles.playerWrapperFullscreen : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        width="100%"
        height="100%"
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
        onDuration={(dur) => setDuration(dur)}
        controls={false}
      />

     
      <div
        className={`${styles.centerControls} ${
          showControls ? styles.centerControlsVisible : ""
        }`}
      >
        <button
          onClick={skipBackward}
          className={`${styles.controlButton} ${styles.controlButtonBackwardForward}`}
          title="Back 10 seconds"
          aria-label="Back 10 seconds"
        >
          &#9664;&#9664;
        </button>

        <button
          onClick={togglePlay}
          className={`${styles.controlButton} ${styles.controlButtonPlayPause}`}
          title={playing ? "Pause" : "Play"}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? "❚❚" : "▶"}
        </button>

        <button
          onClick={skipForward}
          className={`${styles.controlButton} ${styles.controlButtonBackwardForward}`}
          title="Forward 10 seconds"
          aria-label="Forward 10 seconds"
        >
          &#9654;&#9654;
        </button>
      </div>

      
      <div className={styles.bottomRightControls}>
        <div>
          {formatTime(playedSeconds)} / {formatTime(duration)}
        </div>
        <button
          onClick={toggleFullscreen}
          className={styles.fullscreenButton}
          title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {fullscreen ? "🡼" : "⛶"}
        </button>
      </div>
    </div>
  );
}

export default CustomVideoPlayer;