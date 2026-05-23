import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", className = "" }: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-accent shadow-[var(--shadow-inner-edge)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
      )}
      <div
        className={`mt-5 h-px bg-gradient-to-r from-accent via-accent/35 to-transparent ${
          align === "center" ? "mx-auto w-24" : "w-20"
        }`}
      />
    </div>
  );
}
