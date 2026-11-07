"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { NAME, SENDER, assets, copy } from "../content";
import Confetti from "./Confetti";

export function Stage({ children }: { children: ReactNode }) {
  return (
    <section className="stage relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      {children}
    </section>
  );
}

const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Welcome({ onOpen }: { onOpen: () => void }) {
  return (
    <Stage>
      <p className="rise text-4xl" style={delay(0.2)} aria-hidden>
        ✦
      </p>
      <h1
        className="rise font-serif-display text-4xl font-medium leading-tight text-soft sm:text-6xl"
        style={delay(0.5)}
      >
        {copy.welcome.title}
      </h1>
      <p className="rise max-w-md text-base leading-relaxed text-cream/70 sm:text-lg" style={delay(1.3)}>
        {copy.welcome.sub}
      </p>
      <button className="btn-gold rise mt-2" style={delay(2)} onClick={onOpen}>
        {copy.welcome.button} 🎁
      </button>
    </Stage>
  );
}

export function Reveal({ onNext }: { onNext: () => void }) {
  return (
    <Stage>
      <Confetti />
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-10 rounded-full bg-gold/30 blur-3xl"
          style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
        />
        <div
          className="relative w-[min(72vw,340px)] overflow-hidden border border-gold/60 p-1.5 shadow-[0_30px_80px_-20px_rgba(217,187,138,0.45)]"
          style={{ borderRadius: "999px 999px 28px 28px" }}
        >
          <div
            className="relative aspect-[3/4] overflow-hidden"
            style={{
              borderRadius: "999px 999px 22px 22px",
              animation: "photo-reveal 2.2s cubic-bezier(0.22,1,0.36,1) 0.3s both",
            }}
          >
            <Image
              src={assets.photo}
              alt={NAME}
              fill
              priority
              sizes="(max-width: 640px) 72vw, 340px"
              className="object-cover"
              style={{ objectPosition: "50% 38%" }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="rise font-hand text-3xl text-gold" style={delay(1.6)}>
          {copy.reveal.eyebrow}
        </p>
        <h2
          className="rise gold-text font-serif-display text-3xl font-semibold uppercase tracking-[0.12em] sm:text-4xl"
          style={delay(2)}
        >
          {copy.reveal.headline}
        </h2>
        <p
          className="rise gold-text font-serif-display text-5xl font-semibold italic leading-tight sm:text-7xl"
          style={delay(2.3)}
        >
          {NAME}!
        </p>
        <p className="rise mt-2 max-w-md text-base leading-relaxed text-cream/75" style={delay(2.9)}>
          {copy.reveal.line}
        </p>
      </div>
      <button className="btn-ghost rise" style={delay(3.5)} onClick={onNext}>
        {copy.next} →
      </button>
    </Stage>
  );
}

export function Letter({ onNext }: { onNext: () => void }) {
  const { paragraphs, title } = copy.letter;
  return (
    <Stage>
      <p className="rise font-hand text-3xl text-gold" style={delay(0.1)}>
        {title}
      </p>
      <div className="flex flex-col gap-5 text-left font-serif-display text-xl leading-relaxed text-soft/90 sm:text-2xl">
        {paragraphs.map((p, i) => (
          <p key={i} className="rise" style={delay(0.6 + i * 0.9)}>
            {p}
          </p>
        ))}
      </div>
      {SENDER && (
        <p className="rise font-hand text-3xl text-gold" style={delay(0.6 + paragraphs.length * 0.9)}>
          With love, {SENDER}
        </p>
      )}
      <button className="btn-ghost rise" style={delay(1 + paragraphs.length * 0.9)} onClick={onNext}>
        {copy.next} →
      </button>
    </Stage>
  );
}

export function Closing({ onReplay }: { onReplay: () => void }) {
  return (
    <Stage>
      <p className="rise text-4xl" style={delay(0.1)} aria-hidden>
        🥂
      </p>
      <h2
        className="rise gold-text font-serif-display text-4xl font-semibold leading-tight sm:text-6xl"
        style={delay(0.4)}
      >
        {copy.closing.title}
      </h2>
      <p className="rise max-w-md text-lg leading-relaxed text-cream/80" style={delay(1.2)}>
        {copy.closing.sub}
      </p>
      <p className="rise font-hand text-3xl text-gold" style={delay(2)}>
        {copy.closing.made}
      </p>
      <button className="btn-gold rise" style={delay(2.6)} onClick={onReplay}>
        {copy.closing.replay}
      </button>
    </Stage>
  );
}
