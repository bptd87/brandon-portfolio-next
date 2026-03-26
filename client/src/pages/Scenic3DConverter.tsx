"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCode2,
  FolderOpen,
  MousePointerClick,
  Sparkles,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

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
    icon: Boxes,
  },
  {
    name: "USDZ (Textures)",
    use: "Best when you want packaged texture and material support.",
    icon: Sparkles,
  },
  {
    name: "3DM Mesh",
    use: "Best compatibility path for clean geometry handoff.",
    icon: FileCode2,
  },
  {
    name: "3DM NURBS (Experimental)",
    use: "Attempts NURBS-style output when possible.",
    icon: Wrench,
  },
];

const supportedInputs = {
  direct: [".usd", ".usda", ".usdc", ".usdz"],
  blender: [".obj", ".fbx", ".gltf", ".glb", ".skp", ".dae", ".stl", ".ply", ".abc", ".x3d"],
  output: [".obj", ".3dm (recommended)"],
};

const workflowSteps = [
  "Right-click one or more files in Finder.",
  "Choose Quick Actions and select Scenic 3D Convert.",
  "Pick USD, USDZ, 3DM Mesh, or 3DM NURBS.",
  "Converted files are written next to the originals.",
];

const installSteps = [
  "Download Scenic-3D-Converter-Stable.zip.",
  "Unzip the package.",
  "Open the folder and double-click Install 3D Finder Tools.command.",
  "Approve prompts for rhino3dm and Blender LTS when needed.",
  "Right-click files in Finder and run Scenic 3D Convert from Quick Actions.",
];

const troubleshooting = [
  "If only two Quick Actions show inline, open the full Quick Actions submenu.",
  "If GLB, FBX, or SKP conversion fails, install Blender LTS and retry.",
  "Conversion logs are saved to quick-actions.log.",
];

const reasons = [
  "Runs locally on your Mac with no cloud upload.",
  "Right-click workflow directly in Finder.",
  "Built for Vectorworks import workflows.",
  "Converts in place next to source files.",
  "Can overwrite previous exports when you rerun conversions.",
];

