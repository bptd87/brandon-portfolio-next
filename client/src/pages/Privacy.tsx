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

export default function Privacy() {
  const updated = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Privacy", url: "https://www.brandonptdavis.com/privacy" },
        ]}
      />
      <Header />

      <main className="container py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 mb-4">Site Info</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-3">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md border text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  item.href === "/privacy"
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
              <h2 className="text-2xl font-bold mb-3">Introduction</h2>
              <p>
                Brandon PT Davis respects your privacy and is committed to protecting your personal information. This page explains what data may be collected, how it is used, and your options regarding that data.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact details you provide voluntarily through forms or email.</li>
                <li>Basic analytics and usage information such as browser, pages visited, and timing.</li>
                <li>Technical data needed for security, spam prevention, and performance monitoring.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">How Data Is Used</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to inquiries and project requests.</li>
                <li>To maintain and improve site performance and usability.</li>
                <li>To protect the site against abuse, fraud, or unauthorized activity.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Data Sharing</h2>
              <p>
                Personal information is not sold. Data may be processed by trusted infrastructure providers used to host, secure, and operate the website.
              </p>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/20 p-6">
              <h2 className="text-2xl font-bold mb-3">Your Rights</h2>
              <p className="mb-2">
                Depending on your jurisdiction, you may request access, correction, or deletion of personal data submitted through this site.
              </p>
              <p>
                Contact: <a href="mailto:info@brandonptdavis.com" className="text-[#FF5722] hover:underline">info@brandonptdavis.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
