"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import BrandMark from "../../client/src/components/BrandMark";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const PORTFOLIO_LINKS = [
  { label: "Scenic Design", href: "/projects" },
  { label: "Rendering", href: "/projects/rendering" },
  { label: "Experiential Design", href: "/projects/experiential" },
  { label: "Assistant Scenic Design", href: "/assistant-scenic-design" },
] as const;

const ABOUT_LINKS = [
  { label: "About", href: "/about" },
  { label: "Resume / CV", href: "/resume" },
  { label: "Creative Statement", href: "/creative-statement" },
  { label: "Teaching Philosophy", href: "/about/teaching" },
  { label: "Collaborators", href: "/about/collaborators" },
] as const;

const STUDIO_LINKS = [
  { label: "Articles", href: "/articles" },
  { label: "Tutorials", href: "/studio/tutorials" },
  { label: "App Studio", href: "/studio/apps" },
  { label: "Scenic Directory", href: "/studio/directory" },
] as const;

function MenuSection({
  isOpen,
  label,
  links,
  onToggle,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  label: string;
  links: readonly { label: string; href: string }[];
  onToggle: () => void;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <div className="border-b border-border/35 pb-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-foreground/55 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="space-y-1 pb-3">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block rounded-2xl px-3 py-3 text-[1.02rem] tracking-[-0.02em] transition-colors ${
                  active
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-foreground/72 hover:bg-foreground/[0.04] hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  const pathname = usePathname() || "/";
  const [workOpen, setWorkOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setWorkOpen(pathname.startsWith("/projects") || pathname.startsWith("/assistant-scenic-design"));
    setAboutOpen(
      pathname.startsWith("/about") ||
        pathname.startsWith("/resume") ||
        pathname.startsWith("/creative-statement")
    );
    setStudioOpen(pathname.startsWith("/articles") || pathname.startsWith("/studio"));
  }, [isOpen, pathname]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/72 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close mobile navigation"
      />

      <div className="fixed inset-x-0 top-0 z-50 h-[100dvh] overflow-y-auto border-b border-border/35 bg-background/96 backdrop-blur-2xl">
        <div className="container flex min-h-full flex-col py-5">
          <div className="flex items-start justify-between gap-6 border-b border-border/35 pb-5">
            <Link href="/" onClick={onClose} className="inline-flex items-center gap-0 leading-none">
              <span className="relative flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center">
                <BrandMark className="h-full w-full" />
              </span>
              <span className="-ml-[4px] flex min-w-0 flex-col items-start justify-center pt-[1px]">
                <span className="text-[1.12rem] font-black tracking-[-0.055em] text-foreground">
                  BRANDON PT DAVIS
                </span>
                <span className="mt-1 pl-[0.06rem] text-[8.5px] font-medium uppercase tracking-[0.28em] text-foreground/48">
                  SCENIC DESIGN
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/45 text-foreground/72 transition-colors hover:border-border hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 pt-6">
            <div className="mb-8 max-w-xs">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/42">
                Scenic Design by Brandon PT Davis
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/58">
                Portfolio, studio resources, and professional information in one place.
              </p>
            </div>

            <Link
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onClose();
                onOpenSearch();
              }}
              className="mb-6 inline-flex h-11 items-center justify-center rounded-full border border-border/45 px-5 text-sm font-medium tracking-[-0.01em] text-foreground/72 transition-colors hover:border-border hover:text-foreground"
            >
              Search Site
            </Link>

            <nav className="space-y-2">
              <MenuSection
                isOpen={workOpen}
                label="Portfolio"
                links={PORTFOLIO_LINKS}
                onToggle={() => setWorkOpen((value) => !value)}
                onClose={onClose}
                pathname={pathname}
              />
              <MenuSection
                isOpen={aboutOpen}
                label="About"
                links={ABOUT_LINKS}
                onToggle={() => setAboutOpen((value) => !value)}
                onClose={onClose}
                pathname={pathname}
              />
              <MenuSection
                isOpen={studioOpen}
                label="Studio"
                links={STUDIO_LINKS}
                onToggle={() => setStudioOpen((value) => !value)}
                onClose={onClose}
                pathname={pathname}
              />
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border/35 pt-5">
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium tracking-[-0.01em] text-background transition-opacity hover:opacity-90"
            >
              Contact
            </Link>
            <a
              href="mailto:info@brandonptdavis.com"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border/45 px-5 text-sm font-medium tracking-[-0.01em] text-foreground/72 transition-colors hover:border-border hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
