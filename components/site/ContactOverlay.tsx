"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Mail, Send, X } from "lucide-react";

import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  type HomeColorTheme,
  useHomeTheme,
} from "../../client/src/lib/homeTheme";

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
  const { homeTheme } = useHomeTheme();
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
  const fieldVars = {
    "--contact-overlay-field-bg": `color-mix(in srgb, ${homeTheme.bg} 86%, ${homeTheme.ink} 14%)`,
    "--contact-overlay-field-border": homeTheme.ghost,
    "--contact-overlay-placeholder": homeTheme.muted,
  } as CSSProperties;

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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/42 p-[clamp(0.75rem,2vw,1.5rem)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-overlay-title"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <style>
        {`
          .contact-overlay-field::placeholder {
            color: var(--contact-overlay-placeholder);
            opacity: 1;
          }
        `}
      </style>

      <div
        className="relative flex h-[calc(100dvh-clamp(0.7rem,2vw,1.5rem))] w-full max-w-[118rem] flex-col overflow-hidden rounded-[clamp(1.35rem,2.4vw,2.25rem)] border shadow-[0_2rem_5rem_rgba(0,0,0,0.24)]"
        style={{
          backgroundColor: `color-mix(in srgb, ${homeTheme.bg} 94%, ${homeTheme.ink} 6%)`,
          borderColor: homeTheme.ghost,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[clamp(1rem,2.2vw,2rem)] top-[clamp(1rem,2.2vw,2rem)] z-10 inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105"
          style={{
            backgroundColor: homeTheme.controlBg,
            color: homeTheme.controlInk,
          }}
          aria-label="Close contact window"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-h-full gap-[clamp(2rem,5vw,5rem)] px-[clamp(1.35rem,4.2vw,5rem)] pb-[clamp(1.5rem,4vw,4rem)] pt-[clamp(5rem,7vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,0.88fr)] lg:items-center">
            <div className="flex min-h-[min(36rem,62vh)] flex-col justify-between gap-10">
              <div>
                <h2
                  id="contact-overlay-title"
                  className="max-w-[8ch] text-[clamp(5.2rem,11.5vw,13rem)] font-black uppercase leading-[0.8] tracking-[0]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  CONTACT
                </h2>
                <p
                  className="mt-7 max-w-[38rem] text-[clamp(1.08rem,1.45vw,1.55rem)] leading-[1.42] tracking-[-0.025em]"
                  style={{ color: homeTheme.muted }}
                >
                  Share the production, venue, timeline, and design goals.
                  I&apos;ll respond with a clear next step.
                </p>
                <a
                  href="mailto:info@brandonptdavis.com"
                  className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-black uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-70"
                  style={{
                    color: homeTheme.ink,
                    fontFamily: HOME_DISPLAY_FONT,
                  }}
                >
                  <Mail className="h-4 w-4" />
                  info@brandonptdavis.com
                </a>
              </div>

              <div
                className="border-t pt-7"
                style={{ borderColor: homeTheme.ghost }}
              >
                <p
                  className="max-w-[32rem] text-[0.95rem] leading-6"
                  style={{ color: homeTheme.muted }}
                >
                  Best to include: production title, organization, venue,
                  target dates, scope, and any known budget or schedule
                  constraints.
                </p>
              </div>
            </div>

            <div
              className="rounded-[clamp(1.2rem,2vw,1.75rem)] border p-[clamp(1rem,2.6vw,2rem)]"
              style={{
                backgroundColor: `color-mix(in srgb, ${homeTheme.bg} 88%, ${homeTheme.ink} 12%)`,
                borderColor: homeTheme.ghost,
              }}
            >
              {status === "success" ? (
                <div className="mb-5 rounded-[1.1rem] border border-emerald-700/20 bg-emerald-100/80 p-4 text-sm font-semibold text-emerald-950">
                  Message sent. Thanks for reaching out.
                </div>
              ) : null}
              {status === "error" ? (
                <div className="mb-5 rounded-[1.1rem] border border-rose-700/20 bg-rose-100/80 p-4 text-sm font-semibold text-rose-950">
                  <p>
                    {errorMessage ||
                      "Failed to send message. Please try again."}
                  </p>
                  <a
                    className="mt-3 inline-flex text-rose-950 underline decoration-rose-950/25 underline-offset-4 transition-colors hover:decoration-rose-950"
                    href={mailtoHref}
                  >
                    Send this message by email instead.
                  </a>
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <ContactField
                  id="overlay-name"
                  label="Your name"
                  value={formData.name}
                  onChange={value =>
                    setFormData(current => ({ ...current, name: value }))
                  }
                  placeholder="Brandon Davis"
                  autoComplete="name"
                  homeTheme={homeTheme}
                  fieldVars={fieldVars}
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
                  homeTheme={homeTheme}
                  fieldVars={fieldVars}
                />
              </div>

              <div className="mt-5">
                <ContactField
                  id="overlay-subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={value =>
                    setFormData(current => ({ ...current, subject: value }))
                  }
                  placeholder="Scenic design inquiry"
                  homeTheme={homeTheme}
                  fieldVars={fieldVars}
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="overlay-message"
                  className="mb-2 block text-[0.78rem] font-black uppercase tracking-[0.1em]"
                  style={{
                    color: homeTheme.muted,
                    fontFamily: HOME_DISPLAY_FONT,
                  }}
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
                  className="contact-overlay-field min-h-[clamp(15rem,30vh,23rem)] w-full resize-none rounded-[1rem] border bg-[var(--contact-overlay-field-bg)] px-4 py-4 text-[1rem] leading-7 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current/20"
                  style={{
                    ...fieldVars,
                    borderColor: "var(--contact-overlay-field-border)",
                    color: homeTheme.ink,
                  }}
                  required
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-14 w-full items-center justify-center rounded-full px-8 text-[0.95rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 md:w-auto"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                    fontFamily: HOME_DISPLAY_FONT,
                  }}
                >
                  {isSubmitting ? "Sending" : "Send Message"}
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
  homeTheme,
  fieldVars,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  homeTheme: HomeColorTheme;
  fieldVars: CSSProperties;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.78rem] font-black uppercase tracking-[0.1em]"
        style={{
          color: homeTheme.muted,
          fontFamily: HOME_DISPLAY_FONT,
        }}
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
        className="contact-overlay-field h-14 w-full rounded-[1rem] border bg-[var(--contact-overlay-field-bg)] px-4 text-[1rem] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current/20"
        style={{
          ...fieldVars,
          borderColor: "var(--contact-overlay-field-border)",
          color: homeTheme.ink,
        }}
        required
      />
    </div>
  );
}
