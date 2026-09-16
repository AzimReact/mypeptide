import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "warn" | "danger";
}) {
  return (
    <div className="border border-line-strong bg-paper p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
          {label}
        </p>
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "warn" && "text-warn",
            tone === "danger" && "text-danger",
            tone === "default" && "text-accent"
          )}
          strokeWidth={1.75}
        />
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight text-ink">{value}</p>
    </div>
  );
}
