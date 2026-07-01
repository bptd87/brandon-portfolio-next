"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Palette, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { copyTextToClipboard } from "@/lib/clipboard";
import { SEO } from "../components/SEO";
import {
  BRAND_FILTERS,
  COMMERCIAL_PAINT_COUNTS,
  COMMERCIAL_PAINTS,
  type CommercialPaint,
  type PaintBrand,
} from "../data/commercialPaints";

const MAX_VISIBLE_RESULTS = 180;

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function rgbToLab(rgb: [number, number, number]): [number, number, number] {
  let [r, g, b] = rgb.map((value) => value / 255);
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  x /= 0.95047;
  y /= 1;
  z /= 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(lab2[0] - lab1[0], 2) +
      Math.pow(lab2[1] - lab1[1], 2) +
      Math.pow(lab2[2] - lab1[2], 2)
  );
}

function getReadableTextColor(hex: string): "#000000" | "#FFFFFF" {
  const [r, g, b] = hexToRgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.48 ? "#000000" : "#FFFFFF";
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return /^#[0-9A-F]{6}$/i.test(withHash) ? withHash.toUpperCase() : null;
}

function scoreFromDelta(delta: number) {
  return Math.max(0, Math.min(100, Math.round(100 - delta * 2.6)));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatBrandFilterLabel(selectedBrands: PaintBrand[]) {
  if (selectedBrands.length === BRAND_FILTERS.length) return "All brands";
  if (selectedBrands.length === 0) return "No brands";
  if (selectedBrands.length === 1) {
    return selectedBrands[0] === "Sherwin-Williams" ? "Sherwin" : selectedBrands[0];
  }
  return `${selectedBrands.length} brands`;
}

function formatPaintInfo(
  paint: CommercialPaint,
  targetColor: string,
  score: number,
  delta: number
) {
  return [
    `Target: ${targetColor}`,
    `Paint: ${paint.name}`,
    `Brand: ${paint.brand}`,
    `Code: ${paint.code}`,
    `Family: ${paint.family}`,
    `Hex: ${paint.hex}`,
    `RGB: ${paint.rgb.join(", ")}`,
    `Match: ${score}%`,
    `Delta: ${delta.toFixed(1)}`,
  ].join("\n");
}

export default function CommercialPaintMatcher() {
  const [targetColor, setTargetColor] = useState("#988234");
  const [selectedBrands, setSelectedBrands] = useState<PaintBrand[]>(BRAND_FILTERS);
  const [selectedPaintId, setSelectedPaintId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState<"match" | null>(null);
  const [copiedPaintId, setCopiedPaintId] = useState<string | null>(null);

  const displayTargetColor = normalizeHex(targetColor) ?? "#000000";

  const brandPaints = useMemo(
    () =>
      selectedBrands.length === BRAND_FILTERS.length
        ? COMMERCIAL_PAINTS
        : COMMERCIAL_PAINTS.filter((paint) => selectedBrands.includes(paint.brand)),
    [selectedBrands]
  );

  const matches = useMemo(() => {
    const targetLab = rgbToLab(hexToRgb(displayTargetColor));
    return brandPaints
      .map((paint) => ({
        paint,
        delta: deltaE(targetLab, rgbToLab(paint.rgb)),
      }))
      .sort((a, b) => a.delta - b.delta);
  }, [brandPaints, displayTargetColor]);

  const libraryPaints = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return brandPaints;
    return brandPaints.filter((paint) =>
      [paint.name, paint.brand, paint.code, paint.family].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [brandPaints, searchTerm]);

  const visibleMatches = useMemo(
    () => {
      const libraryPaintIds = new Set(libraryPaints.map((paint) => paint.id));
      return matches.filter(({ paint }) => libraryPaintIds.has(paint.id));
    },
    [libraryPaints, matches]
  );

  const bestMatch = matches[0];
  const selectedEntry = matches.find(({ paint }) => paint.id === selectedPaintId);
  const selectedMatch = selectedEntry ?? bestMatch;
  const matchScore = selectedMatch ? scoreFromDelta(selectedMatch.delta) : 0;
  const displayedMatches = visibleMatches.slice(0, MAX_VISIBLE_RESULTS);
  const comparisonColor = selectedMatch?.paint.hex ?? displayTargetColor;
  const comparisonTextColor = getReadableTextColor(comparisonColor);
  const filterLabel = formatBrandFilterLabel(selectedBrands);

  function updateTargetColor(value: string) {
    setTargetColor(value);
    setSelectedPaintId(null);
  }

  function toggleBrand(brand: PaintBrand) {
    setSelectedBrands((currentBrands) =>
      currentBrands.includes(brand)
        ? currentBrands.filter((currentBrand) => currentBrand !== brand)
        : [...currentBrands, brand]
    );
  }

  async function copySelectedMatch() {
    if (!selectedMatch) return;
    const text = formatPaintInfo(
      selectedMatch.paint,
      displayTargetColor,
      matchScore,
      selectedMatch.delta
    );
    if (await copyTextToClipboard(text)) {
      setCopied("match");
      window.setTimeout(() => setCopied(null), 1400);
    }
  }

  async function copyPaint(paint: CommercialPaint, score: number, delta: number) {
    const text = formatPaintInfo(paint, displayTargetColor, score, delta);
    if (await copyTextToClipboard(text)) {
      setCopiedPaintId(paint.id);
      window.setTimeout(() => setCopiedPaintId(null), 1100);
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f3eee4] text-black">
      <SEO
        title="Commercial Paint Matcher"
        description="Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR paint libraries with brand filters."
      />

      <main className="studio-app-main box-border h-full overflow-hidden px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.55rem)] sm:px-4 md:px-5">
        <section className="relative mx-auto flex h-full max-w-[29rem] flex-col overflow-hidden">
          <header className="studio-app-mobile-topbar grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
          <Link
            href="/studio/apps"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dfe6d4] text-[#26311f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_10px_24px_rgba(39,52,31,0.2)]"
            aria-label="Back to Studio Apps"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/50">
            Match
          </p>
          <button
            type="button"
            onClick={copySelectedMatch}
            className="ml-auto flex h-8 w-8 items-center justify-center bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-opacity hover:opacity-88"
            aria-label="Copy selected match"
          >
            {copied === "match" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-1">
          <section
            className="relative flex min-h-[16rem] shrink-0 flex-col justify-between border border-black/10 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: comparisonColor, color: comparisonTextColor }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] opacity-64">
                  Target color
                </p>
                <p className="mt-2 font-mono text-[0.9rem] font-semibold tracking-[-0.02em] opacity-76">
                  {displayTargetColor}
                </p>
              </div>
              <label
                className="relative block h-16 w-16 cursor-pointer border"
                style={{
                  backgroundColor: displayTargetColor,
                  borderColor: comparisonTextColor === "#000000" ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.42)",
                  boxShadow: "0 16px 34px rgba(0,0,0,0.14)",
                }}
                aria-label="Choose target color"
                title={`Target / ${displayTargetColor}`}
              >
                <input
                  type="color"
                  value={displayTargetColor}
                  onChange={(event) => updateTargetColor(event.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Choose target color"
                />
                <span className="sr-only">Target color swatch</span>
              </label>
            </div>

            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] opacity-64">
                {selectedEntry ? "Selected match" : "Closest match"}
              </p>
              <h1 className="mt-2 max-w-[9ch] font-sans text-[clamp(3.25rem,15vw,6.4rem)] font-semibold leading-[0.82] tracking-[-0.08em]">
                {selectedMatch?.paint.name ?? "Choose brands"}
              </h1>
              {selectedMatch ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] opacity-78">
                  <span>{selectedMatch.paint.brand}</span>
                  <span>/</span>
                  <span>{selectedMatch.paint.code}</span>
                  <span>/</span>
                  <span>{matchScore}%</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="shrink-0 border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <input
                value={targetColor}
                onChange={(event) => updateTargetColor(event.target.value)}
                onBlur={(event) => {
                  const normalized = normalizeHex(event.target.value);
                  if (normalized) updateTargetColor(normalized);
                }}
                inputMode="text"
                autoCapitalize="characters"
                spellCheck={false}
                className="h-11 min-w-0 border border-black/10 bg-[#f3eee4] px-3 font-mono text-[1rem] font-semibold uppercase tracking-[-0.02em] text-black outline-none focus:border-black/34"
                aria-label="Target hex color"
              />
              <button
                type="button"
                onClick={() => setFiltersOpen((isOpen) => !isOpen)}
                className="flex h-11 items-center gap-2 bg-[#758967] px-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-88"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
            </div>

            {filtersOpen ? (
              <div className="mt-3 grid gap-2 border-t border-black/10 pt-3">
                {BRAND_FILTERS.map((brand) => {
                  const checked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-black/10 bg-[#f3eee4] px-3 py-3 text-black"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBrand(brand)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 items-center justify-center border ${
                          checked ? "border-[#758967] bg-[#758967]" : "border-black/24 bg-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        {checked ? <Check className="h-3.5 w-3.5 text-black" /> : null}
                      </span>
                      <span className="truncate text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-black/70">
                        {brand === "Sherwin-Williams" ? "Sherwin-Williams" : brand}
                      </span>
                      <span className="text-[0.78rem] font-semibold tracking-[-0.02em] text-black/38">
                        {formatNumber(COMMERCIAL_PAINT_COUNTS[brand])}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/42">
                {filterLabel} / tap filter to choose paint companies
              </p>
            )}
          </section>

          <section className="flex min-h-0 flex-1 flex-col border border-black/10 bg-[#fbf7ef] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-b border-black/10 px-3 py-2">
              <Search className="h-4 w-4 text-black/46" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search brand, code, color, family"
                className="h-10 min-w-0 bg-transparent text-[0.95rem] font-medium tracking-[-0.02em] text-black outline-none placeholder:text-black/34"
                aria-label="Search paint library"
              />
            </div>

            <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 border-b border-black/10 px-3 py-2">
              <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/44">
                <Palette className="h-4 w-4" />
                {formatNumber(visibleMatches.length)} colors
              </div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/38">
                {copiedPaintId ? "Copied paint" : "Tap color to compare"}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {displayedMatches
                .map(({ paint, delta }) => {
                  const score = scoreFromDelta(delta);
                  const isSelected = selectedMatch?.paint.id === paint.id;
                  return (
                    <div
                      key={paint.id}
                      className={`grid w-full grid-cols-[minmax(0,1fr)_4.7rem] items-stretch border-b border-black/10 text-left transition-colors ${
                        isSelected ? "bg-[#f3eee4]" : "hover:bg-[#f3eee4]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPaintId(paint.id)}
                        className="grid min-w-0 grid-cols-[3.8rem_minmax(0,1fr)] items-stretch text-left"
                        aria-label={`Select ${paint.name} for comparison`}
                      >
                        <span
                          className={`block min-h-[4.6rem] border-r border-black/10 ${
                            isSelected ? "shadow-[inset_0_0_0_3px_#758967]" : ""
                          }`}
                          style={{ backgroundColor: paint.hex }}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 px-3 py-3">
                          <span className="block truncate text-[1.05rem] font-semibold leading-none tracking-[-0.045em] text-black">
                            {paint.name}
                          </span>
                          <span className="mt-2 block truncate text-[0.78rem] font-medium tracking-[-0.02em] text-black/48">
                            {paint.brand} / {paint.code} / {paint.family}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyPaint(paint, score, delta)}
                        className="flex items-center justify-center border-l border-black/10 px-2 text-black transition-colors hover:bg-[#ede6d8]"
                        aria-label={`Copy ${paint.name} paint information`}
                      >
                        <span className="grid justify-items-center gap-1">
                          <span className="text-[1.08rem] font-semibold tracking-[-0.04em]">
                            {score}
                          </span>
                          {copiedPaintId === paint.id ? (
                            <Check className="h-4 w-4 text-[#758967]" />
                          ) : (
                            <Copy className="h-4 w-4 text-black/44" />
                          )}
                        </span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </section>
          </div>
        </section>
      </main>
    </div>
  );
}
