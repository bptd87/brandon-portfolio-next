import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

const infoPages = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap" },
];

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
    answer:
      "Yes. I am a member of United Scenic Artists, Local USA 829.",
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
    answer:
      "Phillip Thomas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
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
      <Header />

      <main className="container py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 mb-4">Site Info</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-3">FAQ</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about process, scope, timelines, and working together.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md border text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  item.href === "/faq"
                    ? "border-[#FF5722] text-[#FF5722] bg-[#FF5722]/10"
                    : "border-border text-foreground/70 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="rounded-xl border border-border/60 bg-card/20 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-base md:text-lg font-semibold pr-6">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <div className="px-5 pb-5 text-foreground/80 leading-relaxed">{faq.answer}</div>}
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-card/20 p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to discuss a production?</h2>
            <p className="text-foreground/80 mb-6">Share title, venue, and timeline to start a scenic design conversation.</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-7 rounded-md border border-[#FF5722] bg-[#FF5722] text-[11px] font-bold tracking-[0.14em] uppercase text-white hover:bg-[#ff6a3a] hover:border-[#ff6a3a] transition-all duration-300"
            >
              Contact For Scenic Design
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
