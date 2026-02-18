import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What services do you offer?",
    answer: "I specialize in scenic design for theater, experiential design for brand activations and events, 3D rendering and visualization, and scale model fabrication. Each project is approached with a unique blend of artistic vision and technical expertise."
  },
  {
    question: "How do I start a project with you?",
    answer: "Simply reach out through the contact form or email me at info@brandonptdavis.com. We'll schedule an initial consultation to discuss your vision, timeline, and budget. From there, I'll provide a detailed proposal outlining the scope of work."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Timelines vary depending on project scope and complexity. A typical scenic design project takes 4-8 weeks from concept to final delivery, while experiential installations may require 8-16 weeks. Rush projects can be accommodated with advance notice."
  },
  {
    question: "Do you work remotely or on-site?",
    answer: "I work both remotely and on-site depending on project needs. Initial design work is typically done remotely, with on-site visits for installation supervision, technical rehearsals, and final adjustments. I'm based in California but available for travel."
  },
  {
    question: "What software do you use?",
    answer: "I primarily use SketchUp and Vectorworks for 3D modeling, Adobe Creative Suite for renderings and presentations, and various specialized tools for lighting design and technical documentation. I'm always exploring new technologies to enhance the design process."
  },
  {
    question: "Can you provide references or case studies?",
    answer: "Absolutely! Browse my portfolio to see detailed case studies of past projects. I'm happy to provide references from previous clients and collaborators upon request. Each project page includes production photos, renderings, and design notes."
  },
  {
    question: "What is your pricing structure?",
    answer: "Pricing varies based on project scope, timeline, and deliverables. I offer both flat-fee and hourly rate structures depending on the nature of the work. Contact me for a custom quote tailored to your specific needs and budget."
  },
  {
    question: "Do you collaborate with other designers and artists?",
    answer: "Yes! Collaboration is at the heart of great design. I regularly work with directors, choreographers, lighting designers, sound designers, and other creative professionals. I believe the best work emerges from strong collaborative relationships."
  },
  {
    question: "What makes your approach unique?",
    answer: "I bring together theatrical storytelling, experiential design thinking, and cutting-edge technology. My background spans traditional theater, immersive installations, and digital visualization, allowing me to create spaces that are both artistically compelling and technically sophisticated."
  },
  {
    question: "Do you offer teaching or workshops?",
    answer: "Yes! I'm passionate about design education and offer workshops, masterclasses, and guest lectures on scenic design, visualization techniques, and design technology. Check the Teaching Philosophy page for more about my educational approach."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Scenic Design FAQ | Process, Pricing & Collaboration"
        description="Frequently asked questions about scenic design services, pricing, project timelines, and collaboration. Answers about working with Brandon PT Davis."
        keywords="scenic design faq, theatrical design questions, scenic designer services, design project process, scenic design pricing, theatre design collaboration, hire scenic designer, scenic design services California"
        url="https://www.brandonptdavis.com/faq"
      />
      <StructuredData
        type="FAQPage"
        faqPage={{
          mainEntity: faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer
          }))
        }}
      />
      <Header />
      
      <div className="container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-4">Scenic Design FAQ</h1>
          <p className="text-muted-foreground mb-12">Everything you need to know about working with Brandon PT Davis</p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                >
                  <span className="text-lg font-bold pr-8">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-accent/30 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-foreground/80 mb-6">
              Can't find the answer you're looking for? Feel free to reach out directly.
            </p>
            <a 
              href="/contact" 
              className="inline-block text-sm font-black tracking-wide bg-[#FF5722] text-white px-6 py-3 rounded-full hover:bg-[#FF5722]/90 hover:scale-105 transition-all"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
