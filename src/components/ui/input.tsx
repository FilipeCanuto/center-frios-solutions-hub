import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[color:var(--steel)] bg-[color:var(--card)] px-3 py-2 text-sm text-foreground shadow-[var(--shadow-1)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:border-[color:var(--electric)] focus-visible:ring-2 focus-visible:ring-[color:var(--electric)]/40 focus-visible:ring-offset-0 focus-visible:shadow-[var(--shadow-glow-blue)]",
          "aria-[invalid=true]:border-[color:var(--destructive)] aria-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_25%,transparent)] aria-[invalid=true]:focus-visible:ring-[color:var(--destructive)]/40",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
