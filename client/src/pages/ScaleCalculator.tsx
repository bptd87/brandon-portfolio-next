import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Ruler, ArrowRightLeft, Info, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

interface ScaleOption {
  label: string;
  ratio: number;
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

export default function ScaleCalculator() {
  const [activeTab, setActiveTab] = useState<'real-to-scale' | 'scale-to-real'>('real-to-scale');
  
  // Real → Scale Inputs
  const [realFeet, setRealFeet] = useState<string>('10');
  const [realInches, setRealInches] = useState<string>('0');
  
  // Scale → Real Inputs
  const [modelMM, setModelMM] = useState<string>('50');

  const [selectedScale, setSelectedScale] = useState<number>(48); // Default 1/4"
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

  return (
    <div className="min-h-screen">
      <SEO 
        title="Scale Calculator - 3D Printing & Model Making"
        description="Convert between architectural and model scales for 3D printing scenic design models. Calculate dimensions for 1/4 scale, 1:50, and custom ratios."
      />
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-20 border-b border-border">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#1976D2] flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs tracking-widest text-muted-foreground">APP STUDIO</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Scale Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Precision conversion engine for theatrical drafting and scale model fabrication. Convert real-world dimensions to model measurements for 3D printing.
          </p>
        </div>
      </section>

      {/* Header Image */}
      <section className="container max-w-6xl py-8">
        <div className="relative aspect-[2.35/1] rounded-3xl overflow-hidden shadow-2xl border border-border group">
          <img 
            src="https://s3.us-west-1.amazonaws.com/manus.static.files/scale-converter-abstract.webp"
            alt="Scale Calculator Visual" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
            <div>
              <p className="text-sm max-w-md text-white/90 font-medium drop-shadow-md">
                Convert between imperial and metric measurements with precision for 3D printing and handicraft.
              </p>
            </div>
            <Calculator className="w-16 h-16 text-white/60" />
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="container max-w-6xl">
          {/* Main Calculator Card */}
          <Card className="border-2">
            {/* Tab Switcher */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('real-to-scale')}
                className={`flex-1 py-6 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'real-to-scale'
                    ? 'bg-[#2196F3]/10 text-[#2196F3] border-b-2 border-[#2196F3]'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Real World → Scale Model
              </button>
              <button
                onClick={() => setActiveTab('scale-to-real')}
                className={`flex-1 py-6 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'scale-to-real'
                    ? 'bg-[#2196F3]/10 text-[#2196F3] border-b-2 border-[#2196F3]'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Scale Model → Real World
              </button>
            </div>

            <CardContent className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                {/* INPUT */}
                <div className="space-y-4">
                  <Label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Input ({activeTab === 'real-to-scale' ? 'Imperial' : 'Metric'})
                  </Label>
                  
                  {activeTab === 'real-to-scale' ? (
                    <div className="flex gap-4">
                      <div className="group relative flex-1">
                        <Input
                          type="number"
                          value={realFeet}
                          onChange={(e) => setRealFeet(e.target.value)}
                          className="w-full text-3xl font-mono text-center h-20 border-2"
                          placeholder="0"
                        />
                        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Feet
                        </span>
                      </div>
                      <div className="group relative flex-1">
                        <Input
                          type="number"
                          value={realInches}
                          onChange={(e) => setRealInches(e.target.value)}
                          className="w-full text-3xl font-mono text-center h-20 border-2"
                          placeholder="0"
                        />
                        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Inches
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <Input
                        type="number"
                        value={modelMM}
                        onChange={(e) => setModelMM(e.target.value)}
                        className="w-full text-3xl font-mono text-center h-20 border-2"
                        placeholder="0"
                      />
                      <span className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Millimeters
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center gap-2 pt-6">
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                  <div className="p-2 rounded-full border-2 border-[#2196F3] bg-[#2196F3]/10">
                    <ArrowRightLeft size={20} className="text-[#2196F3]" />
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                </div>

                {/* OUTPUT */}
                <div className="space-y-4">
                  <Label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Result ({activeTab === 'real-to-scale' ? 'Metric' : 'Imperial'})
                  </Label>
                  
                  <div className="rounded-2xl p-6 relative group h-20 flex items-center justify-center overflow-hidden border-2 border-[#2196F3]/20 bg-[#2196F3]/5">
                    <button 
                      onClick={() => {
                        if (activeTab === 'real-to-scale' && resultMM) {
                          copyToClipboard(resultMM.toFixed(2));
                        }
                        if (activeTab === 'scale-to-real' && resultReal) {
                          copyToClipboard(`${resultReal.feet}'-${resultReal.inches.toFixed(2)}"`);
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-black/5 text-[#2196F3] transition-colors z-20"
                      title="Copy Result"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>

                    <div className="relative z-10 text-center">
                      {activeTab === 'real-to-scale' ? (
                        resultMM !== null ? (
                          <span className="text-4xl font-mono font-bold text-[#2196F3]">
                            {resultMM.toFixed(2)}<span className="text-base ml-1 opacity-60">mm</span>
                          </span>
                        ) : (
                          <span className="text-4xl font-mono opacity-20 text-muted-foreground">---</span>
                        )
                      ) : (
                        resultReal ? (
                          <span className="text-3xl font-mono font-bold text-[#2196F3]">
                            {resultReal.feet}'<span className="opacity-60 mx-1">-</span>{resultReal.inches.toFixed(2)}"
                          </span>
                        ) : (
                          <span className="text-4xl font-mono opacity-20 text-muted-foreground">---</span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scale Ruler UI */}
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler size={18} className="text-[#2196F3]" />
                    <span className="text-xs font-bold uppercase tracking-widest">Scale Ratio</span>
                  </div>
                  <span className="text-sm font-mono px-3 py-1.5 rounded-lg border-2 border-[#2196F3]/20 bg-[#2196F3]/5 text-[#2196F3] font-bold">
                    {getSelectedScaleLabel()} (1:{selectedScale})
                  </span>
                </div>
                
                <div className="relative border-2 rounded-2xl flex items-center overflow-hidden bg-muted/30">
                  {/* Left Scroll Button */}
                  <button 
                    onClick={() => scrollScales('left')}
                    className="absolute left-0 top-0 bottom-0 z-20 px-3 flex items-center justify-center transition-colors hover:bg-black/5 bg-gradient-to-r from-background to-transparent"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={24} className="text-muted-foreground" />
                  </button>

                  {/* Scrollable Scales */}
                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto w-full scrollbar-hide px-12 snap-x snap-mandatory items-center py-6 scroll-smooth"
                  >
                    {ARCHITECTURAL_SCALES.map((scale) => (
                      <button
                        key={scale.ratio}
                        onClick={() => setSelectedScale(scale.ratio)}
                        className={`flex-shrink-0 snap-center px-6 py-3 rounded-xl border-2 transition-all duration-300 font-mono text-sm font-bold whitespace-nowrap ${
                          selectedScale === scale.ratio
                            ? 'bg-[#2196F3]/20 border-[#2196F3] text-[#2196F3] shadow-lg shadow-[#2196F3]/20'
                            : 'bg-card border-border text-muted-foreground hover:border-[#2196F3]/50 hover:bg-muted'
                        }`}
                      >
                        {scale.label}
                      </button>
                    ))}
                  </div>

                  {/* Right Scroll Button */}
                  <button 
                    onClick={() => scrollScales('right')}
                    className="absolute right-0 top-0 bottom-0 z-20 px-3 flex items-center justify-center transition-colors hover:bg-black/5 bg-gradient-to-l from-background to-transparent"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={24} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="mt-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#2196F3]" />
                Quick Reference: Common Scenic Design Scales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-4 text-[#2196F3] text-lg">Architectural Scales</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="font-mono font-bold">1/4" = 1'-0"</span>
                      <span className="text-sm text-muted-foreground">1:48 (Standard white model)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="font-mono font-bold">1/2" = 1'-0"</span>
                      <span className="text-sm text-muted-foreground">1:24 (Large detail model)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="font-mono font-bold">1" = 1'-0"</span>
                      <span className="text-sm text-muted-foreground">1:12 (Full detail model)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-4 text-[#FF5722] text-lg">3D Printing Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 py-3 border-b border-border">
                      <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm">1:50 Scale</p>
                        <p className="text-sm text-muted-foreground">Popular for 3D printing scenic models</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-3 border-b border-border">
                      <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm">1:25 Scale</p>
                        <p className="text-sm text-muted-foreground">Detailed 3D models with fine features</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-3 border-b border-border">
                      <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm">1/4" Scale</p>
                        <p className="text-sm text-muted-foreground">Standard for theatrical white models</p>
                      </div>
                    </div>
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
