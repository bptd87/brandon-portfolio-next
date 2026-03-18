import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Printer,
  Ruler,
} from "lucide-react";
import { SEO } from "@/components/SEO";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const selectedScaleLabel = useMemo(() => {
    return ARCHITECTURAL_SCALES.find((scale) => scale.ratio === selectedScale)?.label || `1:${selectedScale}`;
  }, [selectedScale]);

  const printerFitInfo = useMemo(() => {
    if (!resultMM) return null;
    const printer = PRINTER_BEDS.find((item) => item.name === selectedPrinter);
    if (!printer) return null;

    const fits = resultMM <= printer.width && resultMM <= printer.depth;
    return { fits, printer };
  }, [resultMM, selectedPrinter]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy", error);
      toast.error("Failed to copy");
    }
  };

  const scrollScales = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const resultText =
    activeTab === "real-to-scale"
      ? resultMM !== null
        ? `${resultMM.toFixed(2)} mm`
        : "---"
      : resultReal
        ? `${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`
        : "---";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Scale Calculator - 3D Printing & Model Making"
        description="Convert between architectural and model scales for 3D printing scenic design models. Calculate dimensions for 1/4 scale, 1:50, and custom ratios."
      />

      <Header />

      <main className="px-4 pb-24 pt-22 sm:px-6 md:pt-28">
        <section className="mx-auto max-w-5xl border-b border-border/18 pb-8 md:pb-12">
          <Link
            href="/studio/apps"
            className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Studio Apps
          </Link>

          <div className="mx-auto mt-6 max-w-4xl text-center md:mt-8">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
              Scale Calculator
            </p>
            <h1 className="mt-4 font-sans text-[clamp(2.45rem,8vw,5.1rem)] font-medium leading-[0.95] tracking-[-0.065em] text-foreground sm:text-[clamp(2.8rem,7vw,5.1rem)]">
              Convert real dimensions to model scale and back.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-7 text-foreground/60 md:mt-7 md:max-w-3xl md:text-[1.12rem] md:leading-8">
              A mobile-friendly scale converter for scenic drafting, model building, and 3D
              printing workflow.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-4xl md:mt-12">
          <div className="rounded-[1.2rem] border border-border/16 bg-card/10 p-3 sm:p-4 md:rounded-[1.4rem] md:p-6">
            <div className="border-b border-border/14 pb-4 md:pb-5">
              <div className="mx-auto flex max-w-[44rem] rounded-full bg-white/6 p-1">
                <button
                  onClick={() => setActiveTab("real-to-scale")}
                  className={`flex-1 rounded-full px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors sm:px-4 sm:text-[0.78rem] md:px-4 md:py-3 md:text-[0.82rem] md:tracking-[0.18em] ${
                    activeTab === "real-to-scale"
                      ? "bg-white text-black"
                      : "text-foreground/54 hover:text-foreground"
                  }`}
                >
                  Real to Scale
                </button>
                <button
                  onClick={() => setActiveTab("scale-to-real")}
                  className={`flex-1 rounded-full px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors sm:px-4 sm:text-[0.78rem] md:px-4 md:py-3 md:text-[0.82rem] md:tracking-[0.18em] ${
                    activeTab === "scale-to-real"
                      ? "bg-white text-black"
                      : "text-foreground/54 hover:text-foreground"
                  }`}
                >
                  Scale to Real
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)] md:mt-6">
              <div className="space-y-5 md:space-y-6">
                <div className="rounded-[0.95rem] border border-border/16 bg-black/10 p-4 md:rounded-[1rem] md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Result
                      </p>
                      <p className="mt-3 font-mono text-[1.8rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem] md:text-[2.4rem]">
                        {resultText}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (activeTab === "real-to-scale" && resultMM !== null) {
                          copyToClipboard(resultMM.toFixed(2));
                        }
                        if (activeTab === "scale-to-real" && resultReal) {
                          copyToClipboard(`${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`);
                        }
                      }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-foreground/70 transition-colors hover:bg-white/12 hover:text-foreground"
                      aria-label="Copy result"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-border/16 pt-5">
                  <div className="mb-4 flex items-center gap-2 text-foreground/56">
                    <span className="text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                      Input
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {activeTab === "real-to-scale" ? (
                    <>
                      <div>
                        <Label className="mb-2 block text-[0.8rem] font-medium uppercase tracking-[0.16em] text-foreground/42">
                          Feet
                        </Label>
                        <Input
                          type="number"
                          value={realFeet}
                          onChange={(e) => setRealFeet(e.target.value)}
                          className="h-13 rounded-[0.85rem] border-border/20 bg-background/60 px-4 text-right font-mono text-[1.3rem] sm:h-14 sm:rounded-[0.9rem] sm:text-center sm:text-[1.45rem]"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-[0.8rem] font-medium uppercase tracking-[0.16em] text-foreground/42">
                          Inches
                        </Label>
                        <Input
                          type="number"
                          value={realInches}
                          onChange={(e) => setRealInches(e.target.value)}
                          className="h-13 rounded-[0.85rem] border-border/20 bg-background/60 px-4 text-right font-mono text-[1.3rem] sm:h-14 sm:rounded-[0.9rem] sm:text-center sm:text-[1.45rem]"
                          placeholder="0"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:max-w-xs">
                      <Label className="mb-2 block text-[0.8rem] font-medium uppercase tracking-[0.16em] text-foreground/42">
                        Model millimeters
                      </Label>
                        <Input
                          type="number"
                          value={modelMM}
                          onChange={(e) => setModelMM(e.target.value)}
                          className="h-13 rounded-[0.85rem] border-border/20 bg-background/60 px-4 text-right font-mono text-[1.3rem] sm:h-14 sm:rounded-[0.9rem] sm:text-center sm:text-[1.45rem]"
                          placeholder="0"
                        />
                      </div>
                  )}
                </div>
                </div>

                <div className="border-t border-border/16 pt-5 md:pt-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-foreground/56">
                      <Ruler className="h-4 w-4" />
                      <span className="text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                        Scale
                      </span>
                    </div>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-[0.82rem] font-medium text-foreground/74">
                      {selectedScaleLabel}
                    </span>
                  </div>

                  <div className="relative rounded-[0.95rem] border border-border/18 bg-background/40 md:rounded-[1rem]">
                    <button
                      onClick={() => scrollScales("left")}
                      className="absolute left-0 top-0 bottom-0 z-10 flex w-10 items-center justify-center bg-gradient-to-r from-background via-background/85 to-transparent text-foreground/46"
                      aria-label="Scroll scales left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div
                      ref={scrollContainerRef}
                      className="flex gap-2 overflow-x-auto px-10 py-3 scrollbar-hide"
                    >
                      {ARCHITECTURAL_SCALES.map((scale) => (
                        <button
                          key={scale.ratio}
                          onClick={() => setSelectedScale(scale.ratio)}
                          className={`shrink-0 rounded-full border px-3 py-2 text-[0.78rem] font-medium transition-colors sm:px-4 sm:text-[0.83rem] ${
                            selectedScale === scale.ratio
                              ? "border-white bg-white text-black"
                              : "border-border/18 bg-white/5 text-foreground/58 hover:text-foreground"
                          }`}
                        >
                          {scale.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => scrollScales("right")}
                      className="absolute right-0 top-0 bottom-0 z-10 flex w-10 items-center justify-center bg-gradient-to-l from-background via-background/85 to-transparent text-foreground/46"
                      aria-label="Scroll scales right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <aside className="border-t border-border/16 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1">
                <div className="flex items-center gap-2 text-foreground/56">
                  <Printer className="h-4 w-4" />
                  <span className="text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                    Printer Fit
                  </span>
                </div>

                <div className="mt-4">
                  <Label className="mb-2 block text-[0.8rem] font-medium uppercase tracking-[0.16em] text-foreground/42">
                    Printer bed
                  </Label>
                  <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                  <SelectTrigger className="h-12 rounded-[0.85rem] border-border/20 bg-background/60 md:rounded-[0.9rem]">
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
                    className={`mt-5 rounded-[1rem] border p-4 ${
                      printerFitInfo.fits
                        ? "border-emerald-500/18 bg-emerald-500/6"
                        : "border-rose-500/18 bg-rose-500/6"
                    }`}
                  >
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/42">
                      {printerFitInfo.fits ? "Fit check" : "Size check"}
                    </p>
                    <p className="mt-3 text-[1.05rem] font-medium text-foreground">
                      {printerFitInfo.fits ? "This model should fit." : "This model is too large."}
                    </p>
                    <p className="mt-3 text-[0.92rem] leading-6 text-foreground/62">
                      Model size: {resultMM.toFixed(1)}mm
                      <br />
                      Bed size: {printerFitInfo.printer.width} x {printerFitInfo.printer.depth}mm
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1rem] border border-border/16 bg-white/5 p-4">
                    <p className="text-[0.92rem] leading-6 text-foreground/56">
                      Enter a dimension and choose a scale to check whether the model fits your
                      printer bed.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
