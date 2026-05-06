import { absoluteUrl, siteMetadata } from "../metadata";

export const BRANDON_PERSON_ID = absoluteUrl("/about#brandon-pt-davis");
export const BRANDON_ORGANIZATION_ID = absoluteUrl("/#brandon-pt-davis-design");
export const BRANDON_WEBSITE_ID = absoluteUrl("/#website");
export const BRANDON_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
export const BRANDON_LOGO_URL = absoluteUrl("/android-chrome-512x512.png");
export const BRANDON_VOYAGELA_PROFILE_URL =
  "https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/";

export const BRANDON_PROFILE_URLS = [
  "https://www.instagram.com/brandonptdavisdesign",
  "https://www.linkedin.com/in/brandonptdavis",
  "https://www.youtube.com/@BrandonPTDavisDesign",
  "https://www.facebook.com/BrandonPTDavisA",
  "https://www.pinterest.com/BrandonPTDavis/",
  "https://www.usa829.org/Member-Profile/MemberID/15357",
] as const;

export function getBrandonPersonJsonLd(options: { includeProfileCitations?: boolean } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": BRANDON_PERSON_ID,
    name: "Brandon PT Davis",
    alternateName: ["Brandon Davis", "Brandon P. T. Davis"],
    givenName: "Brandon",
    familyName: "Davis",
    jobTitle: "Scenic Designer",
    url: absoluteUrl("/about"),
    mainEntityOfPage: absoluteUrl("/about"),
    image: BRANDON_HEADSHOT_URL,
    description:
      "San Diego-based union scenic designer with 130+ production credits across regional theatre, summer stock, and academic stages. Member of United Scenic Artists Local USA 829.",
    email: "mailto:info@brandonptdavis.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
    homeLocation: {
      "@type": "City",
      name: "San Diego",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    workLocation: {
      "@type": "City",
      name: "San Diego",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Scenic Designer",
      occupationLocation: {
        "@type": "City",
        name: "San Diego",
      },
      skills: [
        "Scenic design",
        "Theatre set design",
        "Concept rendering",
        "Vectorworks drafting",
        "3D scenic modeling",
      ],
    },
    memberOf: {
      "@type": "Organization",
      name: "United Scenic Artists Local USA 829",
      url: "https://www.usa829.org/",
    },
    subjectOf: options.includeProfileCitations
      ? [
          {
            "@type": "Article",
            name: "Rising Stars: Meet Brandon PT Davis",
            url: BRANDON_VOYAGELA_PROFILE_URL,
            publisher: {
              "@type": "Organization",
              name: "VoyageLA",
              url: "https://voyagela.com/",
            },
          },
          {
            "@type": "ProfilePage",
            name: "Brandon PT Davis USA 829 Member Profile",
            url: "https://www.usa829.org/Member-Profile/MemberID/15357",
            publisher: {
              "@type": "Organization",
              name: "United Scenic Artists Local USA 829",
              url: "https://www.usa829.org/",
            },
          },
        ]
      : undefined,
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
      "Stage Design",
      "Set Design",
      "Theatrical Design",
      "Theatre Set Design",
      "Regional Theatre",
      "Concept Rendering",
      "Scenic Rendering",
      "Renderworks",
      "Redshift",
      "Vectorworks",
      "Twinmotion",
      "3D Modeling",
      "Digital Drafting",
      "Production Design",
      "Live Experience Design",
      "San Diego Theatre",
    ],
    worksFor: {
      "@id": BRANDON_ORGANIZATION_ID,
    },
  };
}

export function getBrandonOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": BRANDON_ORGANIZATION_ID,
    name: "Brandon PT Davis Design",
    url: siteMetadata.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: BRANDON_LOGO_URL,
    },
    image: absoluteUrl("/og-default.jpeg"),
    description:
      "Scenic design studio focused on story-driven environments, theatrical renderings, and production design work for regional theatre, summer stock, academic production, and live performance.",
    founder: {
      "@id": BRANDON_PERSON_ID,
    },
    foundingDate: "2015",
    email: "mailto:info@brandonptdavis.com",
    sameAs: BRANDON_PROFILE_URLS,
    areaServed: [
      {
        "@type": "City",
        name: "San Diego",
      },
      {
        "@type": "Country",
        name: "United States",
      },
    ],
    serviceType: [
      "Scenic design",
      "Theatre set design",
      "Concept rendering",
      "Production design",
      "Vectorworks drafting",
    ],
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
    mainEntity: getBrandonPersonJsonLd({ includeProfileCitations: true }),
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
