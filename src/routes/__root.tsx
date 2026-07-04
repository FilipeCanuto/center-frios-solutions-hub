import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ComingSoon } from "@/components/site/ComingSoon";
import { isPublicPath, PREVIEW_KEY, PREVIEW_STORAGE_KEY } from "@/lib/visibility";

import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente recarregar ou volte para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Center Frios — Equipamentos para Gastronomia" },
      {
        name: "description",
        content:
          "Refrigeração comercial e equipamentos robustos para supermercados, restaurantes, redes, cozinhas industriais e hotéis.",
      },
      { name: "author", content: "Center Frios" },
      { property: "og:site_name", content: "Center Frios" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Center Frios — Equipamentos de Alta Performance para Gastronomia",
      },
      {
        property: "og:description",
        content:
          "Equipamentos profissionais de refrigeração e gastronomia. Acredite em quem entende do seu setor.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Center Frios — Equipamentos de Alta Performance para Gastronomia",
      },
      {
        name: "twitter:description",
        content:
          "Equipamentos profissionais de refrigeração e gastronomia. Acredite em quem entende do seu setor.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b748c9-57a5-41fb-8ac8-94a0085b3e3a/id-preview-932e4feb--f21498b6-eb3f-40e4-80e5-7f31d6c98171.lovable.app-1778680713714.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b748c9-57a5-41fb-8ac8-94a0085b3e3a/id-preview-932e4feb--f21498b6-eb3f-40e4-80e5-7f31d6c98171.lovable.app-1778680713714.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children:
          "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T2X7QSL2');",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Center Frios",
          url: "https://ofertas.centerfrios.com",
          description:
            "Refrigeração comercial e equipamentos de alta performance para gastronomia profissional.",
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T2X7QSL2"
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <VisibilityGate>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <WhatsAppButton />
      </VisibilityGate>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

/**
 * Mostra <ComingSoon /> para visitantes externos em rotas fora da allowlist.
 * Admins liberam o site inteiro acessando qualquer URL com ?preview=<PREVIEW_KEY>;
 * isso grava uma flag no localStorage. Para sair do modo preview: ?preview=off.
 */
function VisibilityGate({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [previewUnlocked, setPreviewUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const preview = params.get("preview");
      if (preview === PREVIEW_KEY) {
        localStorage.setItem(PREVIEW_STORAGE_KEY, "1");
      } else if (preview === "off") {
        localStorage.removeItem(PREVIEW_STORAGE_KEY);
      }
      setPreviewUnlocked(localStorage.getItem(PREVIEW_STORAGE_KEY) === "1");
    } catch {
      // localStorage indisponível (SSR/Cookies bloqueados) — segue como visitante.
    }
    setHydrated(true);
  }, []);

  const allowed = isPublicPath(pathname);

  // Antes da hidratação, renderiza o conteúdo real para a rota pública (PA7/HS-98)
  // ou a ComingSoon nas demais — evita flash e mantém SSR coerente.
  if (!hydrated) {
    return allowed ? <>{children}</> : <ComingSoon />;
  }

  if (allowed || previewUnlocked) {
    return <>{children}</>;
  }

  return <ComingSoon />;
}
