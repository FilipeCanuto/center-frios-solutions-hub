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
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrderStatus, processPayment } from "@/lib/payments.functions";
import { submitQuote } from "@/lib/leads.functions";
import { humanizeRedeError } from "@/lib/payments/error-messages";
import {
  MAX_INSTALLMENTS,
  computeTotals,
  formatBRL,
  isAlagoasCep,
  shippingFor,
} from "@/lib/pricing";
import { SALES_WHATSAPP, whatsappLink } from "@/data/site";
import { ecommerce, pushEvent, trackWhatsappClick, type TrackedItem } from "@/lib/tracking";

export type CheckoutAddon = { code: string; label: string; price: number };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: { slug: string; name: string; image: string; price: number };
  /** Acessórios opcionais selecionados na landing (cobrados junto). */
  addons?: CheckoutAddon[];
};

// Maps internal product slugs to short GTM/URL product identifiers used
// by the global /obrigado conversion page.
function toGtmProduct(slug: string): string {
  if (slug.includes("pa7")) return "pa7-pro";
  if (slug.includes("hs-98") || slug.includes("hs98")) return "hs-98";
  if (slug.includes("hs-22") || slug.includes("hs22")) return "hs-22";
  return slug;
}

function redirectToThankYou(slug: string, orderId: string, value: number, method: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams({
    product: toGtmProduct(slug),
    order: orderId,
    value: value.toFixed(2),
    method,
  });
  window.location.assign(`/obrigado?${params.toString()}`);
}

const digits = (v: string) => v.replace(/\D/g, "");

/** Validação de CPF pelos dígitos verificadores. */
function isValidCpf(raw: string): boolean {
  const c = digits(raw);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(c[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}

// Máscaras leves aplicadas no onChange dos campos.
const MASKS = {
  phone: (v: string) => {
    const d = digits(v).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },
  cpf: (v: string) =>
    digits(v)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  cnpj: (v: string) =>
    digits(v)
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2"),
  cep: (v: string) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
};

function masked(kind: keyof typeof MASKS) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = MASKS[kind](e.target.value);
  };
}

const StepOne = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z
    .string()
    .trim()
    .refine((v) => digits(v).length >= 10, "Informe o WhatsApp com DDD"),
  company: z.string().trim().optional(),
  cnpj: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || digits(v).length === 14, "CNPJ incompleto"),
  cpf: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || isValidCpf(v), "CPF inválido"),
});

const StepTwo = z.object({
  cep: z
    .string()
    .trim()
    .refine((v) => digits(v).length === 8, "CEP inválido"),
  street: z.string().trim().min(2, "Endereço obrigatório"),
  number: z.string().trim().min(1, "Número obrigatório"),
  complement: z.string().trim().optional(),
  district: z.string().trim().min(2, "Bairro obrigatório"),
  city: z.string().trim().min(2, "Cidade obrigatória"),
  state: z.string().trim().min(2, "UF obrigatória").max(2),
});

