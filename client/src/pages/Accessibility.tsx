import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import StructuredData from "@/components/StructuredData";

const infoPages = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap" },
];

export default function Accessibility() {
  const reviewed = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Accessibility", url: "https://www.brandonptdavis.com/accessibility" },
        ]}
      />
      <Header />

      <main className="container py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 mb-4">Site Info</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-3">Accessibility</h1>
            <p className="text-sm text-muted-foreground">Statement reviewed: {reviewed}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md border text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  item.href === "/accessibility"
                    ? "border-[#FF5722] text-[#FF5722] bg-[#FF5722]/10"
                    : "border-border text-foreground/70 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="space-y-8 text-foreground/85 leading-relaxed">
            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Commitment</h2>
              <p>
                Brandon PT Davis is committed to making this website accessible and usable for as many visitors as possible, including people using assistive technologies.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Standards</h2>
              <p>
                The site is designed with WCAG 2.1 AA targets in mind, including keyboard access, readable contrast, clear focus states, and semantic structure.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">What We Prioritize</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keyboard navigable menus and controls.</li>
                <li>Text alternatives for meaningful imagery.</li>
                <li>Responsive layouts that remain usable on mobile and zoomed views.</li>
                <li>Predictable navigation and interaction patterns.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Feedback</h2>
              <p>
                If you encounter an accessibility issue, contact{" "}
                <a href="mailto:info@brandonptdavis.com" className="text-[#FF5722] hover:underline">
                  info@brandonptdavis.com
                </a>{" "}
                with the page URL and a short description of the problem.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
