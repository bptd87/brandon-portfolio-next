"use client";

import { useState } from "react";
import { Instagram, Linkedin, Mail, Send } from "lucide-react";

import { capturePostHogEvent, isPostHogConfigured } from "../../lib/analytics/posthog-browser";
import { Button } from "../../client/src/components/ui/button";
import { Input } from "../../client/src/components/ui/input";
import { Label } from "../../client/src/components/ui/label";
import { Textarea } from "../../client/src/components/ui/textarea";
import Header from "../../client/src/components/Header";
import Footer from "../../client/src/components/Footer";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

export function ContactPage() {
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
      if (isPostHogConfigured()) {
        capturePostHogEvent("contact_form_submitted", {
          pathname: "/contact",
          subject: formData.subject,
        });
      }

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
      if (isPostHogConfigured()) {
        capturePostHogEvent("contact_form_submit_succeeded", {
          pathname: "/contact",
          subject: formData.subject,
        });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message.");
      if (isPostHogConfigured()) {
        capturePostHogEvent("contact_form_submit_failed", {
          pathname: "/contact",
          subject: formData.subject,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const mailtoHref = `mailto:info@brandonptdavis.com?subject=${encodeURIComponent(
    formData.subject || "Scenic design inquiry"
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
  )}`;

  return (
    <div className="about-profile-light min-h-screen bg-white text-[#111111]">
      <Header />

      <main className="container max-w-[88rem] pb-20 pt-24 md:pb-28 md:pt-28">
        <section className="border-b border-black/10 pb-10 md:pb-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-black/42">
              Contact
            </div>
            <h1 className="font-sans text-[clamp(2.7rem,6vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.06em] text-[#111111]">
              Start a scenic design conversation.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-7 text-black/62 md:text-[1.08rem]">
              Scenic design, rendering, teaching, and collaboration inquiries are welcome. Share
              the production, venue, timeline, and design goals, and I&apos;ll respond with a clear
              next step.
            </p>
            <a
              href="mailto:info@brandonptdavis.com"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-black/14 bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-[#111111] transition-colors hover:bg-black/[0.04]"
            >
              <Mail className="mr-2 h-4 w-4" />
              info@brandonptdavis.com
            </a>
          </div>
        </section>

        <section className="pt-10 md:pt-12">
          <div className="mx-auto max-w-3xl">
            {status === "success" ? (
              <div className="mb-6 rounded-2xl border border-emerald-700/20 bg-emerald-100/70 p-4 text-sm font-medium text-emerald-900">
                Message sent. Thanks for reaching out.
              </div>
            ) : null}
            {status === "error" ? (
              <div className="mb-6 rounded-2xl border border-rose-700/20 bg-rose-100/70 p-4 text-sm font-medium text-rose-950">
                <p>{errorMessage || "Failed to send message. Please try again."}</p>
                <a
                  href={mailtoHref}
                  className="mt-3 inline-flex text-rose-950 underline decoration-rose-950/25 underline-offset-4 transition-colors hover:decoration-rose-950"
                >
                  Send this message by email instead.
                </a>
              </div>
            ) : null}

            <div className="mb-8 border-b border-black/10 pb-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/42">
                Inquiry Form
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/56">
                Include the production, venue, schedule, and scope if you know them. More context
                helps me respond with the right next step more quickly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-black/74">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Brandon Davis"
                    className="h-14 rounded-xl border border-black/14 bg-white px-4 text-base text-[#111111] placeholder:text-black/32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-black/74">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    placeholder="hello@example.com"
                    className="h-14 rounded-xl border border-black/14 bg-white px-4 text-base text-[#111111] placeholder:text-black/32"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="font-medium text-black/74">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="What's this about?"
                  className="h-14 rounded-xl border border-black/14 bg-white px-4 text-base text-[#111111] placeholder:text-black/32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-medium text-black/74">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Tell me about the production, venue, timeline, and design goals..."
                  className="min-h-[200px] resize-none rounded-xl border border-black/14 bg-white px-4 py-4 text-base leading-7 text-[#111111] placeholder:text-black/32"
                  required
                />
                <p className="text-xs text-black/42">
                  Include schedule, venue, and budget parameters if known.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-[#6f4bd8] px-10 text-base font-medium text-white hover:bg-[#5f3fc7] md:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-14 border-t border-black/10 pt-6">
              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/42">
                    Contact
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-black/62">
                    <a href="mailto:info@brandonptdavis.com" className="flex items-center gap-3 transition-colors hover:text-black">
                      <Mail className="h-4 w-4" />
                      <span>info@brandonptdavis.com</span>
                    </a>
                    <a href="https://instagram.com/brandonptdavisdesign" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-black">
                      <Instagram className="h-4 w-4" />
                      <span>@brandonptdavisdesign</span>
                    </a>
                    <a href="https://linkedin.com/in/brandonptdavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-black">
                      <Linkedin className="h-4 w-4" />
                      <span>@brandonptdavis</span>
                    </a>
                    <a href="https://www.pinterest.com/BrandonPTDavis/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-black">
                      <PinterestIcon className="h-4 w-4" />
                      <span>@BrandonPTDavis</span>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/42">
                    Best to Include
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-black/58">
                    <li>Production title and organization</li>
                    <li>Venue, city, and target dates</li>
                    <li>Scope of work and deliverables</li>
                    <li>Known budget or schedule constraints</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
