import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/data/site";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="CENTERFRIOS" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Equipamentos de alta performance para refrigeração comercial e
            gastronomia profissional. Acredite em quem entende do seu setor.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/produtos" className="hover:text-accent">Produtos</Link></li>
            <li><Link to="/segmentos" className="hover:text-accent">Segmentos</Link></li>
            <li><Link to="/solucoes" className="hover:text-accent">Soluções</Link></li>
            <li><Link to="/contato" className="hover:text-accent">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Contato
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-accent" />
              <a href={CONTACT.phoneHref} className="hover:text-foreground">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-accent" />
              <a href={CONTACT.emailHref} className="hover:text-foreground break-all">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 text-accent" />
              <a
                href={CONTACT.instagramHref}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
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

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Center Frios. Todos os direitos reservados.</p>
          <p>Refrigeração comercial e equipamentos para gastronomia profissional.</p>
        </div>
      </div>
    </footer>
  );
}
