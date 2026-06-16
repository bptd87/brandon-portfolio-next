"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSTAGRAM_PORTFOLIO_URL =
  "https://www.instagram.com/brandonptdavisdesign/";

const MENU_LINKS = [
  { label: "Scenic Design", href: "/projects" },
  { label: "Rendering", href: "/projects/rendering" },
  { label: "Experiential", href: "/projects/experiential" },
  { label: "Profile", href: "/about" },
  { label: "Statement", href: "/creative-statement" },
  { label: "Resume", href: "/resume" },
  { label: "Upcoming", href: "/upcoming-productions" },
  { label: "Apps", href: "/studio/apps" },
  {
    label: "Instagram",
    href: INSTAGRAM_PORTFOLIO_URL,
    external: true,
  },
  { label: "Contact", href: "/contact" },
] as const;

type MenuLinkItem = (typeof MENU_LINKS)[number];

function MenuLink({
  item,
  onClose,
  pathname,
}: {
  item: MenuLinkItem;
  onClose: () => void;
  pathname: string;
}) {
  const active =
    !("external" in item) &&
    (pathname === item.href || pathname.startsWith(`${item.href}/`));

  if ("external" in item) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="block py-[0.34rem] font-sans leading-[1.12] tracking-[-0.055em] text-white/82 transition-colors hover:text-white"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className={`block py-[0.34rem] font-sans leading-[1.12] tracking-[-0.055em] transition-colors ${
        active ? "text-white" : "text-white/82 hover:text-white"
      }`}
    >
      {item.label}
    </Link>
  );
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscrollBehavior;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 h-[100dvh] overflow-y-auto overscroll-contain bg-[#151515] text-white">
        <button
          type="button"
          onClick={onClose}
          className="fixed right-5 top-[max(1.15rem,env(safe-area-inset-top))] z-10 inline-flex h-11 w-11 items-center justify-center text-white/64 transition-colors hover:text-white"
          aria-label="Close menu"
        >
          <span className="relative h-5 w-5" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
          </span>
        </button>

        <div className="min-h-full px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(4.8rem,calc(env(safe-area-inset-top)+4.8rem))]">
          <nav aria-label="Mobile navigation">
            <div className="text-[clamp(2.45rem,11.8vw,3.3rem)] font-semibold">
              {MENU_LINKS.map(item => (
                <MenuLink
                  key={item.href}
                  item={item}
                  onClose={onClose}
                  pathname={pathname}
                />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
