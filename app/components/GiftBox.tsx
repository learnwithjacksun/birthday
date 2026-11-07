"use client";

import { useState } from "react";
import { copy } from "../content";
import { Stage } from "./Stages";

const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: 10 + ((i * 53) % 80),
  delay: (i % 7) * 0.18,
  dur: 2.6 + ((i * 7) % 5) * 0.3,
  r: ((i * 37) % 50) - 25,
  glyph: i % 3 === 0 ? "✨" : i % 3 === 1 ? "💛" : "🤍",
}));

export default function GiftBox({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Stage>
      <p className="rise font-hand text-3xl text-gold" style={{ animationDelay: "0.1s" }}>
        {copy.gift.eyebrow}
      </p>
      <h2 className="rise font-serif-display text-4xl font-medium text-soft sm:text-5xl" style={{ animationDelay: "0.5s" }}>
        {copy.gift.title}
      </h2>

      <div className="relative flex h-60 w-full items-end justify-center">
        <button
          onClick={() => setOpen(true)}
          disabled={open}
          aria-label="Open the gift"
          className="rise relative h-44 w-44 cursor-pointer disabled:cursor-default"
          style={{ animationDelay: "0.9s" }}
        >
          <span
            className="absolute inset-0 block"
            style={{ animation: open ? undefined : "wobble 2.8s ease-in-out 1.8s infinite" }}
          >
            {/* body */}
            <span className="absolute bottom-0 left-1/2 block h-28 w-36 -translate-x-1/2 rounded-b-xl bg-gradient-to-b from-gold to-gold-deep shadow-[0_20px_50px_-10px_rgba(217,187,138,0.5)]">
              <span className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-cream/90" />
            </span>
            {/* lid */}
            <span
              className="absolute bottom-[6.6rem] left-1/2 block h-9 w-44 -translate-x-1/2 rounded-md bg-gradient-to-b from-[#f3dfb8] to-gold"
              style={{
                transformOrigin: "left bottom",
                animation: open ? "lid-open 0.9s cubic-bezier(0.22,1,0.36,1) forwards" : undefined,
              }}
            >
              <span className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-cream/90" />
              <span className="absolute -top-5 left-1/2 flex -translate-x-1/2 gap-0.5" aria-hidden>
                <span className="block h-7 w-9 -rotate-[25deg] rounded-full border-4 border-cream/90" />
                <span className="block h-7 w-9 rotate-[25deg] rounded-full border-4 border-cream/90" />
              </span>
            </span>
          </span>
        </button>

        {open && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {HEARTS.map((h, i) => (
              <span
                key={i}
                className="absolute bottom-16 text-2xl opacity-0"
                style={{
                  left: `${h.left}%`,
                  ["--r" as string]: `${h.r}deg`,
                  animation: `float-up ${h.dur}s ease-out ${h.delay}s infinite`,
                }}
              >
                {h.glyph}
              </span>
            ))}
          </div>
        )}
      </div>

      {!open ? (
        <p className="rise font-hand text-2xl text-cream/60" style={{ animationDelay: "1.4s" }}>
          {copy.gift.hint}
        </p>
      ) : (
        <>
          <p className="rise font-serif-display text-xl italic leading-relaxed text-soft/90 sm:text-2xl" style={{ animationDelay: "0.7s" }}>
            {copy.gift.wish}
          </p>
          <button className="btn-ghost rise" style={{ animationDelay: "1.8s" }} onClick={onNext}>
            {copy.next} →
          </button>
        </>
      )}
    </Stage>
  );
}
