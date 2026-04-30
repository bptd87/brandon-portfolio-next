import { absoluteUrl, siteMetadata } from "../metadata";

export const BRANDON_PERSON_ID = absoluteUrl("/about#brandon-pt-davis");
export const BRANDON_ORGANIZATION_ID = absoluteUrl("/#brandon-pt-davis-design");
export const BRANDON_WEBSITE_ID = absoluteUrl("/#website");
export const BRANDON_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
export const BRANDON_LOGO_URL = absoluteUrl("/android-chrome-512x512.png");

export const BRANDON_PROFILE_URLS = [
  "https://www.instagram.com/brandonptdavisdesign",
  "https://www.linkedin.com/in/brandonptdavis",
  "https://www.youtube.com/@BrandonPTDavisDesign",
  "https://www.facebook.com/BrandonPTDavisA",
  "https://www.pinterest.com/BrandonPTDavis/",
  "https://www.usa829.org/Member-Profile/MemberID/15357",
] as const;

export function getBrandonPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": BRANDON_PERSON_ID,
    name: "Brandon PT Davis",
    alternateName: ["Brandon Davis", "Brandon P. T. Davis"],
    jobTitle: "Scenic Designer",
    url: absoluteUrl("/about"),
    image: BRANDON_HEADSHOT_URL,
    description:
      "San Diego-based union scenic designer with 130+ production credits across regional theatre, summer stock, and academic stages. Member of USA 829.",
    email: "mailto:info@brandonptdavis.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
    sameAs: BRANDON_PROFILE_URLS,
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "University of California, Irvine",
        url: "https://www.uci.edu",
      },
      {
        "@type": "EducationalOrganization",
        name: "Stephens College",
        url: "https://www.stephens.edu",
      },
    ],
    knowsAbout: [
      "Scenic Design",
      "Theatrical Design",
      "Regional Theatre",
      "Concept Rendering",
      "Vectorworks",
      "Twinmotion",
      "3D Modeling",
      "Digital Drafting",
      "Scenic Design Education",
    ],
  };
}

export function getBrandonOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": BRANDON_ORGANIZATION_ID,
    name: "Brandon PT Davis Design",
    url: siteMetadata.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: BRANDON_LOGO_URL,
    },
    image: absoluteUrl("/og-default.jpeg"),
    description:
      "Scenic design studio focused on story-driven environments for regional theatre, summer stock, academic production, and scenic design education.",
    founder: {
      "@id": BRANDON_PERSON_ID,
    },
    foundingDate: "2015",
    email: "mailto:info@brandonptdavis.com",
    sameAs: BRANDON_PROFILE_URLS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": BRANDON_WEBSITE_ID,
    name: siteMetadata.siteName,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    inLanguage: "en-US",
    publisher: {
      "@id": BRANDON_ORGANIZATION_ID,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteMetadata.siteUrl.replace(/\/$/, "")}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getAboutProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/about#profile-page"),
    url: absoluteUrl("/about"),
    name: "About Brandon PT Davis",
    description:
      "Profile of Brandon PT Davis, scenic designer and USA 829 member based in San Diego, California.",
    primaryImageOfPage: BRANDON_HEADSHOT_URL,
    mainEntity: getBrandonPersonJsonLd(),
  };
}

export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
