"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "../content";
import Particles from "./Particles";
import { Closing, Letter, Reveal, Welcome } from "./Stages";
import VoicePlayer from "./VoicePlayer";
import SongPlayer from "./SongPlayer";
import GiftBox from "./GiftBox";

const STAGES = ["welcome", "reveal", "letter", "voice", "song", "gift", "closing"] as const;
type StageName = (typeof STAGES)[number];

export default function Experience() {
  const [stage, setStage] = useState<StageName>("welcome");
  const [round, setRound] = useState(0); // bump on replay to remount everything fresh

  // The song lives here (not inside SongPlayer) so it can keep playing through the gift + closing.
  const songEl = useRef<HTMLAudioElement>(null);
  const [songPlaying, setSongPlaying] = useState(false);
  const [songAvailable, setSongAvailable] = useState(true);
  const [volume, setVolumeState] = useState(0.7);

  // Detect a missing song file up front so the UI can show a friendly message instead of dead buttons.
  useEffect(() => {
    fetch(assets.song, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (!r.ok || !type.startsWith("audio")) setSongAvailable(false);
      })
      .catch(() => setSongAvailable(false));
  }, []);

  useEffect(() => {
    if (songEl.current) songEl.current.volume = volume;
  }, [volume]);

  const playSong = useCallback(() => {
    songEl.current?.play().catch(() => {});
  }, []);
  const pauseSong = useCallback(() => songEl.current?.pause(), []);

  const go = (s: StageName) => {
    setStage(s);
    window.scrollTo({ top: 0 });
  };

  const stageIndex = STAGES.indexOf(stage);

  const replay = () => {
    const el = songEl.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setRound((r) => r + 1);
    go("welcome");
  };

  return (
    <main className="relative min-h-dvh">
      <Particles />

      {stage !== "welcome" && (
        <nav aria-hidden className="fixed left-0 right-0 top-4 z-20 flex justify-center gap-2">
          {STAGES.slice(1).map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i + 1 <= stageIndex ? "w-6 bg-gold" : "w-1.5 bg-cream/25"
              }`}
            />
          ))}
        </nav>
      )}

      <div key={round}>
        {stage === "welcome" && <Welcome onOpen={() => go("reveal")} />}
        {stage === "reveal" && <Reveal onNext={() => go("letter")} />}
        {stage === "letter" && <Letter onNext={() => go("voice")} />}
        {stage === "voice" && (
          <VoicePlayer
            onPlay={pauseSong}
            onNext={() => {
              go("song");
              playSong(); // triggered by the user's click, and only after the voice stage is left
            }}
          />
        )}
        {stage === "song" && (
          <SongPlayer
            onNext={() => go("gift")}
            song={{
              playing: songPlaying,
              available: songAvailable,
              volume,
              toggle: () => (songEl.current?.paused ? playSong() : pauseSong()),
              replay: () => {
                if (songEl.current) songEl.current.currentTime = 0;
                playSong();
              },
              setVolume: setVolumeState,
            }}
          />
        )}
        {stage === "gift" && <GiftBox onNext={() => go("closing")} />}
        {stage === "closing" && <Closing onReplay={replay} />}
      </div>

      <audio
        ref={songEl}
        src={assets.song}
        preload="none"
        loop
        onPlay={() => setSongPlaying(true)}
        onPause={() => setSongPlaying(false)}
        onError={() => setSongAvailable(false)}
      />
    </main>
  );
}
