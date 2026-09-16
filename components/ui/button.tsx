import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-[13px] font-medium uppercase tracking-[0.08em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper hover:bg-ink-soft active:translate-y-px",
        accent:
          "bg-accent text-paper hover:bg-accent-dark active:translate-y-px",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper active:translate-y-px",
        ghost:
          "bg-transparent text-ink hover:bg-ink/5",
        link:
          "bg-transparent p-0 normal-case tracking-normal text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink",
        subtle:
          "bg-paper-dim text-ink hover:bg-line",
      },
      size: {
        sm: "h-9 px-4 text-[12px]",
        md: "h-11 px-6",
        lg: "h-14 px-9 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