export function CheckoutDialog({ open, onOpenChange, product, addons = [] }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identity, setIdentity] = useState<z.infer<typeof StepOne> | null>(null);
  const [address, setAddress] = useState<z.infer<typeof StepTwo> | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cepDraft, setCepDraft] = useState("");
  const effectiveCep = (address?.cep ?? cepDraft).replace(/\D/g, "");
  const cepKnown = effectiveCep.length === 8;
  const isFreeShippingAL = isAlagoasCep(effectiveCep);
  const shipping = cepKnown ? shippingFor(effectiveCep) : 0;
  const shippingLabel = !cepKnown
    ? "Grátis para Alagoas"
    : isFreeShippingAL
      ? "Grátis (Alagoas)"
      : formatBRL(shipping);

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");

  // PIX State
  const [pixResult, setPixResult] = useState<{
    qrCode: string;
    copiaCola: string;
    orderId: string;
    total: number;
  } | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);

  // Credit Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // MM/AA
  const [securityCode, setSecurityCode] = useState("");
  const [installments, setInstallments] = useState(MAX_INSTALLMENTS);

  // Polling to verify PIX payment confirmation in real-time
  useEffect(() => {
    if (!pixResult) return;

    const interval = setInterval(async () => {
      try {
        const order = await getOrderStatus({ data: { orderId: pixResult.orderId } });

        if (order.status === "paid") {
          clearInterval(interval);
          setStep(4);
          toast.success("Pagamento PIX confirmado com sucesso!");
          redirectToThankYou(product.slug, pixResult.orderId, order.total ?? pixResult.total, "pix");
        } else if (order.status === "failed") {
          clearInterval(interval);
          toast.error("O pagamento falhou ou foi recusado pela operadora.");
        }
      } catch (err) {
        console.error("Erro ao verificar status do PIX:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [pixResult, product.slug]);

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

  const subtotal = product.price + addons.reduce((acc, a) => acc + a.price, 0);
  const cardTotals = useMemo(
    () => computeTotals(subtotal, "credit_card", effectiveCep),
    [subtotal, effectiveCep],
  );
  const pixTotals = useMemo(
    () => computeTotals(subtotal, "pix", effectiveCep),
    [subtotal, effectiveCep],
  );
  const discountPix = pixTotals.discount;
  const total = cepKnown ? cardTotals.total : subtotal;
  const totalPix = cepKnown ? pixTotals.total : subtotal - discountPix;

  const trackedItems: TrackedItem[] = useMemo(
    () => [
      {
        item_id: toGtmProduct(product.slug),
        item_name: product.name,
        price: product.price,
        item_brand: "Skymsen",
      },
      ...addons.map((a) => ({ item_id: a.code, item_name: a.label, price: a.price })),
    ],
    [product.slug, product.name, product.price, addons],
  );

  // Funil: abertura do checkout.
  useEffect(() => {
    if (open) pushEvent("begin_checkout", ecommerce(subtotal, trackedItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function reset() {
    setStep(1);
    setIdentity(null);
    setAddress(null);
    setPixResult(null);
    setPixError(null);
    setCardNumber("");
    setCardholderName("");
    setExpiryDate("");
    setSecurityCode("");
    setInstallments(MAX_INSTALLMENTS);
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

    // Guarda o contato já na etapa 1: se o cliente abandonar o checkout,
    // o time comercial consegue retomar a conversa pelo WhatsApp.
    void submitQuote({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company ?? "",
        product_interest: [product.name, ...addons.map((a) => a.code)].join(" + "),
        message: `Checkout iniciado — subtotal ${formatBRL(subtotal)}`,
        source: `checkout-${toGtmProduct(product.slug)}`,
      },
    }).catch(() => {});
    pushEvent("generate_lead", { lead_source: "checkout_step1", value: subtotal, currency: "BRL" });
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
      (form.elements.namedItem("number") as HTMLInputElement | null)?.focus();
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
    const shippingValue = shippingFor(parsed.data.cep);
    pushEvent(
      "add_shipping_info",
      ecommerce(subtotal, trackedItems, {
        shipping: shippingValue,
        shipping_tier: isAlagoasCep(parsed.data.cep) ? "gratis_alagoas" : "transportadora",
      }),
    );
  }

  async function handlePayment(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!identity || !address) {
      toast.error("Por favor, preencha seus dados de identificação e endereço primeiro.");
      setStep(1);
      return;
    }

    setSubmitting(true);

    // Sanitização agressiva no cliente (defesa em profundidade — o servidor
    // também aplica onlyDigits antes de montar o payload da e-Rede).
    const cleanPhone = identity.phone.replace(/\D/g, "");
    const cleanCnpj = identity.cnpj ? identity.cnpj.replace(/\D/g, "") : undefined;
    const cleanCpf = identity.cpf ? identity.cpf.replace(/\D/g, "") : undefined;
    const cleanCep = address.cep.replace(/\D/g, "");
    const addonCodes = addons.map((a) => a.code);

    pushEvent(
      "add_payment_info",
      ecommerce(paymentMethod === "pix" ? totalPix : total, trackedItems, {
        payment_type: paymentMethod === "pix" ? "pix" : `cartao_${installments}x`,
      }),
    );

    try {
      if (paymentMethod === "pix") {
        setPixError(null);
        const result = await processPayment({
          data: {
            customer_name: identity.name,
            customer_email: identity.email,
            customer_phone: cleanPhone,
            customer_company: identity.company,
            customer_cnpj: cleanCnpj,
            shipping_address: {
              cep: cleanCep,
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
            },
            customer_cpf: cleanCpf,
            product_slug: product.slug,
            payment_method: "pix",
            addons: addonCodes,
          },
        });

        if (result && result.success && result.pix && result.pix.qrCode && result.pix.copiaCola) {
          setPixResult({
            qrCode: result.pix.qrCode,
            copiaCola: result.pix.copiaCola,
            orderId: result.orderId,
            total: result.total ?? totalPix,
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

        const result = await processPayment({
          data: {
            customer_name: identity.name,
            customer_email: identity.email,
            customer_phone: cleanPhone,
            customer_company: identity.company,
            customer_cnpj: cleanCnpj,
            customer_cpf: cleanCpf,
            shipping_address: {
              cep: cleanCep,
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
            },
            product_slug: product.slug,
            payment_method: "credit_card",
            addons: addonCodes,
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
          redirectToThankYou(
            product.slug,
            result.orderId,
            result.total ?? total,
            `cartao_${installments}x`,
          );
        } else {
          throw new Error("O pagamento foi recusado ou falhou.");
        }
      }
    } catch (error: unknown) {
      type PaymentError = Error & { response?: { data?: unknown } };
      const paymentError = error as PaymentError;
      console.error('🔥 E-REDE PIX ERROR:', paymentError.response?.data || paymentError.message || error);
      console.error("Erro no pagamento:", error);
      const raw = error instanceof Error ? error.message : String(error ?? "");
      const humanized = humanizeRedeError({ raw });

      // PCI hygiene: limpar PAN/CVV após qualquer falha no fluxo de cartão.
      if (paymentMethod === "credit_card") {
        setCardNumber("");
        setSecurityCode("");
      }

      if (paymentMethod === "pix") {
        setPixError(humanized.message || "Falha ao gerar QR Code PIX.");
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
            <div className="sticky top-0 z-10 border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
              <div className="flex items-center gap-1.5 text-xs sm:gap-2">
                {[
                  { n: 1, label: "Dados" },
                  { n: 2, label: "Entrega" },
                  { n: 3, label: "Pagamento" },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-1.5 sm:gap-2">
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
                    {i < 2 && <span className="mx-1 h-px w-4 bg-white/10 sm:mx-2 md:w-10" />}
                  </div>
                ))}
              </div>
              {/* Resumo compacto — no mobile a coluna lateral fica oculta */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 md:hidden">
                <img
                  src={product.image}
                  alt=""
                  className="size-11 shrink-0 rounded-lg bg-white/5 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{product.name}</p>
                  {addons.length > 0 && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      + {addons.map((a) => a.code).join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatBRL(totalPix)}</p>
                  <p className="text-[11px] text-muted-foreground">no PIX</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6 md:px-8 md:py-8">
              {step === 1 && (
                <form onSubmit={handleStepOne} className="grid gap-4" noValidate>
                  <h2 className="text-xl font-semibold text-foreground">Seus dados</h2>
                  <p className="text-sm text-muted-foreground">
                    Nota fiscal para CPF ou CNPJ. Usamos seu WhatsApp para combinar a entrega.
                  </p>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      defaultValue={identity?.name}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">WhatsApp com DDD *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(82) 99999-9999"
                        required
                        onChange={masked("phone")}
                        defaultValue={identity?.phone}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        defaultValue={identity?.email}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      onChange={masked("cpf")}
                      defaultValue={identity?.cpf}
                    />
                  </div>
                  <details className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 open:pb-4">
                    <summary className="cursor-pointer text-sm font-medium text-foreground">
                      Comprar com CNPJ (opcional)
                    </summary>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="company">Razão social / Empresa</Label>
                        <Input
                          id="company"
                          name="company"
                          autoComplete="organization"
                          defaultValue={identity?.company}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          name="cnpj"
                          inputMode="numeric"
                          placeholder="00.000.000/0000-00"
                          onChange={masked("cnpj")}
                          defaultValue={identity?.cnpj}
                        />
                      </div>
                    </div>
                  </details>
                  <Button type="submit" className="mt-2 h-12 rounded-full" size="lg">
                    Continuar para entrega
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground">
                    <Lock className="size-3.5" /> Seus dados são usados apenas para este pedido.
                  </p>
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
                          inputMode="numeric"
                          autoComplete="postal-code"
                          placeholder="57000-000"
                          onChange={masked("cep")}
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
                          {isFreeShippingAL ? "Entrega grátis em Alagoas" : "Transportadora parceira"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isFreeShippingAL
                            ? "Pronta entrega · prazo confirmado pelo nosso time no WhatsApp"
                            : "Frete fixo para outros estados · prazo confirmado no WhatsApp"}
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
                        PIX · 5% off
                      </TabsTrigger>
                      <TabsTrigger value="credit_card">
                        <CreditCard className="mr-1.5 size-4" />
                        Cartão até 12x
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
                                5% de desconto · economia de {formatBRL(discountPix)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                Gere o QR Code, pague no app do seu banco e a confirmação aparece
                                aqui automaticamente.
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
                            {pixError ? (
                              <PixWhatsAppFallback
                                errorMessage={pixError}
                                product={product}
                                identity={identity}
                                address={address}
                                totalPix={totalPix}
                              />
                            ) : (
                              <PayCta
                                onClick={() => handlePayment()}
                                loading={submitting}
                                label="Gerar QR Code PIX"
                              />
                            )}
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
                              {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => {
                                const count = MAX_INSTALLMENTS - i;
                                const val = total / count;
                                return (
                                  <option
                                    key={count}
                                    value={count}
                                    className="bg-background text-foreground"
                                  >
                                    {count === 1
                                      ? `À vista no cartão — ${formatBRL(total)}`
                                      : `${count}x de ${formatBRL(val)} sem juros`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <TrustStrip />
                          <PayCta
                            type="submit"
                            loading={submitting}
                            label={
                              installments > 1
                                ? `Pagar ${installments}x de ${formatBRL(total / installments)}`
                                : `Pagar ${formatBRL(total)}`
                            }
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
                      <ShieldCheck className="size-3.5 text-accent" /> Pagamento seguro e-Rede
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
                      <a
                        href={whatsappLink(
                          `Olá, ${SALES_WHATSAPP.name}! Acabei de concluir a compra do ${product.name} pelo site.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackWhatsappClick("checkout_sucesso")}
                      >
                        Falar com a {SALES_WHATSAPP.name} no WhatsApp
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

              {addons.length > 0 && (
                <ul className="grid gap-1.5 text-xs">
                  {addons.map((a) => (
                    <li key={a.code} className="flex justify-between gap-3 text-muted-foreground">
                      <span>+ {a.label}</span>
                      <span className="text-foreground">{formatBRL(a.price)}</span>
                    </li>
                  ))}
                </ul>
              )}

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
                  no PIX · ou {formatBRL(total)} em até {MAX_INSTALLMENTS}x de{" "}
                  {formatBRL(total / MAX_INSTALLMENTS)} sem juros no cartão.
                </p>
              </div>

              <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  Garantias da transação
                </p>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-accent" /> Pagamento processado pela e-Rede
                  </p>
                  <p className="flex items-center gap-2">
                    <Lock className="size-4 text-accent" /> Conexão criptografada (HTTPS)
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="size-4 text-accent" /> Frete grátis para Alagoas
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" /> Nota fiscal e garantia de 12 meses
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
        <Lock className="size-3.5 text-accent" /> Conexão segura
      </span>
      <span className="size-1 rounded-full bg-white/15" aria-hidden />
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-accent" /> Nota fiscal
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

type FallbackProps = {
  errorMessage: string;
  product: { slug: string; name: string; price: number; image: string };
  identity: z.infer<typeof StepOne> | null;
  address: z.infer<typeof StepTwo> | null;
  totalPix: number;
};

function PixWhatsAppFallback({
  errorMessage,
  product,
  identity,
  address,
  totalPix,
}: FallbackProps) {
  function handleClick() {
    const lines = [
      "Olá, CENTERFRIOS! Tive uma instabilidade ao gerar o PIX no site e gostaria de concluir minha compra por aqui (garantindo os 5% de desconto).",
      "",
      `*Produto:* ${product.name}`,
      `*Valor com 5% de desconto:* ${formatBRL(totalPix)}`,
    ];
    if (identity) {
      lines.push("", "*Meus dados:*");
      lines.push(`Nome: ${identity.name}`);
      lines.push(`E-mail: ${identity.email}`);
      lines.push(`Telefone: ${identity.phone}`);
      if (identity.company) lines.push(`Empresa: ${identity.company}`);
      if (identity.cnpj) lines.push(`CNPJ: ${identity.cnpj}`);
      if (identity.cpf) lines.push(`CPF: ${identity.cpf}`);
    }
    if (address) {
      lines.push("", "*Entrega:*");
      lines.push(
        `${address.street}, ${address.number}${address.complement ? " - " + address.complement : ""}`,
      );
      lines.push(`${address.district} — ${address.city}/${address.state}`);
      lines.push(`CEP: ${address.cep}`);
    }
    const message = encodeURIComponent(lines.join("\n"));

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_checkout_contingencia",
        product: product.slug,
        value: Number(totalPix.toFixed(2)),
        currency: "BRL",
        reason: "pix_unavailable",
      });
    }

    trackWhatsappClick("checkout_pix_fallback");
    window.open(
      `https://wa.me/${SALES_WHATSAPP.number}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
        Instabilidade momentânea no PIX ({errorMessage}). Conclua sua compra em segundos direto com
        nossa equipe.
      </div>
      <button
        type="button"
        onClick={handleClick}
        id="cta-pix-fallback-whatsapp"
        data-gtm-event="lead_checkout_contingencia"
        data-gtm-product={product.slug}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] hover:bg-[#20b858] focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Concluir Compra via WhatsApp (Garantir 5% Desconto)
      </button>
    </div>
  );
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
