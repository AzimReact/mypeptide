import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-line-strong bg-paper-dim text-graphite",
        ink: "border-ink bg-ink text-paper",
        accent: "border-accent/30 bg-accent-soft text-accent-dark",
        success: "border-success/25 bg-success-soft text-success",
        warn: "border-warn/25 bg-warn-soft text-warn",
        danger: "border-danger/25 bg-danger-soft text-danger",
        outline: "border-ink/20 bg-transparent text-ink",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
