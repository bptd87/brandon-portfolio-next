"use client";

import InfoPageShell from "@/components/InfoPageShell";
import StructuredData from "@/components/StructuredData";

const sections = [
  {
    title: "Use of This Website",
    body: [
      "By using this website, you agree to these terms. If you do not agree, please discontinue use.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "Unless otherwise noted, text, images, renderings, videos, and design content on this site are the property of Brandon PT Davis and are protected by applicable intellectual property laws.",
    ],
  },
  {
    title: "Permitted Use",
    items: [
      "You may view and reference site content for personal or informational purposes.",
      "You may not reproduce, republish, or distribute materials for commercial use without written permission.",
      "You may not attempt to interfere with site operation, access controls, or security.",
    ],
  },
  {
    title: "Third-Party Links",
    body: [
      "This site may link to third-party destinations. Those sites are governed by their own policies and terms, and Brandon PT Davis is not responsible for third-party content or practices.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about these terms can be sent to info@brandonptdavis.com."],
  },
];

export default function Terms() {
  const updated = "March 26, 2026";

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Terms", url: "https://www.brandonptdavis.com/terms" },
        ]}
      />

      <InfoPageShell
        title="Terms of Service"
        intro="The basic terms that govern use of this website, its content, and any linked resources."
        currentPath="/terms"
        metaLabel={`Last updated: ${updated}`}
      >
        <div className="max-w-4xl">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-border py-8 first:pt-0">
              <h2 className="mb-4 font-display text-[clamp(2.35rem,4vw,3.8rem)] font-black uppercase leading-[0.88] tracking-[0] text-foreground">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 max-w-[46rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70"
                  >
                    {paragraph.includes("info@brandonptdavis.com") ? (
                      <>
                        Questions about these terms can be sent to{" "}
                        <a
                          href="mailto:info@brandonptdavis.com"
                          className="text-foreground underline decoration-current/30 underline-offset-4 hover:decoration-current"
                        >
                          info@brandonptdavis.com
                        </a>
                        .
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              {section.items ? (
                <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-foreground/35">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="max-w-[46rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </InfoPageShell>
    </>
  );
}
