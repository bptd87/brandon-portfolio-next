import type { Metadata } from "next";
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
        url: "/favicon-light.png?v=5",
        type: "image/png",
        sizes: "64x64",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.png?v=5",
        type: "image/png",
        sizes: "64x64",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon-light.png?v=5",
    apple: [{ url: "/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" }],
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
        backgroundColor: "var(--home-theme-bg, #ffffff)",
        color: "var(--home-theme-ink, #2c2c2c)",
        colorScheme: "light",
      }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=5" color="#174d46" />
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
        data-paper-texture="folded"
        className="min-h-screen"
        style={{
          backgroundColor: "var(--home-theme-bg, #ffffff)",
          color: "var(--home-theme-ink, #2c2c2c)",
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
