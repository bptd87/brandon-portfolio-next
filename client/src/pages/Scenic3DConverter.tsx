import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowLeft, Boxes, CheckCircle2, Download, ExternalLink, FileCode2, FolderOpen, MousePointerClick, Sparkles, TriangleAlert, Wrench } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PAGE_URL = "https://www.brandonptdavis.com/studio/apps/scenic-3d-converter";
const PAGE_IMAGE = "https://www.brandonptdavis.com/assets/studio/scenic-3d-converter-card.webp";
const PAGE_HERO_IMAGE = "https://www.brandonptdavis.com/assets/studio/scenic-3d-converter-hero.webp";
const DOWNLOAD_URL_ABS = "https://www.brandonptdavis.com/api/downloads/scenic-3d-converter";
const PAGE_TITLE = "Scenic 3D Converter for Vectorworks (Mac) | Local Finder Quick Action";
const PAGE_DESCRIPTION =
  "Download Scenic 3D Converter for Mac to convert 3D files locally into Vectorworks-friendly USD, USDZ, and 3DM formats using a Finder right-click workflow.";
const DOWNLOAD_URL = "/api/downloads/scenic-3d-converter";

const conversionModes = [
  {
    name: "USD (Smallest)",
    use: "Best for compact files and fast import.",
    icon: <Boxes className="h-4 w-4" />,
    accent: "#00E5FF",
  },
  {
    name: "USDZ (Textures)",
    use: "Best when you want packaged texture/material support.",
    icon: <Sparkles className="h-4 w-4" />,
    accent: "#FFB300",
  },
  {
    name: "3DM Mesh",
    use: "Best compatibility path for clean geometry handoff.",
    icon: <FileCode2 className="h-4 w-4" />,
    accent: "#7CFF6B",
  },
  {
    name: "3DM NURBS (Experimental)",
    use: "Attempts NURBS-style output when possible.",
    icon: <Wrench className="h-4 w-4" />,
    accent: "#FF6E40",
  },
];

const supportedInputs = {
  direct: [".usd", ".usda", ".usdc", ".usdz"],
  blender: [".obj", ".fbx", ".gltf", ".glb", ".skp", ".dae", ".stl", ".ply", ".abc", ".x3d"],
  output: [".obj", ".3dm (recommended)"],
};

const workflowSteps = [
  "Right-click one or more files in Finder.",
  "Choose Quick Actions → Scenic 3D Convert…",
  "Pick output type: USD, USDZ, 3DM Mesh, or 3DM NURBS.",
  "Converted files are written next to originals.",
];

const installSteps = [
  "Download Scenic-3D-Converter-Stable.zip.",
  "Unzip it.",
  "Open the folder and double-click Install 3D Finder Tools.command.",
  "Approve prompts for rhino3dm and Blender LTS (recommended).",
  "In Finder, right-click files → Quick Actions → Scenic 3D Convert…",
];

const troubleshooting = [
  "If only two Quick Actions show inline, open the full Quick Actions submenu to see all actions.",
  "If GLB/FBX/SKP conversion fails, install Blender LTS and retry.",
  "Conversion logs are saved to quick-actions.log.",
];

