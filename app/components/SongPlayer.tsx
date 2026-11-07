"use client";

import { copy } from "../content";
import { Stage } from "./Stages";
import { PlayIcon } from "./VoicePlayer";

export type Song = {
  playing: boolean;
  available: boolean;
  volume: number;
  toggle: () => void;
  replay: () => void;
  setVolume: (v: number) => void;
};

export default function SongPlayer({ song, onNext }: { song: Song; onNext: () => void }) {
  return (
    <Stage>
      <div className="rise relative grid h-24 w-24 place-items-center" aria-hidden>
        <span
          className="absolute inset-0 rounded-full border border-gold/50"
          style={{ animation: song.playing ? "glow-pulse 2.4s ease-in-out infinite" : undefined }}
        />
        <span
          className="absolute inset-3 rounded-full border border-gold/30"
          style={{ animation: song.playing ? "glow-pulse 2.4s ease-in-out 0.4s infinite" : undefined }}
        />
        <span className="relative text-4xl">🎶</span>
      </div>

      <h2 className="rise font-serif-display text-3xl font-medium italic leading-tight text-soft sm:text-4xl" style={{ animationDelay: "0.3s" }}>
        {copy.song.title}
      </h2>

      <div className="rise flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-gold/25 bg-white/[0.03] p-6 backdrop-blur" style={{ animationDelay: "0.7s" }}>
        {song.available ? (
          <>
            <div className="flex items-center gap-3">
              <button className="btn-gold" onClick={song.toggle} aria-label={song.playing ? "Pause song" : "Play song"}>
                <PlayIcon playing={song.playing} />
                {song.playing ? "Pause" : "Play"}
              </button>
              <button className="btn-ghost" onClick={song.replay} aria-label="Replay song">
                ↺ Replay
              </button>
            </div>
            <label className="flex w-full items-center gap-3 text-xs text-cream/60">
              <span aria-hidden>🔈</span>
              <input
                type="range"
                aria-label="Volume"
                min={0}
                max={1}
                step={0.01}
                value={song.volume}
                onChange={(e) => song.setVolume(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer accent-[#d9bb8a]"
              />
              <span aria-hidden>🔊</span>
            </label>
          </>
        ) : (
          <p className="font-hand text-2xl text-gold">{copy.song.missing}</p>
        )}
      </div>

      <button className="btn-ghost rise" style={{ animationDelay: "1.2s" }} onClick={onNext}>
        {copy.next} →
      </button>
    </Stage>
  );
}
