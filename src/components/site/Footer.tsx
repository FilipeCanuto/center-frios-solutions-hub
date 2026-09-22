import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, SALES_WHATSAPP, STORE_WHATSAPP } from "@/data/site";
import { HS98_LINK, PA7_LINK } from "@/lib/visibility";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--steel)] bg-brushed-metal relative">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link {...PA7_LINK} className="flex items-center" aria-label="Center Frios">
            <Logo size="md" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Equipamentos de alta performance para refrigeração comercial e gastronomia profissional.
            Acredite em quem entende do seu setor.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link {...PA7_LINK} className="transition-colors hover:text-accent">
                Processador PA7 Pro
              </Link>
            </li>
            <li>
              <Link {...HS98_LINK} className="transition-colors hover:text-accent">
                Homogeneizadores HS-22 e HS-98
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Contato
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-accent" />
              <a
                href={`https://wa.me/${SALES_WHATSAPP.number}`}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Vendas ({SALES_WHATSAPP.name}): {SALES_WHATSAPP.display}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-accent" />
              <a href={CONTACT.phoneHref} className="transition-colors hover:text-foreground">
                Loja / dúvidas: {STORE_WHATSAPP.display}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-accent" />
              <a href={CONTACT.emailHref} className="break-all transition-colors hover:text-foreground">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 text-accent" />
              <a
                href={CONTACT.instagramHref}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {CONTACT.instagram}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              <span>{CONTACT.city}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-[color:var(--steel)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Center Frios. Todos os direitos reservados.</p>
          <p>Refrigeração comercial e equipamentos para gastronomia profissional.</p>
        </div>
      </div>
    </footer>
  );
}
