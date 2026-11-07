"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { assets } from "../content";

export type MusicControls = {
  /** Start the music. Call from a click handler (browsers block autoplay). */
  start: () => void;
  /** Stop and rewind (used on replay). */
  reset: () => void;
  /** Pause for the voice message (remembers whether it was playing). */
  duck: () => void;
  /** Resume after the voice message, only if it was playing before. */
  unduck: () => void;
};

const VOLUME = 0.35;

export default function BackgroundMusic({
  controlsRef,
  visible,
}: {
  controlsRef: Ref<MusicControls>;
  visible: boolean;
}) {
  const el = useRef<HTMLAudioElement>(null);
  const wasPlaying = useRef(false);
  const ducked = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (el.current) el.current.volume = VOLUME;
  }, []);

  useImperativeHandle(controlsRef, () => ({
    start: () => {
      ducked.current = false;
      el.current?.play().catch(() => {});
    },
    reset: () => {
      ducked.current = false;
      wasPlaying.current = false;
      if (el.current) {
        el.current.pause();
        el.current.currentTime = 0;
      }
    },
    duck: () => {
      if (ducked.current || !el.current) return;
      ducked.current = true;
      wasPlaying.current = !el.current.paused;
      el.current.pause();
    },
    unduck: () => {
      if (!ducked.current) return;
      ducked.current = false;
      if (wasPlaying.current) el.current?.play().catch(() => {});
    },
  }));

  return (
    <>
      <audio ref={el} src={assets.music} loop preload="auto" muted={muted} />
      {visible && (
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ink/80 text-lg backdrop-blur transition hover:border-gold"
        >
          {muted ? "🔇" : "🎵"}
        </button>
      )}
    </>
  );
}
