"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "../content";
import Confetti from "./Confetti";
import { Stage } from "./Stages";

export default function Candle({ onNext }: { onNext: () => void }) {
  const [out, setOut] = useState(false);
  const [listening, setListening] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const stopMic = useRef<(() => void) | null>(null);

  const blowOut = useCallback(() => {
    stopMic.current?.();
    setListening(false);
    setOut(true);
  }, []);

  useEffect(() => () => stopMic.current?.(), []);

  const listen = async () => {
    if (listening || out) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      let loudSince = 0;
      let raf = 0;
      const tick = (now: number) => {
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.12) {
          loudSince ||= now;
          if (now - loudSince > 250) return blowOut();
        } else loudSince = 0;
        raf = requestAnimationFrame(tick);
      };
      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
        stopMic.current = null;
      };
      setListening(true);
      raf = requestAnimationFrame(tick);
    } catch {
      setMicDenied(true);
    }
  };

  return (
    <Stage>
      {out && <Confetti />}
      <p className="rise font-hand text-3xl text-gold" style={{ animationDelay: "0.1s" }}>
        {out ? copy.wish.doneEyebrow : copy.wish.eyebrow}
      </p>
      <h2 className="rise font-serif-display text-3xl font-medium leading-tight text-soft sm:text-5xl" style={{ animationDelay: "0.5s" }}>
        {out ? copy.wish.doneTitle : copy.wish.title}
      </h2>

      <button
        onClick={blowOut}
        disabled={out}
        aria-label="Blow out the candle"
        className="rise relative flex h-64 w-48 cursor-pointer flex-col items-center justify-end disabled:cursor-default"
        style={{ animationDelay: "0.9s" }}
      >
        {/* glow */}
        <span
          aria-hidden
          className="absolute top-2 h-40 w-40 rounded-full bg-gold/30 blur-3xl transition-opacity duration-1000"
          style={{ opacity: out ? 0 : 1, animation: out ? undefined : "glow-pulse 2.5s ease-in-out infinite" }}
        />
        {/* flame / smoke */}
        <span className="relative mb-1 flex h-14 w-10 items-end justify-center" aria-hidden>
          {!out ? (
            <span
              className="block h-12 w-6 origin-bottom rounded-[50%_50%_50%_50%/65%_65%_35%_35%] bg-gradient-to-t from-[#ff9d2e] via-[#ffd277] to-[#fff6d6] shadow-[0_0_30px_8px_rgba(255,190,90,0.6)]"
              style={{ animation: "flicker 0.18s ease-in-out infinite alternate" }}
            />
          ) : (
            [0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute bottom-0 block h-8 w-2 rounded-full bg-cream/40 blur-[3px]"
                style={{
                  ["--r" as string]: `${(i - 1) * 18}deg`,
                  left: `${30 + i * 18}%`,
                  animation: `float-up 2.2s ease-out ${i * 0.2}s forwards`,
                }}
              />
            ))
          )}
        </span>
        {/* wick + candle */}
        <span className="block h-3 w-0.5 bg-cream/70" aria-hidden />
        <span className="block h-20 w-5 rounded-t-sm bg-gradient-to-r from-cream via-soft to-[#e3d3b0]" aria-hidden />
        {/* cake */}
        <span className="relative block h-16 w-48 rounded-xl bg-gradient-to-b from-gold to-gold-deep shadow-[0_20px_50px_-10px_rgba(217,187,138,0.45)]" aria-hidden>
          <span className="absolute inset-x-0 top-0 h-5 rounded-t-xl bg-cream/90" />
          <span className="absolute inset-x-4 bottom-4 h-1 rounded-full bg-cream/40" />
        </span>
      </button>

      {!out ? (
        <div className="rise flex flex-col items-center gap-3" style={{ animationDelay: "1.3s" }}>
          <p className="max-w-sm text-base leading-relaxed text-cream/70">{copy.wish.hint}</p>
          <button className="btn-ghost" onClick={listen} disabled={listening}>
            {listening ? copy.wish.listening : copy.wish.mic}
          </button>
          {micDenied && <p className="text-sm text-cream/50">{copy.wish.micDenied}</p>}
        </div>
      ) : (
        <>
          <p className="rise font-serif-display text-xl italic text-soft/90 sm:text-2xl" style={{ animationDelay: "0.6s" }}>
            {copy.wish.doneLine}
          </p>
          <button className="btn-ghost rise" style={{ animationDelay: "1.6s" }} onClick={onNext}>
            {copy.next} →
          </button>
        </>
      )}
    </Stage>
  );
}
