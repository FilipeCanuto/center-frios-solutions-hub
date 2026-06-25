import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/data/site";

type Props = {
  name: string;
  image: string;
  price: number;
  pixPrice?: number;
  additionalTotal?: number;
  onBuy: () => void;
};

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function StickyBuyBar({ name, image, price, pixPrice, additionalTotal = 0, onBuy }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cls = "sticky-buybar-active";
    if (show) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [show]);


  const displayPrice = (pixPrice ?? price) + additionalTotal;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-[color:var(--steel)] bg-brushed-metal p-2 shadow-[var(--shadow-4)] backdrop-blur-xl sm:gap-3 sm:p-3">
          {/* Thumb */}
          <div className="relative z-10 hidden size-12 shrink-0 overflow-hidden rounded-lg border border-[color:var(--steel)] bg-card md:block">
            <img src={image} alt="" className="h-full w-full object-contain p-1" />
          </div>

          {/* Title + price */}
          <div className="relative z-10 min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-sm">
              {name}
              {additionalTotal > 0 && (
                <span className="ml-1.5 hidden rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent sm:inline-block">
                  + acessórios
                </span>
              )}
            </p>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">
              {fmtBRL(displayPrice)}
              <span className="ml-1.5 hidden text-[11px] font-normal text-muted-foreground sm:inline">
                à vista no PIX
              </span>
            </p>
          </div>

          {/* Actions — perfectly center-aligned, consistent gaps */}
          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar no WhatsApp"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--color-brand-whatsapp)] px-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.03] sm:px-4"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M19.11 17.27c-.27-.13-1.59-.78-1.83-.87-.25-.09-.43-.13-.61.13-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.94 2.96 4.7 4.04.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.06-.11-.25-.18-.52-.31zM12.04 2C6.51 2 2 6.5 2 12.02c0 1.91.5 3.7 1.38 5.25L2 22l4.86-1.27a9.97 9.97 0 0 0 5.18 1.43h.01c5.52 0 10.03-4.49 10.03-10.02 0-2.68-1.05-5.2-2.95-7.1A10.04 10.04 0 0 0 12.04 2z" />
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <Button onClick={onBuy} size="lg" className="h-11 rounded-full px-4 sm:px-6">
              Comprar agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
