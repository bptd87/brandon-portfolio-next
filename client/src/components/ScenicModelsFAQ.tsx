import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What scale do you typically work at?",
    answer: "Scale depends on the project requirements. Quarter-inch scale (1:48) and half-inch scale (1:24) are standard for theatrical productions, allowing for careful detailing while remaining practical for stage use. Larger scales enable more intricate features; smaller scales challenge precision and require careful material selection. Each scale has its own aesthetic and fabrication considerations."
  },
  {
    question: "What materials do you use for scenic models?",
    answer: "I work primarily with museum board, chipboard, foam core, and other archival materials for carving and structural components. Laser cutting enables precision work in wood veneer, acrylic, and mat board. 3D printing provides organic forms and complex geometries that would be difficult to achieve by hand. Material selection depends on the aesthetic goal—whether aiming for the warmth of hand-crafted elements or the precision of digital fabrication."
  },
  {
    question: "How detailed are the models?",
    answer: "Detail is calibrated to what reads from the theatrical perspective. A model built for a 500-seat theater requires different detail intensity than one for an intimate black-box space. I work at the level that communicates the designer's vision without burying the stage composition. Weathering, texture, and fine details are included where they contribute to storytelling—not as filler."
  },
  {
    question: "What's the timeline for building a scenic model?",
    answer: "A typical model takes 2-4 weeks depending on scale, complexity, and detail level. Simple architectural forms might take a week; intricate period pieces with hand-crafted elements could take 6 weeks or more. Laser cutting significantly accelerates repetitive elements. The design phase—understanding the vision and planning the build—is as important as the execution itself."
  },
  {
    question: "How do you approach translating a design into a model?",
    answer: "I start by asking: what story does this model need to tell? What does the director and designer need to see? Is this about spatial relationships, material exploration, or atmospheric possibility? The model's job isn't to be precious—it's to be a thinking tool. I plan the build to prioritize what matters and simplify what doesn't need detail resolution at this stage."
  },
  {
    question: "Can you work from rough sketches or preliminary concepts?",
    answer: "Absolutely. Some of my best models come from conversational design sessions. I ask questions, suggest material approaches, propose how certain elements might be built, and the design evolves through collaboration. I can work from rough sketches, photographs, or even theatrical inspiration references. The earlier in the design process, the more the model can influence the final design."
  },
  {
    question: "How do you handle precision in hand-crafted builds?",
    answer: "Precision comes from planning. I draft the build, identifying how components will fit together before cutting anything. Knife-work is deliberate—multiple light passes rather than forcing cuts. For elements requiring tight tolerances, I use straightedges, cutting mats, and metal rulers. The goal is accuracy without appearing mechanical or cold. Hand-crafted models should feel intentional, not crude."
  },
  {
    question: "What's the difference between hand-crafted and digitally fabricated elements?",
    answer: "Hand-crafted work—knife-cut, folded, shaped—reads as intuitive and organic but requires skill and time. Digital fabrication—3D printing, laser cutting—delivers precision and enables complex geometries quickly. The strongest models often combine both: digital fabrication for repetitive or complex geometry, hand-work for texture, weathering, and the human touch that brings a model to life."
  }
];

export function ScenicModelsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 border-t border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              The Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              On modeling methodology, materials, scale, and the thinking behind three-dimensional design exploration.
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
                    openIndex === index ? "max-h-96" : "max-h-0"
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
