"use client";

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { ArrowLeft, Camera, Check, Copy, Palette, Sliders, X } from "lucide-react";
import { Link } from "wouter";
import { copyTextToClipboard } from "@/lib/clipboard";
import { SEO } from "../components/SEO";

interface RoscoPaint {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

const ROSCO_PAINTS: RoscoPaint[] = [
  { id: "05350", name: "White", hex: "#F7F4EA", rgb: [247, 244, 234] },
  { id: "05351", name: "White White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { id: "05366", name: "Lemon Yellow", hex: "#F7D822", rgb: [247, 216, 34] },
  { id: "05372", name: "Sky Blue", hex: "#48A7C7", rgb: [72, 167, 199] },
  { id: "05365", name: "Chrome Oxide Green", hex: "#0A563C", rgb: [10, 86, 60] },
  { id: "05352", name: "Black", hex: "#141914", rgb: [20, 25, 20] },
  { id: "05367", name: "Golden Yellow", hex: "#EFA31B", rgb: [239, 163, 27] },
  { id: "05373", name: "Pthalo Blue", hex: "#244A83", rgb: [36, 74, 131] },
  { id: "05353", name: "Yellow Ochre", hex: "#A77922", rgb: [167, 121, 34] },
  { id: "05385", name: "Silver", hex: "#8F9186", rgb: [143, 145, 134] },
  { id: "05363", name: "Orange", hex: "#F26722", rgb: [242, 103, 34] },
  { id: "05359", name: "Ultramarine Blue", hex: "#283B80", rgb: [40, 59, 128] },
  { id: "05355", name: "Raw Sienna", hex: "#81741E", rgb: [129, 116, 30] },
  { id: "05386", name: "Copper", hex: "#7D4B2F", rgb: [125, 75, 47] },
  { id: "05360", name: "Fire Red", hex: "#DF3B27", rgb: [223, 59, 39] },
  { id: "05368", name: "Purple", hex: "#25305D", rgb: [37, 48, 93] },
  { id: "05356", name: "Burnt Sienna", hex: "#87422D", rgb: [135, 66, 45] },
  { id: "05384", name: "Gold", hex: "#A8852E", rgb: [168, 133, 46] },
  { id: "05361", name: "Deep Red", hex: "#B42C3B", rgb: [180, 44, 59] },
  { id: "05364", name: "Emerald Green", hex: "#2BB23C", rgb: [43, 178, 60] },
  { id: "05354", name: "Burnt Umber", hex: "#3E2A21", rgb: [62, 42, 33] },
  { id: "05383", name: "Bright Gold", hex: "#9A832D", rgb: [154, 131, 45] },
  { id: "05369", name: "Magenta", hex: "#B33B8F", rgb: [179, 59, 143] },
  { id: "05371", name: "Pthalo Green", hex: "#007F67", rgb: [0, 127, 103] },
  { id: "05357", name: "Raw Umber", hex: "#4B4735", rgb: [75, 71, 53] },
  { id: "05387", name: "Antique Gold", hex: "#56543A", rgb: [86, 84, 58] },
];

const ROSCO_PALETTE_SWATCHES = ROSCO_PAINTS.filter(
  (paint) => paint.id !== "05350" && paint.id !== "05351"
);

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

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
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

function rgbToHex(rgb: [number, number, number]): string {
  return (
    "#" +
    rgb
      .map((value) => {
        const hex = Math.round(Math.max(0, Math.min(255, value))).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join("")
  );
}

function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(lab2[0] - lab1[0], 2) +
      Math.pow(lab2[1] - lab1[1], 2) +
      Math.pow(lab2[2] - lab1[2], 2)
  );
}

function rgbToCmyk(rgb: [number, number, number]): [number, number, number, number] {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return [c, m, y, k];
}

function cmykToRgb(cmyk: [number, number, number, number]): [number, number, number] {
  const [c, m, y, k] = cmyk;
  return [255 * (1 - c) * (1 - k), 255 * (1 - m) * (1 - k), 255 * (1 - y) * (1 - k)];
}

interface PaintRecipe {
  paint: RoscoPaint;
  parts: number;
}

interface RecipeResult {
  recipe: PaintRecipe[];
  achievedColor: string;
  achievedRgb: [number, number, number];
  accuracy: number;
  deltaE: number;
}

function mixColors(paints: PaintRecipe[]): [number, number, number] {
  const totalParts = paints.reduce((sum, paint) => sum + paint.parts, 0);
  if (totalParts === 0) return [0, 0, 0];

  let c = 0;
  let m = 0;
  let y = 0;
  let k = 0;

  paints.forEach(({ paint, parts }) => {
    const weight = parts / totalParts;
    const [pc, pm, py, pk] = rgbToCmyk(paint.rgb);
    c += pc * weight;
    m += pm * weight;
    y += py * weight;
    k += pk * weight;
  });

  return cmykToRgb([c, m, y, k]);
}

function calculateRecipe(targetHex: string, paintSet: RoscoPaint[] = ROSCO_PAINTS): RecipeResult {
  const targetRgb = hexToRgb(targetHex);
  const targetLab = rgbToLab(targetRgb);

  const sortedPaints = [...paintSet]
    .map((paint) => ({ paint, delta: deltaE(targetLab, rgbToLab(paint.rgb)) }))
    .sort((a, b) => a.delta - b.delta);

  if (sortedPaints.length === 0) {
    return { recipe: [], achievedColor: "#000000", achievedRgb: [0, 0, 0], accuracy: 0, deltaE: 100 };
  }

  if (sortedPaints[0].delta < 2) {
    return {
      recipe: [{ paint: sortedPaints[0].paint, parts: 1 }],
      achievedColor: sortedPaints[0].paint.hex,
      achievedRgb: sortedPaints[0].paint.rgb,
      accuracy: Math.max(0, Math.min(100, 100 - sortedPaints[0].delta * 10)),
      deltaE: sortedPaints[0].delta,
    };
  }

  let bestRecipe: PaintRecipe[] = [];
  let bestDeltaE = Infinity;
  let bestMixedRgb: [number, number, number] = [0, 0, 0];

  const updateBest = (recipe: PaintRecipe[]) => {
    if (!recipe.length) return;
    const mixed = mixColors(recipe);
    const delta = deltaE(targetLab, rgbToLab(mixed));
    if (delta < bestDeltaE) {
      bestDeltaE = delta;
      bestRecipe = recipe;
      bestMixedRgb = mixed;
    }
  };

  const topPaints = sortedPaints.slice(0, 10);
  for (let i = 0; i < topPaints.length; i++) {
    for (let j = i; j < topPaints.length; j++) {
      for (let r = 1; r <= 39; r++) {
        const r1 = r / 40;
        updateBest([
          { paint: topPaints[i].paint, parts: r1 * 40 },
          { paint: topPaints[j].paint, parts: (1 - r1) * 40 },
        ]);
      }
    }
  }

  const top3 = sortedPaints.slice(0, 6);
  for (let i = 0; i < top3.length; i++) {
    for (let j = i + 1; j < top3.length; j++) {
      for (let k = j + 1; k < top3.length; k++) {
        const ratios = [
          [0.5, 0.3, 0.2],
          [0.5, 0.25, 0.25],
          [0.4, 0.4, 0.2],
          [0.4, 0.3, 0.3],
          [0.6, 0.2, 0.2],
        ];
        for (const [r1, r2, r3] of ratios) {
          updateBest([
            { paint: top3[i].paint, parts: r1 * 20 },
            { paint: top3[j].paint, parts: r2 * 20 },
            { paint: top3[k].paint, parts: r3 * 20 },
          ]);
        }
      }
    }
  }

  if (bestRecipe.length > 0) {
    const white = paintSet.find((paint) => paint.id === "05350");
    const black = paintSet.find((paint) => paint.id === "05352");

    if (white) {
      for (let w = 1; w <= 8; w++) {
        const ratio = w * 0.025;
        updateBest([
          ...bestRecipe.map((recipe) => ({ ...recipe, parts: recipe.parts * (1 - ratio) })),
          { paint: white, parts: ratio * 40 },
        ]);
      }
    }

    if (black) {
      for (let b = 1; b <= 6; b++) {
        const ratio = b * 0.025;
        updateBest([
          ...bestRecipe.map((recipe) => ({ ...recipe, parts: recipe.parts * (1 - ratio) })),
          { paint: black, parts: ratio * 40 },
        ]);
      }
    }
  }

  const consolidated: Record<string, PaintRecipe> = {};
  bestRecipe.forEach((recipe) => {
    if (consolidated[recipe.paint.id]) {
      consolidated[recipe.paint.id].parts += recipe.parts;
    } else {
      consolidated[recipe.paint.id] = { ...recipe };
    }
  });

  const total = Object.values(consolidated).reduce((sum, recipe) => sum + recipe.parts, 0);
  const normalized = Object.values(consolidated)
    .map((recipe) => ({
      paint: recipe.paint,
      parts: Math.round((recipe.parts / total) * 20) / 2,
    }))
    .filter((recipe) => recipe.parts > 0)
    .sort((a, b) => b.parts - a.parts);

  return {
    recipe: normalized,
    achievedColor: rgbToHex(bestMixedRgb),
    achievedRgb: bestMixedRgb,
    accuracy: Math.max(0, Math.min(100, 100 - bestDeltaE * 8)),
    deltaE: bestDeltaE,
  };
}

export default function RoscoPaintCalculator() {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [targetColor, setTargetColor] = useState("#8B4789");
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [panelOpen, setPanelOpen] = useState<"directions" | "library" | "inventory" | null>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [sampledPhotoColor, setSampledPhotoColor] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rosco_inventory_v1");
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("rosco_inventory_v1", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    if (targetColor && /^#[0-9A-F]{6}$/i.test(targetColor)) {
      const availablePaints = inStockOnly
        ? ROSCO_PAINTS.filter((paint) => inventory.includes(paint.id))
        : ROSCO_PAINTS;

      setResult(availablePaints.length > 0 ? calculateRecipe(targetColor, availablePaints) : null);
    }
  }, [targetColor, inStockOnly, inventory]);

  const toggleInventoryItem = (id: string) => {
    setInventory((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const copyRecipe = async () => {
    if (!result) return;
    const text = `Rosco recipe for ${targetColor}: ${result.recipe
      .map((recipe) => `${recipe.parts.toFixed(1)} parts ${recipe.paint.name}`)
      .join(", ")}`;
    const copied = await copyTextToClipboard(text);
    if (copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyPaintList = async () => {
    const text = [
      "Rosco Off Broadway Paint Palette",
      ...ROSCO_PALETTE_SWATCHES.map(
        (paint) =>
          `${paint.id}\t${paint.name}\t${paint.hex}\tRGB ${paint.rgb.join(", ")}`
      ),
    ].join("\n");
    const copied = await copyTextToClipboard(text);
    if (copied) {
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    }
  };

  const updateTargetHex = (value: string) => {
    const hex = value.replace(/#/g, "").replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setTargetColor(`#${hex}`.toUpperCase());
  };

  const openPhotoPicker = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setPhotoPreviewUrl(reader.result);
      setSampledPhotoColor(null);
      setPhotoOpen(true);
      setPanelOpen(null);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const samplePhotoColor = (event: MouseEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const rect = image.getBoundingClientRect();
    const naturalX = ((event.clientX - rect.left) / rect.width) * image.naturalWidth;
    const naturalY = ((event.clientY - rect.top) / rect.height) * image.naturalHeight;
    const radius = Math.max(3, Math.round(Math.min(image.naturalWidth, image.naturalHeight) * 0.006));
    const sampleX = Math.max(0, Math.round(naturalX) - radius);
    const sampleY = Math.max(0, Math.round(naturalY) - radius);
    const sampleWidth = Math.min(radius * 2 + 1, image.naturalWidth - sampleX);
    const sampleHeight = Math.min(radius * 2 + 1, image.naturalHeight - sampleY);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context || sampleWidth <= 0 || sampleHeight <= 0) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);

    const pixels = context.getImageData(sampleX, sampleY, sampleWidth, sampleHeight).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 128) continue;
      r += pixels[index];
      g += pixels[index + 1];
      b += pixels[index + 2];
      count += 1;
    }

    if (!count) return;

    const sampledHex = rgbToHex([r / count, g / count, b / count]).toUpperCase();
    setSampledPhotoColor(sampledHex);
    setTargetColor(sampledHex);
  };

  const validTargetColor = /^#[0-9A-F]{6}$/i.test(targetColor);
  const displayTargetColor = validTargetColor ? targetColor : "#000000";
  const achievedColor = result?.achievedColor ?? "#000000";
  const accuracyValue = result ? result.accuracy.toFixed(1) : "--";
  const mixTextColor = getReadableTextColor(achievedColor);
  const mixMutedColor =
    mixTextColor === "#000000" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.64)";
  const mixLineColor =
    mixTextColor === "#000000" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.22)";

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f3eee4] text-black">
      <SEO title="Rosco Paint Calculator" description="Professional scenic paint calculator and Rosco color mixing tool." />

