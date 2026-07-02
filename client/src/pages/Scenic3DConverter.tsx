"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  Boxes,
  CheckCircle2,
  FolderOpen,
  PackageCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const PAGE_URL =
  "https://www.brandonptdavis.com/studio/apps/scenic-3d-converter";
const PAGE_IMAGE =
  "https://www.brandonptdavis.com/assets/studio-apps/icons/scenic-3d-converter.jpg";
const PAGE_HERO_IMAGE =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/scenic-3d-converter-hero.webp";
const PAGE_TOOL_GRAPHIC =
  "/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg";
const WORKFLOW_GRAPHIC =
  "/assets/studio-apps/scenic-3d-converter/workflow-human-card.jpg";
const LOCAL_FILES_GRAPHIC =
  "/assets/studio-apps/scenic-3d-converter/local-files-umbrella-card.jpg";
const MAC_DOWNLOAD_URL =
  "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/files/downloads/studio-apps/scenic-3d-converter/Scenic-3D-Converter-Stable.zip";
const WINDOWS_DOWNLOAD_URL =
  "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/files/downloads/studio-apps/scenic-3d-converter/Scenic-3D-Converter-Windows-Stable.zip";
const PAGE_TITLE =
  "Scenic 3D Converter for Vectorworks | Mac and Windows Download";
const PAGE_DESCRIPTION =
  "Download Scenic 3D Converter for Mac or Windows to keep Vectorworks files lighter by converting 3D handoffs locally into USD, USDZ, and 3DM formats.";

type DownloadOption = {
  href: string;
  title: string;
  description: string;
  platform: "mac" | "windows";
  accentClass: string;
};

const downloads: DownloadOption[] = [
  {
    href: MAC_DOWNLOAD_URL,
    title: "Download for Mac",
    description: "For local desktop handoff work on macOS.",
    platform: "mac",
    accentClass:
      "border-[#628faa] bg-[#628faa] hover:border-[#d7e7ef]/72 hover:bg-[#719db7]",
  },
  {
    href: WINDOWS_DOWNLOAD_URL,
    title: "Download for Windows",
    description: "For local desktop handoff work on Windows.",
    platform: "windows",
    accentClass:
      "border-[#bd6843] bg-[#bd6843] hover:border-[#f3b06c]/82 hover:bg-[#c97854]",
  },
];

const conversionModes = [
  {
    name: "USD (Smallest)",
    use: "Best for compact files and fast import.",
    icon: Archive,
  },
  {
    name: "USDZ (Textures)",
    use: "Best when you want packaged texture and material support.",
    icon: PackageCheck,
  },
  {
    name: "3DM Mesh (Recommended)",
    use: "Best compatibility path for clean geometry handoff.",
    icon: Boxes,
  },
  {
    name: "3DM NURBS (Experimental)",
    use: "Attempts NURBS-style output when possible.",
    icon: Sparkles,
  },
];

const supportedInputs = {
  direct: [".usd", ".usda", ".usdc", ".usdz"],
  blender: [
    ".obj",
    ".fbx",
    ".gltf",
    ".glb",
    ".skp",
    ".dae",
    ".stl",
    ".ply",
    ".abc",
    ".x3d",
  ],
  output: [".obj", ".3dm (recommended)"],
};

const workflowSteps = [
  "Download the ZIP for Mac or Windows.",
  "On Mac, Control-click Start Here and choose Open.",
  "Choose the files you need to hand off.",
  "Pick the output that makes sense for the next step.",
  "Keep the converted files beside the originals.",
];

const installSteps = [
  "Download the Mac or Windows ZIP.",
  "Unzip the package.",
  "Mac: Control-click Start Here, choose Open, then confirm.",
  "Windows: double-click Start Here and follow the prompt.",
  "Let the included setup guide you through anything extra it needs.",
  "Use it when a model needs to become a cleaner handoff file.",
];

const troubleshooting = [
  "If macOS says Apple cannot verify the installer, Control-click Start Here and choose Open instead of double-clicking.",
  "If the right-click menu is hidden, use the included guided fallback converter.",
  "If GLB, FBX, or SKP conversion fails, install or repair Blender LTS and retry.",
  "Conversion logs are saved to quick-actions.log.",
];

const reasons = [
  "Runs locally with no cloud upload.",
  "Works from the desktop instead of another web account.",
  "Includes a fallback converter when the right-click path is hidden.",
  "Built for Vectorworks import workflows.",
  "Converts in place next to source files.",
];

