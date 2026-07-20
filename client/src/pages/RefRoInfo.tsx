"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type CSSProperties, type ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-current/15 py-8 first:border-0 first:pt-0">
      <h2
        className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-none"
        style={{ fontFamily: HOME_DISPLAY_FONT }}
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[1rem] font-medium leading-7 opacity-75">
        {children}
      </div>
    </section>
  );
}

export default function RefRoInfo({ page }: { page: "support" | "privacy" }) {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const isSupport = page === "support";
  const style = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  return (
    <div className="min-h-screen" style={style}>
      <Header />
      <PublishingTopBar active="apps" tone="dark" />
      <main className="px-[clamp(1.25rem,5vw,6rem)] pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-[72rem]">
          <a
            href="/studio/apps/refro"
            className="inline-flex items-center gap-2 text-sm font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> RefRo
          </a>
          <p className="mt-12 text-[0.76rem] font-black uppercase tracking-[0.18em] opacity-55">
            Reference Rover for macOS
          </p>
          <h1
            className="mt-5 text-[clamp(4.5rem,11vw,10rem)] font-black uppercase leading-[0.78]"
            style={{ fontFamily: HOME_DISPLAY_FONT }}
          >
            {isSupport ? "RefRo Support" : "Privacy Policy"}
          </h1>
          <p className="mt-8 max-w-[44rem] text-[1.15rem] font-medium leading-8 opacity-70">
            {isSupport
              ? "RefRo is a visual research archive and presentation studio for macOS. If something is not working as expected, use the guidance below or contact support."
              : "Effective July 19, 2026. This policy explains how RefRo handles the information in your visual research library."}
          </p>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div>{isSupport ? <SupportContent /> : <PrivacyContent />}</div>
            <aside className="lg:order-last">
              <div
                className="sticky top-8 rounded-[1.5rem] p-6"
                style={{ backgroundColor: homeTheme.accentSoft }}
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] opacity-55">
                  RefRo
                </p>
                <a
                  href={
                    isSupport
                      ? "/studio/apps/refro/privacy"
                      : "/studio/apps/refro/support"
                  }
                  className="mt-4 inline-flex items-center gap-2 font-bold"
                >
                  {isSupport ? "Privacy policy" : "Get support"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:brandon@brandonptdavis.com"
                  className="mt-3 block break-all text-sm font-medium opacity-70"
                >
                  brandon@brandonptdavis.com
                </a>
              </div>
            </aside>
          </div>
        </div>
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

function SupportContent() {
  return (
    <>
      <Section title="Contact">
        <p>
          Email{" "}
          <a className="underline" href="mailto:brandon@brandonptdavis.com">
            brandon@brandonptdavis.com
          </a>{" "}
          or use the{" "}
          <a className="underline" href="/contact">
            contact form
          </a>
          . Include your macOS version, what you were trying to do, and a
          screenshot if useful. Do not send private research images unless they
          are necessary to explain the issue.
        </p>
      </Section>
      <Section title="System requirements">
        <p>
          RefRo requires macOS 15 or later. Apple Intelligence naming is
          available only on supported Macs when the system model reports that it
          is available. The rest of RefRo remains usable without Apple
          Intelligence.
        </p>
      </Section>
      <Section title="Importing images">
        <p>
          You can add images from Finder, Safari, Chrome, the open panel, or the
          RefRo Dock icon. Some websites limit what information they include in
          a drag. If a source URL is missing, use RefRo’s browser capture action
          while the source page is open or add the address manually.
        </p>
      </Section>
      <Section title="Browser permission">
        <p>
          RefRo asks for permission to communicate with Safari or Chrome only
          when you use a feature that needs the current page address or source
          recovery. If access was denied, open System Settings, choose Privacy &
          Security, then Automation, and allow RefRo to control the browser you
          use for capture.
        </p>
      </Section>
      <Section title="Keynote export">
        <p>
          RefRo asks for permission to communicate with Keynote only when you
          choose Keynote export. If export is blocked after permission was
          denied, open System Settings, choose Privacy & Security, then
          Automation, and allow RefRo to control Keynote.
        </p>
      </Section>
      <Section title="iCloud">
        <p>
          When iCloud sync is available and enabled, RefRo uses the iCloud
          account signed in on your Mac. RefRo’s developer does not operate a
          separate account system or research-library server.
        </p>
      </Section>
      <Section title="Reverse-image search">
        <p>
          Reverse Image Search opens a third-party website such as TinEye. If a
          public image address is available, RefRo may include it in the
          request. That website processes the request under its own privacy
          policy.
        </p>
      </Section>
      <Section title="Deleting content">
        <p>
          Deleting an image or project removes it from RefRo. When iCloud sync
          is enabled, deletions may synchronize across devices signed into the
          same iCloud account.
        </p>
      </Section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <Section title="Information you add">
        <p>
          RefRo stores the projects, images, source addresses, product details,
          notes, tags, categories, folders, presentations, and other information
          you choose to add. This content is used only to provide the app’s
          research, organization, search, presentation, and export features.
        </p>
      </Section>
      <Section title="Storage and iCloud">
        <p>
          Your RefRo library is stored on your device. If you enable iCloud
          synchronization in a release that supports it, Apple’s iCloud service
          stores and synchronizes the library within your iCloud account.
          RefRo’s developer does not operate a separate server that receives
          your research library.
        </p>
      </Section>
      <Section title="On-device analysis">
        <p>
          RefRo may use Apple Vision and, on supported systems, Apple
          Intelligence Foundation Models to suggest labels and concise titles.
          This analysis runs on the device. RefRo does not upload images to its
          developer for analysis.
        </p>
      </Section>
      <Section title="Browser and website access">
        <p>
          When you drag content from a website or ask RefRo to capture the
          current page, RefRo may read the active Safari or Chrome page address
          and save it with your reference. When you import from a web address,
          RefRo may contact that address to retrieve the image and page metadata
          you requested.
        </p>
        <p>
          RefRo opens third-party websites only when you choose an action that
          needs them. Those websites handle information under their own privacy
          policies.
        </p>
      </Section>
      <Section title="Keynote access">
        <p>
          When you choose Keynote export, RefRo communicates with Keynote to
          create the presentation you requested. RefRo does not use Keynote
          access for any other purpose.
        </p>
      </Section>
      <Section title="Analytics, advertising, and tracking">
        <p>
          RefRo does not include third-party advertising, behavioral tracking,
          or developer-operated analytics in the current release. RefRo does not
          sell personal information.
        </p>
      </Section>
      <Section title="Data sharing">
        <p>
          RefRo does not share your library with its developer. Information
          leaves the app only when you choose to sync through Apple iCloud,
          access an external website, export or share content, or drag content
          to another application.
        </p>
      </Section>
      <Section title="Retention and deletion">
        <p>
          Your information remains until you delete images, projects, or the
          app’s data. When iCloud synchronization is enabled, deletions may
          synchronize through your iCloud account according to Apple’s iCloud
          behavior and retention practices.
        </p>
      </Section>
      <Section title="Children">
        <p>
          RefRo is a general creative tool and is not directed to children under
          13.
        </p>
      </Section>
      <Section title="Changes">
        <p>
          This policy may be updated when RefRo’s features or data practices
          change. The effective date above will identify the latest version.
        </p>
      </Section>
      <Section title="Contact">
        <p>
          Brandon Davis
          <br />
          <a className="underline" href="mailto:brandon@brandonptdavis.com">
            brandon@brandonptdavis.com
          </a>
          <br />
          <a className="underline" href="/contact">
            brandonptdavis.com/contact
          </a>
        </p>
      </Section>
    </>
  );
}
