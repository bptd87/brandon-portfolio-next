import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { LegacyProviders } from "../components/legacy/Providers";
import { JsonLdScript } from "../components/seo/JsonLdScript";
import { ContactOverlayProvider } from "../components/site/ContactOverlay";
import { LegacyClientCleanup } from "../components/site/LegacyClientCleanup";
import { StudioFrameMode } from "../components/site/StudioFrameMode";
import { absoluteUrl, siteMetadata } from "../lib/metadata";
import {
  getBrandonOrganizationJsonLd,
  getBrandonPersonJsonLd,
  getWebsiteJsonLd,
} from "../lib/seo/entities";

const homeThemeBootstrapScript = `
  (() => {
    try {
      const themes = [
        ["light", "#F7F5EF", "#171A18", "rgba(23,26,24,0.68)", "#747974", "#174D46", "rgba(23,77,70,0.11)", "#E7E2D8", "#174D46", "#E7E2D8", "#174D46", "#171A18"],
        ["dark", "#0D0E0D", "#F0EEE8", "rgba(240,238,232,0.66)", "#858781", "#D7C7A1", "rgba(215,199,161,0.12)", "#F0EEE8", "#0D0E0D", "#171918", "#D7C7A1", "#F0EEE8"],
        ["dark", "#174D46", "#F3EEDF", "rgba(243,238,223,0.68)", "#A9BFB9", "#D85A28", "rgba(216,90,40,0.18)", "#F3EEDF", "#174D46", "#103A35", "#F1A070", "#F3EEDF"],
        ["light", "#D85A28", "#1A1411", "rgba(26,20,17,0.7)", "#673421", "#F8E9D2", "rgba(248,233,210,0.2)", "#A64524", "#0D0E0D", "#241B17", "#F1A070", "#F8E9D2"],
        ["dark", "#22324A", "#F2EEE6", "rgba(242,238,230,0.68)", "#A8B4C4", "#D3A978", "rgba(211,169,120,0.14)", "#F2EEE6", "#22324A", "#182435", "#D3A978", "#F2EEE6"]
      ];
      const storageKey = "brandon-home-theme-index";
      const versionKey = "brandon-home-theme-version";
      const version = "6";
      let index = Number.parseInt(localStorage.getItem(storageKey) || "1", 10);
      if (!Number.isFinite(index) || localStorage.getItem(versionKey) !== version) {
        index = 1;
        localStorage.setItem(storageKey, "1");
        localStorage.setItem(versionKey, version);
      }
      index = Math.min(Math.max(index, 0), themes.length - 1);
      const theme = themes[index];
      const names = ["bg", "ink", "muted", "ghost", "accent", "accent-soft", "control-bg", "control-ink", "footer-bg", "footer-display", "footer-ink"];
      const root = document.documentElement;
      names.forEach((name, themeIndex) => root.style.setProperty("--home-theme-" + name, theme[themeIndex + 1]));
      root.style.backgroundColor = theme[1];
      root.style.color = theme[2];
      root.style.colorScheme = theme[0];
    } catch {}
  })();
`;

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
      {
        url: "/favicon-light.png?v=6",
        type: "image/png",
        sizes: "64x64",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.png?v=6",
        type: "image/png",
        sizes: "64x64",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon-light.png?v=6",
    apple: [
      { url: "/apple-touch-icon.png?v=6", sizes: "180x180", type: "image/png" },
    ],
  },
  category: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";
  return (
    <html
      lang="en"
      className="dark"
      style={{
        backgroundColor: "var(--home-theme-bg, #0D0E0D)",
        color: "var(--home-theme-ink, #F0EEE8)",
        colorScheme: "dark",
      }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <Script id="home-theme-bootstrap" strategy="beforeInteractive">
          {homeThemeBootstrapScript}
        </Script>
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=6"
          color="#171918"
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
          backgroundColor: "var(--home-theme-bg, #0D0E0D)",
          color: "var(--home-theme-ink, #F0EEE8)",
        }}
        suppressHydrationWarning
      >
        <StudioFrameMode />
        <LegacyClientCleanup />
        <LegacyProviders>
          <ContactOverlayProvider>{children}</ContactOverlayProvider>
        </LegacyProviders>
        {isProduction ? <Analytics /> : null}
        {isProduction ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