function PlatformLogo({ platform }: { platform: "mac" | "windows" }) {
  if (platform === "windows") {
    return (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 4.3 10.8 3v8.2H3V4.3Zm9.4-1.5L21 1.4v9.8h-8.6V2.8ZM3 12.8h7.8V21L3 19.7v-6.9Zm9.4 0H21v9.8l-8.6-1.4v-8.4Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16.4 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 2.9-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6 0 0-2.7-1-2.7-3.9ZM14.3 6.2c.6-.8 1.1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3Z" />
    </svg>
  );
}

function HeroGraphicPanel() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#628faa]">
      <img
        src={PAGE_TOOL_GRAPHIC}
        alt="Scenic 3D Converter app graphic showing file conversion"
        className="h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function WorkflowGraphicBlock() {
  return (
    <div className="overflow-hidden bg-[#bd6843]">
      <img
        src={WORKFLOW_GRAPHIC}
        alt="Illustration of a scenic designer carrying a model toward organized handoff files"
        className="aspect-square w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function InstallGraphicBlock() {
  return (
    <div className="overflow-hidden bg-[#d09724]">
      <img
        src={LOCAL_FILES_GRAPHIC}
        alt="Illustration of a scenic designer protecting local files under an umbrella beneath a raining cloud"
        className="aspect-square w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function Scenic3DConverter() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground">
      <SEO
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        keywords="Scenic 3D Converter, Vectorworks converter, USD to Vectorworks, USDZ conversion, 3DM mesh, 3DM NURBS, Finder Quick Actions, Windows Explorer actions, macOS 3D conversion utility, Windows 3D conversion utility, scenic design tools"
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
          name: "Scenic 3D Converter for Vectorworks",
          description: PAGE_DESCRIPTION,
          applicationCategory: "GraphicsApplication",
          operatingSystem: "macOS, Windows",
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
          name: "Install Scenic 3D Converter",
          description:
            "Download and install Scenic 3D Converter for local USD, USDZ, and 3DM export workflows.",
          image: PAGE_HERO_IMAGE,
          totalTime: "PT5M",
          estimatedCost: {
            currency: "USD",
            value: "0",
          },
          supply: [
            { name: "Scenic-3D-Converter-Stable.zip", url: MAC_DOWNLOAD_URL },
            {
              name: "Scenic-3D-Converter-Windows-Stable.zip",
              url: WINDOWS_DOWNLOAD_URL,
            },
          ],
          tool: [
            { name: "Finder Quick Actions" },
            { name: "Windows Explorer actions" },
            { name: "Blender LTS" },
            { name: "rhino3dm" },
          ],
          step: [
            {
              name: "Download the ZIP",
              text: "Download the Mac or Windows ZIP.",
              url: MAC_DOWNLOAD_URL,
            },
            { name: "Unzip package", text: "Unzip the downloaded archive." },
            {
              name: "Start the installer",
              text: "On Mac, Control-click Start Here and choose Open. On Windows, double-click Start Here.",
            },
            {
              name: "Approve dependencies",
              text: "Allow installation of rhino3dm and Blender LTS when prompted.",
            },
            {
              name: "Use right-click actions",
              text: "Right-click 3D files in Finder or Explorer and choose Scenic 3D Convert.",
            },
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
                "No. The workflow runs locally and writes converted files next to your source files.",
            },
            {
              question: "Which output types are available?",
              answer:
                "USD (Smallest), USDZ (Textures), 3DM Mesh, and 3DM NURBS (Experimental).",
            },
            {
              question: "What if GLB, FBX, or SKP conversion fails?",
              answer:
                "Install or repair Blender LTS and retry the conversion, or use the included guided fallback converter.",
            },
          ],
        }}
      />

      <Header />

      <main className="px-6 pb-24 pt-24 md:pt-28">
        <section className="mx-auto max-w-6xl pb-16">
          <AnimatedSection>
            <Link
              href="/studio/apps"
              className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/50 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studio Apps
            </Link>

            <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(25rem,1.08fr)] xl:items-center">
              <div className="max-w-[40rem]">
                <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                  Scenic 3D Converter for Vectorworks.
                </h1>
                <p className="mt-6 max-w-3xl text-[1.06rem] leading-8 text-foreground/62 md:text-[1.14rem]">
                  A local Mac and Windows download for keeping Vectorworks files
                  lighter by turning model handoffs into practical USD, USDZ,
                  and 3DM outputs.
                </p>

                <div className="mt-9 grid max-w-[34rem] gap-3 sm:grid-cols-2">
                  {downloads.map(download => (
                    <a
                      key={download.href}
                      href={download.href}
                      download
                      className={`inline-flex min-h-14 items-center justify-center gap-2 border px-5 py-4 text-center text-white transition-colors ${download.accentClass}`}
                    >
                      <PlatformLogo platform={download.platform} />
                      <span className="text-[0.95rem] font-medium">
                        {download.title}
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-foreground/50">
                  <span>Free local download.</span>
                  <a
                    href="#install"
                    className="inline-flex items-center gap-2 text-foreground/74 transition-colors hover:text-foreground"
                  >
                    Install steps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <HeroGraphicPanel />
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto mt-16 max-w-6xl border-t border-white/12 pt-16">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                What It Makes
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                A few useful outputs for the next handoff.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {conversionModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <AnimatedSection key={mode.name} delay={index * 70}>
                  <div className="border-t border-border/16 pt-6">
                    <div className="flex items-center gap-3 text-[#9dd6ff]">
                      <Icon className="h-4 w-4" />
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

        <section className="mx-auto mt-20 max-w-6xl border-t border-[#bd6843]/22 pt-16">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] xl:items-center">
            <AnimatedSection>
              <WorkflowGraphicBlock />
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  Workflow
                </p>
                <h2 className="mt-4 font-sans text-[clamp(2rem,3.8vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Built to stay out of the way.
                </h2>
                <div className="mt-7 space-y-5">
                  {workflowSteps.map((step, index) => (
                    <div
                      key={step}
                      className="grid grid-cols-[28px_minmax(0,1fr)] gap-4"
                    >
                      <div className="pt-0.5 font-mono text-[0.82rem] text-foreground/34">
                        {index + 1}
                      </div>
                      <p className="text-[1rem] leading-7 text-foreground/64">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 max-w-xl">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                    Desktop First
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-foreground/62">
                    Use the right-click actions when they are visible, or open
                    the guided converter when you need the slower, clearer path.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl border-t border-[#d09724]/22 pt-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <AnimatedSection>
              <div
                id="supported-inputs"
                className="border-t border-border/20 pt-6"
              >
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  Files It Can Meet
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
                  {reasons.map(reason => (
                    <div
                      key={reason}
                      className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 border-t border-border/14 pt-4 first:border-t-0 first:pt-0"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 text-foreground/56" />
                      <p className="text-[0.98rem] leading-7 text-foreground/64">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section
          id="install"
          className="mx-auto mt-20 max-w-6xl border-t border-[#dcecf4]/16 pt-16"
        >
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
                  Download it, set it up, and get back to the model.
                </h2>

                <div className="mt-10 space-y-5">
                  {installSteps.map((step, index) => (
                    <div
                      key={step}
                      className="grid grid-cols-[32px_minmax(0,1fr)] gap-4"
                    >
                      <div className="pt-1 font-mono text-[0.85rem] text-foreground/34">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-[1rem] leading-7 text-foreground/64">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <InstallGraphicBlock />
            </AnimatedSection>

            <AnimatedSection
              className="xl:col-start-2 xl:row-start-2"
              delay={120}
            >
              <div className="border-t border-border/20 pt-6">
                <div className="flex items-center gap-3 text-foreground/60">
                  <TriangleAlert className="h-4 w-4" />
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                    Troubleshooting
                  </p>
                </div>
                <div className="mt-5 space-y-4">
                  {troubleshooting.map(item => (
                    <div
                      key={item}
                      className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 border-t border-border/14 pt-4 first:border-t-0 first:pt-0"
                    >
                      <span className="mt-1 text-foreground/52">•</span>
                      <p className="text-[0.98rem] leading-7 text-foreground/64">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <AnimatedSection>
            <div className="bg-[#628faa] px-6 py-14 text-center text-white md:px-12 md:py-16">
              <h2 className="mx-auto max-w-3xl font-sans text-[clamp(2.3rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.055em] text-white">
                Keep your 3D conversion workflow fast, local, and practical.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-8 text-white/74">
                Built for scenic production handoff between modeling packages
                and Vectorworks, without adding another complicated pipeline.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={MAC_DOWNLOAD_URL}
                  download
                  className="inline-flex items-center gap-2 border border-white bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-[#dcecf4]"
                >
                  <PlatformLogo platform="mac" />
                  Download for Mac
                </a>
                <a
                  href={WINDOWS_DOWNLOAD_URL}
                  download
                  className="inline-flex items-center gap-2 border border-white bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-[#dcecf4]"
                >
                  <PlatformLogo platform="windows" />
                  Download for Windows
                </a>
                <Link
                  href="/studio/apps"
                  className="inline-flex items-center gap-2 border border-white/35 bg-[#101010]/18 px-5 py-3 text-[0.95rem] font-medium text-white transition-colors hover:border-white/70 hover:bg-[#101010]/28"
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
