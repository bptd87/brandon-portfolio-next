import Link from "next/link";

import { AdminSignOutButton } from "./AdminSignOutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Workbench" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/uploads", label: "Uploads" },
  { href: "/admin/snippets", label: "Snippets" },
] as const;

export function AdminShell({
  currentPath,
  eyebrow = "Admin",
  title,
  description,
  children,
}: {
  currentPath: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-[88rem] py-12">
        <section className="border-b border-border/20 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-sans text-[clamp(2.4rem,4vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.06em] text-foreground">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-3xl text-[1rem] leading-7 text-foreground/62">{description}</p>
              ) : null}
            </div>
            <AdminSignOutButton />
          </div>

          <nav className="mt-6 flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => {
              const active = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${
                    active
                      ? "border-foreground/25 bg-foreground text-background"
                      : "border-border/35 text-foreground/72 hover:bg-foreground/[0.04] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="mt-8">{children}</section>
      </div>
    </main>
  );
}