      <main className="studio-app-main box-border h-full overflow-hidden px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.55rem)] sm:px-4 md:px-5">
        <section className="relative mx-auto flex h-full max-w-[29rem] flex-col overflow-hidden">
          <header className="studio-app-mobile-topbar grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
            <Link
              href="/studio/apps"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1bd84] text-[#55301b] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_10px_24px_rgba(77,49,36,0.22)]"
              aria-label="Back to Studio Apps"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                Rosco
              </p>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-1">
            <section
              className="relative flex min-h-[11rem] flex-[0.72] flex-col overflow-hidden rounded-[0.45rem] border border-black/10 p-4 shadow-[0_24px_70px_rgba(58,45,31,0.16),inset_0_1px_rgba(255,255,255,0.22)]"
              style={{ backgroundColor: achievedColor, color: mixTextColor }}
            >
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px"
                style={{ backgroundColor: mixTextColor === "#000000" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)" }}
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
                style={{ backgroundColor: mixLineColor }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.13em]"
                    style={{ color: mixMutedColor }}
                  >
                    Color mix
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPanelOpen("directions")}
                    className="h-8 border border-[#31484d] bg-[#3f5d62] px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white shadow-none"
                  >
                    Directions
                  </button>
                  <button
                    type="button"
                    onClick={copyRecipe}
                    disabled={!result}
                    className="flex h-8 w-8 shrink-0 items-center justify-center border shadow-[0_10px_18px_rgba(38,30,20,0.18)] transition-opacity hover:opacity-90 disabled:opacity-35"
                    style={{
                      backgroundColor: mixTextColor,
                      borderColor: mixLineColor,
                      color: achievedColor,
                    }}
                    aria-label="Copy recipe"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_5.8rem] gap-3 pt-[clamp(1.7rem,3.6dvh,2.8rem)]">
                <div className="min-w-0">
                  <p
                    className="block max-w-full overflow-hidden whitespace-nowrap font-sans text-[clamp(4.8rem,18vw,6.45rem)] font-semibold leading-[0.84] tracking-normal tabular-nums"
                    style={{ color: mixTextColor }}
                  >
                    {accuracyValue}%
                  </p>
                  <p
                    className="font-sans text-[clamp(2.1rem,8vw,2.85rem)] font-semibold leading-none tracking-normal"
                    style={{ color: mixTextColor }}
                  >
                    match
                  </p>
                </div>

                <div className="flex items-end justify-end pb-1">
                  <p
                    className="max-w-[5.6rem] text-right font-mono text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.08em]"
                    style={{ color: mixMutedColor }}
                  >
                    Mix<br />
                    {achievedColor}
                  </p>
                </div>
              </div>
            </section>

            <div
              className="relative grid h-12 grid-cols-2 border border-black/10 bg-[#e7dfd0] p-1 text-left shadow-[inset_0_1px_rgba(255,255,255,0.62)]"
              role="group"
              aria-label="Paint source"
            >
              <span
                className={`pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] bg-black shadow-[0_10px_22px_rgba(38,30,20,0.16)] transition-transform ${
                  inStockOnly ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
                }`}
              />
              <button
                type="button"
                onClick={() => setInStockOnly(false)}
                aria-pressed={!inStockOnly}
                className={`relative z-10 flex items-center justify-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] ${
                  !inStockOnly ? "text-[#f8f1e6]" : "text-black/48"
                }`}
              >
                Full Catalog
              </button>
              <button
                type="button"
                onClick={() => setInStockOnly(true)}
                aria-pressed={inStockOnly}
                className={`relative z-10 flex items-center justify-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] ${
                  inStockOnly ? "text-[#f8f1e6]" : "text-black/48"
                }`}
              >
                Inventory
              </button>
            </div>

            <section className="rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
              <div className="mb-2 flex items-center gap-2 text-black/46">
                <Palette className="h-4 w-4" />
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                  Target
                </p>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_3rem_4.2rem] gap-3">
                <input
                  type="text"
                  value={targetColor}
                  onChange={(event) => updateTargetHex(event.target.value)}
                  onFocus={(event) => event.currentTarget.select()}
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-12 rounded-[0.18rem] border border-black/10 bg-[#ece5d7] px-4 text-center font-mono text-[1.25rem] font-semibold uppercase tracking-normal text-black placeholder:text-black/22 focus:outline-none focus:ring-2 focus:ring-[#3f5d62]/70"
                  placeholder="#000000"
                  aria-label="Target color hex"
                />
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                  aria-label="Take or upload a color photo"
                />
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  className="flex h-12 items-center justify-center rounded-[0.18rem] bg-[#f1bd84] text-[#55301b] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-88"
                  aria-label="Take or upload a color photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <label className="relative block h-12 cursor-pointer border border-black/10 bg-[#ece5d7] p-1.5">
                  <input
                    type="color"
                    value={displayTargetColor}
                    onChange={(event) => setTargetColor(event.target.value.toUpperCase())}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Choose target color"
                  />
                  <span
                    className="block h-full border border-black/10"
                    style={{ backgroundColor: displayTargetColor }}
                  />
                </label>
              </div>
            </section>

            <section className="flex min-h-0 flex-1 flex-col rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-black/46">
                  <Sliders className="h-4 w-4" />
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                    Recipe
                  </p>
                </div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-black/38">
                  {result ? `DE ${result.deltaE.toFixed(2)}` : "No match"}
                </p>
              </div>

              <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {result && result.recipe.length > 0 ? (
                  result.recipe.map((recipe) => (
                    <div
                      key={recipe.paint.id}
                      className="grid grid-cols-[2.35rem_minmax(0,1fr)_3.5rem] items-center gap-2 border border-black/8 bg-[#ece5d7] p-2"
                    >
                      <div
                        className="h-8 border border-black/10"
                        style={{ backgroundColor: recipe.paint.hex }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[0.84rem] font-semibold leading-none text-black">
                          {recipe.paint.name}
                        </p>
                        <p className="mt-1 font-mono text-[0.62rem] text-black/42">
                          {recipe.paint.id}
                        </p>
                      </div>
                      <p className="text-right text-[0.86rem] font-semibold text-black/72">
                        {recipe.parts.toFixed(1)} pt
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center border border-black/8 bg-[#ece5d7] px-4 text-center text-[0.86rem] font-medium leading-5 text-black/52">
                    Add inventory or switch to the full catalog to generate a mix.
                  </div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2 rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-2 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
              <button
                type="button"
                onClick={() => setPanelOpen("library")}
                className="flex h-10 items-center justify-center gap-2 bg-black px-3 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#f8f1e6]"
              >
                <Palette className="h-3.5 w-3.5" />
                Library
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen("inventory")}
                className="flex h-10 items-center justify-center gap-2 bg-black px-3 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#f8f1e6]"
              >
                <Sliders className="h-3.5 w-3.5" />
                Stock {inventory.length}
              </button>
            </section>
          </div>

          {panelOpen ? (
            <div className="absolute inset-0 z-20 flex items-end bg-[#f3eee4]/78 p-3 backdrop-blur-sm">
              <section className="flex max-h-[86%] w-full flex-col border border-black/12 bg-[#fbf7ef] p-4 shadow-[0_24px_70px_rgba(58,45,31,0.22)]">
                <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#3f5d62]">
                      {panelOpen === "directions"
                        ? "Directions"
                        : panelOpen === "library"
                          ? "Paint Library"
                          : "Inventory"}
                    </p>
                    <h2 className="mt-1 text-[1.25rem] font-semibold leading-none tracking-[-0.04em] text-black">
                      {panelOpen === "directions"
                        ? "Fast paint mix."
                        : panelOpen === "library"
                          ? "Choose target color."
                          : "Manage stock."}
                    </h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {panelOpen === "library" ? (
                      <button
                        type="button"
                        onClick={copyPaintList}
                        className="flex h-8 items-center gap-1.5 bg-black px-3 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#f8f1e6]"
                      >
                        {copiedList ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedList ? "Copied" : "Copy list"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setPanelOpen(null)}
                      className="flex h-8 w-8 items-center justify-center border border-black/12 bg-[#ece5d7] text-black"
                      aria-label="Close panel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {panelOpen === "directions" ? (
                  <div className="grid gap-3 pt-3 text-[0.88rem] font-medium leading-5 tracking-normal text-black/68">
                    <p>Pick a target color with the swatch or hex field.</p>
                    <p>Use the full catalog, or switch to inventory after adding the paints you have on hand.</p>
                    <p>Copy the recipe and treat the match score as a starting point for shop testing.</p>
                  </div>
                ) : null}

                {panelOpen === "library" ? (
                  <div className="min-h-0 overflow-y-auto pt-3">
                    <div className="grid grid-cols-4 gap-2">
                      {ROSCO_PALETTE_SWATCHES.map((paint) => (
                        <button
                          key={paint.id}
                          type="button"
                          onClick={() => {
                            setTargetColor(paint.hex);
                            setPanelOpen(null);
                          }}
                          className="border border-black/10 bg-[#ece5d7] p-1.5 text-left"
                          title={`${paint.name} (${paint.id})`}
                        >
                          <span
                            className="block aspect-square border border-black/10"
                            style={{ backgroundColor: paint.hex }}
                          />
                          <span className="mt-1 block truncate text-[0.56rem] font-semibold uppercase tracking-[0.06em] text-black/48">
                            {paint.id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {panelOpen === "inventory" ? (
                  <div className="min-h-0 overflow-y-auto pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {ROSCO_PALETTE_SWATCHES.map((paint) => {
                        const selected = inventory.includes(paint.id);
                        return (
                          <button
                            key={paint.id}
                            type="button"
                            onClick={() => toggleInventoryItem(paint.id)}
                            aria-pressed={selected}
                            className={`grid grid-cols-[1.35rem_minmax(0,1fr)] items-center gap-2 border p-2 text-left ${
                              selected
                                ? "border-[#3f5d62] bg-[#3f5d62] text-white"
                                : "border-black/10 bg-[#ece5d7] text-black"
                            }`}
                          >
                            <span
                              className="h-5 border border-black/14"
                              style={{ backgroundColor: paint.hex }}
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-[0.7rem] font-semibold leading-none">
                                {paint.name}
                              </span>
                              <span className="mt-1 block font-mono text-[0.58rem] text-black/42">
                                {paint.id}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}

          {photoOpen && photoPreviewUrl ? (
            <div className="absolute inset-0 z-30 flex items-end bg-black/24 p-3 backdrop-blur-[2px]">
              <section className="max-h-[calc(100%-1.5rem)] w-full border border-black/10 bg-[#fbf7ef] p-3 text-black shadow-[0_20px_60px_rgba(58,45,31,0.24)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/52">
                    <Camera className="h-3.5 w-3.5" />
                    Tap photo to sample
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoOpen(false)}
                    className="flex h-8 w-8 items-center justify-center border border-black/12 bg-[#ece5d7] text-black"
                    aria-label="Close photo sampler"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 w-full overflow-hidden border border-black/10 bg-black">
                  <img
                    src={photoPreviewUrl}
                    alt="Uploaded Rosco paint color sample"
                    onClick={samplePhotoColor}
                    className="max-h-[46vh] w-full cursor-crosshair object-contain"
                    draggable={false}
                  />
                </div>

                <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span
                    className="h-9 w-9 border border-black/10"
                    style={{ backgroundColor: sampledPhotoColor ?? displayTargetColor }}
                    aria-hidden="true"
                  />
                  <p className="min-w-0 text-[0.72rem] font-semibold uppercase leading-4 tracking-[0.12em] text-black/44">
                    {sampledPhotoColor ? `${sampledPhotoColor} applied` : "Tap photo to set target"}
                  </p>
                  <button
                    type="button"
                    onClick={openPhotoPicker}
                    className="h-9 bg-[#3f5d62] px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    Retake
                  </button>
                </div>

                <p className="mt-3 text-[0.76rem] font-medium leading-5 text-black/48">
                  Photo color is an estimate. Use even natural light and test the recipe with real paint.
                </p>
              </section>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
