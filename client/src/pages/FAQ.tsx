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
          <div className="border-t border-black/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.question} className="border-b border-black/10">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span className="max-w-[44rem] font-sans text-[1.18rem] font-medium leading-[1.14] tracking-[-0.03em] text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-foreground/44 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="pb-5 pr-10 text-[1rem] leading-[1.8] tracking-[-0.01em] text-foreground/68">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-12 border-t border-black/10 pt-8">
            <p className="max-w-[38rem] text-[1rem] leading-[1.78] tracking-[-0.01em] text-foreground/62">
              Ready to discuss a production? Share the title, venue, and timeline to start a scenic
              design conversation.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-black/14 px-5 py-3 text-[0.88rem] font-medium tracking-[-0.01em] text-foreground transition-colors hover:border-black/24 hover:bg-black/[0.04]"
            >
              Contact
            </Link>
          </div>
        </div>
      </InfoPageShell>
    </>
  );
}
