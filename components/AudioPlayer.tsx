"use client";

import { useRef, useState, useEffect } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.08;
    audio.muted = true;
    audio.loop = true;
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.muted = false;
      setMuted(false);
      if (!playing) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <>
      {/* The audio element — drone tone */}
      <audio ref={audioRef} preload="none" loop muted>
        <source src="/audio/drone.mp3" type="audio/mpeg" />
      </audio>

      {/* Unmute button */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 label text-[#EFE4CF]/50 hover:text-[#EFE4CF]/90 transition-colors duration-300"
        aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
      >
        {muted ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>Sound</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span>Sound</span>
          </>
        )}
      </button>
    </>
  );
}