export default function Scenic3DConverter() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
          about:
            "Mac Finder Quick Action utility for local 3D file conversion in scenic design workflows.",
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
          description:
            "Input formats accepted by Scenic 3D Converter using direct conversion and Blender pipeline workflows.",
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
          description:
            "Download and install Scenic 3D Converter Finder Quick Actions for local USD, USDZ, and 3DM export workflows.",
          image: PAGE_HERO_IMAGE,
          totalTime: "PT5M",
          estimatedCost: {
            currency: "USD",
            value: "0",
          },
          supply: [{ name: "Scenic-3D-Converter-Stable.zip", url: DOWNLOAD_URL_ABS }],
          tool: [{ name: "Finder Quick Actions" }, { name: "Blender LTS" }, { name: "rhino3dm" }],
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
              answer:
                "No. The workflow runs locally on your Mac and writes converted files next to your source files.",
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

      <main className="px-6 pb-24 pt-24 md:pt-28">
        <section className="mx-auto max-w-6xl border-b border-border/18 pb-16">
          <AnimatedSection>
            <Link
              href="/studio/apps"
              className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studio Apps
            </Link>

            <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(25rem,0.98fr)] xl:items-center">
              <div className="max-w-[40rem]">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                  Studio App
                </p>
                <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                  Scenic 3D Converter for Vectorworks on Mac.
                </h1>
                <p className="mt-6 max-w-3xl text-[1.06rem] leading-8 text-foreground/62 md:text-[1.14rem]">
                  Convert 3D files locally into Vectorworks-friendly formats with a Finder
                  right-click workflow built for scenic design handoff.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.95rem] text-foreground/56">
                  <div>Free download</div>
                  <div>macOS utility</div>
                  <div>Finder Quick Actions</div>
                  <div>Local conversion only</div>
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href={DOWNLOAD_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-white/90"
                  >
                    <Download className="h-4 w-4" />
                    Download stable ZIP
                  </a>
                  <a
                    href="#install"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-white/14"
                  >
                    Install steps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/10">
                <img
                  src="/assets/studio/scenic-3d-converter-hero-art.png"
                  alt="Abstract scenic converter artwork"
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto mt-16 max-w-6xl">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                Conversion Modes
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Four export paths for different handoff needs.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {conversionModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <AnimatedSection key={mode.name} delay={index * 70}>
                  <div className="border-t border-border/16 pt-6">
                    <div className="flex items-center gap-3 text-foreground/66">
                      <Icon className="h-4 w-4" />
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/36">
                        Mode
                      </p>
                    </div>
                    <h3 className="mt-4 font-sans text-[1.4rem] font-medium tracking-[-0.04em] text-foreground">
                      {mode.name}
                    </h3>
                    <p className="mt-3 max-w-[32rem] text-[0.98rem] leading-7 text-foreground/62">
                      {mode.use}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl border-t border-border/18 pt-16">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] xl:items-center">
            <AnimatedSection>
              <div className="overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/10">
                <img
                  src="/assets/studio/scenic-3d-converter-modes-art.png"
                  alt="Abstract artwork suggesting multiple conversion paths"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  Workflow
                </p>
                <h2 className="mt-4 font-sans text-[clamp(2rem,3.8vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Use it from Finder, not from another complicated app interface.
                </h2>
                <div className="mt-7 space-y-5">
                  {workflowSteps.map((step, index) => (
                    <div key={step} className="grid grid-cols-[28px_minmax(0,1fr)] gap-4 border-t border-border/16 pt-5 first:border-t-0 first:pt-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[0.82rem] font-medium text-foreground/72">
                        {index + 1}
                      </div>
                      <p className="text-[1rem] leading-7 text-foreground/64">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-border/16 pt-5">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Advanced Quick Actions
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-foreground/62">
                    Power users also get direct actions for Convert to USD, Convert to USDZ, and
                    Convert to 3DM.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl border-t border-border/18 pt-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <AnimatedSection>
              <div id="supported-inputs" className="border-t border-border/20 pt-6">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  Supported Inputs
                </p>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-[0.82rem] uppercase tracking-[0.18em] text-foreground/42">
                      Direct USD family
                    </p>
                    <p className="mt-3 text-[1rem] leading-7 text-foreground/66">
                      {supportedInputs.direct.join(" · ")}
                    </p>
                  </div>
                  <div className="border-t border-border/14 pt-5">
                    <p className="text-[0.82rem] uppercase tracking-[0.18em] text-foreground/42">
                      Via Blender pipeline
                    </p>
                    <p className="mt-3 text-[1rem] leading-7 text-foreground/66">
                      {supportedInputs.blender.join(" · ")}
                    </p>
                  </div>
                  <div className="border-t border-border/14 pt-5">
                    <p className="text-[0.82rem] uppercase tracking-[0.18em] text-foreground/42">
                      Recommended output
                    </p>
                    <p className="mt-3 text-[1rem] leading-7 text-foreground/66">
                      {supportedInputs.output.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <div className="border-t border-border/20 pt-6">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  Why Designers Like It
                </p>
                <div className="mt-6 space-y-4">
                  {reasons.map((reason) => (
                    <div
                      key={reason}
                      className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 border-t border-border/14 pt-4 first:border-t-0 first:pt-0"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 text-foreground/56" />
                      <p className="text-[0.98rem] leading-7 text-foreground/64">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="install" className="mx-auto mt-20 max-w-6xl border-t border-border/18 pt-16">
          <div className="grid gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] xl:grid-rows-[auto_auto] xl:items-start">
            <AnimatedSection>
              <div className="max-w-[42rem]">
                <div className="flex items-center gap-3 text-foreground/60">
                  <FolderOpen className="h-4 w-4" />
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                    Install
                  </p>
                </div>
                <h2 className="mt-4 font-sans text-[clamp(2rem,3.8vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Set it up in a few minutes and keep the conversion local.
                </h2>

                <div className="mt-10 space-y-5">
                  {installSteps.map((step, index) => (
                    <div key={step} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 border-t border-border/16 pt-5 first:border-t-0 first:pt-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[0.85rem] font-medium text-foreground/72">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-[1rem] leading-7 text-foreground/64">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <div className="overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/10 xl:self-start">
                <img
                  src="/assets/studio/scenic-3d-converter-install-art.png"
                  alt="Abstract artwork suggesting setup flow and local tooling"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection className="xl:col-start-2 xl:row-start-2" delay={120}>
              <div className="border-t border-border/20 pt-6">
                <div className="flex items-center gap-3 text-foreground/60">
                  <TriangleAlert className="h-4 w-4" />
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                    Troubleshooting
                  </p>
                </div>
                <div className="mt-5 space-y-4">
                  {troubleshooting.map((item) => (
                    <div
                      key={item}
                      className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 border-t border-border/14 pt-4 first:border-t-0 first:pt-0"
                    >
                      <span className="mt-1 text-foreground/52">•</span>
                      <p className="text-[0.98rem] leading-7 text-foreground/64">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="mx-auto mt-18 max-w-6xl border-t border-border/18 pt-16">
          <AnimatedSection>
            <div className="rounded-[2rem] bg-white/8 px-6 py-14 text-center md:px-12 md:py-16">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                Studio App
              </p>
              <h2 className="mx-auto mt-5 max-w-3xl font-sans text-[clamp(2.3rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.055em] text-foreground">
                Keep your 3D conversion workflow fast, local, and practical.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-8 text-foreground/62">
                Built for scenic production handoff between modeling packages and Vectorworks,
                without adding another complicated pipeline.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-white/90"
                >
                  <MousePointerClick className="h-4 w-4" />
                  Get Scenic 3D Converter
                </a>
                <Link
                  href="/studio/apps"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-white/14"
                >
                  All studio apps
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
}
