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
            <section key={section.title} className="border-t border-white/10 py-8 first:pt-0">
              <h2 className="mb-4 font-sans text-[clamp(1.55rem,2.3vw,2.2rem)] font-medium leading-[1] tracking-[-0.045em] text-foreground">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 max-w-[46rem] text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68"
                  >
                    {paragraph.includes("info@brandonptdavis.com") ? (
                      <>
                        If you encounter an accessibility issue, contact{" "}
                        <a
                          href="mailto:info@brandonptdavis.com"
                          className="text-foreground underline decoration-white/20 underline-offset-4 hover:decoration-white/50"
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
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="max-w-[46rem] text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68"
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
