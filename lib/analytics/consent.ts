"use client";

export type AnalyticsConsent = "accepted" | "declined";

export const ANALYTICS_CONSENT_STORAGE_KEY = "bptd_analytics_consent_v1";
const ANALYTICS_CONSENT_EVENT = "bptd:analytics-consent";

function isAnalyticsConsent(value: string | null): value is AnalyticsConsent {
  return value === "accepted" || value === "declined";
}

export function getStoredAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return isAnalyticsConsent(value) ? value : null;
}

export function setStoredAnalyticsConsent(consent: AnalyticsConsent) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  window.dispatchEvent(
    new CustomEvent<AnalyticsConsent>(ANALYTICS_CONSENT_EVENT, {
      detail: consent,
    })
  );
}

export function subscribeToAnalyticsConsent(
  handler: (consent: AnalyticsConsent | null) => void
) {
  if (typeof window === "undefined") return () => {};

  const handleConsentEvent = (event: Event) => {
    if (event instanceof CustomEvent && isAnalyticsConsent(event.detail)) {
      handler(event.detail);
      return;
    }

    handler(getStoredAnalyticsConsent());
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CONSENT_STORAGE_KEY) {
      handler(isAnalyticsConsent(event.newValue) ? event.newValue : null);
    }
  };

  window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
