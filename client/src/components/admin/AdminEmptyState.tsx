import { Button } from "@/components/ui/button";
import { getAdminAccentColor, type AdminAccentKey } from "./adminTheme";

interface AdminEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  accent?: AdminAccentKey;
}

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  accent = "neutral"
}: AdminEmptyStateProps) {
  const accentColor = getAdminAccentColor(accent);
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-background/40 px-5 py-10 text-center">
      <h3 className="text-base font-semibold" style={{ color: accentColor }}>{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4 text-white" onClick={onAction} style={{ backgroundColor: accentColor }}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

