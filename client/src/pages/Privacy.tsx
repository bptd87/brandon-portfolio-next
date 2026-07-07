"use client";

import { useEffect, useState } from "react";

import InfoPageShell from "@/components/InfoPageShell";
import StructuredData from "@/components/StructuredData";
import {
  getStoredAnalyticsConsent,
  setStoredAnalyticsConsent,
  subscribeToAnalyticsConsent,
  type AnalyticsConsent,
} from "../../../lib/analytics/consent";

const sections = [
  {
    title: "Introduction",
    body: [
      "Brandon PT Davis respects your privacy and is committed to protecting the information you choose to share through this website.",
      "This page outlines what data may be collected, how it is used, and the choices available to visitors regarding that information.",
    ],
  },
  {
    title: "Information We Collect",
    items: [
      "Contact details submitted voluntarily through forms or email.",
      "Basic analytics and usage information, such as browser, pages visited, approximate location, and interaction events collected through Vercel Analytics and, when accepted, PostHog.",
      "Technical data needed for site security, spam prevention, and performance monitoring.",
    ],
  },
  {
    title: "How Information Is Used",
    items: [
      "To respond to project inquiries and direct messages.",
      "To maintain and improve site performance, navigation, and usability.",
      "To understand which portfolio pages, articles, and contact pathways are most useful to visitors.",
      "To protect the site against abuse, fraud, or unauthorized activity.",
    ],
  },
  {
    title: "Analytics Choices",
    body: [
      "PostHog analytics are optional and are only enabled after a visitor accepts analytics in the site notice.",
      "A local preference is stored in the browser so the choice can be remembered on future visits.",
    ],
  },
  {
    title: "Data Sharing",
    body: [
      "Personal information is not sold. Data may be processed by trusted infrastructure providers used to host, secure, and operate the website.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "Depending on your jurisdiction, you may request access, correction, or deletion of personal data submitted through this site.",
      "For privacy-related questions, contact info@brandonptdavis.com.",
    ],
  },
];

export default function Privacy() {
  const updated = "March 27, 2026";

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Privacy", url: "https://www.brandonptdavis.com/privacy" },
        ]}
      />

      <InfoPageShell
        title="Privacy Policy"
        intro="A clear outline of what information may be collected through this site, how it is used, and how it is handled."
        currentPath="/privacy"
        metaLabel={`Last updated: ${updated}`}
      >
        <div className="max-w-4xl">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-border py-8 first:pt-0">
              <h2 className="mb-4 font-display text-[clamp(2.35rem,4vw,3.8rem)] font-black uppercase leading-[0.88] tracking-[0] text-foreground">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 max-w-[46rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70"
                  >
                    {paragraph.includes("info@brandonptdavis.com") ? (
                      <>
                        For privacy-related questions, contact{" "}
                        <a
                          href="mailto:info@brandonptdavis.com"
                          className="text-foreground underline decoration-current/30 underline-offset-4 hover:decoration-current"
                        >
                          info@brandonptdavis.com
                        </a>
                        .
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              {section.items ? (
                <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-foreground/35">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="max-w-[46rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <AnalyticsPreferenceControl />
        </div>
      </InfoPageShell>
    </>
  );
}

function AnalyticsPreferenceControl() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | undefined>(
    undefined
  );

  useEffect(() => {
    setConsent(getStoredAnalyticsConsent());
    return subscribeToAnalyticsConsent(setConsent);
  }, []);

  const status =
    consent === "accepted"
      ? "Analytics accepted"
      : consent === "declined"
        ? "Analytics declined"
        : "No analytics choice saved";

  function chooseConsent(nextConsent: AnalyticsConsent) {
    setStoredAnalyticsConsent(nextConsent);
    setConsent(nextConsent);
  }

  return (
    <section className="border-t border-border py-8">
      <h2 className="mb-4 font-display text-[clamp(2.35rem,4vw,3.8rem)] font-black uppercase leading-[0.88] tracking-[0] text-foreground">
        Analytics Preference
      </h2>
      <p className="max-w-[46rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70">
        Current setting:{" "}
        <span className="font-black text-foreground">{status}</span>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => chooseConsent("accepted")}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--home-theme-control-bg)] px-5 text-[0.78rem] font-black uppercase tracking-[0.04em] text-[var(--home-theme-control-ink)] transition-transform hover:scale-[1.02]"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => chooseConsent("declined")}
          className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-[var(--home-theme-accent-soft)] px-5 text-[0.78rem] font-black uppercase tracking-[0.04em] text-foreground transition-transform hover:scale-[1.02]"
        >
          Decline analytics
        </button>
      </div>
    </section>
  );
}
