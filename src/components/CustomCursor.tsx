"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);

  const mouse  = useRef({ x: -300, y: -300 });
  const lerped = useRef({ x: -300, y: -300 });
  const rafId  = useRef(0);
  const isHovered = useRef(false);
  const isClicked = useRef(false);

  useEffect(() => {
    // Skip entirely on touch/mobile devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    /* ── Trail particles ─────────────────────────────────────── */
    const TRAIL_COUNT = 6;
    const trail = trailRef.current;
    trail.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = String((1 - i / TRAIL_COUNT) * 0.25);
      el.style.transform = "translate(-300px,-300px) translate(-50%,-50%)";
    });

    const trailPositions = Array.from({ length: TRAIL_COUNT }, () => ({
      x: -300,
      y: -300,
    }));

    /* ── Mouse events ────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onDown = () => {
      isClicked.current = true;
      if (dotRef.current) dotRef.current.style.transform += " scale(0.6)";
      if (ringRef.current) ringRef.current.style.transform += " scale(0.85)";
    };
    const onUp = () => {
      isClicked.current = false;
    };

    /* ── Hover detection ─────────────────────────────────────── */
    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

    const onEnter = () => { isHovered.current = true; };
    const onLeave = () => { isHovered.current = false; };

    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    /* ── Animation loop ──────────────────────────────────────── */
    // Faster lerp = 0.22 (was 0.12 before)
    const LERP_RING  = 0.22;
    const LERP_GLOW  = 0.10;
    const glowPos = { x: -300, y: -300 };

    let frame = 0;

    const tick = () => {
      frame++;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      /* dot — instant */
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mx}px,${my}px) translate(-50%,-50%) scale(${isClicked.current ? 0.55 : 1})`;
      }

      /* ring — fast lerp */
      lerped.current.x += (mx - lerped.current.x) * LERP_RING;
      lerped.current.y += (my - lerped.current.y) * LERP_RING;

      const rx = lerped.current.x;
      const ry = lerped.current.y;
      const size = isHovered.current ? 52 : 36;
      const borderW = isHovered.current ? "1.5px" : "1.5px";
      const ringScale = isClicked.current ? 0.85 : 1;

      if (ringRef.current) {
        ringRef.current.style.transform  = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${ringScale})`;
        ringRef.current.style.width      = `${size}px`;
        ringRef.current.style.height     = `${size}px`;
        ringRef.current.style.borderWidth = borderW;
        ringRef.current.style.boxShadow  = isHovered.current
          ? `0 0 12px 2px var(--c-primary), inset 0 0 8px rgba(255,255,255,0.08)`
          : `0 0 6px 0px var(--c-primary)`;
        ringRef.current.style.opacity    = isHovered.current ? "0.9" : "0.6";
        ringRef.current.style.background = isHovered.current
          ? "radial-gradient(circle, color-mix(in srgb, var(--c-primary) 18%, transparent), transparent)"
          : "transparent";
      }

      /* glow — slowest lerp for dreamy trail */
      glowPos.x += (mx - glowPos.x) * LERP_GLOW;
      glowPos.y += (my - glowPos.y) * LERP_GLOW;

      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(${glowPos.x}px,${glowPos.y}px) translate(-50%,-50%)`;
      }

      /* trail every 2 frames */
      if (frame % 2 === 0) {
        trailPositions.unshift({ x: mx, y: my });
        trailPositions.pop();
        trailPositions.forEach((pos, i) => {
          const el = trail[i];
          if (!el) return;
          const frac = 1 - i / TRAIL_COUNT;
          const s = frac * 5;
          el.style.transform = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;
          el.style.width  = `${s}px`;
          el.style.height = `${s}px`;
          el.style.opacity = String(frac * 0.35);
        });
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      observer.disconnect();
    };
  }, []);

  // SSR / touch guard — don't even render on mobile
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const BASE: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 99999,
    borderRadius: "50%",
    willChange: "transform",
  };

  return (
    <>
      {/* ── Outer soft glow (slowest) ── */}
      <div
        ref={glowRef}
        style={{
          ...BASE,
          width: "80px",
          height: "80px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--c-primary) 22%, transparent) 0%, transparent 70%)",
          filter: "blur(8px)",
          opacity: 0.5,
          transition: "opacity 0.3s",
          zIndex: 99996,
        }}
      />

      {/* ── Trail dots ── */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRef.current[i] = el; }}
          style={{
            ...BASE,
            width: "5px",
            height: "5px",
            background: "var(--c-primary)",
            zIndex: 99997,
            transition: "opacity 0.1s",
          }}
        />
      ))}

      {/* ── Ring (fast lerp) ── */}
      <div
        ref={ringRef}
        style={{
          ...BASE,
          width: "36px",
          height: "36px",
          border: "1.5px solid var(--c-primary)",
          opacity: 0.6,
          zIndex: 99998,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s, background 0.2s, box-shadow 0.2s",
        }}
      />

      {/* ── Center dot (instant) ── */}
      <div
        ref={dotRef}
        style={{
          ...BASE,
          width: "7px",
          height: "7px",
          background: "var(--c-primary)",
          boxShadow: "0 0 6px 2px var(--c-primary)",
          transition: "transform 0.05s, box-shadow 0.15s",
          zIndex: 99999,
        }}
      />
    </>
  );
}
