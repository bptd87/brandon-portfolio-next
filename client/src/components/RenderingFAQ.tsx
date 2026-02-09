import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes a rendering successful?",
    answer: "A successful rendering doesn't just document space—it communicates emotion, narrative, and atmosphere. It's about choosing what to reveal and what to withhold. Composition guides the eye. Light establishes mood. Material choices carry memory and history. When these elements align with the story you're telling, the rendering transcends technical accuracy and becomes a piece of visual storytelling."
  },
  {
    question: "How do you approach composition in renderings?",
    answer: "Every frame is a deliberate choice. I start by asking: where should the viewer's eye enter? What's the focal point? What remains in shadow? Composition isn't about filling space—it's about building visual hierarchy that serves the narrative. I use the rule of thirds, leading lines, and negative space to create tension, balance, or unease depending on what the project demands."
  },
  {
    question: "What's your philosophy on light and atmosphere?",
    answer: "Light is emotion. It defines time of day, temperature, and psychological tension. I approach lighting like a cinematographer—motivated sources, intentional shadows, and atmospheric depth. Fog, haze, and volumetric effects aren't decoration; they create separation between foreground and background, add mystery, and remind the viewer they're looking at a moment in time, not just geometry."
  },
  {
    question: "How do you collaborate with directors and designers?",
    answer: "I start by understanding the narrative and emotional goals of the project. What feeling should this space evoke? What's the story being told? From there, I work iteratively—sharing early compositions, testing lighting scenarios, and refining based on feedback. The best collaborations happen when the rendering process becomes part of the design conversation, not just documentation of decisions already made."
  },
  {
    question: "What's the difference between documentation and storytelling?",
    answer: "Documentation shows what a space looks like. Storytelling shows what it feels like. Documentation is neutral, objective, complete. Storytelling is authored—it has a point of view, a mood, a sense of time and place. I'm not interested in creating architectural photography. I'm interested in creating images that make you want to step into the world they depict."
  },
  {
    question: "What is Authored Composite Rendering?",
    answer: "It's my approach to blending traditional 3D rendering with modern post-production techniques. Every image begins with authored geometry, intentional lighting, and curated materials. The composite phase—whether through Photoshop, AI tools, or other methods—refines atmospherics, enhances textures, and accelerates iteration. The result is faster turnaround without sacrificing artistic control. The craft is in knowing what to build, what to enhance, and what to leave alone."
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
              The Craft
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              On rendering as an art form, design philosophy, and the process behind the images.
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
