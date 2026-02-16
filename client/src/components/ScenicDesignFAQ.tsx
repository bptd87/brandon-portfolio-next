import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is scenic design?",
    answer: "Scenic design is the art of creating the physical environment for live performance. It's about building worlds that support storytelling—defining where the story takes place, what time period it inhabits, what emotional landscape the audience enters. Every choice—color, texture, scale, materiality—serves the narrative. Scenic design isn't decoration; it's architecture in service of story."
  },
  {
    question: "How do you approach a new scenic design?",
    answer: "I start with the script and conversations with the director. What is this play about? What needs to happen spatially? What's the emotional journey? From there, I research historical context, architectural precedents, and visual inspiration. Sketches and models follow—exploring spatial relationships, sightlines, and flow. The design evolves through collaboration, refinement, and technical problem-solving until it serves both the artistic vision and the practical demands of production."
  },
  {
    question: "What's the role of research in your process?",
    answer: "Research grounds imagination. Whether it's period architecture, cultural context, or material history, research provides the vocabulary for design choices. It's not about literal replication—it's about understanding the rules so you know when and how to break them. Research informs authenticity, even when the design is stylized or abstract."
  },
  {
    question: "How do you balance artistic vision with technical constraints?",
    answer: "Every project has limits—budget, space, time, crew capacity. The best designs aren't made in spite of constraints; they're made because of them. Constraints force clarity. They eliminate the unnecessary. A great design doesn't require unlimited resources—it requires intentional choices. I embrace limitations as creative fuel, not obstacles."
  },
  {
    question: "What makes effective collaboration in theatre?",
    answer: "Theatre is inherently collaborative. The best work happens when designers, directors, and performers trust each other enough to take risks. I listen first—understanding the director's vision, the needs of the performers, the capabilities of the technical team. Then I contribute, iterate, and adapt. Good collaboration isn't about defending your ideas; it's about serving the story and lifting each other's work."
  },
  {
    question: "How do you communicate design ideas?",
    answer: "I use whatever tools serve the conversation—sketches, renderings, models, references, diagrams. Early in the process, I work fast and loose, exploring multiple directions. As the design solidifies, I refine and detail. White models show form and space. Renderings communicate atmosphere and mood. Construction drawings translate vision into buildable reality. Each tool has a purpose; the art is knowing which one to use when."
  },
  {
    question: "What role does storytelling play in your work?",
    answer: "Everything I design is in service of the story. The set should feel inevitable—as if the play couldn't happen anywhere else. It should guide the audience's focus, support the emotional arc, and create opportunities for staging that wouldn't exist without it. Scenic design is spatial storytelling. If it's not serving the narrative, it doesn't belong on stage."
  }
];

export function ScenicDesignFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 border-t border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Design Philosophy
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              On process, collaboration, and the craft of scenic design for live theatre.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index}>
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-xl font-bold pr-8">{faq.question}</h3>
                  <ChevronDown
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-[600px]" : "max-h-0"
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
