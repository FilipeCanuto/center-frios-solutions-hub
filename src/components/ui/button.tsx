import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--gradient-blue-cta)] text-primary-foreground shadow-[var(--shadow-2)] hover:-translate-y-px hover:shadow-[var(--shadow-glow-blue)] active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-2)] hover:bg-destructive/90 hover:-translate-y-px",
        outline:
          "border border-[color:var(--steel)] bg-transparent text-foreground shadow-[var(--shadow-1)] hover:border-[color:var(--electric)] hover:text-foreground hover:shadow-[var(--shadow-glow-blue)]",
        secondary:
          "bg-[image:var(--gradient-steel)] text-foreground border border-[color:var(--steel)] shadow-[var(--shadow-1)] hover:border-[color:var(--electric)]/60 hover:shadow-[var(--shadow-2)]",
        ghost:
          "text-foreground hover:bg-[color:var(--graphite)]/60 hover:text-foreground",
        link: "text-[color:var(--electric)] underline-offset-4 hover:underline",
        conversion:
          "cta-high-gravity bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black uppercase tracking-widest rounded-xl border border-amber-400/20 shadow-[0_0_35px_rgba(245,158,11,0.55)] hover:scale-[1.03] hover:shadow-[0_0_55px_rgba(245,158,11,0.85)] transition-all duration-300 ease-out animate-pulse focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
