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
            <section key={section.title} className="border-t border-black/10 py-8 first:pt-0">
              <h2 className="mb-4 font-sans text-[clamp(1.55rem,2.3vw,2.2rem)] font-medium leading-[1] tracking-[-0.045em] text-foreground">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 max-w-[46rem] text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68"
                  >
                    {paragraph.includes("info@brandonptdavis.com") ? (
                      <>
                        For privacy-related questions, contact{" "}
                        <a
                          href="mailto:info@brandonptdavis.com"
                          className="text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/50"
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
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="max-w-[46rem] text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68"
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
    <section className="border-t border-black/10 py-8">
      <h2 className="mb-4 font-sans text-[clamp(1.55rem,2.3vw,2.2rem)] font-medium leading-[1] tracking-[-0.045em] text-foreground">
        Analytics Preference
      </h2>
      <p className="max-w-[46rem] text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68">
        Current setting:{" "}
        <span className="font-medium text-foreground">{status}</span>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => chooseConsent("accepted")}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#111111] px-5 text-[0.92rem] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => chooseConsent("declined")}
          className="inline-flex h-11 items-center justify-center rounded-full border border-black/14 px-5 text-[0.92rem] font-medium tracking-[-0.02em] text-foreground/68 transition-colors hover:border-black/30 hover:text-foreground"
        >
          Decline analytics
        </button>
      </div>
    </section>
  );
}
