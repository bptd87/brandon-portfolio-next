"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  Check,
  Ruler,
  X,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

interface ScaleOption {
  label: string;
  ratio: number;
}

interface PrinterBed {
  name: string;
  width: number;
  depth: number;
  height: number;
}

const ARCHITECTURAL_SCALES: ScaleOption[] = [
  { label: '1" = 1\'-0"', ratio: 12 },
  { label: '3/4" = 1\'-0"', ratio: 16 },
  { label: '1/2" = 1\'-0"', ratio: 24 },
  { label: '3/8" = 1\'-0"', ratio: 32 },
  { label: '1/4" = 1\'-0"', ratio: 48 },
  { label: '3/16" = 1\'-0"', ratio: 64 },
  { label: '1/8" = 1\'-0"', ratio: 96 },
  { label: '3/32" = 1\'-0"', ratio: 128 },
  { label: '1/16" = 1\'-0"', ratio: 192 },
];

const PRINTER_BEDS: PrinterBed[] = [
  { name: "Prusa Mini", width: 180, depth: 180, height: 180 },
  { name: "Prusa MK4", width: 250, depth: 210, height: 220 },
  { name: "Ender 3 V2", width: 220, depth: 220, height: 250 },
  { name: "Bambu Lab P1P", width: 256, depth: 256, height: 256 },
  { name: "Bambu Lab X1C", width: 256, depth: 256, height: 256 },
  { name: "Creality CR-10", width: 300, depth: 300, height: 400 },
  { name: "Anycubic Photon", width: 115, depth: 65, height: 155 },
];

const cleanWholeNumberInput = (value: string) => value.replace(/\D/g, "");

const cleanDecimalInput = (value: string) => {
  const numeric = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = numeric.split(".");
  return decimalParts.length > 0
    ? `${whole}.${decimalParts.join("")}`
    : whole;
};

const restoreZero = (value: string) => (value.trim() === "" ? "0" : value);

