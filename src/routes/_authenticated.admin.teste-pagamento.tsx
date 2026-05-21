import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { chargeTestPayment } from "@/lib/test-charge.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/teste-pagamento")({
  component: TestPaymentPage,
});

function collectDeviceData() {
  return {
    userAgent: navigator.userAgent,
    acceptHeader: "application/json",
    device: {
      colorDepth: window.screen.colorDepth || 24,
      deviceType: "BROWSER" as const,
      javaEnabled: typeof navigator.javaEnabled === "function" ? navigator.javaEnabled() : false,
      language: navigator.language || "pt-BR",
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      timeZoneOffset: new Date().getTimezoneOffset(),
    },
  };
}

function TestPaymentPage() {
  const charge = useServerFn(chargeTestPayment);
  const [form, setForm] = useState({
    amount: "1.00",
    description: "Teste e-Rede 3DS",
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    installments: "1",
    // 3DS — portador
    chName: "",
    chEmail: "",
    chPhone: "",
    chCpf: "",
    // 3DS — billing address
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const mutation = useMutation({
    mutationFn: (vars: Record<string, unknown>) => charge({ data: vars as never }),
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const dev = collectDeviceData();
    const cleanPhone = form.chPhone.replace(/\D/g, "");
    mutation.mutate({
      amount: parseFloat(form.amount),
      description: form.description,
      cardholderName: form.cardholderName,
      cardNumber: form.cardNumber.replace(/\s+/g, ""),
      expirationMonth: form.expirationMonth.padStart(2, "0"),
      expirationYear: form.expirationYear,
      securityCode: form.securityCode,
      installments: parseInt(form.installments, 10) || 1,
      threeDS: {
        ...dev,
        cardHolder: {
          name: form.chName || form.cardholderName,
          email: form.chEmail,
          mobilePhone: cleanPhone.length < 12 ? `55${cleanPhone}` : cleanPhone,
          documentNumber: form.chCpf.replace(/\D/g, ""),
        },
        billingAddress: {
          street: form.street,
          number: form.number,
          complement: form.complement || undefined,
          city: form.city,
          state: form.state.toUpperCase(),
          country: "BRA",
          zipCode: form.zipCode.replace(/\D/g, ""),
        },
      },
    });
  }

  const result = mutation.data;

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teste de pagamento (e-Rede + 3DS 2.0)</h1>
        <p className="text-sm text-muted-foreground">
          Rota interna. Cria pedido real, autentica via 3DS 2.0 e cobra no cartão.
          PAN/CVV nunca são gravados.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-card p-6">
        <section className="space-y-4">
          <h2 className="font-semibold">Transação</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" min="0.01" required
                value={form.amount} onChange={(e) => update("amount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installments">Parcelas</Label>
              <Input id="installments" type="number" min="1" max="12"
                value={form.installments} onChange={(e) => update("installments", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" required
              value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="font-semibold">Cartão (em memória — não persistido)</h2>
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Nome no cartão</Label>
            <Input id="cardholderName" required
              value={form.cardholderName} onChange={(e) => update("cardholderName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do cartão</Label>
            <Input id="cardNumber" required inputMode="numeric" autoComplete="off"
              placeholder="0000 0000 0000 0000"
              value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationMonth">Mês</Label>
              <Input id="expirationMonth" required maxLength={2} placeholder="MM"
                value={form.expirationMonth} onChange={(e) => update("expirationMonth", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationYear">Ano</Label>
              <Input id="expirationYear" required maxLength={4} placeholder="AA ou AAAA"
                value={form.expirationYear} onChange={(e) => update("expirationYear", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityCode">CVV</Label>
              <Input id="securityCode" required maxLength={4} placeholder="123" autoComplete="off"
                value={form.securityCode} onChange={(e) => update("securityCode", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="font-semibold">Portador (3DS)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chCpf">CPF</Label>
              <Input id="chCpf" required placeholder="000.000.000-00"
                value={form.chCpf} onChange={(e) => update("chCpf", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chPhone">Celular (com DDD)</Label>
              <Input id="chPhone" required placeholder="(11) 99999-9999"
                value={form.chPhone} onChange={(e) => update("chPhone", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chEmail">E-mail</Label>
            <Input id="chEmail" type="email" required
              value={form.chEmail} onChange={(e) => update("chEmail", e.target.value)} />
          </div>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="font-semibold">Endereço de cobrança (3DS)</h2>
          <div className="grid grid-cols-[1fr_140px] gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input id="street" required
                value={form.street} onChange={(e) => update("street", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" required
                value={form.number} onChange={(e) => update("number", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement"
              value={form.complement} onChange={(e) => update("complement", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" required placeholder="00000-000"
                value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" required
                value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">UF</Label>
              <Input id="state" required maxLength={2}
                value={form.state} onChange={(e) => update("state", e.target.value)} />
            </div>
          </div>
        </section>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Processando..." : "Cobrar agora (3DS)"}
        </Button>
      </form>

      {mutation.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {(mutation.error as Error).message}
        </div>
      )}

      {result && (
        <div className={`rounded-lg border p-6 space-y-2 ${result.approved ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}>
          <div className="text-lg font-semibold">
            {result.approved ? "✅ Aprovado" : "❌ Negado"}
          </div>
          <div className="text-sm space-y-1">
            <div><strong>Status pedido:</strong> {result.status}</div>
            <div><strong>TID:</strong> {result.tid ?? "—"}</div>
            <div><strong>HTTP:</strong> {result.httpStatus ?? "—"}</div>
            <div><strong>Code:</strong> {result.returnCode ?? "—"}</div>
            <div><strong>Mensagem:</strong> {result.returnMessage}</div>
            <div><strong>Order ID:</strong> {result.orderId}</div>
            {result.threeDSUrl && (
              <div className="mt-2">
                <strong>Challenge 3DS requerido:</strong>{" "}
                <a href={result.threeDSUrl} target="_blank" rel="noreferrer" className="underline">
                  abrir URL de autenticação
                </a>
              </div>
            )}
          </div>
          <Link
            to="/admin/pedidos/$id"
            params={{ id: result.orderId }}
            className="inline-block text-sm underline mt-2"
          >
            Ver pedido →
          </Link>
        </div>
      )}
    </div>
  );
}
