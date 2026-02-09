import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Authored Composite Visualization?",
    answer: "A hybrid visualization workflow combining authored spatial design, real-time rendering, and selective AI-assisted post-production. Every environment begins with scaled geometry and intentional composition. AI tools support environmental density, atmospheric depth, and surface refinement—always grounded in real-world proportion and authored design intent."
  },
  {
    question: "Are these visuals buildable?",
    answer: "Yes. All visualization is grounded in scaled geometry and technical drawing logic. Spatial relationships, circulation paths, and structural elements maintain real-world proportion throughout the design and visualization process. The design and the visualization describe the same space."
  },
  {
    question: "How does this benefit agile teams?",
    answer: "One author across design and visualization means faster iteration without rescaling or reinterpretation. Changes happen in the same file, maintaining spatial consistency. Visuals stay grounded in real circulation and proportion, creating clear communication between creative and production teams without adding complexity."
  },
  {
    question: "What is point-cloud–driven visualization?",
    answer: "An approach that treats space as a field of information rather than isolated objects. Point-cloud visualization emphasizes density, scale, and human perception—allowing environments to be evaluated as they will be experienced. Like a portrait composed of thousands of points, the environment resolves through accumulation rather than surface detail alone."
  },
  {
    question: "Can this support pitch presentations?",
    answer: "Yes—particularly where clarity, scale, and speed matter. The workflow allows rapid exploration of multiple compositions, lighting scenarios, and spatial configurations. More options in less time means better design decisions and more confident presentations that communicate both vision and feasibility."
  },
  {
    question: "What makes experiential design different from scenic design?",
    answer: "Experiential design prioritizes audience interaction and spatial navigation over theatrical sightlines. While scenic design frames a performance for a seated audience, experiential design creates environments people move through, touch, and explore. The design must work from every angle, accommodate circulation, and maintain coherence across multiple viewpoints and scales."
  }
];

export function ExperientialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 border-t border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Process & Approach
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              On experiential design methodology, spatial thinking, and visualization workflow.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left border border-border rounded-lg p-6 hover:border-white/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
