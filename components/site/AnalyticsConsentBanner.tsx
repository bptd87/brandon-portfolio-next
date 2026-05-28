"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getStoredAnalyticsConsent,
  setStoredAnalyticsConsent,
  type AnalyticsConsent,
} from "../../lib/analytics/consent";

export function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | undefined>(
    undefined
  );

  useEffect(() => {
    setConsent(getStoredAnalyticsConsent());
  }, []);

  if (consent !== null) return null;

  function chooseConsent(nextConsent: AnalyticsConsent) {
    setStoredAnalyticsConsent(nextConsent);
    setConsent(nextConsent);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] px-4 pb-4 md:px-6 md:pb-6">
      <section
        aria-label="Analytics consent"
        className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[1.5rem] border border-white/12 bg-[#111111]/94 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:p-5"
      >
        <div className="max-w-2xl">
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.22em] text-white/42">
            Analytics
          </p>
          <p className="mt-2 text-[0.98rem] leading-6 tracking-[-0.015em] text-white/78">
            I use privacy-conscious analytics to understand which portfolio
            pages, articles, and contact paths are useful. No ad tracking.
          </p>
          <Link
            href="/privacy"
            className="mt-3 inline-flex text-[0.9rem] font-medium text-white/56 underline decoration-white/18 underline-offset-4 transition-colors hover:text-white hover:decoration-white/42"
          >
            Privacy details
          </Link>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => chooseConsent("declined")}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/16 px-5 text-[0.92rem] font-medium tracking-[-0.02em] text-white/64 transition-colors hover:border-white/30 hover:text-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => chooseConsent("accepted")}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-[0.92rem] font-medium tracking-[-0.02em] text-black transition-opacity hover:opacity-90"
          >
            Accept analytics
          </button>
        </div>
      </section>
    </div>
  );
}
