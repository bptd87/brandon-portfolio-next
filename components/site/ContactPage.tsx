"use client";

import { type CSSProperties, useState } from "react";
import { Instagram, Linkedin, Mail, Send, X } from "lucide-react";

import { Button } from "../../client/src/components/ui/button";
import { Input } from "../../client/src/components/ui/input";
import { Label } from "../../client/src/components/ui/label";
import { Textarea } from "../../client/src/components/ui/textarea";
import Header from "../../client/src/components/Header";
import Footer from "../../client/src/components/Footer";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "../../client/src/lib/homeTheme";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

export function ContactPage() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const mailtoHref = `mailto:info@brandonptdavis.com?subject=${encodeURIComponent(
    formData.subject || "Scenic design inquiry"
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
  )}`;
  const fieldStyle = {
    "--contact-field-bg": `color-mix(in srgb, ${homeTheme.bg} 92%, ${homeTheme.ink} 8%)`,
    "--contact-field-border": homeTheme.ghost,
    "--contact-placeholder": homeTheme.muted,
  } as CSSProperties;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_BODY_FONT,
      }}
    >
      <Header />

      <style>
        {`
          .contact-field::placeholder {
            color: var(--contact-placeholder);
            opacity: 1;
          }
        `}
      </style>

      <main className="px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(1.5rem,4vw,3rem)] pt-[clamp(5rem,9vw,7rem)]">
        <section
          className="relative mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[92rem] flex-col overflow-hidden rounded-[clamp(1.5rem,3vw,2.75rem)] border px-[clamp(1.35rem,4vw,4rem)] py-[clamp(1.35rem,4vw,4rem)]"
          style={{
            backgroundColor: `color-mix(in srgb, ${homeTheme.bg} 92%, ${homeTheme.ink} 8%)`,
            borderColor: homeTheme.ghost,
            boxShadow: "0 1.6rem 5rem rgba(0,0,0,0.14)",
          }}
        >
          <a
            href="/"
            aria-label="Close contact page"
            className="absolute right-[clamp(1rem,2.2vw,2rem)] top-[clamp(1rem,2.2vw,2rem)] z-10 inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </a>

          <div className="grid flex-1 gap-[clamp(2rem,6vw,6rem)] pt-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,0.72fr)] lg:items-end lg:pt-4">
            <div className="flex min-h-[34rem] flex-col justify-between gap-12">
              <div>
                <h1
                  className="max-w-[9ch] text-[clamp(4.2rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-[0]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  CONTACT
                </h1>
                <p className="mt-7 max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.45rem)] leading-[1.45] tracking-[-0.025em]" style={{ color: homeTheme.muted }}>
                  Scenic design, rendering, teaching, and collaboration inquiries are welcome. Share
                  the production, venue, timeline, and design goals, and I&apos;ll respond with a clear
                  next step.
                </p>
              </div>

              <div className="grid gap-8 border-t pt-7 md:grid-cols-2" style={{ borderColor: homeTheme.ghost }}>
                <div>
                  <p
                    className="text-[0.78rem] font-black uppercase tracking-[0.12em]"
                    style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
                  >
                    Direct
                  </p>
                  <div className="mt-4 space-y-3 text-[0.95rem] leading-6">
                    <a href="mailto:info@brandonptdavis.com" className="flex items-center gap-3 no-underline transition-opacity hover:opacity-70">
                      <Mail className="h-4 w-4" />
                      <span>info@brandonptdavis.com</span>
                    </a>
                    <a href="https://instagram.com/brandonptdavisdesign" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 no-underline transition-opacity hover:opacity-70">
                      <Instagram className="h-4 w-4" />
                      <span>@brandonptdavisdesign</span>
                    </a>
                    <a href="https://linkedin.com/in/brandonptdavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 no-underline transition-opacity hover:opacity-70">
                      <Linkedin className="h-4 w-4" />
                      <span>@brandonptdavis</span>
                    </a>
                    <a href="https://www.pinterest.com/BrandonPTDavis/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 no-underline transition-opacity hover:opacity-70">
                      <PinterestIcon className="h-4 w-4" />
                      <span>@BrandonPTDavis</span>
                    </a>
                  </div>
                </div>

                <div>
                  <p
                    className="text-[0.78rem] font-black uppercase tracking-[0.12em]"
                    style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
                  >
                    Best to include
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.95rem] leading-6" style={{ color: homeTheme.muted }}>
                    <li>Production title and organization</li>
                    <li>Venue, city, and target dates</li>
                    <li>Scope of work and deliverables</li>
                    <li>Known budget or schedule constraints</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              {status === "success" ? (
                <div className="mb-5 rounded-[1.1rem] border border-emerald-700/20 bg-emerald-100/80 p-4 text-sm font-semibold text-emerald-950">
                  Message sent. Thanks for reaching out.
                </div>
              ) : null}
              {status === "error" ? (
                <div className="mb-5 rounded-[1.1rem] border border-rose-700/20 bg-rose-100/80 p-4 text-sm font-semibold text-rose-950">
                  <p>{errorMessage || "Failed to send message. Please try again."}</p>
                  <a
                    href={mailtoHref}
                    className="mt-3 inline-flex text-rose-950 underline decoration-rose-950/25 underline-offset-4 transition-colors hover:decoration-rose-950"
                  >
                    Send this message by email instead.
                  </a>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[0.78rem] font-black uppercase tracking-[0.1em]" style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}>
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Brandon Davis"
                      className="contact-field h-14 rounded-[1rem] border bg-[var(--contact-field-bg)] px-4 text-base shadow-none outline-none focus-visible:ring-2 focus-visible:ring-current/20"
                      style={{ ...fieldStyle, borderColor: "var(--contact-field-border)", color: homeTheme.ink }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[0.78rem] font-black uppercase tracking-[0.1em]" style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                      placeholder="hello@example.com"
                      className="contact-field h-14 rounded-[1rem] border bg-[var(--contact-field-bg)] px-4 text-base shadow-none outline-none focus-visible:ring-2 focus-visible:ring-current/20"
                      style={{ ...fieldStyle, borderColor: "var(--contact-field-border)", color: homeTheme.ink }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[0.78rem] font-black uppercase tracking-[0.1em]" style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}>
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                    placeholder="What's this about?"
                    className="contact-field h-14 rounded-[1rem] border bg-[var(--contact-field-bg)] px-4 text-base shadow-none outline-none focus-visible:ring-2 focus-visible:ring-current/20"
                    style={{ ...fieldStyle, borderColor: "var(--contact-field-border)", color: homeTheme.ink }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[0.78rem] font-black uppercase tracking-[0.1em]" style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}>
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                    placeholder="Tell me about the production, venue, timeline, and design goals..."
                    className="contact-field min-h-[14rem] resize-none rounded-[1rem] border bg-[var(--contact-field-bg)] px-4 py-4 text-base leading-7 shadow-none outline-none focus-visible:ring-2 focus-visible:ring-current/20"
                    style={{ ...fieldStyle, borderColor: "var(--contact-field-border)", color: homeTheme.ink }}
                    required
                  />
                  <p className="text-[0.82rem] leading-5" style={{ color: homeTheme.muted }}>
                    Include schedule, venue, and budget parameters if known.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-full border-0 px-8 text-[0.95rem] font-black uppercase tracking-[0.04em] shadow-none transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 md:w-auto"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                    fontFamily: HOME_DISPLAY_FONT,
                  }}
                >
                  {isSubmitting ? "Sending" : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer backgroundColor={homeTheme.footerBg} displayTextColor={homeTheme.footerDisplay} textColor={homeTheme.footerInk} />
    </div>
  );
}
