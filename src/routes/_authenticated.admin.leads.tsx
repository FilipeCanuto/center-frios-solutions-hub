import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listLeads } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

function whatsappHref(phone: string) {
  const d = phone.replace(/\D/g, "").replace(/^55/, "");
  return `https://wa.me/55${d}`;
}

function LeadsPage() {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => fetchLeads({ data: {} }),
  });

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{(error as Error).message}</div>;

  const leads = data?.leads ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Leads e orçamentos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Inclui quem preencheu a 1ª etapa do checkout (origem “checkout-…”) e pode não ter pago.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">Origem</th>
              <th className="px-3 py-2">Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  Nenhum lead ainda.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                  {new Date(l.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.email}</div>
                  {l.company && <div className="text-xs text-muted-foreground">{l.company}</div>}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <a
                    href={whatsappHref(l.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    {l.phone}
                  </a>
                </td>
                <td className="px-3 py-2">{l.product_interest ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{l.source ?? "—"}</td>
                <td className="max-w-xs px-3 py-2 text-xs text-muted-foreground">{l.message ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
