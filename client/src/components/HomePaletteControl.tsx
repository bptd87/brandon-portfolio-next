"use client";

import { Palette } from "lucide-react";

import { HOME_COLOR_THEMES, type HomeColorTheme } from "@/lib/homeTheme";

export default function HomePaletteControl({
  activeTheme,
  activeThemeIndex,
  isOpen,
  onOpenChange,
  onThemeChange,
}: {
  activeTheme: HomeColorTheme;
  activeThemeIndex: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onThemeChange: (index: number) => void;
}) {
  const arcAngles = [180, 220, 260, 300];
  const arcRadius = 48;
  const visibleThemes = HOME_COLOR_THEMES.map((theme, index) => ({
    theme,
    index,
  })).filter(({ index }) => index !== activeThemeIndex);

  return (
    <>
      <style>{`
        @keyframes home-palette-idle {
          0%, 100% { transform: translateY(0) scale(1); }
          48% { transform: translateY(-3px) scale(1.015); }
        }

        @keyframes home-palette-spinner {
          0% { transform: rotate(0deg) scale(1); }
          42% { transform: rotate(190deg) scale(1.12); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
      <div className="pointer-events-none fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-[90] h-28 w-32 md:bottom-[clamp(0.25rem,1.2vw,0.75rem)] md:right-[clamp(0.25rem,1.2vw,0.75rem)]">
        <div className="absolute bottom-4 right-4 h-12 w-12">
          {visibleThemes.map(({ theme, index }, optionIndex) => {
            const angle = (arcAngles[optionIndex] * Math.PI) / 180;
            const swatchX = Math.cos(angle) * arcRadius;
            const swatchY = Math.sin(angle) * arcRadius;

            return (
              <button
                key={theme.name}
                type="button"
                aria-label={`Use ${theme.name} site color`}
                aria-pressed={false}
                onClick={() => {
                  onThemeChange(index);
                  onOpenChange(false);
                }}
                className={`home-palette-swatch pointer-events-auto absolute left-1/2 top-1/2 h-7 w-7 rounded-full shadow-[0_0.5rem_1.1rem_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/45 ${
                  isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{
                  backgroundColor: theme.bg,
                  transform: isOpen
                    ? `translate(calc(-50% + ${swatchX}px), calc(-50% + ${swatchY}px)) scale(1)`
                    : "translate(-50%, -50%) scale(0.2)",
                  transitionDelay: isOpen ? `${optionIndex * 35}ms` : "0ms",
                  boxShadow: "0 0.5rem 1.1rem rgba(0,0,0,0.16)",
                }}
              />
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Change site colors"
          aria-expanded={isOpen}
          onClick={() => onOpenChange(!isOpen)}
          className="pointer-events-auto absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full shadow-[0_0.8rem_2rem_rgba(0,0,0,0.2)] transition-transform motion-safe:animate-[home-palette-idle_2.4s_cubic-bezier(0.45,0,0.2,1)_infinite] hover:scale-105 hover:[animation-play-state:paused] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/45"
          style={{
            backgroundColor: activeTheme.controlBg,
            color: activeTheme.controlInk,
            border: activeTheme.controlBorder,
            boxShadow: "0 0.8rem 2rem rgba(0,0,0,0.2)",
          }}
        >
          <Palette
            className={`home-palette-spinner h-5 w-5 ${
              isOpen
                ? "motion-safe:animate-[home-palette-spinner_820ms_cubic-bezier(0.2,1,0.34,1)_infinite]"
                : ""
            }`}
            strokeWidth={2.1}
          />
        </button>
      </div>
    </>
  );
}
