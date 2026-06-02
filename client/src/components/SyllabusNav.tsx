"use client";

import { usePathname } from "next/navigation";
import { Link } from "wouter";

const navItems = [
  { path: "/syllabus/experiential-design", label: "Experiential Design" },
  { path: "/syllabus/3d-modeling", label: "3D Modeling" },
];

export default function SyllabusNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="Syllabus navigation"
      className="sticky top-[72px] z-30 border-b border-black/[0.06] bg-[#f1f0ec]/92 backdrop-blur-xl"
    >
      <div className="flex min-h-16 flex-col gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <Link
          href="/about/teaching"
          className="text-[1.35rem] font-semibold leading-none tracking-[-0.045em] text-[#111111]"
        >
          Teaching
        </Link>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-6 md:gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[0.95rem] tracking-[-0.025em] transition-colors ${
                    isActive ? "text-[#111111]" : "text-[#777169] hover:text-[#111111]"
                  }`}
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
