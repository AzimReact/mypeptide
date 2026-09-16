import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResearchUseNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 border border-line-strong bg-paper-dim/60 p-4 text-graphite",
        compact ? "text-[12px]" : "text-[13px]",
        className
      )}
    >
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <p className="leading-relaxed">
        <span className="font-semibold text-ink">
          For laboratory and research use only.
        </span>{" "}
        Not for human or veterinary use, diagnostic use, or in vitro
        diagnostic use. Not a drug, food, or cosmetic. Products are sold only
        to qualified researchers and institutions.
      </p>
    </div>
  );
}
