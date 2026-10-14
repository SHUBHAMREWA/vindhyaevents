"use client";

import { useEffect, useRef } from "react";

const PINK = "#FF3CAC";
const PURPLE = "#784BA0";
const ORANGE = "#FF8C00";
const COLORS = [PINK, PURPLE, ORANGE];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // Ignore on touch screens

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const mouse = { x: -300, y: -300 };
    const particles: Particle[] = [];
    let lastSpawn = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const now = performance.now();
      if (now - lastSpawn < 30) return;
      lastSpawn = now;

      // Spawn subtle particles trailing behind the mouse
      for (let i = 0; i < 2; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 10,
          y: mouse.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2.5,
          vy: Math.random() * 2 + 0.8,
          rx: Math.random() * 4 + 3,
          ry: Math.random() * 5 + 4,
          color,
          alpha: 0.8,
          decay: 0.02,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    // Animation Loop for floating particle sparkles
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rx, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
}