export default function ScaleCalculator() {
  const [activeTab, setActiveTab] = useState<"real-to-scale" | "scale-to-real">("real-to-scale");
  const [realFeet, setRealFeet] = useState("10");
  const [realInches, setRealInches] = useState("0");
  const [modelMM, setModelMM] = useState("50");
  const [selectedScale, setSelectedScale] = useState<number>(48);
  const [selectedPrinter, setSelectedPrinter] = useState("Prusa MK4");
  const [resultMM, setResultMM] = useState<number | null>(null);
  const [resultReal, setResultReal] = useState<{ feet: number; inches: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "real-to-scale") {
      const feet = parseFloat(realFeet) || 0;
      const inches = parseFloat(realInches) || 0;
      if (feet === 0 && inches === 0) {
        setResultMM(null);
        return;
      }

      const totalInches = feet * 12 + inches;
      const modelInches = totalInches / selectedScale;
      setResultMM(modelInches * 25.4);
      return;
    }

    const mm = parseFloat(modelMM) || 0;
    if (mm === 0) {
      setResultReal(null);
      return;
    }

    const modelInches = mm / 25.4;
    const realTotalInches = modelInches * selectedScale;
    setResultReal({
      feet: Math.floor(realTotalInches / 12),
      inches: realTotalInches % 12,
    });
  }, [activeTab, modelMM, realFeet, realInches, selectedScale]);

  const printerFitInfo = useMemo(() => {
    if (!resultMM) return null;
    const printer = PRINTER_BEDS.find((item) => item.name === selectedPrinter);
    if (!printer) return null;

    const fits = resultMM <= printer.width && resultMM <= printer.depth;
    return { fits, printer };
  }, [resultMM, selectedPrinter]);

  const copyToClipboard = async (text: string) => {
    const copied = await copyTextToClipboard(text);
    if (copied) {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  const resultText =
    activeTab === "real-to-scale"
      ? resultMM !== null
        ? `${resultMM.toFixed(2)} mm`
        : "---"
      : resultReal
        ? `${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`
        : "---";

  const resultValue =
    activeTab === "real-to-scale"
      ? resultMM !== null
        ? resultMM.toFixed(2)
        : "---"
      : resultReal
        ? `${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`
        : "---";

  const resultUnit = activeTab === "real-to-scale" ? "mm" : "full";

  const targetLabel =
    activeTab === "real-to-scale" ? "Model size" : "Full-size dimension";

  const copyResult = () => {
    if (resultText !== "---") {
      copyToClipboard(resultText);
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f3eee4] text-black">
      <SEO
        title="Architectural Scale Calculator for 3D Printing"
        description="Convert full-size architectural and scenic dimensions into model scale millimeters for 3D printing, drafting, and physical model making."
      />

      <main className="studio-app-main box-border h-full overflow-hidden px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.55rem)] sm:px-4 md:px-5">
        <section className="relative mx-auto flex h-full max-w-[29rem] flex-col overflow-hidden">
          <header className="studio-app-mobile-topbar grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
            <Link
              href="/studio/apps"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0bd77] text-[#54240f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_10px_24px_rgba(128,54,23,0.2)]"
              aria-label="Back to Studio Apps"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                Scale
              </p>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-1">
            <section className="relative flex min-h-[9rem] flex-[0.78] flex-col overflow-hidden rounded-[0.45rem] border border-black/10 bg-[#fbf7ef] p-4 shadow-[0_24px_70px_rgba(58,45,31,0.16),inset_0_1px_rgba(255,255,255,0.75)]">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/80" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-black/8" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-black/42">
                    {targetLabel}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDirectionsOpen(true)}
                    className="h-8 border border-[#a94b23] bg-[#d06934] px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-black shadow-none"
                  >
                    Directions
                  </button>
                  <button
                    onClick={copyResult}
                    className="flex h-8 w-8 shrink-0 items-center justify-center bg-black text-[#f8f1e6] shadow-[0_10px_18px_rgba(38,30,20,0.18)] transition-opacity hover:opacity-90"
                    aria-label="Copy result"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="min-w-0 pb-3 pt-[clamp(2.2rem,4.5dvh,3.8rem)]">
                <p className="block max-w-full overflow-hidden whitespace-nowrap font-sans text-[clamp(5.25rem,19.4vw,6.55rem)] font-semibold leading-[0.84] tracking-normal text-black tabular-nums">
                  {resultValue}
                </p>
                <p className="font-sans text-[clamp(2.75rem,9.6vw,3.35rem)] font-semibold leading-none tracking-normal text-black">
                  {resultUnit}
                </p>
              </div>
            </section>

            <div
              className="relative grid h-12 grid-cols-2 border border-black/10 bg-[#e7dfd0] p-1 text-left shadow-[inset_0_1px_rgba(255,255,255,0.62)]"
              role="group"
              aria-label="Conversion direction"
            >
              <span
                className={`pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] bg-black shadow-[0_10px_22px_rgba(38,30,20,0.16)] transition-transform ${
                  activeTab === "scale-to-real"
                    ? "translate-x-[calc(100%+0.5rem)]"
                    : "translate-x-0"
                }`}
              >
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("real-to-scale")}
                aria-pressed={activeTab === "real-to-scale"}
                className={`relative z-10 flex items-center justify-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] ${
                  activeTab === "real-to-scale" ? "text-[#f8f1e6]" : "text-black/48"
                }`}
              >
                Full to Model
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("scale-to-real")}
                aria-pressed={activeTab === "scale-to-real"}
                className={`relative z-10 flex items-center justify-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] ${
                  activeTab === "scale-to-real" ? "text-[#f8f1e6]" : "text-black/48"
                }`}
              >
                Model to Full
              </button>
            </div>

            <section className="rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
              <div className="mb-2 flex items-center gap-2 text-black/46">
                <Ruler className="h-4 w-4" />
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                  Dimension
                </p>
              </div>

              {activeTab === "real-to-scale" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-black/40">
                      Feet
                    </Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={realFeet}
                      onChange={(event) => setRealFeet(cleanWholeNumberInput(event.target.value))}
                      onBlur={() => setRealFeet((value) => restoreZero(value))}
                      onFocus={(event) => event.currentTarget.select()}
                      enterKeyHint="next"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-label="Full-size feet"
                      className="h-[3.25rem] rounded-[0.18rem] border-black/10 bg-[#ece5d7] px-4 text-center font-sans text-[1.75rem] font-semibold tracking-normal text-black tabular-nums placeholder:text-black/22 focus-visible:ring-[#d06934]/70"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-black/40">
                      Inches
                    </Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.]?[0-9]*"
                      value={realInches}
                      onChange={(event) => setRealInches(cleanDecimalInput(event.target.value))}
                      onBlur={() => setRealInches((value) => restoreZero(value))}
                      onFocus={(event) => event.currentTarget.select()}
                      enterKeyHint="done"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-label="Full-size inches"
                      className="h-[3.25rem] rounded-[0.18rem] border-black/10 bg-[#ece5d7] px-4 text-center font-sans text-[1.75rem] font-semibold tracking-normal text-black tabular-nums placeholder:text-black/22 focus-visible:ring-[#d06934]/70"
                      placeholder="0"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-black/40">
                    Millimeters
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    value={modelMM}
                    onChange={(event) => setModelMM(cleanDecimalInput(event.target.value))}
                    onBlur={() => setModelMM((value) => restoreZero(value))}
                    onFocus={(event) => event.currentTarget.select()}
                    enterKeyHint="done"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Model millimeters"
                    className="h-[3.25rem] rounded-[0.18rem] border-black/10 bg-[#ece5d7] px-4 text-center font-sans text-[1.75rem] font-semibold tracking-normal text-black tabular-nums placeholder:text-black/22 focus-visible:ring-[#d06934]/70"
                    placeholder="0"
                  />
                </div>
              )}
            </section>

            <section className="rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
              <div className="mb-2 flex items-center gap-2 text-black/46">
                <Ruler className="h-4 w-4" />
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                  Scale
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ARCHITECTURAL_SCALES.map((scale) => (
                  <button
                    key={scale.ratio}
                    onClick={() => setSelectedScale(scale.ratio)}
                    aria-pressed={selectedScale === scale.ratio}
                    className={`h-9 rounded-[0.12rem] border px-1 text-[0.66rem] font-semibold tracking-normal transition-colors ${
                      selectedScale === scale.ratio
                        ? "border-[#d06934] bg-[#d06934] text-black shadow-[0_10px_18px_rgba(82,48,18,0.16)]"
                        : "border-black bg-black text-[#f8f1e6]"
                    }`}
                  >
                    {scale.label}
                  </button>
                ))}
              </div>
            </section>

            {activeTab === "real-to-scale" ? (
              <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[0.38rem] border border-black/10 bg-[#fbf7ef] p-2 shadow-[0_10px_30px_rgba(58,45,31,0.08),inset_0_1px_rgba(255,255,255,0.68)]">
                <div className="min-w-0">
                  <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                    <SelectTrigger className="h-11 rounded-[0.18rem] border-black/10 bg-[#ece5d7] text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRINTER_BEDS.map((printer) => (
                        <SelectItem key={printer.name} value={printer.name}>
                          {printer.name} ({printer.width}x{printer.depth}mm)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {printerFitInfo && resultMM ? (
                  <div
                    className={`flex h-11 min-w-[5.1rem] items-center justify-center rounded-[0.18rem] border px-3 ${
                      printerFitInfo.fits
                        ? "border-black/10 bg-[#dce8cf]"
                        : "border-black/10 bg-[#ead2cd]"
                    }`}
                  >
                    <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-black/72">
                      {printerFitInfo.fits ? "Fits" : "Large"}
                    </p>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          {directionsOpen ? (
            <div className="absolute inset-0 z-20 flex items-end bg-[#f3eee4]/78 p-3 backdrop-blur-sm">
              <section className="w-full border border-black/12 bg-[#fbf7ef] p-4 shadow-[0_24px_70px_rgba(58,45,31,0.22)]">
                <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#d06934]">
                      Directions
                    </p>
                    <h2 className="mt-1 text-[1.25rem] font-semibold leading-none tracking-[-0.04em] text-black">
                      Fast scale check.
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDirectionsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center border border-black/12 bg-[#ece5d7] text-black"
                    aria-label="Close directions"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 pt-3 text-[0.88rem] font-medium leading-5 tracking-normal text-black/68">
                  <p>
                    Choose full-to-model or model-to-full.
                  </p>
                  <p>
                    Enter the dimension, then select the drawing scale.
                  </p>
                  <p>
                    Copy the result or use the printer fit status as a quick size check.
                  </p>
                </div>
              </section>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
