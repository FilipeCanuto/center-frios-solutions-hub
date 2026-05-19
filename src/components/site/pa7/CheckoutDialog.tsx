import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Landmark,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PA7_BANK } from "@/data/pa7";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: { name: string; image: string; price: number };
};

const StepOne = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().min(8, "Telefone inválido"),
  company: z.string().trim().optional(),
  cnpj: z.string().trim().optional(),
});

const StepTwo = z.object({
  cep: z.string().trim().min(8, "CEP inválido"),
  street: z.string().trim().min(2, "Endereço obrigatório"),
  number: z.string().trim().min(1, "Número obrigatório"),
  complement: z.string().trim().optional(),
  district: z.string().trim().min(2, "Bairro obrigatório"),
  city: z.string().trim().min(2, "Cidade obrigatória"),
  state: z.string().trim().min(2, "UF obrigatória").max(2),
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CheckoutDialog({ open, onOpenChange, product }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identity, setIdentity] = useState<z.infer<typeof StepOne> | null>(null);
  const [address, setAddress] = useState<z.infer<typeof StepTwo> | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shipping] = useState(89.9);

  const subtotal = product.price;
  const discountPix = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = subtotal + shipping;
  const totalPix = subtotal - discountPix + shipping;

  function reset() {
    setStep(1);
    setIdentity(null);
    setAddress(null);
  }

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) setTimeout(reset, 300);
  }

  function handleStepOne(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = StepOne.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }
    setIdentity(parsed.data);
    setStep(2);
  }

  async function lookupCep(cep: string, form: HTMLFormElement) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) return;
      (form.elements.namedItem("street") as HTMLInputElement).value = data.logradouro || "";
      (form.elements.namedItem("district") as HTMLInputElement).value = data.bairro || "";
      (form.elements.namedItem("city") as HTMLInputElement).value = data.localidade || "";
      (form.elements.namedItem("state") as HTMLInputElement).value = data.uf || "";
    } catch {
      // silencioso
    } finally {
      setCepLoading(false);
    }
  }

  function handleStepTwo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = StepTwo.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }
    setAddress(parsed.data);
    setStep(3);
  }

  async function fakePay() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setStep(4);
    toast.success("Pedido registrado para confirmação!");
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden border-white/10 bg-background p-0 sm:max-w-5xl">
        <DialogTitle className="sr-only">Checkout — {product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Finalize sua compra do {product.name}.
        </DialogDescription>

        <div className="grid max-h-[92vh] overflow-hidden md:grid-cols-[1fr_360px]">
          {/* MAIN */}
          <div className="flex flex-col overflow-y-auto">
            {/* Stepper */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-background/90 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs">
                {[
                  { n: 1, label: "Identificação" },
                  { n: 2, label: "Entrega" },
                  { n: 3, label: "Pagamento" },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full border text-[11px] font-semibold ${
                        step > s.n
                          ? "border-accent bg-accent text-accent-foreground"
                          : step === s.n
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-white/15 text-muted-foreground"
                      }`}
                    >
                      {step > s.n ? <Check className="size-3.5" /> : s.n}
                    </span>
                    <span
                      className={
                        step === s.n ? "font-medium text-foreground" : "text-muted-foreground"
                      }
                    >
                      {s.label}
                    </span>
                    {i < 2 && <span className="mx-2 h-px w-6 bg-white/10 md:w-10" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              {step === 1 && (
                <form onSubmit={handleStepOne} className="grid gap-4">
                  <h2 className="text-xl font-semibold text-foreground">Seus dados</h2>
                  <p className="text-sm text-muted-foreground">
                    Atendimento exclusivo B2B com emissão de nota fiscal.
                  </p>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input id="name" name="name" required defaultValue={identity?.name} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        defaultValue={identity?.email}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        defaultValue={identity?.phone}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" name="company" defaultValue={identity?.company} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        placeholder="00.000.000/0000-00"
                        defaultValue={identity?.cnpj}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-2 rounded-full" size="lg">
                    Continuar para entrega
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form
                  onSubmit={handleStepTwo}
                  onChangeCapture={(e) => {
                    const t = e.target as unknown as HTMLInputElement;
                    if (t?.name === "cep" && t.value.replace(/\D/g, "").length === 8) {
                      lookupCep(t.value, e.currentTarget);
                    }
                  }}
                  className="grid gap-4"
                >
                  <h2 className="text-xl font-semibold text-foreground">Endereço de entrega</h2>
                  <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                    <div className="grid gap-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          name="cep"
                          required
                          maxLength={9}
                          defaultValue={address?.cep}
                        />
                        {cepLoading && (
                          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="street">Rua / Avenida *</Label>
                      <Input id="street" name="street" required defaultValue={address?.street} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="number">Número *</Label>
                      <Input id="number" name="number" required defaultValue={address?.number} />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" name="complement" defaultValue={address?.complement} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="district">Bairro *</Label>
                      <Input
                        id="district"
                        name="district"
                        required
                        defaultValue={address?.district}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input id="city" name="city" required defaultValue={address?.city} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">UF *</Label>
                      <Input
                        id="state"
                        name="state"
                        required
                        maxLength={2}
                        defaultValue={address?.state}
                      />
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="size-5 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Transportadora parceira
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Entrega em todo Brasil · 5 a 10 dias úteis
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatBRL(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="rounded-full"
                    >
                      <ArrowLeft className="mr-2 size-4" /> Voltar
                    </Button>
                    <Button type="submit" size="lg" className="rounded-full">
                      Continuar para pagamento
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="grid gap-5">
                  <h2 className="text-xl font-semibold text-foreground">Forma de pagamento</h2>

                  <Tabs defaultValue="pix" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="pix">
                        <QrCode className="mr-1.5 size-4" />
                        PIX
                      </TabsTrigger>
                      <TabsTrigger value="boleto">
                        <Wallet className="mr-1.5 size-4" />
                        Boleto
                      </TabsTrigger>
                      <TabsTrigger value="ted">
                        <Landmark className="mr-1.5 size-4" />
                        TED
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pix" className="mt-5">
                      <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[180px_1fr]">
                        <div className="grid place-items-center rounded-xl bg-white p-3">
                          <QrPlaceholder />
                        </div>
                        <div className="grid gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                              5% de desconto à vista
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-foreground">
                              {formatBRL(totalPix)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Aprovação em segundos · pedido liberado para faturamento.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/60 p-2">
                            <code className="flex-1 truncate text-xs text-muted-foreground">
                              {PA7_BANK.pixKey}
                            </code>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard?.writeText(PA7_BANK.pixKey);
                                toast.success("Chave PIX copiada");
                              }}
                            >
                              Copiar
                            </Button>
                          </div>
                        </div>
                      </div>
                      <PayCta
                        onClick={fakePay}
                        loading={submitting}
                        label="Confirmar pedido com PIX"
                      />
                    </TabsContent>

                    <TabsContent value="boleto" className="mt-5">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-sm text-muted-foreground">
                          O boleto será enviado por e-mail em até 1 dia útil. Vencimento em 3 dias.
                        </p>
                        <div className="mt-3 rounded-lg border border-dashed border-white/15 bg-background/60 p-3 text-center font-mono text-xs text-muted-foreground">
                          34191.79001 01043.510047 91020.150008 4 99850000{" "}
                          {String(Math.round(total * 100)).padStart(8, "0")}
                        </div>
                      </div>
                      <PayCta onClick={fakePay} loading={submitting} label="Gerar boleto" />
                    </TabsContent>

                    <TabsContent value="ted" className="mt-5">
                      <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm">
                        <p className="text-muted-foreground">
                          Realize a transferência para os dados abaixo e envie o comprovante.
                        </p>
                        <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-foreground">
                          <dt className="text-muted-foreground">Banco</dt>
                          <dd>{PA7_BANK.bank}</dd>
                          <dt className="text-muted-foreground">Agência</dt>
                          <dd>{PA7_BANK.agency}</dd>
                          <dt className="text-muted-foreground">Conta</dt>
                          <dd>{PA7_BANK.account}</dd>
                          <dt className="text-muted-foreground">Titular</dt>
                          <dd>{PA7_BANK.holder}</dd>
                          <dt className="text-muted-foreground">CNPJ</dt>
                          <dd>{PA7_BANK.cnpj}</dd>
                        </dl>
                      </div>
                      <PayCta
                        onClick={fakePay}
                        loading={submitting}
                        label="Confirmar pedido por TED"
                      />
                    </TabsContent>

                  </Tabs>

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="rounded-full"
                    >
                      <ArrowLeft className="mr-2 size-4" /> Voltar
                    </Button>
                    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Lock className="size-3.5" /> Conexão segura SSL · Dados protegidos LGPD
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid place-items-center gap-4 py-10 text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="size-9" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Pedido recebido!</h2>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Estamos finalizando a integração com nossa plataforma de pagamento. Um consultor
                    da Center Frios entrará em contato pelo WhatsApp{" "}
                    <strong className="text-foreground">{identity?.phone}</strong> para confirmar e
                    liberar o pedido.
                  </p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Button asChild className="rounded-full" size="lg">
                      <a href="https://wa.me/558232232497" target="_blank" rel="noreferrer">
                        Falar pelo WhatsApp
                      </a>
                    </Button>
                    <Button
                      onClick={() => handleClose(false)}
                      variant="outline"
                      className="rounded-full"
                      size="lg"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="hidden flex-col border-l border-white/10 bg-white/[0.02] md:flex">
            <div className="flex h-full flex-col gap-5 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Resumo do pedido
              </p>
              <div className="flex gap-3">
                <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <img src={product.image} alt="" className="h-full w-full object-contain p-1.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Qtd. 1 · Garantia 12 meses</p>
                </div>
              </div>

              <dl className="grid gap-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground">{formatBRL(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Frete</dt>
                  <dd className="text-foreground">{formatBRL(shipping)}</dd>
                </div>
                <div className="flex justify-between text-accent">
                  <dt>Desconto PIX (5%)</dt>
                  <dd>− {formatBRL(discountPix)}</dd>
                </div>
              </dl>

              <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Total no PIX
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{formatBRL(totalPix)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ou {formatBRL(total)} em até 12x sem juros no cartão.
                </p>
              </div>

              <div className="mt-auto grid gap-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-accent" /> Compra protegida
                </p>
                <p className="flex items-center gap-2">
                  <Lock className="size-4 text-accent" /> Conexão SSL 256 bits
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="size-4 text-accent" /> Entrega em todo Brasil
                </p>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayCta({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <Button onClick={onClick} disabled={loading} size="lg" className="mt-5 w-full rounded-full">
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" /> Processando…
        </>
      ) : (
        label
      )}
    </Button>
  );
}



function QrPlaceholder() {
  // SVG decorativo — não é um QR real
  return (
    <svg viewBox="0 0 21 21" className="h-40 w-40">
      {Array.from({ length: 21 * 21 }).map((_, i) => {
        const x = i % 21;
        const y = Math.floor(i / 21);
        const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        const seed = (x * 31 + y * 17) % 7;
        const fill = corner
          ? x === 0 ||
            x === 6 ||
            x === 14 ||
            x === 20 ||
            y === 0 ||
            y === 6 ||
            y === 14 ||
            y === 20 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
            (x >= 16 && x <= 18 && y >= 2 && y <= 4) ||
            (x >= 2 && x <= 4 && y >= 16 && y <= 18)
          : seed < 3;
        return fill ? (
          <rect key={i} x={x} y={y} width={1} height={1} fill="var(--color-foreground)" />
        ) : null;
      })}
    </svg>
  );
}
