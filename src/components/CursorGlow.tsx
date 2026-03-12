"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const GLOW_SIZE = 40;
const DOT_SIZE  = 5;

export function CursorGlow() {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  const springCfg = { damping: 26, stiffness: 400, mass: 0.4 };
  const smoothX   = useSpring(rawX, springCfg);
  const smoothY   = useSpring(rawY, springCfg);

  // Centered positions
  const glowX = useTransform(smoothX, (v) => v - GLOW_SIZE / 2);
  const glowY = useTransform(smoothY, (v) => v - GLOW_SIZE / 2);
  const dotX  = useTransform(smoothX, (v) => v - DOT_SIZE  / 2);
  const dotY  = useTransform(smoothY, (v) => v - DOT_SIZE  / 2);

  useEffect(() => {
    setMounted(true);

    // Hide system cursor on non-input elements
    document.body.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.id = "__cursor-glow__";
    styleEl.textContent = [
      "input, textarea, select, [contenteditable] { cursor: auto !important; }",
      "[data-radix-select-trigger], [role='combobox'] { cursor: pointer !important; }",
    ].join("\n");
    document.head.appendChild(styleEl);

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsHovering(
        !!el.closest('button, a, [role="button"], label, [role="tab"]')
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      document.body.style.cursor = "";
      document.getElementById("__cursor-glow__")?.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [rawX, rawY]);

  if (!mounted) return null;

  return (
    <>
      {/* Soft glow blob — GPU-accelerated via scale */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full"
        style={{
          top: 0,
          left: 0,
          x: glowX,
          y: glowY,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          filter: "blur(10px)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.75) 0%, rgba(168,85,247,0.45) 50%, transparent 70%)",
        }}
        animate={{
          scale:   isHovering ? 2.2 : 1,
          opacity: isHovering ? 0.65 : 0.35,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />

      {/* Sharp cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-indigo-400 dark:bg-indigo-300"
        style={{
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          width: DOT_SIZE,
          height: DOT_SIZE,
        }}
        animate={{
          scale:   isHovering ? 1.8 : 1,
          opacity: isHovering ? 1 : 0.85,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
