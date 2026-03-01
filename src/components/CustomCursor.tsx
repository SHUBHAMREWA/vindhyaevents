"use client";

import { useEffect, useRef } from "react";

const PINK   = "#FF3CAC";
const PURPLE = "#784BA0";
const ORANGE = "#FF8C00";
const COLORS = [PINK, PURPLE, ORANGE];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  rx: number; ry: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
}

export default function CustomCursor() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const isPointerRef = useRef(false); // true when hovering interactive element

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Track hover over interactive elements ───────────── */
    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

    const onEnter = () => { isPointerRef.current = true;  };
    const onLeave = () => { isPointerRef.current = false; };

    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachHover();
    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    /* ── Mouse + particles ───────────────────────────────── */
    const mouse     = { x: -300, y: -300 };
    const particles: Particle[] = [];
    let lastSpawn   = 0;
    let rafId       = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const now = performance.now();
      if (now - lastSpawn < 25) return;
      lastSpawn = now;

      for (let i = 0; i < 4; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const big   = Math.random() > 0.55;
        particles.push({
          x:        mouse.x + (Math.random() - 0.5) * 14,
          y:        mouse.y + (Math.random() - 0.5) * 14,
          vx:       (Math.random() - 0.5) * 5,
          vy:       Math.random() * 3 + 1.5,
          rx:       big ? Math.random() * 7 + 6  : Math.random() * 4 + 3,
          ry:       big ? Math.random() * 9 + 11 : Math.random() * 5 + 4,
          color,
          alpha:    0.9 + Math.random() * 0.1,
          decay:    Math.random() * 0.018 + 0.012,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    };

    document.addEventListener("mousemove", onMove);
    document.documentElement.style.cursor = "none";

    /* ── Draw arrow cursor (default) ────────────────────── */
    const drawArrow = (x: number, y: number) => {
      // 3 overlapping vertical ellipses → paint arrow
      const blobs = [
        { dx:  7, dy:  8, rx: 7,  ry: 18, rot:  0.35, color: ORANGE },
        { dx: -5, dy:  6, rx: 7,  ry: 19, rot: -0.25, color: PURPLE },
        { dx:  1, dy:  0, rx: 8,  ry: 22, rot:  0.05, color: PINK   },
      ];
      blobs.forEach(b => {
        ctx.save();
        ctx.translate(x + b.dx, y + b.dy);
        ctx.rotate(b.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle   = b.color;
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = b.color;
        ctx.shadowBlur  = 8;
        ctx.fill();
        ctx.restore();
      });
      // White tip highlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + 2, y - 14, 3, 0, Math.PI * 2);
      ctx.fillStyle   = "rgba(255,255,255,0.6)";
      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
      ctx.fill();
      ctx.restore();
    };

    /* ── Draw pointer / finger cursor (on hover) ─────────── */
    const drawPointer = (x: number, y: number) => {
      // Blobs rotated ~60-70° to look like a pointing finger / 👆
      // Slightly larger scale to indicate "active" state
      const blobs = [
        // orange — back, rotated most
        { dx:  9, dy:  6, rx: 7,  ry: 19, rot: 1.15, color: ORANGE },
        // purple — middle
        { dx: -2, dy:  4, rx: 7,  ry: 20, rot: 0.85, color: PURPLE },
        // pink — front pointer tip
        { dx:  3, dy: -1, rx: 9,  ry: 22, rot: 0.95, color: PINK   },
      ];
      blobs.forEach(b => {
        ctx.save();
        ctx.translate(x + b.dx, y + b.dy);
        ctx.rotate(b.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle   = b.color;
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = b.color;
        ctx.shadowBlur  = 12;  // stronger glow on hover
        ctx.fill();
        ctx.restore();
      });
      // White knuckle highlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + 10, y + 2, 3.5, 0, Math.PI * 2);
      ctx.fillStyle   = "rgba(255,255,255,0.65)";
      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
      ctx.fill();
      ctx.restore();
    };

    /* ── Animation loop ──────────────────────────────────── */
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.18;
        p.vx *= 0.97;
        p.alpha    -= p.decay;
        p.rotation += 0.04;

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 8;
        ctx.fill();
        ctx.restore();
      }

      // Cursor
      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;

      if (isPointerRef.current) {
        drawPointer(mouse.x, mouse.y);
      } else {
        drawArrow(mouse.x, mouse.y);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.documentElement.style.cursor = "";
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        99999,
      }}
    />
  );
}
