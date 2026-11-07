"use client";

import { useState } from "react";
import Particles from "./Particles";
import { Closing, Letter, Reveal, Welcome } from "./Stages";
import VoicePlayer from "./VoicePlayer";
import GiftBox from "./GiftBox";

const STAGES = ["welcome", "reveal", "letter", "voice", "gift", "closing"] as const;
type StageName = (typeof STAGES)[number];

export default function Experience() {
  const [stage, setStage] = useState<StageName>("welcome");
  const [round, setRound] = useState(0); // bump on replay to remount everything fresh

  const go = (s: StageName) => {
    setStage(s);
    window.scrollTo({ top: 0 });
  };

  const stageIndex = STAGES.indexOf(stage);

  const replay = () => {
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
          <VoicePlayer onNext={() => go("gift")} />
        )}
        {stage === "gift" && <GiftBox onNext={() => go("closing")} />}
        {stage === "closing" && <Closing onReplay={replay} />}
      </div>

    </main>
  );
}
