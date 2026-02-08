import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, Palette, Ruler } from "lucide-react";
import { useState } from "react";

export default function StudioApps() {
  // Scale Converter State
  const [realMeasurement, setRealMeasurement] = useState("");
  const [scale, setScale] = useState("1/4");
  const [scaleResult, setScaleResult] = useState("");

  // Dimension Reference State
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [dimensionResult, setDimensionResult] = useState("");

  const calculateScale = () => {
    if (!realMeasurement) return;
    
    const measurement = parseFloat(realMeasurement);
    const scales: Record<string, number> = {
      "1/4": 0.25,
      "1/2": 0.5,
      "1/8": 0.125,
      "1": 1,
    };

    const scaleFactor = scales[scale] || 0.25;
    const result = measurement * scaleFactor;
    
    const resultInches = result % 12;
    const resultFeet = Math.floor(result / 12);
    
    if (resultFeet > 0) {
      setScaleResult(`${resultFeet}' ${resultInches.toFixed(2)}"`);
    } else {
      setScaleResult(`${resultInches.toFixed(2)}"`);
    }
  };

  const convertDimensions = () => {
    const feetNum = parseFloat(feet) || 0;
    const inchesNum = parseFloat(inches) || 0;
    
    const totalInches = (feetNum * 12) + inchesNum;
    const totalFeet = totalInches / 12;
    const meters = totalInches * 0.0254;
    const centimeters = totalInches * 2.54;
    
    setDimensionResult(
      `Total: ${totalFeet.toFixed(2)} ft | ${totalInches.toFixed(2)} in | ${meters.toFixed(2)} m | ${centimeters.toFixed(2)} cm`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-20 border-b border-border bg-gradient-to-br from-[#FF5722]/5 to-transparent">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">STUDIO / APP STUDIO</p>
          <h1 className="mb-4">Interactive Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A collection of practical tools for scenic designers, technical directors, and theatre professionals. 
            Calculate scales, convert dimensions, and reference common measurements.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Scale Converter */}
          <Card className="border-2 hover:border-[#FF5722]/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-[#FF5722]" />
                <div>
                  <CardTitle>Architecture Scale Converter</CardTitle>
                  <CardDescription>
                    Convert real-world measurements to scale for drafting and model building
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="realMeasurement">Real Measurement (inches)</Label>
                  <Input
                    id="realMeasurement"
                    type="number"
                    placeholder="e.g., 120"
                    value={realMeasurement}
                    onChange={(e) => setRealMeasurement(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scale">Scale</Label>
                  <Select value={scale} onValueChange={setScale}>
                    <SelectTrigger id="scale">
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1/4">1/4" = 1'-0"</SelectItem>
                      <SelectItem value="1/2">1/2" = 1'-0"</SelectItem>
                      <SelectItem value="1/8">1/8" = 1'-0"</SelectItem>
                      <SelectItem value="1">1" = 1'-0"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Result</Label>
                  <div className="flex gap-2">
                    <Input
                      value={scaleResult}
                      readOnly
                      placeholder="Scaled measurement"
                      className="bg-muted"
                    />
                    <Button onClick={calculateScale} className="bg-[#FF5722] hover:bg-[#E64A19]">Calculate</Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Common Scales:</p>
                <ul className="space-y-1">
                  <li>• <strong>1/4" = 1'-0"</strong> - Most common for ground plans and elevations</li>
                  <li>• <strong>1/2" = 1'-0"</strong> - Detailed drawings and sections</li>
                  <li>• <strong>1/8" = 1'-0"</strong> - Site plans and large venues</li>
                  <li>• <strong>1" = 1'-0"</strong> - Full-scale details</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Reference */}
          <Card className="border-2 hover:border-[#FF5722]/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Ruler className="h-6 w-6 text-[#FF5722]" />
                <div>
                  <CardTitle>Dimension Reference</CardTitle>
                  <CardDescription>
                    Convert between feet, inches, meters, and centimeters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="feet">Feet</Label>
                  <Input
                    id="feet"
                    type="number"
                    placeholder="0"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inches">Inches</Label>
                  <Input
                    id="inches"
                    type="number"
                    placeholder="0"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={convertDimensions} className="w-full bg-[#FF5722] hover:bg-[#E64A19]">
                    Convert
                  </Button>
                </div>
              </div>

              {dimensionResult && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{dimensionResult}</p>
                </div>
              )}

              <Separator className="my-6" />

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Quick Reference:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-1">
                    <li>• 1 foot = 12 inches</li>
                    <li>• 1 inch = 2.54 centimeters</li>
                    <li>• 1 foot = 0.3048 meters</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• 1 meter = 3.28084 feet</li>
                    <li>• 1 meter = 39.3701 inches</li>
                    <li>• 1 centimeter = 0.393701 inches</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paint Reference */}
          <Card className="border-2 hover:border-[#FF5722]/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-[#FF5722]" />
                <div>
                  <CardTitle>Scenic Paint Reference</CardTitle>
                  <CardDescription>
                    Common scenic paint colors and mixing ratios
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Base Coat Colors</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 border rounded-lg">
                      <div className="h-12 bg-white border mb-2 rounded"></div>
                      <p className="text-sm font-medium">White</p>
                      <p className="text-xs text-muted-foreground">Base coat</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="h-12 bg-black mb-2 rounded"></div>
                      <p className="text-sm font-medium">Black</p>
                      <p className="text-xs text-muted-foreground">Shadows</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="h-12 bg-red-600 mb-2 rounded"></div>
                      <p className="text-sm font-medium">Red</p>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="h-12 bg-blue-600 mb-2 rounded"></div>
                      <p className="text-sm font-medium">Blue</p>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Common Mixing Ratios</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Stone/Concrete Gray</p>
                      <p className="text-muted-foreground">White + Black (10:1) + touch of Raw Umber</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Aged Wood</p>
                      <p className="text-muted-foreground">Raw Umber + Burnt Sienna (3:1) + touch of Black</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Brick Red</p>
                      <p className="text-muted-foreground">Red + Raw Umber (2:1) + touch of Yellow Ochre</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Sky Blue</p>
                      <p className="text-muted-foreground">White + Ultramarine Blue (20:1) + tiny touch of Black</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Pro Tips:</p>
                  <ul className="space-y-1">
                    <li>• Always mix more paint than you think you'll need</li>
                    <li>• Test colors on scrap material before applying to scenery</li>
                    <li>• Keep detailed records of your mixing ratios</li>
                    <li>• Add water gradually to achieve desired consistency</li>
                    <li>• Colors dry darker - account for this in your mixing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standard Dimensions Reference */}
          <Card className="border-2 hover:border-[#FF5722]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle>Standard Theatre Dimensions</CardTitle>
              <CardDescription>
                Common measurements for scenic elements and stage furniture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Furniture Heights</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Chair seat</span>
                      <span className="text-muted-foreground">17" - 18"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Table (dining)</span>
                      <span className="text-muted-foreground">29" - 30"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Counter height</span>
                      <span className="text-muted-foreground">36"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Bar height</span>
                      <span className="text-muted-foreground">42"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Desk height</span>
                      <span className="text-muted-foreground">29" - 30"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Door & Window</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Standard door</span>
                      <span className="text-muted-foreground">6'8" x 3'0"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Interior door</span>
                      <span className="text-muted-foreground">6'8" x 2'6"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Window sill</span>
                      <span className="text-muted-foreground">36" - 42"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Window head</span>
                      <span className="text-muted-foreground">6'8" - 7'0"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Doorknob height</span>
                      <span className="text-muted-foreground">36"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Human Dimensions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Average height</span>
                      <span className="text-muted-foreground">5'6" - 5'10"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Eye level (standing)</span>
                      <span className="text-muted-foreground">5'0" - 5'6"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Shoulder width</span>
                      <span className="text-muted-foreground">18" - 24"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Arm reach</span>
                      <span className="text-muted-foreground">30" - 36"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Stage Elements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Step riser</span>
                      <span className="text-muted-foreground">6" - 8"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Step tread</span>
                      <span className="text-muted-foreground">11" - 12"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Handrail height</span>
                      <span className="text-muted-foreground">34" - 38"</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Platform standard</span>
                      <span className="text-muted-foreground">4' x 8'</span>
                    </li>
                  </ul>
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
