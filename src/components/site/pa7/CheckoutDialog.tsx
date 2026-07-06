import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
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
import { processPayment } from "@/lib/payments.functions";
import { humanizeRedeError } from "@/lib/payments/error-messages";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: { slug: string; name: string; image: string; price: number };
  onSuccess?: () => void;
};

const StepOne = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().min(8, "Telefone inválido"),
  company: z.string().trim().optional(),
  cnpj: z.string().trim().optional(),
  cpf: z.string().trim().optional(),
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
  const [cepDraft, setCepDraft] = useState("");
  const effectiveCep = (address?.cep ?? cepDraft).replace(/\D/g, "");
  const isFreeShippingAL = effectiveCep.startsWith("57");
  const shipping = isFreeShippingAL ? 0 : 89.9;
  const shippingLabel = isFreeShippingAL ? "Grátis (Benefício Alagoas)" : formatBRL(shipping);

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");

  // PIX State
  const [pixResult, setPixResult] = useState<{
    qrCode: string;
    copiaCola: string;
    orderId: string;
  } | null>(null);

  // Credit Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // MM/AA
  const [securityCode, setSecurityCode] = useState("");
  const [installments, setInstallments] = useState(1);

  // Polling to verify PIX payment confirmation in real-time
  useEffect(() => {
    if (!pixResult) return;

    const interval = setInterval(async () => {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("status")
          .eq("id", pixResult.orderId)
          .single();

        if (order && order.status === "paid") {
          clearInterval(interval);
          setStep(4);
          toast.success("Pagamento PIX confirmado com sucesso!");
        } else if (order && order.status === "failed") {
          clearInterval(interval);
          toast.error("O pagamento falhou ou foi recusado pela operadora.");
        }
      } catch (err) {
        console.error("Erro ao verificar status do PIX:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pixResult]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiryDate(value.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setSecurityCode(value.substring(0, 4));
  };

  const subtotal = product.price;
  const discountPix = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = subtotal + shipping;
  const totalPix = subtotal - discountPix + shipping;

  function reset() {
    setStep(1);
    setIdentity(null);
    setAddress(null);
    setPixResult(null);
    setCardNumber("");
    setCardholderName("");
    setExpiryDate("");
    setSecurityCode("");
    setInstallments(1);
    setPaymentMethod("pix");
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

  async function handlePayment(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!identity || !address) {
      toast.error("Por favor, preencha seus dados de identificação e endereço primeiro.");
      setStep(1);
      return;
    }

    setSubmitting(true);

    try {
      if (paymentMethod === "pix") {
        const result = await processPayment({
          data: {
            customer_name: identity.name,
            customer_email: identity.email,
            customer_phone: identity.phone,
            customer_company: identity.company,
            customer_cnpj: identity.cnpj,
            shipping_address: {
              cep: address.cep,
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
            },
            product_slug: product.slug,
            payment_method: "pix",
          },
        });

        if (result && result.success && result.pix && result.pix.qrCode && result.pix.copiaCola) {
          setPixResult({
            qrCode: result.pix.qrCode,
            copiaCola: result.pix.copiaCola,
            orderId: result.orderId,
          });
          toast.success("QR Code do PIX gerado com sucesso!");
        } else {
          throw new Error("Erro ao gerar o PIX.");
        }
      } else {
        // Credit Card validation
        const cleanCard = cardNumber.replace(/\s+/g, "");
        if (cleanCard.length < 15 || cleanCard.length > 16) {
          toast.error("Número do cartão inválido.");
          setSubmitting(false);
          return;
        }

        if (!cardholderName.trim()) {
          toast.error("Nome do titular do cartão obrigatório.");
          setSubmitting(false);
          return;
        }

        const [month, year] = expiryDate.split("/");
        if (!month || !year || month.length !== 2 || year.length !== 2) {
          toast.error("Validade inválida. Use o formato MM/AA.");
          setSubmitting(false);
          return;
        }

        const m = parseInt(month, 10);
        if (m < 1 || m > 12) {
          toast.error("Mês de validade inválido.");
          setSubmitting(false);
          return;
        }

        if (securityCode.length < 3) {
          toast.error("Código de segurança (CVV) inválido.");
          setSubmitting(false);
          return;
        }

        const fullYear = `20${year}`;

        if (!identity.cpf || identity.cpf.replace(/\D/g, "").length !== 11) {
          toast.error("Informe um CPF válido (obrigatório para autenticação 3DS).");
          setSubmitting(false);
          return;
        }

        const result = await processPayment({
          data: {
            customer_name: identity.name,
            customer_email: identity.email,
            customer_phone: identity.phone,
            customer_company: identity.company,
            customer_cnpj: identity.cnpj,
            customer_cpf: identity.cpf,
            shipping_address: {
              cep: address.cep,
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
            },
            product_slug: product.slug,
            payment_method: "credit_card",
            card_data: {
              cardNumber: cleanCard,
              cardholderName: cardholderName.toUpperCase(),
              expirationMonth: month,
              expirationYear: fullYear,
              securityCode: securityCode,
              installments: installments,
            },
            three_ds: {
              userAgent: navigator.userAgent,
              acceptHeader: "application/json",
              device: {
                colorDepth: window.screen.colorDepth || 24,
                deviceType: "BROWSER",
                javaEnabled:
                  typeof navigator.javaEnabled === "function" ? navigator.javaEnabled() : false,
                language: navigator.language || "pt-BR",
                screenHeight: window.screen.height,
                screenWidth: window.screen.width,
                timeZoneOffset: new Date().getTimezoneOffset(),
              },
            },
          },
        });

        if (result && result.success) {
          toast.success("Pagamento autorizado com sucesso!");
          setStep(4);
        } else {
          throw new Error("O pagamento foi recusado ou falhou.");
        }
      }
    } catch (err: unknown) {
      console.error("Erro no pagamento:", err);
      const raw = err instanceof Error ? err.message : String(err ?? "");
      const humanized = humanizeRedeError({ raw });

      // PCI hygiene: limpar PAN/CVV após qualquer falha no fluxo de cartão.
      if (paymentMethod === "credit_card") {
        setCardNumber("");
        setSecurityCode("");
      }

      if (humanized.category === "use_pix" && paymentMethod === "credit_card") {
        toast.error(humanized.message, {
          description: humanized.title,
          action: {
            label: "Pagar com PIX",
            onClick: () => {
              setPaymentMethod("pix");
              setTimeout(() => handlePayment(), 50);
            },
          },
        });
      } else {
        toast.error(humanized.message, { description: humanized.title });
      }
    } finally {
      setSubmitting(false);
    }
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
                    Compra direta B2B com emissão de nota fiscal e pagamento seguro.
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
                  <div className="grid gap-2">
                      <Label htmlFor="cpf">CPF do pagador</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      defaultValue={identity?.cpf}
                    />
                    <p className="text-xs text-muted-foreground">
                      Usado na autenticação do cartão e na conciliação do pedido.
                    </p>
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
                    if (t?.name === "cep") {
                      setCepDraft(t.value);
                      if (t.value.replace(/\D/g, "").length === 8) {
                        lookupCep(t.value, e.currentTarget);
                      }
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
                          Despacho para todo o Brasil · prazo validado pela rota do município
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${isFreeShippingAL ? "text-emerald-400" : "text-foreground"}`}
                      >
                        {shippingLabel}
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
                <div className="grid gap-6">
                  <h2 className="text-xl font-semibold text-foreground">Forma de pagamento</h2>

                  <Tabs
                    defaultValue="pix"
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as "pix" | "credit_card")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pix">
                        <QrCode className="mr-1.5 size-4" />
                        PIX (5% Desconto)
                      </TabsTrigger>
                      <TabsTrigger value="credit_card">
                        <CreditCard className="mr-1.5 size-4" />
                        Cartão de Crédito
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pix" className="mt-5">
                      {!pixResult ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-white/5 rounded-full border border-white/10">
                              <QrCode className="size-10 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                Pagamento Instantâneo PIX
                              </h3>
                              <p className="text-xs text-accent font-semibold uppercase tracking-wider mt-1">
                                5% de Desconto Exclusivo
                              </p>
                              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                O faturamento e liberação do pedido ocorrem imediatamente após a
                                confirmação do PIX pela e-Rede.
                              </p>
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-2 w-full flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">
                                Valor total com desconto:
                              </span>
                              <span className="text-2xl font-bold text-foreground mt-1">
                                {formatBRL(totalPix)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-5 grid gap-3">
                            <TrustStrip />
                            <PayCta
                              onClick={() => handlePayment()}
                              loading={submitting}
                              label="Gerar QR Code PIX"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[180px_1fr]">
                          <div className="grid place-items-center rounded-xl bg-white p-3">
                            <img
                              src={
                                pixResult.qrCode.startsWith("data:")
                                  ? pixResult.qrCode
                                  : `data:image/png;base64,${pixResult.qrCode}`
                              }
                              className="h-40 w-40 object-contain"
                              alt="QR Code PIX"
                            />
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
                                Escaneie o QR Code ou copie o código abaixo para pagar.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/60 p-2">
                              <code className="flex-1 truncate text-xs text-muted-foreground select-all">
                                {pixResult.copiaCola}
                              </code>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard?.writeText(pixResult.copiaCola);
                                  toast.success("Código Copia e Cola copiado!");
                                }}
                              >
                                <Copy className="size-3.5 mr-1" />
                                Copiar
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/10 border border-accent/20 rounded-lg p-2.5 animate-pulse">
                              <Loader2 className="size-4 animate-spin text-accent" />
                              <span className="flex-1">Aguardando detecção do pagamento via Rede…</span>
                              <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0ms" }} />
                                <span className="size-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
                                <span className="size-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="credit_card" className="mt-5">
                      <form
                        onSubmit={handlePayment}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                      >
                        <fieldset
                          disabled={submitting}
                          className="grid gap-4 disabled:opacity-60 disabled:pointer-events-none transition-opacity"
                        >
                          <div className="grid gap-2">
                            <Label htmlFor="cardholderName">Nome impresso no cartão *</Label>
                            <Input
                              id="cardholderName"
                              required
                              placeholder="NOME DO TITULAR"
                              value={cardholderName}
                              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                              autoComplete="cc-name"
                              spellCheck={false}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cardNumber">Número do cartão *</Label>
                            <div className="relative">
                              <Input
                                id="cardNumber"
                                required
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                className="peer pr-10"
                                autoComplete="cc-number"
                                inputMode="numeric"
                                pattern="[0-9 ]*"
                                spellCheck={false}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none transition-colors peer-focus:text-[color:var(--electric)]">
                                <CreditCard className="size-5" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="expiryDate">Validade *</Label>
                              <Input
                                id="expiryDate"
                                required
                                placeholder="MM/AA"
                                value={expiryDate}
                                onChange={handleExpiryChange}
                                maxLength={5}
                                autoComplete="cc-exp"
                                inputMode="numeric"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="securityCode">CVV *</Label>
                              <Input
                                id="securityCode"
                                required
                                placeholder="000"
                                value={securityCode}
                                onChange={handleCvvChange}
                                maxLength={4}
                                autoComplete="cc-csc"
                                inputMode="numeric"
                                spellCheck={false}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="installments">Opções de Parcelamento *</Label>
                            <select
                              id="installments"
                              value={installments}
                              onChange={(e) => setInstallments(Number(e.target.value))}
                              className="select-field"
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const count = i + 1;
                                const val = total / count;
                                return (
                                  <option
                                    key={count}
                                    value={count}
                                    className="bg-background text-foreground"
                                  >
                                    {count}x de {formatBRL(val)} sem juros
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <TrustStrip />
                          <PayCta
                            type="submit"
                            loading={submitting}
                            label={`Pagar ${formatBRL(total)}`}
                          />
                        </fieldset>
                      </form>
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
                      <ShieldCheck className="size-3.5 text-accent" /> Ambiente certificado
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid place-items-center gap-4 py-10 text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="size-9" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Compra recebida!</h2>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Seu pagamento foi registrado e o pedido entrou em processamento. Enviaremos a
                    confirmação, nota fiscal e próximos passos de entrega pelo WhatsApp{" "}
                    <strong className="text-foreground">{identity?.phone}</strong>.
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
                  <dd className={isFreeShippingAL ? "text-emerald-400 font-semibold" : "text-foreground"}>
                    {shippingLabel}
                  </dd>
                </div>
                <div className="flex justify-between text-accent">
                  <dt>Desconto PIX (5%)</dt>
                  <dd>− {formatBRL(discountPix)}</dd>
                </div>
              </dl>

              <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--electric)] font-semibold">
                  Você paga
                </p>
                <p className="mt-1.5 text-3xl font-bold text-foreground tracking-tight">{formatBRL(totalPix)}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  no PIX · ou {formatBRL(total)} em até 12x sem juros no cartão.
                </p>
              </div>

              <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  Garantias da transação
                </p>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-accent" /> Compra protegida · PCI-DSS
                  </p>
                  <p className="flex items-center gap-2">
                    <Lock className="size-4 text-accent" /> Conexão SSL 256 bits
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="size-4 text-accent" /> Entrega em todo Brasil
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Lock className="size-3.5 text-accent" /> SSL 256-bit
      </span>
      <span className="size-1 rounded-full bg-white/15" aria-hidden />
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-accent" /> PCI-DSS
      </span>
      <span className="size-1 rounded-full bg-white/15" aria-hidden />
      <span className="inline-flex items-center gap-1.5">
        <Landmark className="size-3.5 text-accent" /> Processado por <strong className="text-foreground font-semibold">e-Rede</strong>
      </span>
    </div>
  );
}

function PayCta({
  onClick,
  loading,
  label,
  type = "button",
}: {
  onClick?: () => void;
  loading: boolean;
  label: string;
  type?: "button" | "submit";
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading}
      size="lg"
      variant="conversion"
      aria-busy={loading}
      data-loading={loading || undefined}
      className="mt-1 h-14 w-full rounded-full text-base data-[loading=true]:cursor-progress data-[loading=true]:opacity-95 data-[loading=true]:cta-progress-bar"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" /> Processando pagamento com segurança…
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
