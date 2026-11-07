"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f3dfb8", "#d9bb8a", "#b8935a", "#fbf9f4", "#f5ecd9", "#ffffff"];

type Piece = {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; rot: number; vr: number; c: string; round: boolean;
};

// One-shot confetti burst. Fades out and stops after a few seconds.
export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const make = (fromLeft: boolean): Piece => ({
      x: fromLeft ? -10 : w + 10,
      y: h * (0.35 + Math.random() * 0.2),
      vx: (fromLeft ? 1 : -1) * (Math.random() * 9 + 5),
      vy: -(Math.random() * 12 + 6),
      w: Math.random() * 8 + 5,
      h: Math.random() * 5 + 3,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() > 0.7,
    });
    const count = w < 600 ? 55 : 90;
    const pieces: Piece[] = [
      ...Array.from({ length: count }, () => make(true)),
      ...Array.from({ length: count }, () => make(false)),
    ];

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      const fade = t > 3200 ? Math.max(0, 1 - (t - 3200) / 1200) : 1;
      for (const p of pieces) {
        p.vy += 0.22;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.h / 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      if (t < 4400) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
