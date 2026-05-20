import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/lib/orders.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/pedidos/$id")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const fetchOrder = useServerFn(getOrderById);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => fetchOrder({ data: { id } }),
  });

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{(error as Error).message}</div>;
  if (!data) return null;

  const { order, transactions } = data;
  const addr = order.shipping_address as Record<string, string>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link to="/admin/pedidos" className="text-xs text-muted-foreground hover:text-foreground">
        ← Voltar
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Pedido {order.id.slice(0, 8)}</h1>
        <Badge variant="outline">{order.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {new Date(order.created_at).toLocaleString("pt-BR")}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-border p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cliente</h2>
          <dl className="space-y-2 text-sm">
            <Row k="Nome" v={order.customer_name} />
            <Row k="E-mail" v={order.customer_email} />
            <Row k="Telefone" v={order.customer_phone} />
            {order.customer_company && <Row k="Empresa" v={order.customer_company} />}
            {order.customer_cnpj && <Row k="CNPJ" v={order.customer_cnpj} />}
          </dl>
        </section>

        <section className="rounded-xl border border-border p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Entrega</h2>
          <dl className="space-y-2 text-sm">
            <Row k="CEP" v={addr.cep} />
            <Row k="Endereço" v={`${addr.street}, ${addr.number}${addr.complement ? " - " + addr.complement : ""}`} />
            <Row k="Bairro" v={addr.district} />
            <Row k="Cidade/UF" v={`${addr.city}/${addr.state}`} />
          </dl>
        </section>

        <section className="rounded-xl border border-border p-5 md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pedido</h2>
          <dl className="space-y-2 text-sm">
            <Row k="Produto" v={order.product_name} />
            <Row k="Valor" v={fmt(order.product_price)} />
            <Row k="Frete" v={fmt(order.shipping_price)} />
            <Row k="Total" v={fmt(order.total_price)} />
            <Row k="Método" v={order.payment_method} />
          </dl>
        </section>

        <section className="rounded-xl border border-border p-5 md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Transações ({transactions.length})
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((t) => (
                <li key={t.id} className="rounded-lg border border-border p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">{t.gateway} · {t.status}</span>
                    <span className="text-muted-foreground tabular-nums">{fmt(t.amount)}</span>
                  </div>
                  {t.gateway_transaction_id && (
                    <div className="mt-1 text-muted-foreground">TID: {t.gateway_transaction_id}</div>
                  )}
                  {t.pix_copia_cola && (
                    <div className="mt-1 break-all text-muted-foreground">PIX: {t.pix_copia_cola}</div>
                  )}
                  {t.raw_response && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-muted-foreground">Resposta bruta</summary>
                      <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-[10px]">
                        {JSON.stringify(t.raw_response, null, 2)}
                      </pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function fmt(n: number | string) {
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
