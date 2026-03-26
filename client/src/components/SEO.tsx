interface SEOProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
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
  title: _title,
  description: _description,
  image: _image = "https://www.brandonptdavis.com/og-default.jpeg",
  imageAlt: _imageAlt,
  url: _url,
  type: _type = "website",
  author: _author,
  publishedTime: _publishedTime,
  modifiedTime: _modifiedTime,
  keywords: _keywords,
  noindex: _noindex = false,
  nofollow: _nofollow = false,
}: SEOProps) {
  // App Router route files now own titles, canonicals, robots, and social metadata.
  // Keeping this component as a no-op avoids duplicate head tags from the old Helmet layer.
  return null;
}
