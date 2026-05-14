import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { QuoteDialog } from "./QuoteDialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/produtos", label: "Produtos" },
  { to: "/segmentos", label: "Segmentos" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="CENTERFRIOS"
            className="h-10 w-auto object-contain"
            style={{
              filter:
                "drop-shadow(0 0 1px color-mix(in oklab, var(--foreground) 55%, transparent)) drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 30%, transparent))",
            }}
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
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
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <QuoteDialog
                source="header-mobile"
                trigger={
                  <Button className="w-full rounded-full">Solicite Orçamento</Button>
                }
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
