import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const infoPages = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap" },
];

export default function Terms() {
  const updated = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 mb-4">Site Info</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-3">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md border text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  item.href === "/terms"
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
              <h2 className="text-2xl font-bold mb-3">Use of This Website</h2>
              <p>
                By using this website, you agree to these terms. If you do not agree, please discontinue use.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Intellectual Property</h2>
              <p>
                Unless otherwise noted, text, images, renderings, videos, and design content on this site are the property of Brandon PT Davis and protected by applicable intellectual property laws.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Permitted Use</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may view and reference site content for personal, informational purposes.</li>
                <li>You may not reproduce, republish, or distribute materials for commercial use without written permission.</li>
                <li>You may not attempt to interfere with site operation or security.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Third-Party Links</h2>
              <p>
                This site may link to third-party sites. Those destinations are governed by their own terms and policies, and Brandon PT Davis is not responsible for third-party content or practices.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a href="mailto:info@brandonptdavis.com" className="text-[#FF5722] hover:underline">
                  info@brandonptdavis.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