export default function Scenic3DConverter() {
  return (
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_10%_8%,rgba(0,229,255,0.11),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(255,183,0,0.10),transparent_36%)]">
      <SEO
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        keywords="Scenic 3D Converter, Vectorworks converter, USD to Vectorworks, USDZ conversion, 3DM mesh, 3DM NURBS, Finder Quick Actions, macOS 3D conversion utility, scenic design tools"
        type="website"
        image={PAGE_IMAGE}
        url={PAGE_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Apps", url: "https://www.brandonptdavis.com/studio/apps" },
          { name: "Scenic 3D Converter", url: PAGE_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic 3D Converter for Vectorworks (Mac)",
          url: PAGE_URL,
          description: PAGE_DESCRIPTION,
          about: "Mac Finder Quick Action utility for local 3D file conversion in scenic design workflows.",
          primaryImageOfPage: PAGE_HERO_IMAGE,
          mainEntity: {
            name: "Conversion Modes",
            itemListElement: conversionModes.map((mode, index) => ({
              position: index + 1,
              name: mode.name,
              url: PAGE_URL,
              image: PAGE_IMAGE,
            })),
          },
        }}
      />
      <StructuredData
        type="ItemList"
        itemList={{
          name: "Supported Scenic 3D Converter Input Formats",
          description: "Input formats accepted by Scenic 3D Converter using direct conversion and Blender pipeline workflows.",
          url: PAGE_URL,
          itemListElement: [
            ...supportedInputs.direct.map((format, index) => ({
              position: index + 1,
              name: `Direct input ${format}`,
              url: `${PAGE_URL}#supported-inputs`,
            })),
            ...supportedInputs.blender.map((format, index) => ({
              position: supportedInputs.direct.length + index + 1,
              name: `Pipeline input ${format}`,
              url: `${PAGE_URL}#supported-inputs`,
            })),
          ],
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Scenic 3D Converter for Vectorworks (Mac)",
          description: PAGE_DESCRIPTION,
          applicationCategory: "GraphicsApplication",
          operatingSystem: "macOS",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          image: PAGE_HERO_IMAGE,
          url: PAGE_URL,
        }}
      />
      <StructuredData
        type="HowTo"
        howTo={{
          name: "Install Scenic 3D Converter on Mac",
          description: "Download and install Scenic 3D Converter Finder Quick Actions for local USD, USDZ, and 3DM export workflows.",
          image: PAGE_HERO_IMAGE,
          totalTime: "PT5M",
          estimatedCost: {
            currency: "USD",
            value: "0",
          },
          supply: [
            { name: "Scenic-3D-Converter-Stable.zip", url: DOWNLOAD_URL_ABS },
          ],
          tool: [
            { name: "Finder Quick Actions" },
            { name: "Blender LTS" },
            { name: "rhino3dm" },
          ],
          step: [
            { name: "Download the ZIP", text: "Download Scenic-3D-Converter-Stable.zip.", url: DOWNLOAD_URL_ABS },
            { name: "Unzip package", text: "Unzip the downloaded archive." },
            { name: "Run installer command", text: "Open the folder and double-click Install 3D Finder Tools.command." },
            { name: "Approve dependencies", text: "Allow installation of rhino3dm and Blender LTS when prompted." },
            { name: "Use Quick Actions", text: "Right-click 3D files in Finder and choose Scenic 3D Convert under Quick Actions." },
          ],
        }}
      />
      <StructuredData
        type="FAQPage"
        faqPage={{
          mainEntity: [
            {
              question: "Does Scenic 3D Converter upload files to the cloud?",
              answer: "No. The workflow runs locally on your Mac and writes converted files next to your source files.",
            },
            {
              question: "Which output types are available?",
              answer: "USD (Smallest), USDZ (Textures), 3DM Mesh, and 3DM NURBS (Experimental).",
            },
            {
              question: "What if GLB, FBX, or SKP conversion fails?",
              answer: "Install or repair Blender LTS and retry the conversion.",
            },
          ],
        }}
      />

      <Header />

      <section className="container pt-12 md:pt-16 pb-10">
        <div className="mx-auto w-full max-w-[1780px]">
          <AnimatedSection>
            <Link href="/studio/apps">
              <Button variant="ghost" className="-ml-4 mb-7 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Studio Apps
              </Button>
            </Link>

            <div className="grid xl:grid-cols-12 gap-8 xl:gap-10 items-start">
              <div className="xl:col-span-5 min-[1920px]:pr-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio / Apps / Mac Utility</p>
                <h1 className="text-4xl md:text-6xl min-[1920px]:text-[4.8rem] font-serif tracking-tight leading-[0.94] mb-4 min-[1920px]:max-w-[14ch]">
                  Scenic 3D Converter for Vectorworks (Mac)
                </h1>
                <p className="text-lg md:text-xl text-foreground/75 leading-relaxed max-w-[56ch] mb-6">
                  Convert 3D files locally on your Mac into Vectorworks-friendly formats in one click with a Finder right-click workflow.
                </p>

                <div className="flex flex-wrap gap-2 mb-7">
                  {conversionModes.map((mode) => (
                    <Badge key={mode.name} variant="outline" className="px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                      {mode.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-[#FF6D3A] hover:bg-[#ff8559] text-black font-semibold">
                    <a href={DOWNLOAD_URL} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Stable ZIP
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="#install">
                      Install Steps
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <Card className="xl:col-span-7 border border-border/60 overflow-hidden rounded-3xl bg-card/25 py-0 gap-0 min-[1920px]:max-h-[700px]">
                <img
                  src="/assets/studio/scenic-3d-converter-hero.webp"
                  alt="Scenic 3D converter Finder quick action concept"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-[1780px]">
          <AnimatedSection>
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-2">What It Does</h2>
              <p className="text-foreground/75 max-w-[72ch]">Choose an output mode based on speed, package type, and handoff needs.</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 min-[1920px]:grid-cols-4 gap-4 min-[1920px]:gap-5">
            {conversionModes.map((mode, index) => (
              <AnimatedSection key={mode.name} delay={index * 70}>
                <Card className="h-full border border-border/60 bg-card/25 py-0 gap-0">
                  <CardContent className="p-5 min-[1920px]:p-6">
                    <div className="inline-flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.14em]" style={{ color: mode.accent }}>
                      {mode.icon}
                      Mode
                    </div>
                    <h3 className="text-xl min-[1920px]:text-[1.75rem] font-semibold leading-tight mb-2">{mode.name}</h3>
                    <p className="text-sm min-[1920px]:text-base text-foreground/75 leading-relaxed">{mode.use}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={280}>
            <Card className="mt-6 border border-border/60 overflow-hidden rounded-2xl bg-card/20 py-0 gap-0">
              <img
                src="/assets/studio/scenic-3d-converter-modes.webp"
                alt="Conversion mode diagram for USD, USDZ, mesh, and NURBS outputs"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-[1720px] grid xl:grid-cols-[1fr_1fr] gap-6 min-[1920px]:gap-8">
          <AnimatedSection>
            <Card className="h-full border border-border/60 bg-card/25">
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif mb-4 tracking-tight">Why Designers Like It</h2>
                <ul className="space-y-3 text-sm text-foreground/80">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-[#00E5FF]" />Runs locally on your Mac with no cloud upload.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-[#00E5FF]" />Right-click workflow directly in Finder.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-[#00E5FF]" />Built for Vectorworks import workflows.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-[#00E5FF]" />Converts in place next to your source files.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-[#00E5FF]" />Re-running can overwrite old exports automatically.</li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <Card id="supported-inputs" className="h-full border border-border/60 bg-card/25">
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif mb-4 tracking-tight">Supported Inputs</h2>
                <div className="space-y-5 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#00E5FF] mb-2 font-semibold">Direct USD-family</p>
                    <p className="text-foreground/80">{supportedInputs.direct.join(" · ")}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#FF6E40] mb-2 font-semibold">Via Blender pipeline</p>
                    <p className="text-foreground/80">{supportedInputs.blender.join(" · ")}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#7CFF6B] mb-2 font-semibold">3DM output modes</p>
                    <p className="text-foreground/80">{supportedInputs.output.join(" · ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-[1720px] grid xl:grid-cols-[1.1fr_1fr] gap-6 min-[1920px]:gap-8">
          <AnimatedSection>
            <Card className="border border-border/60 bg-card/25 h-full">
              <CardContent className="p-6">
                <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-4">How It Works</h2>
                <div className="space-y-4">
                  {workflowSteps.map((step, idx) => (
                    <div key={step} className="flex gap-3">
                      <div className="h-7 w-7 rounded-full border border-border/70 bg-background/60 flex items-center justify-center text-xs font-semibold text-[#00E5FF]">
                        {idx + 1}
                      </div>
                      <p className="text-foreground/80 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-border/70 pt-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Advanced Quick Actions</p>
                  <p className="text-sm text-foreground/80">
                    Direct actions are also installed for power users: Convert to USD, Convert to USDZ, and Convert to 3DM.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <Card className="border border-border/60 overflow-hidden rounded-2xl bg-card/20 h-full py-0 gap-0">
              <img
                src="/assets/studio/scenic-3d-converter-install.webp"
                alt="Scenic 3D converter installation and setup concept"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section id="install" className="container pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-[1720px] grid xl:grid-cols-2 gap-6 min-[1920px]:gap-8">
          <AnimatedSection>
            <Card className="h-full border border-border/60 bg-card/25">
              <CardContent className="p-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#FF6E40] mb-3">
                  <FolderOpen className="h-4 w-4" />
                  Install (Mac)
                </div>
                <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-4">Quick Setup</h2>
                <ol className="space-y-3 text-sm text-foreground/80 list-decimal pl-5">
                  {installSteps.map((step) => (
                    <li key={step} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <Card className="h-full border border-border/60 bg-card/25">
              <CardContent className="p-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#FFB300] mb-3">
                  <TriangleAlert className="h-4 w-4" />
                  Troubleshooting
                </div>
                <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-4">If Anything Fails</h2>
                <ul className="space-y-3 text-sm text-foreground/80">
                  {troubleshooting.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#FFB300] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl border border-border/70 bg-background/40 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">Log File</p>
                  <code className="text-xs text-foreground/90">quick-actions.log</code>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="container pb-24">
        <div className="mx-auto w-full max-w-[1720px]">
          <AnimatedSection>
            <Card className="border border-border/60 bg-gradient-to-br from-[#00E5FF]/10 via-card/20 to-[#FF6E40]/10">
              <CardContent className="p-7 md:p-10 min-[1920px]:p-12 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">Share The Tool</p>
                  <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-2">Built for Scenic Production Workflow</h2>
                  <p className="text-sm md:text-base text-foreground/75 max-w-[72ch]">
                    If you are moving assets between modeling packages and Vectorworks, this keeps conversion practical, local, and fast.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-[#00BCD4] hover:bg-[#26c6da] text-black">
                    <a href={DOWNLOAD_URL} target="_blank" rel="noreferrer">
                      <MousePointerClick className="mr-2 h-4 w-4" />
                      Get Scenic 3D Converter
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/studio/apps">All Studio Apps</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
