"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-line-strong",
        size === "sm" ? "h-9" : "h-11"
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-paper-dim disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-full w-9 items-center justify-center text-[13px] font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-paper-dim disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
