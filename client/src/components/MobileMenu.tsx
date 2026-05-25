"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { recentScenicProjects } from "./navigationData";

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
  { label: "Profile", href: "/about" },
  { label: "Upcoming Productions", href: "/upcoming-productions" },
  { label: "Resume / CV", href: "/resume" },
  { label: "Creative Statement", href: "/creative-statement" },
  { label: "Teaching Philosophy", href: "/about/teaching" },
  { label: "Collaborators", href: "/about/collaborators" },
] as const;

const PUBLISH_LINKS = [
  { label: "Articles", href: "/articles" },
  { label: "Tutorials", href: "/studio/tutorials" },
  { label: "Scenic Directory", href: "/studio/directory" },
  { label: "Studio Apps", href: "/studio/apps" },
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
    <div className="border-b border-border/35 pb-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-sans text-[1.72rem] font-semibold leading-none tracking-[-0.055em] text-foreground">
          {label}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-foreground/42 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="space-y-1 pb-4">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block rounded-[1rem] px-1 py-2.5 font-sans text-[1.25rem] font-medium leading-[1.05] tracking-[-0.04em] transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-foreground/58 hover:text-foreground"
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
  const [publishOpen, setPublishOpen] = useState(false);

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
        pathname.startsWith("/upcoming-productions") ||
        pathname.startsWith("/resume") ||
        pathname.startsWith("/creative-statement")
    );
    setPublishOpen(
      pathname.startsWith("/articles") ||
        pathname.startsWith("/studio/tutorials") ||
        pathname.startsWith("/studio/directory") ||
        pathname.startsWith("/studio/apps")
    );
  }, [isOpen, pathname]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/46 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close mobile navigation"
      />

      <div className="fixed inset-x-0 top-0 z-50 h-[100dvh] overflow-y-auto border-b border-border/35 bg-background/94 backdrop-blur-2xl">
        <div className="container flex min-h-full flex-col py-5">
          <div className="flex items-start justify-between gap-6 border-b border-border/35 pb-5">
            <Link href="/" onClick={onClose} className="inline-flex min-w-0 flex-col leading-none">
              <span className="font-sans text-[1.42rem] font-black leading-[0.88] tracking-[-0.075em] text-foreground">
                BRANDON PT DAVIS
              </span>
              <span className="mt-1.5 font-sans text-[9px] font-semibold uppercase leading-none tracking-[0.34em] text-foreground/48">
                SCENIC DESIGN
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center gap-3 rounded-full px-1.5 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-foreground/72 transition-colors hover:text-foreground"
              aria-label="Close menu"
            >
              <span className="relative h-3.5 w-6" aria-hidden="true">
                <span className="absolute left-0 top-0 h-px w-6 translate-y-[6px] rotate-45 bg-current" />
                <span className="absolute bottom-0 left-0 h-px w-6 -translate-y-[7px] -rotate-45 bg-current" />
              </span>
              <span>Close</span>
            </button>
          </div>

          <div className="flex-1 pt-6">
            <div className="mb-7">
              <p className="font-sans text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.065em] text-foreground">
                Portfolio, profile, and published work.
              </p>
            </div>

            <Link
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onClose();
                onOpenSearch();
              }}
              className="mb-6 inline-flex h-12 items-center justify-center rounded-full border border-border/45 px-5 text-[1rem] font-medium tracking-[-0.02em] text-foreground/72 transition-colors hover:border-border hover:text-foreground"
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
                label="Profile"
                links={ABOUT_LINKS}
                onToggle={() => setAboutOpen((value) => !value)}
                onClose={onClose}
                pathname={pathname}
              />
              <MenuSection
                isOpen={publishOpen}
                label="Publish"
                links={PUBLISH_LINKS}
                onToggle={() => setPublishOpen((value) => !value)}
                onClose={onClose}
                pathname={pathname}
              />
            </nav>

            <div className="mt-9 border-t border-border/35 pt-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-sans text-[1rem] font-medium tracking-[-0.02em] text-foreground/48">
                  Recent Scenic Design
                </p>
                <Link
                  href="/projects"
                  onClick={onClose}
                  className="text-sm font-medium tracking-[-0.02em] text-foreground/58"
                >
                  Portfolio
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentScenicProjects.slice(0, 2).map((project) => (
                  <Link key={project.href} href={project.href} onClick={onClose} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[0.75rem] border border-border/35 bg-foreground/[0.035]">
                      <Image
                        src={project.imageUrl}
                        alt={project.imageAlt}
                        fill
                        quality={74}
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
