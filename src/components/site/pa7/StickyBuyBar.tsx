import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  image: string;
  price: number;
  onBuy: () => void;
};

export function StickyBuyBar({ name, image, price, onBuy }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 pb-3">
        <div className="flex items-center gap-3 rounded-xl border border-[color:var(--steel)] bg-brushed-metal p-2 pr-3 shadow-[var(--shadow-4)] backdrop-blur-xl md:gap-4 md:p-3 md:pr-4">
          <div className="hidden size-12 shrink-0 overflow-hidden rounded-xl bg-white/5 md:block">
            <img src={image} alt="" className="h-full w-full object-contain p-1" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted-foreground md:text-sm">{name}</p>
            <p className="text-sm font-semibold text-foreground md:text-base">
              R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                à vista no PIX
              </span>
            </p>
          </div>
          <Button onClick={onBuy} size="lg" className="rounded-full">
            Comprar agora
          </Button>
        </div>
      </div>
    </div>
  );
}
