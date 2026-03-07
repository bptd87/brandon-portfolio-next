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
  const inferImageType = (value: string) => {
    const lower = value.toLowerCase().split("?")[0];
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".svg")) return "image/svg+xml";
    return "image/jpeg";
  };

  const rawCanonicalUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://www.brandonptdavis.com");
  const canonicalUrl = normalizeCanonicalUrl(rawCanonicalUrl);
  const imageType = inferImageType(image);
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
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:domain" content="brandonptdavis.com" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={description || title} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterSite} />

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
