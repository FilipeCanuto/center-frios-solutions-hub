import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "status-dot inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--electric)]/40 bg-[color:var(--electric)]/12 text-[color:var(--electric-glow)]",
        secondary:
          "border-[color:var(--steel)] bg-[color:var(--graphite)]/60 text-foreground",
        success:
          "border-[color:oklch(0.7_0.17_152)]/40 bg-[oklch(0.7_0.17_152)]/12 text-[oklch(0.78_0.17_152)]",
        warning:
          "border-[color:oklch(0.78_0.17_75)]/40 bg-[oklch(0.78_0.17_75)]/12 text-[oklch(0.84_0.17_75)]",
        destructive:
          "border-destructive/40 bg-destructive/12 text-[oklch(0.72_0.22_27)]",
        info:
          "border-[color:var(--electric)]/40 bg-[color:var(--electric)]/12 text-[color:var(--electric-glow)]",
        neutral:
          "border-[color:var(--steel)] bg-transparent text-muted-foreground",
        outline: "border-[color:var(--steel)] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
