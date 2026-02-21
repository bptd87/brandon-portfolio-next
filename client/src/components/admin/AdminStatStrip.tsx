import { cn } from "@/lib/utils";
import { getAdminAccentColor, type AdminAccentKey } from "./adminTheme";

type StatItem = {
  label: string;
  value: number | string;
  accent?: AdminAccentKey;
};

interface AdminStatStripProps {
  items: StatItem[];
  className?: string;
}

export function AdminStatStrip({ items, className }: AdminStatStripProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => {
        const accent = getAdminAccentColor(item.accent || "neutral");
        return (
          <div key={item.label} className="rounded-lg border border-border/70 bg-background/50 px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.label}</div>
            <div className="mt-1 text-xl font-semibold" style={{ color: accent }}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

