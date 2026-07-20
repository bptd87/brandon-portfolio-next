"use client";

import Image from "next/image";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { type CSSProperties } from "react";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

const base = "/assets/studio-apps/refro";

const sections = [
  {
    eyebrow: "Collect",
    title: "Every reference keeps its story.",
    body: "Bring images in from Safari, Chrome, Finder, or the RefRo Dock icon. RefRo keeps the source page, image address, date added, creator, location, notes, categories, color, and other useful context with the image—so research does not become an anonymous folder of files.",
    points: [
      "Capture the current browser page with one click",
      "Save source and direct image addresses when websites provide them",
      "Add rights, attribution, period, emotional quality, and creative notes",
      "Open a saved source or start a reverse-image search from the reference",
    ],
    image: `${base}/01-research-library.jpg`,
    alt: "RefRo research library showing organized image references in a Mac project.",
  },
  {
    eyebrow: "Organize",
    title: "Build an archive you can use again.",
    body: "Create projects, folders, subfolders, and your own categories. Search and filter by the information that matters to you, mark favorites and hero images, and carry the references you love into the next project without losing their context.",
    points: [
      "Custom categories, tags, folders, and subfolders",
      "Favorite and hero-image collections",
      "Multiple library views for different stages of research",
      "Copy or drag images into other Mac applications",
    ],
    image: `${base}/02-source-inspector.jpg`,
    alt: "RefRo inspector showing source links, categories, notes, and saved image context.",
  },
  {
    eyebrow: "Specify",
    title: "Product research without the loose ends.",
    body: "Keep visual references and practical product information together. Record the retailer, store location, price, currency, product URL, and date checked, then find the item again when a concept becomes a real decision.",
    image: `${base}/03-product-research.jpg`,
    alt: "RefRo product research view with images and product details stored together.",
  },
  {
    eyebrow: "Present",
    title: "Move from research to room.",
    body: "Turn selected references into a multi-page presentation. Start with an automatic grid or work freely in collage mode, then crop inside frames, resize, rotate, caption, align, and space objects with the control of a native Mac app.",
    points: [
      "Automatic grids and freeform collage layouts",
      "Adjustable crops, frames, borders, shadows, and captions",
      "Full-screen presenting from RefRo",
      "PDF, Keynote, PNG-page, and flattened-PSD export",
    ],
    image: `${base}/04-presentation-editor.jpg`,
    alt: "RefRo mood-board editor with multiple pages, research images, and layout controls.",
  },
  {
    eyebrow: "Communicate",
    title: "Let one image carry the details.",
    body: "Create a reference card that pairs an image with the information your collaborators need. Use it in presentations, design documents, and the rest of your creative workflow without rebuilding the context by hand.",
    image: `${base}/05-reference-card.jpg`,
    alt: "A data-rich reference card created in RefRo for use in another design document.",
  },
] as const;

function WaitlistButton({ light = false }: { light?: boolean }) {
  return (
    <span
      className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[0.78rem] font-black uppercase tracking-[0.12em]"
      style={{
        backgroundColor: light ? "#f5f0e7" : "#2c2c2c",
        color: light ? "#2c2c2c" : "#fff",
      }}
    >
      Coming to the Mac App Store
    </span>
  );
}

