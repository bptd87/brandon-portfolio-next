import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Info, Copy, Check, ChevronLeft, ChevronRight, Ruler, Printer } from "lucide-react";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScaleOption {
  label: string;
  ratio: number;
}

interface PrinterBed {
  name: string;
  width: number; // mm
  depth: number; // mm
  height: number; // mm
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
  const [activeTab, setActiveTab] = useState<'real-to-scale' | 'scale-to-real'>('real-to-scale');
  
  // Real → Scale Inputs
  const [realFeet, setRealFeet] = useState<string>('10');
  const [realInches, setRealInches] = useState<string>('0');
  
  // Scale → Real Inputs
  const [modelMM, setModelMM] = useState<string>('50');

  const [selectedScale, setSelectedScale] = useState<number>(48); // Default 1/4"
  const [selectedPrinter, setSelectedPrinter] = useState<string>("Prusa MK4");
  const [resultMM, setResultMM] = useState<number | null>(null);
  const [resultReal, setResultReal] = useState<{ feet: number; inches: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculation Logic
  useEffect(() => {
    if (activeTab === 'real-to-scale') {
      const feet = parseFloat(realFeet) || 0;
      const inches = parseFloat(realInches) || 0;
      if (feet === 0 && inches === 0) {
        setResultMM(null);
        return;
      }
      const totalInches = (feet * 12) + inches;
      const modelInches = totalInches / selectedScale;
      setResultMM(modelInches * 25.4);
    } else {
      const mm = parseFloat(modelMM) || 0;
      if (mm === 0) {
        setResultReal(null);
        return;
      }
      const modelInches = mm / 25.4;
      const realTotalInches = modelInches * selectedScale;
      setResultReal({
        feet: Math.floor(realTotalInches / 12),
        inches: realTotalInches % 12
      });
    }
  }, [realFeet, realInches, modelMM, selectedScale, activeTab]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      toast.error('Failed to copy');
    }
  };

  const scrollScales = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getSelectedScaleLabel = () => {
    const scale = ARCHITECTURAL_SCALES.find(s => s.ratio === selectedScale);
    return scale?.label || `1:${selectedScale}`;
  };

  const checkPrinterFit = () => {
    if (!resultMM) return null;
    const printer = PRINTER_BEDS.find(p => p.name === selectedPrinter);
    if (!printer) return null;
    
    const fits = resultMM <= printer.width && resultMM <= printer.depth;
    return { fits, printer };
  };

  const printerFitInfo = checkPrinterFit();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Scale Calculator - 3D Printing & Model Making"
        description="Convert between architectural and model scales for 3D printing scenic design models. Calculate dimensions for 1/4 scale, 1:50, and custom ratios."
      />
      <Header />

      {/* Compact Hero with Header Image */}
      <section className="relative h-[30vh] md:h-[35vh] overflow-hidden border-b border-border">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/lnzkWrrrBVEdEMDu.webp"
          alt="Scale Calculator - Precision conversion for theatrical drafting" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        
        <div className="absolute bottom-0 left-0 right-0 container max-w-5xl pb-4 md:pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-4 h-4 text-[#2196F3]" />
            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-semibold uppercase">Scale Calculator</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 text-white drop-shadow-lg">
            3D Printing Scale Converter
          </h1>
          <p className="text-xs md:text-sm text-white/90 max-w-2xl drop-shadow">
            Convert real-world dimensions to model measurements for theatrical 3D printing
          </p>
        </div>
      </section>

      {/* Main Calculator - Single Screen */}
      <section className="flex-1 py-6 md:py-8">
        <div className="container max-w-5xl">
          <Card className="border-2">
            {/* Tab Switcher */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('real-to-scale')}
                className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'real-to-scale'
                    ? 'bg-[#2196F3] text-white'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Real → Scale
              </button>
              <button
                onClick={() => setActiveTab('scale-to-real')}
                className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'scale-to-real'
                    ? 'bg-[#2196F3] text-white'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Scale → Real
              </button>
            </div>

