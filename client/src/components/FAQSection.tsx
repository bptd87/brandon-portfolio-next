import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export function FAQSection({ title, subtitle, items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 border-t border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              {title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {items.map((faq, index) => (
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
