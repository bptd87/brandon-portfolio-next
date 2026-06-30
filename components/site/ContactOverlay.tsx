"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Send, X } from "lucide-react";

import {
  capturePostHogEvent,
  isPostHogConfigured,
} from "../../lib/analytics/posthog-browser";

type ContactStatus = "idle" | "success" | "error";

export function ContactOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleContactClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!(target instanceof HTMLAnchorElement)) return;

      const url = new URL(target.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== "/contact" ||
        window.location.pathname === "/contact"
      ) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    }

    document.addEventListener("click", handleContactClick, true);
    return () =>
      document.removeEventListener("click", handleContactClick, true);
  }, []);

  return (
    <>
      {children}
      <ContactOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ContactOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const mailtoHref = useMemo(
    () =>
      `mailto:info@brandonptdavis.com?subject=${encodeURIComponent(
        formData.subject || "Scenic design inquiry"
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`,
    [formData]
  );

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      if (isPostHogConfigured()) {
        capturePostHogEvent("contact_overlay_submitted", {
          pathname: window.location.pathname,
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
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/28 px-3 py-5 md:px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-overlay-title"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[calc(100vh-2.5rem)] w-full max-w-[64rem] flex-col overflow-hidden rounded-lg border border-black/10 bg-[#f7f6f2] text-[#111111] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/10 bg-white/54 px-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9f3b2d]/22 bg-[#c6533f] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-colors hover:bg-[#a8482c]"
            aria-label="Close contact window"
          >
            <X className="h-4 w-4" />
          </button>
          <p
            id="contact-overlay-title"
            className="text-[0.88rem] font-semibold tracking-[-0.02em] text-black/58"
          >
            Contact
          </p>
          <div />
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
          <div className="px-6 py-6 md:px-10 md:py-7">
            <div className="max-w-3xl">
              <h3 className="text-[clamp(2.25rem,4.2vw,4rem)] font-medium leading-[0.93] tracking-[-0.06em] text-black">
                Start a scenic design conversation.
              </h3>
              <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-black/58">
                Share the production, venue, timeline, and design goals.
                I&apos;ll respond with a clear next step.
              </p>
              <a
                href="mailto:info@brandonptdavis.com"
                className="mt-5 inline-flex text-sm font-semibold text-[#496784] underline decoration-[#496784]/24 underline-offset-4 transition-colors hover:text-[#2f4c66] hover:decoration-[#496784]/60"
              >
                info@brandonptdavis.com
              </a>
            </div>

            <div className="mt-7 border-t border-black/10 pt-5">
              {status === "success" ? (
                <div className="mb-6 rounded-md border border-[#5d744d]/22 bg-[#5d744d]/10 px-4 py-3 text-sm font-medium text-black/72">
                  Message sent. Thanks for reaching out.
                </div>
              ) : null}
              {status === "error" ? (
                <div className="mb-6 rounded-md border border-[#a8482c]/24 bg-[#a8482c]/10 px-4 py-3 text-sm font-medium text-black/72">
                  <p>
                    {errorMessage ||
                      "Failed to send message. Please try again."}
                  </p>
                  <a
                    className="mt-2 inline-flex text-[#496784] underline decoration-[#496784]/24 underline-offset-4 hover:text-[#2f4c66] hover:decoration-[#496784]/60"
                    href={mailtoHref}
                  >
                    Send this message by email instead.
                  </a>
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-5">
                  <ContactField
                    id="overlay-name"
                    label="Your name"
                    value={formData.name}
                    onChange={value =>
                      setFormData(current => ({ ...current, name: value }))
                    }
                    placeholder="Brandon Davis"
                    autoComplete="name"
                  />
                  <ContactField
                    id="overlay-email"
                    label="Your email"
                    type="email"
                    value={formData.email}
                    onChange={value =>
                      setFormData(current => ({ ...current, email: value }))
                    }
                    placeholder="hello@example.com"
                    autoComplete="email"
                  />
                  <ContactField
                    id="overlay-subject"
                    label="Subject"
                    value={formData.subject}
                    onChange={value =>
                      setFormData(current => ({ ...current, subject: value }))
                    }
                    placeholder="Scenic design inquiry"
                  />
                </div>
                <div>
                  <label
                    htmlFor="overlay-message"
                    className="mb-2 block text-sm font-semibold tracking-[-0.02em] text-black/58"
                  >
                    Message
                  </label>
                  <textarea
                    id="overlay-message"
                    value={formData.message}
                    onChange={event =>
                      setFormData(current => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Production, venue, timeline, and design goals..."
                    className="min-h-56 w-full resize-none rounded-md border border-black/12 bg-white/72 px-4 py-3 text-[1rem] leading-7 text-black outline-none transition-colors placeholder:text-black/28 focus:border-[#496784] md:min-h-[16rem]"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#496784] px-7 text-[0.92rem] font-semibold tracking-[-0.01em] text-white transition-colors hover:bg-[#3c5872] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending" : "Send inquiry"}
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold tracking-[-0.02em] text-black/58"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-md border border-black/12 bg-white/72 px-4 text-[1rem] text-black outline-none transition-colors placeholder:text-black/28 focus:border-[#496784]"
        required
      />
    </div>
  );
}
