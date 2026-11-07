"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; vy: number; vx: number; tw: number; ph: number };

// Soft twinkling stars + drifting gold dust, drawn on one fixed canvas.
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 14000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        vy: -(Math.random() * 0.12 + 0.02),
        vx: (Math.random() - 0.5) * 0.06,
        tw: Math.random() * 0.02 + 0.006,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.ph += d.tw;
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -4) d.y = h + 4;
        if (d.x < -4) d.x = w + 4;
        if (d.x > w + 4) d.x = -4;
        const a = 0.25 + 0.55 * Math.abs(Math.sin(d.ph));
        ctx.beginPath();
        ctx.fillStyle = `rgba(233, 205, 156, ${a})`;
        ctx.shadowColor = "rgba(233, 205, 156, 0.8)";
        ctx.shadowBlur = d.r * 4;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
