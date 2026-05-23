import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitQuote } from "@/lib/leads.functions";
import { SEGMENTS } from "@/data/site";

const ClientSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().min(8, "Telefone inválido"),
  segment: z.string().optional(),
  product_interest: z.string().optional(),
  message: z.string().max(2000).optional(),
});

type Props = {
  trigger: ReactNode;
  source?: string;
  defaultProduct?: string;
  defaultSegment?: string;
};

export function QuoteDialog({ trigger, source, defaultProduct, defaultSegment }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useServerFn(submitQuote);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      segment: String(fd.get("segment") || ""),
      product_interest: String(fd.get("product_interest") || ""),
      message: String(fd.get("message") || ""),
    };

    const parsed = ClientSchema.safeParse(payload);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Verifique os campos.";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await submit({ data: { ...payload, source: source ?? "site" } });
      toast.success("Pedido enviado! Nossa equipe entrará em contato em breve.");
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="metal-surface max-h-[90vh] overflow-y-auto border-white/10 bg-background/95 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Solicite seu orçamento</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo e nossa equipe técnica retorna em até 1 dia útil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" name="name" required maxLength={120} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" name="company" maxLength={120} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone / WhatsApp *</Label>
              <Input id="phone" name="phone" type="tel" required maxLength={40} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="segment">Segmento</Label>
            <Select name="segment" defaultValue={defaultSegment}>
              <SelectTrigger id="segment">
                <SelectValue placeholder="Selecione (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENTS.map((s) => (
                  <SelectItem key={s.slug} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product_interest">Produto de interesse</Label>
            <Input
              id="product_interest"
              name="product_interest"
              maxLength={120}
              defaultValue={defaultProduct}
              placeholder="Ex.: Processador PA7 Pro Skymsen"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" name="message" rows={4} maxLength={2000} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Enviando…
              </>
            ) : (
              "Enviar pedido"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
