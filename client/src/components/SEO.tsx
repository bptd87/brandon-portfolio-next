import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEO({
  title,
  description,
  image = "https://www.brandonptdavis.com/og-default.jpeg",
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  keywords,
  noindex = false,
  nofollow = false,
}: SEOProps) {
  const siteName = "Brandon PT Davis";
  const twitterHandle = "@brandonptdavis";
  const twitterSite = "@brandonptdavis";

  const normalizeCanonicalUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      parsed.hash = "";
      parsed.search = "";
      if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      return parsed.toString();
    } catch {
      return value;
    }
  };

  const rawCanonicalUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://www.brandonptdavis.com");
  const canonicalUrl = normalizeCanonicalUrl(rawCanonicalUrl);
  const robotsValue = `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsValue} />
      <meta name="googlebot" content={robotsValue} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content={twitterHandle} />
      <meta property="twitter:site" content={twitterSite} />

      {/* Article-specific tags */}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
