"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";

type AboutNavProps = {
  tone?: "light" | "dark";
};

export default function AboutNav({ tone = "light" }: AboutNavProps) {
  const pathname = usePathname() || "/";
  const isDark = tone === "dark";

  const navItems = [
    { path: "/about", label: "Profile" },
    { path: "/upcoming-productions", label: "Upcoming", matchPrefix: true },
    { path: "/resume", label: "Resume" },
    { path: "/creative-statement", label: "Creative" },
    { path: "/about/teaching", label: "Teaching", aliases: ["/teaching-philosophy", "/about/philosophy"] },
    { path: "/about/collaborators", label: "Collaborators" },
  ];

  const linkClass = (isActive: boolean) =>
    `text-[0.95rem] tracking-[-0.025em] transition-colors ${
      isDark
        ? isActive
          ? "text-white"
          : "text-white/48 hover:text-white"
        : isActive
          ? "text-[#111111]"
          : "text-[#777169] hover:text-[#111111]"
    }`;

  return (
    <nav
      aria-label="Profile section navigation"
      className={`sticky top-[72px] z-30 border-b backdrop-blur-xl ${
        isDark ? "border-white/12 bg-black/88" : "border-black/[0.06] bg-[#f7f6f2]/90"
      }`}
    >
      <div className="flex min-h-16 flex-col gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <Link
          href="/about"
          className={`text-[1.35rem] font-semibold leading-none tracking-[-0.045em] ${
            isDark ? "text-white" : "text-[#111111]"
          }`}
        >
          Profile
        </Link>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-6 md:gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path ||
                item.aliases?.includes(pathname) ||
                (item.matchPrefix && pathname.startsWith(`${item.path}/`));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={linkClass(Boolean(isActive))}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
