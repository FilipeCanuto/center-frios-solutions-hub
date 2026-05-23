import type { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<HTMLAttributes<HTMLElement>> & {
  as?: ElementType;
  interactive?: boolean;
};

export function PremiumCard({ as: Component = "div", children, className, interactive = true, ...props }: Props) {
  return (
    <Component
      className={cn(
        "metal-surface rounded-2xl border border-white/10 p-6",
        interactive && "metal-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
