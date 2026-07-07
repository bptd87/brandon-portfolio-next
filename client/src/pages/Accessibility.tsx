"use client";

import InfoPageShell from "@/components/InfoPageShell";
import StructuredData from "@/components/StructuredData";

const sections = [
  {
    title: "Commitment",
    body: [
      "Brandon PT Davis is committed to making this website accessible and usable for as many visitors as possible, including people using assistive technologies.",
    ],
  },
  {
    title: "Standards",
    body: [
      "The site is designed with WCAG 2.1 AA targets in mind, including keyboard access, readable contrast, clear focus states, and semantic structure.",
    ],
  },
  {
    title: "What We Prioritize",
    items: [
      "Keyboard navigable menus and controls.",
      "Text alternatives for meaningful imagery.",
      "Responsive layouts that remain usable on mobile and zoomed views.",
      "Predictable navigation and interaction patterns.",
    ],
  },
  {
    title: "Feedback",
    body: [
      "If you encounter an accessibility issue, contact info@brandonptdavis.com with the page URL and a short description of the problem.",
    ],
  },
];

export default function Accessibility() {
  const reviewed = "March 26, 2026";

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Accessibility", url: "https://www.brandonptdavis.com/accessibility" },
        ]}
      />

      <InfoPageShell
        title="Accessibility"
        intro="An overview of the accessibility priorities guiding this site, including navigation, readable contrast, structure, and feedback pathways."
        currentPath="/accessibility"
        metaLabel={`Statement reviewed: ${reviewed}`}
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
                        If you encounter an accessibility issue, contact{" "}
                        <a
                          href="mailto:info@brandonptdavis.com"
                          className="text-foreground underline decoration-current/30 underline-offset-4 hover:decoration-current"
                        >
                          info@brandonptdavis.com
                        </a>{" "}
                        with the page URL and a short description of the problem.
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
