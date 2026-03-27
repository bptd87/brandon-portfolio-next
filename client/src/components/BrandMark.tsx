"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

type Dot = {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
};

const GRID_RADIUS = 7;
const GRID_STEP = 6.15;
const CENTER = 64;

const dots: Dot[] = [];

for (let row = -GRID_RADIUS; row <= GRID_RADIUS; row += 1) {
  for (let col = -GRID_RADIUS; col <= GRID_RADIUS; col += 1) {
    const distance = Math.hypot(col, row);
    const normalized = Math.max(0, 1 - distance / (GRID_RADIUS + 0.4));

    if (normalized <= 0) continue;

    dots.push({
      cx: CENTER + col * GRID_STEP,
      cy: CENTER + row * GRID_STEP,
      r: 0.45 + normalized * 1.75,
      opacity: 0.08 + normalized * 0.86,
    });
  }
}

export default function BrandMark({ className }: BrandMarkProps) {
  const id = useId();
  const glowId = `${id}-glow`;
  const sphereId = `${id}-sphere`;
  const bloomId = `${id}-bloom`;
  const blurId = `${id}-blur`;

  return (
    <svg
      viewBox="18 18 92 92"
      aria-hidden="true"
      className={cn("block", className)}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="48%" r="44%">
          <stop offset="0%" stopColor="rgba(251,247,240,0.98)" />
          <stop offset="18%" stopColor="rgba(239,231,224,0.92)" />
          <stop offset="42%" stopColor="rgba(122,106,114,0.48)" />
          <stop offset="68%" stopColor="rgba(46,38,44,0.16)" />
          <stop offset="100%" stopColor="rgba(10,10,14,0)" />
        </radialGradient>
        <radialGradient id={sphereId} cx="50%" cy="48%" r="56%">
          <stop offset="0%" stopColor="rgba(255,251,246,0.42)" />
          <stop offset="28%" stopColor="rgba(216,203,198,0.22)" />
          <stop offset="58%" stopColor="rgba(87,72,78,0.14)" />
          <stop offset="100%" stopColor="rgba(10,10,14,0)" />
        </radialGradient>
        <radialGradient id={bloomId} cx="50%" cy="48%" r="22%">
          <stop offset="0%" stopColor="rgba(255,252,248,0.95)" />
          <stop offset="100%" stopColor="rgba(255,252,248,0)" />
        </radialGradient>
        <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6.5" />
        </filter>
      </defs>

      <circle cx={CENTER} cy={CENTER} r="40" fill={`url(#${sphereId})`} />
      <circle
        cx={CENTER}
        cy={CENTER}
        r="28"
        fill={`url(#${glowId})`}
        filter={`url(#${blurId})`}
        opacity="0.92"
      />
      <circle cx={CENTER} cy={CENTER} r="14" fill={`url(#${bloomId})`} opacity="0.82" />

      {dots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill="#f7f4ef"
          opacity={dot.opacity}
        />
      ))}
    </svg>
  );
}
