"use client";

import { useEffect, useRef, useState } from "react";
import { assets, copy } from "../content";
import { Stage } from "./Stages";

const BARS = 36;

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

export default function VoicePlayer({
  onPlay,
  onNext,
}: {
  onPlay: () => void;
  onNext: () => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const raf = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [heard, setHeard] = useState(false);
  const [error, setError] = useState(false);
  const [fallbackWave, setFallbackWave] = useState(false);

  // Real audio-driven soundwave
  useEffect(() => {
    if (!playing || fallbackWave) return;
    const an = analyser.current;
    if (!an) return;
    const data = new Uint8Array(an.frequencyBinCount);
    const loop = () => {
      an.getByteFrequencyData(data);
      // voice lives in the low-mid bins
      const usable = Math.floor(data.length * 0.55);
      for (let i = 0; i < BARS; i++) {
        const v = data[Math.floor((i / BARS) * usable)] / 255;
        const el = bars.current[i];
        if (el) el.style.transform = `scaleY(${Math.max(0.08, v ** 1.2).toFixed(3)})`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, fallbackWave]);

  // Flatten bars when paused
  useEffect(() => {
    if (playing) return;
    bars.current.forEach((el) => el && (el.style.transform = "scaleY(0.08)"));
  }, [playing]);

  useEffect(() => {
    const el = audio.current;
    return () => {
      cancelAnimationFrame(raf.current);
      el?.pause();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const setupAnalyser = () => {
    if (analyser.current || fallbackWave || !audio.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audio.current);
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.75;
      src.connect(an);
      an.connect(ctx.destination);
      ctxRef.current = ctx;
      analyser.current = an;
    } catch {
      setFallbackWave(true);
    }
  };

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      onPlay();
      setupAnalyser();
      try {
        await ctxRef.current?.resume();
        await el.play();
      } catch {
        setError(true);
      }
    } else {
      el.pause();
    }
  };

  const label = playing ? copy.voice.pause : heard ? copy.voice.replay : copy.voice.button;

  return (
    <Stage>
      <div className="rise relative grid h-20 w-20 place-items-center rounded-full border border-gold/50 text-gold">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
          style={{ animation: playing ? "glow-pulse 2s ease-in-out infinite" : undefined }}
        />
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="relative">
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
      </div>

      <h2 className="rise font-serif-display text-3xl font-medium leading-tight text-soft sm:text-5xl" style={{ animationDelay: "0.3s" }}>
        {copy.voice.title}
      </h2>

      <div className="rise flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-gold/25 bg-white/[0.03] p-6 backdrop-blur" style={{ animationDelay: "0.7s" }}>
        <div className="flex h-16 w-full items-center justify-center gap-[3px]" aria-hidden>
          {Array.from({ length: BARS }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                bars.current[i] = el;
              }}
              className="h-full w-[3px] origin-center rounded-full bg-gradient-to-t from-gold-deep to-gold"
              style={{
                transform: "scaleY(0.08)",
                transition: "transform 80ms linear",
                ...(fallbackWave && playing
                  ? { animation: `bar-idle ${0.7 + ((i * 37) % 7) / 10}s ease-in-out ${(i % 6) * 0.07}s infinite` }
                  : {}),
              }}
            />
          ))}
        </div>

        <div className="flex w-full items-center gap-3 text-xs tabular-nums text-cream/60">
          <span className="w-9 text-right">{fmt(time)}</span>
          <input
            type="range"
            aria-label="Seek"
            min={0}
            max={dur || 1}
            step={0.1}
            value={Math.min(time, dur || 1)}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (audio.current) audio.current.currentTime = v;
              setTime(v);
            }}
            className="h-1 flex-1 cursor-pointer accent-[#d9bb8a]"
          />
          <span className="w-9">{fmt(dur)}</span>
        </div>

        <button className="btn-gold" onClick={toggle} aria-label={label}>
          <PlayIcon playing={playing} />
          {label}
        </button>
        {error && <p className="text-sm text-cream/60">Couldn&apos;t load the recording. Try again in a moment.</p>}
      </div>

      <audio
        ref={audio}
        src={assets.voice}
        preload="metadata"
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onDurationChange={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setHeard(true);
        }}
        onError={() => setError(true)}
      />

      <button className="btn-ghost rise" style={{ animationDelay: "1.2s" }} onClick={onNext}>
        {copy.next} →
      </button>
    </Stage>
  );
}
