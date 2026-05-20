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

function TestPaymentPage() {
  const charge = useServerFn(chargeTestPayment);
  const [form, setForm] = useState({
    amount: "1.00",
    description: "Teste e-Rede",
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    installments: "1",
  });

  type ChargeInput = {
    amount: number;
    description: string;
    cardholderName: string;
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
    installments: number;
  };
  const mutation = useMutation({
    mutationFn: (vars: ChargeInput) => charge({ data: vars }),
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({
      amount: parseFloat(form.amount),
      description: form.description,
      cardholderName: form.cardholderName,
      cardNumber: form.cardNumber,
      expirationMonth: form.expirationMonth.padStart(2, "0"),
      expirationYear: form.expirationYear,
      securityCode: form.securityCode,
      installments: parseInt(form.installments, 10) || 1,
    });
  }

  const result = mutation.data;

  return (
    <div className="container max-w-xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teste de pagamento (e-Rede)</h1>
        <p className="text-sm text-muted-foreground">
          Rota interna. Cria um pedido real com valor simbólico e cobra no cartão informado.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-card p-6">
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

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Nome no cartão</Label>
          <Input id="cardholderName" required
            value={form.cardholderName} onChange={(e) => update("cardholderName", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número do cartão</Label>
          <Input id="cardNumber" required inputMode="numeric"
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
            <Input id="securityCode" required maxLength={4} placeholder="123"
              value={form.securityCode} onChange={(e) => update("securityCode", e.target.value)} />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Processando..." : "Cobrar agora"}
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
            <div><strong>Code:</strong> {result.returnCode ?? "—"}</div>
            <div><strong>Mensagem:</strong> {result.returnMessage}</div>
            <div><strong>Order ID:</strong> {result.orderId}</div>
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
