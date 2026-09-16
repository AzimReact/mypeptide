import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-sm border border-line-strong bg-paper px-3.5 text-[14px] text-ink placeholder:text-graphite-light",
          "transition-colors focus:border-ink focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-danger",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
