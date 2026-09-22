import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { QuoteDialog } from "./QuoteDialog";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { HS98_LINK, PA7_LINK } from "@/lib/visibility";

// Enquanto o site institucional está fechado, a navegação aponta só para as
// páginas publicadas — nenhum link leva à tela "Em construção".
const NAV = [
  { link: PA7_LINK, label: "Processador PA7 Pro" },
  { link: HS98_LINK, label: "Homogeneizadores" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--steel)] bg-brushed-metal backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link {...PA7_LINK} className="flex items-center" aria-label="Center Frios">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              {...item.link}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.04] hover:text-foreground"
              activeProps={{ className: "bg-accent/10 text-foreground shadow-[var(--shadow-inner-edge)]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <QuoteDialog
            source="header"
            trigger={
              <Button size="sm" className="rounded-full">
                Solicite Orçamento
              </Button>
            }
          />
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[color:var(--steel)] bg-brushed-metal md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                {...item.link}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <QuoteDialog
                source="header-mobile"
                trigger={<Button className="w-full rounded-full">Solicite Orçamento</Button>}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
