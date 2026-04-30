import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { LegacyProviders } from "../components/legacy/Providers";
import { JsonLdScript } from "../components/seo/JsonLdScript";
import { LegacyClientCleanup } from "../components/site/LegacyClientCleanup";
import { PostHogAnalytics } from "../components/site/PostHogAnalytics";
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
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
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

  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <JsonLdScript
          id="site-entity-json-ld"
          data={[
            getWebsiteJsonLd(),
            getBrandonOrganizationJsonLd(),
            getBrandonPersonJsonLd(),
          ]}
        />
      </head>
      <body className="min-h-screen bg-gradient-premium">
        <LegacyClientCleanup />
        <PostHogAnalytics />
        <LegacyProviders>{children}</LegacyProviders>
        {isProduction ? <Analytics /> : null}
        {isProduction ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