            <CardContent className="p-4 md:p-6">
              {/* Compact Conversion Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-6">
                {/* INPUT */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Input
                  </Label>
                  
                  {activeTab === 'real-to-scale' ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={realFeet}
                          onChange={(e) => setRealFeet(e.target.value)}
                          className="w-full text-2xl font-mono text-center h-16 border-2"
                          placeholder="0"
                        />
                        <span className="absolute -bottom-5 left-0 right-0 text-center text-xs font-bold uppercase text-muted-foreground">
                          Feet
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={realInches}
                          onChange={(e) => setRealInches(e.target.value)}
                          className="w-full text-2xl font-mono text-center h-16 border-2"
                          placeholder="0"
                        />
                        <span className="absolute -bottom-5 left-0 right-0 text-center text-xs font-bold uppercase text-muted-foreground">
                          Inches
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        type="number"
                        value={modelMM}
                        onChange={(e) => setModelMM(e.target.value)}
                        className="w-full text-2xl font-mono text-center h-16 border-2"
                        placeholder="0"
                      />
                      <span className="absolute -bottom-5 left-0 right-0 text-center text-xs font-bold uppercase text-muted-foreground">
                        Millimeters
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center gap-2 pt-3">
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
                  <div className="p-2 rounded-full border-2 border-[#2196F3] bg-[#2196F3]/10">
                    <ArrowRightLeft size={16} className="text-[#2196F3]" />
                  </div>
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
                </div>

                {/* OUTPUT */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Result
                  </Label>
                  
                  <div className="rounded-xl p-4 relative h-16 flex items-center justify-center border-2 border-[#2196F3]/20 bg-[#2196F3]/5">
                    <button 
                      onClick={() => {
                        if (activeTab === 'real-to-scale' && resultMM) {
                          copyToClipboard(resultMM.toFixed(2));
                        }
                        if (activeTab === 'scale-to-real' && resultReal) {
                          copyToClipboard(`${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`);
                        }
                      }}
                      className="absolute top-2 right-2 p-1 rounded hover:bg-black/5 text-[#2196F3] transition-colors"
                      title="Copy Result"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <div className="text-center">
                      {activeTab === 'real-to-scale' ? (
                        resultMM !== null ? (
                          <span className="text-3xl font-mono font-bold text-[#2196F3]">
                            {resultMM.toFixed(2)}<span className="text-sm ml-1 opacity-60">mm</span>
                          </span>
                        ) : (
                          <span className="text-3xl font-mono opacity-20 text-muted-foreground">---</span>
                        )
                      ) : (
                        resultReal ? (
                          <span className="text-2xl font-mono font-bold text-[#2196F3]">
                            {resultReal.feet}'<span className="opacity-60 mx-1">-</span>{resultReal.inches.toFixed(2)}"
                          </span>
                        ) : (
                          <span className="text-3xl font-mono opacity-20 text-muted-foreground">---</span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scale Ruler - Compact */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler size={16} className="text-[#2196F3]" />
                    <span className="text-xs font-bold uppercase tracking-widest">Scale</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded border-2 border-[#2196F3]/20 bg-[#2196F3]/5 text-[#2196F3] font-bold">
                    {getSelectedScaleLabel()}
                  </span>
                </div>
                
                <div className="relative border-2 rounded-xl flex items-center overflow-hidden bg-muted/30">
                  <button 
                    onClick={() => scrollScales('left')}
                    className="absolute left-0 top-0 bottom-0 z-20 px-2 flex items-center justify-center transition-colors hover:bg-black/5 bg-gradient-to-r from-background to-transparent"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={20} className="text-muted-foreground" />
                  </button>

                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-x-auto w-full scrollbar-hide px-10 snap-x snap-mandatory items-center py-3 scroll-smooth"
                  >
                    {ARCHITECTURAL_SCALES.map((scale) => (
                      <button
                        key={scale.ratio}
                        onClick={() => setSelectedScale(scale.ratio)}
                        className={`flex-shrink-0 snap-center px-4 py-2 rounded-lg border-2 transition-all duration-300 font-mono text-xs font-bold whitespace-nowrap ${
                          selectedScale === scale.ratio
                            ? 'bg-[#2196F3]/20 border-[#2196F3] text-[#2196F3] shadow-lg'
                            : 'bg-card border-border text-muted-foreground hover:border-[#2196F3]/50'
                        }`}
                      >
                        {scale.label}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => scrollScales('right')}
                    className="absolute right-0 top-0 bottom-0 z-20 px-2 flex items-center justify-center transition-colors hover:bg-black/5 bg-gradient-to-l from-background to-transparent"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* 3D Printer Bed Size Checker */}
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <Printer size={16} className="text-[#FF5722]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Printer Bed Check
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-2 block">Select Printer</Label>
                    <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRINTER_BEDS.map((printer) => (
                          <SelectItem key={printer.name} value={printer.name}>
                            {printer.name} ({printer.width}×{printer.depth}mm)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    {printerFitInfo && resultMM && (
                      <div className={`p-3 rounded-lg border-2 ${
                        printerFitInfo.fits 
                          ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400' 
                          : 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400'
                      }`}>
                        <div className="font-bold text-sm mb-1">
                          {printerFitInfo.fits ? '✓ Will Fit' : '✗ Too Large'}
                        </div>
                        <div className="text-xs opacity-80">
                          Model: {resultMM.toFixed(1)}mm<br />
                          Bed: {printerFitInfo.printer.width}×{printerFitInfo.printer.depth}mm
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
