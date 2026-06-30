"use client";

import { Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brandonptdavis",
    icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/brandonptdavisdesign",
    icon: Instagram,
  },
] as const;

const FOOTER_LINKS = [
  { label: "Portfolio", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
] as const;

const COPYRIGHT_YEAR = 2026;

export default function Footer({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";
  const linkClassName = `text-[0.92rem] font-semibold tracking-[-0.012em] transition-colors ${
    isLight ? "text-black/56 hover:text-black" : "text-white/58 hover:text-white"
  }`;
  const socialClassName = `inline-flex h-10 w-10 items-center justify-center border transition-colors ${
    isLight
      ? "border-black/12 text-black/52 hover:border-black/24 hover:bg-black/[0.05] hover:text-black"
      : "border-white/14 text-white/54 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
  }`;

  return (
    <footer
      className={`mt-0 border-t ${
        isLight
          ? "border-black/10 bg-[#f1f0ec] text-[#111111]"
          : "border-white/10 bg-[#070707] text-white"
      } ${className}`}
    >
      <div className="px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-12">
        <div className="mx-auto flex max-w-[76rem] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-3 md:justify-start" aria-label="Footer navigation">
            {FOOTER_LINKS.map(item => (
              <Link key={item.href} href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:justify-end">
            {SOCIAL_LINKS.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialClassName}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div
          className={`mx-auto mt-8 flex max-w-[76rem] flex-col gap-3 border-t pt-5 text-[0.84rem] tracking-[-0.006em] md:flex-row md:items-center md:justify-between ${
            isLight ? "border-black/10 text-black/46" : "border-white/10 text-white/42"
          }`}
        >
          <p>© {COPYRIGHT_YEAR} Brandon PT Davis.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className={linkClassName}>
              Privacy
            </Link>
            <Link href="/terms" className={linkClassName}>
              Terms
            </Link>
            <Link href="/accessibility" className={linkClassName}>
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
