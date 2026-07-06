import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { LegacyProviders } from "../components/legacy/Providers";
import { JsonLdScript } from "../components/seo/JsonLdScript";
import { AnalyticsConsentBanner } from "../components/site/AnalyticsConsentBanner";
import { ContactOverlayProvider } from "../components/site/ContactOverlay";
import { LegacyClientCleanup } from "../components/site/LegacyClientCleanup";
import { PostHogAnalytics } from "../components/site/PostHogAnalytics";
import { StudioFrameMode } from "../components/site/StudioFrameMode";
import { absoluteUrl, siteMetadata } from "../lib/metadata";
import {
  getBrandonOrganizationJsonLd,
  getBrandonPersonJsonLd,
  getWebsiteJsonLd,
} from "../lib/seo/entities";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.siteName}`,
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.siteName,
  authors: [{ name: "Brandon PT Davis", url: absoluteUrl("/about") }],
  creator: "Brandon PT Davis",
  publisher: "Brandon PT Davis",
  alternates: {
    canonical: absoluteUrl("/"),
    types: {
      "application/rss+xml": [
        {
          url: absoluteUrl("/articles/rss.xml"),
          title: "Brandon PT Davis Articles",
        },
        {
          url: absoluteUrl("/projects/rss.xml"),
          title: "Brandon PT Davis Projects",
        },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.siteName,
    images: [
      {
        url: absoluteUrl("/og-default.jpeg"),
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@brandonptdavis",
    site: "@brandonptdavis",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [absoluteUrl("/og-default.jpeg")],
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";
  const themeBootScript = `
    (function () {
      try {
        var themes = [
          {
            bg: "#ffffff",
            ink: "#2c2c2c",
            muted: "rgba(44,44,44,0.62)",
            ghost: "#cbcbcb",
            accent: "#2c2c2c",
            accentSoft: "rgba(44,44,44,0.08)",
            controlBg: "#2c2c2c",
            controlInk: "#ffffff",
            footerBg: "#cbcbcb",
            footerDisplay: "rgba(44,44,44,0.7)",
            footerInk: "#2c2c2c"
          },
          {
            bg: "#496784",
            ink: "#f7f7f2",
            muted: "rgba(247,247,242,0.58)",
            ghost: "rgba(247,247,242,0.22)",
            accent: "#f7f7f2",
            accentSoft: "rgba(247,247,242,0.16)",
            controlBg: "#063f95",
            controlInk: "#88e7ff",
            footerBg: "#334f68",
            footerDisplay: "rgba(247,247,242,0.68)",
            footerInk: "#f7f7f2"
          },
          {
            bg: "#d39a24",
            ink: "#17120a",
            muted: "rgba(23,18,10,0.58)",
            ghost: "rgba(23,18,10,0.18)",
            accent: "#17120a",
            accentSoft: "rgba(23,18,10,0.12)",
            controlBg: "#17120a",
            controlInk: "#f2b427",
            footerBg: "#b47b14",
            footerDisplay: "rgba(255,244,216,0.66)",
            footerInk: "#17120a"
          },
          {
            bg: "#6f7d59",
            ink: "#f4f0e5",
            muted: "rgba(244,240,229,0.62)",
            ghost: "rgba(244,240,229,0.24)",
            accent: "#f4f0e5",
            accentSoft: "rgba(244,240,229,0.16)",
            controlBg: "#0c5f2e",
            controlInk: "#d9ff00",
            footerBg: "#566541",
            footerDisplay: "rgba(244,240,229,0.66)",
            footerInk: "#f4f0e5"
          }
        ];
        var stored = window.localStorage.getItem("brandon-home-theme-index");
        var index = Number.parseInt(stored || "0", 10);
        if (!Number.isFinite(index) || index < 0 || index >= themes.length) index = 0;
        var theme = themes[index];
        document.documentElement.style.setProperty("--home-theme-bg", theme.bg);
        document.documentElement.style.setProperty("--home-theme-ink", theme.ink);
        document.documentElement.style.setProperty("--home-theme-muted", theme.muted);
        document.documentElement.style.setProperty("--home-theme-ghost", theme.ghost);
        document.documentElement.style.setProperty("--home-theme-accent", theme.accent);
        document.documentElement.style.setProperty("--home-theme-accent-soft", theme.accentSoft);
        document.documentElement.style.setProperty("--home-theme-control-bg", theme.controlBg);
        document.documentElement.style.setProperty("--home-theme-control-ink", theme.controlInk);
        document.documentElement.style.setProperty("--home-theme-footer-bg", theme.footerBg);
        document.documentElement.style.setProperty("--home-theme-footer-display", theme.footerDisplay);
        document.documentElement.style.setProperty("--home-theme-footer-ink", theme.footerInk);
        document.documentElement.style.backgroundColor = theme.bg;
        document.documentElement.style.color = theme.ink;
        document.documentElement.style.colorScheme = "light";
      } catch (error) {}
    })();
  `;

  return (
    <html
      lang="en"
      className="dark"
      style={{
        backgroundColor: "var(--home-theme-bg, #ffffff)",
        color: "var(--home-theme-ink, #2c2c2c)",
        colorScheme: "light",
      }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeBootScript,
          }}
        />
        <JsonLdScript
          id="site-entity-json-ld"
          data={[
            getWebsiteJsonLd(),
            getBrandonOrganizationJsonLd(),
            getBrandonPersonJsonLd(),
          ]}
        />
      </head>
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--home-theme-bg, #ffffff)",
          color: "var(--home-theme-ink, #2c2c2c)",
        }}
        suppressHydrationWarning
      >
        <StudioFrameMode />
        <LegacyClientCleanup />
        {isProduction ? <PostHogAnalytics /> : null}
        <LegacyProviders>
          <ContactOverlayProvider>{children}</ContactOverlayProvider>
        </LegacyProviders>
        {isProduction ? <AnalyticsConsentBanner /> : null}
        {isProduction ? <Analytics /> : null}
        {isProduction ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
