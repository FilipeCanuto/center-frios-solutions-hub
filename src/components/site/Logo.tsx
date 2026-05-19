import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, string> = {
  sm: "h-7",
  md: "h-10",
  lg: "h-14",
  xl: "h-20",
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
  /** Desativa o contorno/glow se precisar de versão limpa */
  plain?: boolean;
  alt?: string;
}

/**
 * Logomarca oficial da CENTERFRIOS.
 * Mantém o contorno premium (drop-shadow azul + glow ouro) consistente
 * em qualquer aplicação. Use a prop `size` para escalar.
 */
export function Logo({ size = "md", className, plain = false, alt = "CENTERFRIOS" }: LogoProps) {
  return (
    <img
      src={logo}
      alt={alt}
      className={cn(SIZES[size], "w-auto object-contain select-none", className)}
      draggable={false}
      style={
        plain
          ? undefined
          : {
              filter:
                "drop-shadow(0 0 1px color-mix(in oklab, var(--foreground) 55%, transparent)) drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 30%, transparent))",
            }
      }
    />
  );
}
