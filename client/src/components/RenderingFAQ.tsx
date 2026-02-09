import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Authored Composite Rendering?",
    answer: "It's a hybrid workflow that combines traditional 3D rendering with AI-assisted post-production. Every image begins with intentional geometry, authored lighting, and curated materials. AI enters only in the composite phase—refining atmospherics, enhancing textures, or accelerating iteration. The result is faster turnaround without sacrificing artistic control."
  },
  {
    question: "Why is this approach better than traditional rendering?",
    answer: "Speed and flexibility. Traditional rendering can take hours per frame. Authored Composite Rendering maintains the same foundation—authored models, intentional lighting—but compresses the post-production timeline. You get photorealistic results faster, with more room for creative iteration and client feedback loops."
  },
  {
    question: "How does this benefit my project?",
    answer: "More options, faster. Instead of waiting days for a single angle, you can explore multiple compositions, lighting scenarios, and atmospheric treatments in the same timeframe. This means better design decisions, more confident presentations, and renderings that truly serve the narrative of your space."
  },
  {
    question: "What level of control do you maintain?",
    answer: "Complete control. Every rendering starts with authored 3D geometry built specifically for your project. Lighting is developed manually. Materials are chosen intentionally. AI tools support the composite phase, but every output is curated, refined, and aligned with your project's goals. You're not getting generic AI art—you're getting designed images."
  },
  {
    question: "Can you match specific aesthetic requirements?",
    answer: "Yes. Because the foundation is authored, not generated, the process adapts to any aesthetic—photorealistic, painterly, atmospheric, or stylized. The composite phase enhances what's already there. If you need a specific look, material palette, or lighting mood, it's built into the base render before AI ever touches it."
  },
  {
    question: "How does pricing compare to traditional rendering?",
    answer: "Competitive with faster turnaround. The efficiency gains mean you get more iterations and angles for similar investment. Instead of paying for render farm time and waiting days, you get curated results faster—which often translates to better value and more responsive collaboration throughout the design process."
  }
];

export function RenderingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 border-t border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Authored Composite Rendering
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A hybrid process that delivers photorealistic results faster, without compromising artistic control.
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
