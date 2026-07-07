"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import InfoPageShell from "@/components/InfoPageShell";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I focus on scenic design for plays and musicals, with an art-first process rooted in story, composition, and performance. I also provide renderings when teams need visual alignment before rehearsal and build.",
  },
  {
    question: "How do I start a project with you?",
    answer:
      "Use the contact page or email info@brandonptdavis.com with your production title, venue, dates, and goals. From there, we can define scope, timeline, deliverables, and collaboration workflow.",
  },
  {
    question: "What is a typical scenic design timeline?",
    answer:
      "Most scenic design projects move through script analysis, visual research, concept development, drafting, and production collaboration. Timing depends on production scale, build schedule, and how early the team can begin design development.",
  },
  {
    question: "Are you a union scenic designer?",
    answer: "Yes. I am a member of United Scenic Artists, Local USA 829.",
  },
  {
    question: "Do you work only in California?",
    answer:
      "No. I am based in California and work with teams regionally and nationally. Remote collaboration is built into my process, with travel available as needed for production milestones.",
  },
  {
    question: "Can I hire you for renderings only?",
    answer:
      "Yes. Rendering-only support is available for pitches, season planning, donor decks, and internal production alignment when full scenic design is not needed.",
  },
  {
    question: "How do you handle collaboration with other departments?",
    answer:
      "I collaborate closely with directors and the full design team so the scenic world supports story, performer movement, and the production’s visual language.",
  },
  {
    question: "Do you work with educational theatre programs?",
    answer:
      "Yes. I regularly work with academic and training programs, and I also offer teaching and mentorship in scenic design practice.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Pricing is based on scope, schedule, venue needs, and deliverables. Depending on project type, rates can be fee-based or hourly with clearly defined milestones.",
  },
  {
    question: "Do you take experiential design projects?",
    answer:
      "Yes. My experiential work applies scenic storytelling principles to live events and branded environments, while my core practice remains scenic design for performance.",
  },
  {
    question: "Can scenic and experiential approaches work together on one project?",
    answer:
      "Absolutely. When the project calls for it, theatrical storytelling and experiential strategy can reinforce each other to create clear, emotionally resonant audience experiences.",
  },
  {
    question: "What does the PT stand for?",
    answer: "Phillip Thomas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <SEO
        title="Scenic Design FAQ | Process, Pricing & Collaboration"
        description="Frequently asked questions about scenic design services, timelines, collaboration, and pricing."
        keywords="scenic design faq, scenic designer services, theatre design process, scenic design pricing, scenic collaboration"
        url="https://www.brandonptdavis.com/faq"
      />
      <StructuredData
        type="FAQPage"
        faqPage={{
          mainEntity: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "FAQ", url: "https://www.brandonptdavis.com/faq" },
        ]}
      />

      <InfoPageShell
        title="FAQ"
        intro="Common questions about scenic design process, collaboration, timeline, and project scope."
        currentPath="/faq"
      >
        <div className="max-w-4xl">
          <div className="border-t border-border">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.question} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span className="max-w-[44rem] font-display text-[clamp(1.9rem,3.1vw,3rem)] font-black uppercase leading-[0.9] tracking-[0] text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-7 w-7 shrink-0 text-foreground/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="pb-6 pr-10 text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_1rem_3rem_rgba(0,0,0,0.08)] md:p-8">
            <p className="max-w-[38rem] text-[1rem] font-semibold leading-[1.72] tracking-[-0.02em] text-foreground/70">
              Ready to discuss a production? Share the title, venue, and timeline to start a scenic
              design conversation.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--home-theme-control-bg)] px-5 text-[0.78rem] font-black uppercase tracking-[0.04em] text-[var(--home-theme-control-ink)] transition-transform hover:scale-[1.02]"
            >
              Contact
            </Link>
          </div>
        </div>
      </InfoPageShell>
    </>
  );
}
