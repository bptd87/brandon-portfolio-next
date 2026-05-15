"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Palette, Sliders } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { copyTextToClipboard } from "@/lib/clipboard";
import { SEO } from "../components/SEO";

interface RoscoPaint {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

const ROSCO_PAINTS: RoscoPaint[] = [
  { id: "5330", name: "White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { id: "5340", name: "Chrome Yellow", hex: "#FFD700", rgb: [255, 215, 0] },
  { id: "5341", name: "Yellow Ochre", hex: "#CC8833", rgb: [204, 136, 51] },
  { id: "5342", name: "Raw Sienna", hex: "#C17A3A", rgb: [193, 122, 58] },
  { id: "5343", name: "Burnt Sienna", hex: "#8B4513", rgb: [139, 69, 19] },
  { id: "5344", name: "Burnt Umber", hex: "#5C3317", rgb: [92, 51, 23] },
  { id: "5345", name: "Raw Umber", hex: "#6B4423", rgb: [107, 68, 35] },
  { id: "5350", name: "Paynes Grey", hex: "#536878", rgb: [83, 104, 120] },
  { id: "5352", name: "Black", hex: "#1A1A1A", rgb: [26, 26, 26] },
  { id: "5355", name: "Cerulean Blue", hex: "#2A52BE", rgb: [42, 82, 190] },
  { id: "5357", name: "Prussian Blue", hex: "#003153", rgb: [0, 49, 83] },
  { id: "5358", name: "Pthalo Blue", hex: "#000F89", rgb: [0, 15, 137] },
  { id: "5359", name: "Ultramarine Blue", hex: "#4166F5", rgb: [65, 102, 245] },
  { id: "5360", name: "Violet", hex: "#8B00FF", rgb: [139, 0, 255] },
  { id: "5363", name: "Purple", hex: "#660099", rgb: [102, 0, 153] },
  { id: "5365", name: "Crimson", hex: "#DC143C", rgb: [220, 20, 60] },
  { id: "5367", name: "Fire Red", hex: "#E92207", rgb: [233, 34, 7] },
  { id: "5369", name: "Magenta", hex: "#FF00FF", rgb: [255, 0, 255] },
  { id: "5370", name: "Burgundy", hex: "#800020", rgb: [128, 0, 32] },
  { id: "5371", name: "Red Oxide", hex: "#A0522D", rgb: [160, 82, 45] },
  { id: "5373", name: "Orange", hex: "#FF6600", rgb: [255, 102, 0] },
  { id: "5375", name: "Chrome Orange", hex: "#FF7F00", rgb: [255, 127, 0] },
  { id: "5380", name: "Lemon Yellow", hex: "#FFF44F", rgb: [255, 244, 79] },
  { id: "5381", name: "Chrome Green", hex: "#00A86B", rgb: [0, 168, 107] },
  { id: "5385", name: "Pthalo Green", hex: "#123524", rgb: [18, 53, 36] },
  { id: "5387", name: "Ultramarine Green", hex: "#00693E", rgb: [0, 105, 62] },
  { id: "5388", name: "Viridian Green", hex: "#40826D", rgb: [64, 130, 109] },
  { id: "5389", name: "Emerald Green", hex: "#50C878", rgb: [80, 200, 120] },
  { id: "5390", name: "Turquoise", hex: "#40E0D0", rgb: [64, 224, 208] },
  { id: "5391", name: "Aqua", hex: "#00FFFF", rgb: [0, 255, 255] },
  { id: "5392", name: "Navy Blue", hex: "#000080", rgb: [0, 0, 128] },
  { id: "5395", name: "Van Dyke Brown", hex: "#3D2B1F", rgb: [61, 43, 31] },
];

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
    const white = paintSet.find((paint) => paint.id === "5330");
    const black = paintSet.find((paint) => paint.id === "5352");

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
  const [targetColor, setTargetColor] = useState("#8B4789");
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

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

  return (
    <>
      <SEO title="Rosco Paint Calculator" description="Professional scenic paint calculator and Rosco color mixing tool." />

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="px-4 pb-24 pt-22 sm:px-6 md:pt-28">
          <section className="mx-auto max-w-6xl border-b border-border/18 pb-10 md:pb-12">
            <Link
              href="/studio/apps"
              className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studio Apps
            </Link>

            <div className="mx-auto mt-6 max-w-4xl text-center md:mt-8">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                Rosco Paint Calculator
              </p>
              <h1 className="mt-4 font-sans text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.95] tracking-[-0.065em] text-foreground">
                Mix scenic paint colors with a practical production workflow.
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-[0.98rem] leading-7 text-foreground/60 md:text-[1.08rem] md:leading-8">
                Choose a target color, generate a Rosco Off-Broadway recipe, and optionally limit
                results to the paints already on hand in your stock.
              </p>
            </div>
          </section>

          <section className="mx-auto mt-8 max-w-4xl md:mt-10">
            <div className="space-y-5">
              <div className="rounded-[1.2rem] bg-[#1b1b1d] p-4 md:rounded-[1.4rem] md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-foreground/58">
                    <Palette className="h-4 w-4" />
                    <span className="text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                      Target Color
                    </span>
                  </div>
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                      inStockOnly ? "bg-white text-black" : "bg-black/28 text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {inStockOnly ? "Using inventory" : "Full catalog"}
                  </button>
                </div>

                <div className="mt-5 rounded-[1rem] border border-white/7 bg-black/28 p-4">
                  <input
                    type="color"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    className="h-16 w-full cursor-pointer rounded-[0.85rem] border-0 bg-transparent"
                    title="Choose target color"
                  />
                  <input
                    type="text"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    className="mt-3 w-full rounded-[0.85rem] border border-white/7 bg-black/28 px-4 py-3 text-center font-mono uppercase text-foreground"
                    placeholder="#000000"
                  />
                </div>

                {result ? (
                  <div className="mt-5 rounded-[1rem] bg-black/28 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[0.74rem] uppercase tracking-[0.18em] text-foreground/38">
                          Accuracy
                        </p>
                        <p className="mt-2 text-[1.45rem] font-medium text-foreground">
                          {result.accuracy.toFixed(1)}%
                        </p>
                      </div>
                      <button
                        onClick={copyRecipe}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/90"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy recipe"}
                      </button>
                    </div>
                    <p className="mt-2 text-[0.9rem] text-foreground/56">
                      Delta E: {result.deltaE.toFixed(2)}
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 border-t border-white/8 pt-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setShowLibrary(!showLibrary)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-black/18 px-4 py-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      <Palette className="h-4 w-4" />
                      {showLibrary ? "Hide paint library" : "Open paint library"}
                    </button>

                    <button
                      onClick={() => setShowInventory(!showInventory)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-black/18 px-4 py-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      <Sliders className="h-4 w-4" />
                      {showInventory ? "Hide inventory" : "Manage inventory"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showLibrary ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-white/8 pt-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-[0.78rem] font-medium uppercase tracking-[0.16em] text-foreground/44">
                              Rosco Library
                            </p>
                            <span className="text-[0.78rem] text-foreground/36">{ROSCO_PAINTS.length}</span>
                          </div>

                          <div className="grid grid-cols-5 gap-2">
                            {ROSCO_PAINTS.map((paint) => (
                              <button
                                key={paint.id}
                                onClick={() => setTargetColor(paint.hex)}
                                className="aspect-square rounded-[0.7rem] border border-white/8 transition-transform hover:scale-105"
                                style={{ backgroundColor: paint.hex }}
                                title={`${paint.name} (${paint.id})`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showInventory ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-white/8 pt-4">
                          <div className="grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                            {ROSCO_PAINTS.map((paint) => (
                              <button
                                key={paint.id}
                                onClick={() => toggleInventoryItem(paint.id)}
                                className={`flex items-center gap-2 rounded-[0.8rem] px-3 py-3 text-left text-[0.78rem] transition-colors ${
                                  inventory.includes(paint.id)
                                    ? "bg-white text-black"
                                    : "bg-black/28 text-foreground/60 hover:text-foreground"
                                }`}
                              >
                                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: paint.hex }} />
                                <span className="truncate">{paint.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              {result ? (
                <div className="rounded-[1.2rem] bg-[#1b1b1d] p-4 md:rounded-[1.4rem] md:p-6">
                    <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                          Mixing Recipe
                        </p>
                        <p className="mt-3 text-[1rem] leading-7 text-foreground/62">
                          Suggested Rosco Off-Broadway mix for the selected target color.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-5">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-[1rem] border border-white/7 bg-black/24 p-3">
                            <div
                              className="h-28 rounded-[0.85rem]"
                              style={{ backgroundColor: targetColor }}
                            />
                            <p className="mt-3 text-[0.74rem] uppercase tracking-[0.18em] text-foreground/38">
                              Target
                            </p>
                            <p className="mt-1 font-mono text-[0.92rem] text-foreground/76">
                              {targetColor}
                            </p>
                          </div>

                          <div className="rounded-[1rem] border border-white/7 bg-black/24 p-3">
                            <div
                              className="h-28 rounded-[0.85rem]"
                              style={{ backgroundColor: result.achievedColor }}
                            />
                            <p className="mt-3 text-[0.74rem] uppercase tracking-[0.18em] text-foreground/38">
                              Result
                            </p>
                            <p className="mt-1 font-mono text-[0.92rem] text-foreground/76">
                              {result.achievedColor}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-white/8 pt-5">
                        {result.recipe.map((recipe, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-[1rem] bg-black/28 p-3"
                          >
                            <div
                              className="h-10 w-10 shrink-0 rounded-[0.8rem] border border-white/7"
                              style={{ backgroundColor: recipe.paint.hex }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[0.96rem] font-medium text-foreground">
                                {recipe.paint.name}
                              </p>
                              <p className="mt-1 text-[0.74rem] font-mono text-foreground/42">
                                RGB {recipe.paint.rgb.join(", ")}
                              </p>
                            </div>
                            <div className="text-[1rem] font-medium text-foreground/74">
                              {recipe.parts.toFixed(1)} pt
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
              ) : null}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