export default function RefRo() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  return (
    <div className="min-h-screen" style={pageStyle}>
      <Header />
      <PublishingTopBar active="apps" tone="dark" />

      <main>
        <section className="px-[clamp(1.25rem,5vw,6rem)] pb-14 pt-28 md:pb-24 md:pt-36">
          <div className="mx-auto grid max-w-[76rem] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.55fr)] lg:items-end">
            <AnimatedSection>
              <div>
                <div className="mb-8 flex items-center gap-4">
                  <Image
                    src={`${base}/icon.png`}
                    alt=""
                    width={88}
                    height={88}
                    className="h-16 w-16 rounded-[1.1rem] shadow-[0_16px_40px_rgba(44,44,44,0.16)] md:h-[5.5rem] md:w-[5.5rem] md:rounded-[1.5rem]"
                    priority
                  />
                  <div>
                    <p
                      className="text-[0.78rem] font-black uppercase tracking-[0.16em]"
                      style={{ color: homeTheme.muted }}
                    >
                      Reference Rover for macOS
                    </p>
                    <p className="mt-1 text-lg font-bold">RefRo</p>
                  </div>
                </div>
                <h1
                  className="max-w-[9ch] text-[clamp(4.6rem,11vw,10.5rem)] font-black uppercase leading-[0.78]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  Research with a memory.
                </h1>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={80}>
              <div className="lg:pb-2">
                <p
                  className="text-[clamp(1.12rem,1.6vw,1.4rem)] font-medium leading-[1.4]"
                  style={{ color: homeTheme.muted }}
                >
                  RefRo keeps the source, context, and creative decisions
                  attached to every image—then turns your strongest references
                  into presentation-ready mood boards.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <WaitlistButton />
                  <a
                    href="#research"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold"
                    style={{ backgroundColor: homeTheme.accentSoft }}
                  >
                    See how it works <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="px-[clamp(1rem,3vw,2.5rem)] pb-16 md:pb-24">
          <AnimatedSection>
            <div
              className="mx-auto max-w-[90rem] overflow-hidden rounded-[1.5rem] p-[clamp(0.5rem,2.5vw,2.4rem)] shadow-[0_40px_120px_rgba(44,44,44,0.2)] transition-colors duration-300 md:rounded-[2.5rem]"
              style={{ backgroundColor: homeTheme.controlBg }}
            >
              <Image
                src={`${base}/04-presentation-editor.jpg`}
                alt="RefRo mood-board editor with multiple pages, research images, and layout controls."
                width={1440}
                height={900}
                className="h-auto w-full rounded-[clamp(1rem,2.2vw,2rem)]"
                priority
              />
            </div>
          </AnimatedSection>
        </section>

        <section
          id="research"
          className="px-[clamp(1.25rem,5vw,6rem)] py-14 md:py-24"
        >
          <div className="mx-auto max-w-[76rem] space-y-24 md:space-y-36">
            {sections.map((section, index) => (
              <AnimatedSection key={section.title}>
                <article
                  className={`grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-16 ${index % 2 ? "" : ""}`}
                >
                  <div className={index % 2 ? "lg:order-2" : ""}>
                    <p
                      className="text-[0.76rem] font-black uppercase tracking-[0.18em]"
                      style={{ color: homeTheme.muted }}
                    >
                      {section.eyebrow}
                    </p>
                    <h2
                      className="mt-5 max-w-[11ch] text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.86]"
                      style={{ fontFamily: HOME_DISPLAY_FONT }}
                    >
                      {section.title}
                    </h2>
                    <p
                      className="mt-7 max-w-[38rem] text-[1.02rem] font-medium leading-7"
                      style={{ color: homeTheme.muted }}
                    >
                      {section.body}
                    </p>
                    {"points" in section ? (
                      <ul className="mt-7 grid gap-3 text-[0.94rem] font-medium sm:grid-cols-2">
                        {section.points.map(point => (
                          <li key={point} className="flex gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0" />{" "}
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div
                    className={`overflow-hidden rounded-[1.5rem] p-3 shadow-[0_30px_80px_rgba(44,44,44,0.16)] transition-colors duration-300 md:rounded-[2rem] md:p-5 ${index % 2 ? "lg:order-1" : ""}`}
                    style={{ backgroundColor: homeTheme.controlBg }}
                  >
                    <Image
                      src={section.image}
                      alt={section.alt}
                      width={1440}
                      height={900}
                      className="h-auto w-full rounded-[clamp(0.9rem,1.8vw,1.5rem)]"
                      loading="lazy"
                    />
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="px-[clamp(1.25rem,5vw,6rem)] py-16 md:py-24">
          <div className="mx-auto grid max-w-[76rem] gap-5 md:grid-cols-2">
            <AnimatedSection>
              <div
                className="h-full rounded-[2rem] p-7 md:p-10"
                style={{ backgroundColor: homeTheme.accentSoft }}
              >
                <p
                  className="text-[0.76rem] font-black uppercase tracking-[0.18em]"
                  style={{ color: homeTheme.muted }}
                >
                  Find
                </p>
                <h2
                  className="mt-5 text-[clamp(2.8rem,5vw,5rem)] font-black uppercase leading-[0.88]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  Organization that starts for you.
                </h2>
                <p
                  className="mt-6 font-medium leading-7"
                  style={{ color: homeTheme.muted }}
                >
                  RefRo uses Apple Vision to suggest searchable image labels. On
                  supported Macs, Apple Intelligence can refine those signals
                  into concise reference names. Analysis happens on the device
                  after import.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={70}>
              <div className="h-full rounded-[2rem] bg-[#2c2c2c] p-7 text-white md:p-10">
                <p className="text-[0.76rem] font-black uppercase tracking-[0.18em] text-white/60">
                  Made for the Mac
                </p>
                <h2
                  className="mt-5 text-[clamp(2.8rem,5vw,5rem)] font-black uppercase leading-[0.88]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  Your research belongs to you.
                </h2>
                <p className="mt-6 font-medium leading-7 text-white/70">
                  No advertising, behavioral tracking, or developer-operated
                  analytics. Your library stays on your Mac and, when iCloud
                  sync is enabled, within your own iCloud account.
                </p>
                <a
                  href="/studio/apps/refro/privacy"
                  className="mt-7 inline-flex items-center gap-2 font-bold"
                >
                  Read the privacy policy <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="bg-[#2c2c2c] px-[clamp(1.25rem,5vw,6rem)] py-24 text-center text-white md:py-36">
          <div className="mx-auto max-w-[76rem]">
            <p className="text-[0.76rem] font-black uppercase tracking-[0.18em] text-white/55">
              RefRo for macOS
            </p>
            <h2
              className="mx-auto mt-6 max-w-[11ch] text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.8]"
              style={{ fontFamily: HOME_DISPLAY_FONT }}
            >
              Keep the image. Keep the idea behind it.
            </h2>
            <p className="mx-auto mt-8 max-w-[42rem] text-lg font-medium leading-8 text-white/68">
              Build a source-aware visual archive and turn the strongest
              references into presentations—all without leaving your Mac.
            </p>
            <div className="mt-9">
              <WaitlistButton light />
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/68">
              <a href="/studio/apps/refro/support" className="hover:text-white">
                Support
              </a>
              <a href="/studio/apps/refro/privacy" className="hover:text-white">
                Privacy
              </a>
              <a
                href="/studio/apps"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                All Apps <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer
        variant="standard"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
