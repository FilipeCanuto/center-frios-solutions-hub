import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTACT, SEGMENTS } from "@/data/site";
import { submitQuote } from "@/lib/leads.functions";
import { PremiumCard } from "@/components/site/PremiumCard";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Center Frios" },
      {
        name: "description",
        content:
          "Fale com a Center Frios. Telefone, WhatsApp, e-mail e formulário para orçamentos e consultoria técnica.",
      },
      { property: "og:title", content: "Contato Center Frios" },
      {
        property: "og:description",
        content: "Receba um orçamento técnico personalizado.",
      },
    ],
  }),
  component: ContatoPage,
});

const Schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().min(8, "Telefone inválido"),
});

function ContatoPage() {
  const [loading, setLoading] = useState(false);
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
      source: "pagina-contato",
    };
    const parsed = Schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }
    setLoading(true);
    try {
      await submit({ data: payload });
      toast.success("Mensagem enviada! Retornaremos em até 1 dia útil.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Fale conosco
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Vamos conversar sobre o seu projeto.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Atendimento técnico para orçamentos, projetos e consultoria. Resposta em até 1 dia útil.
          </p>

          <ul className="mt-10 grid gap-3">
            <PremiumCard as="li" className="flex items-start gap-3 p-4">
              <Phone className="mt-1 size-5 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Telefone</p>
                <a
                  href={CONTACT.phoneHref}
                  className="text-base font-medium text-foreground hover:text-accent"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </PremiumCard>
            <PremiumCard as="li" className="flex items-start gap-3 p-4">
              <MessageCircle className="mt-1 size-5 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-medium text-foreground hover:text-accent"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </PremiumCard>
            <PremiumCard as="li" className="flex items-start gap-3 p-4">
              <Mail className="mt-1 size-5 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</p>
                <a
                  href={CONTACT.emailHref}
                  className="text-base font-medium text-foreground hover:text-accent break-all"
                >
                  {CONTACT.email}
                </a>
              </div>
            </PremiumCard>
            <PremiumCard as="li" className="flex items-start gap-3 p-4">
              <MapPin className="mt-1 size-5 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Localização
                </p>
                <p className="text-base font-medium text-foreground">{CONTACT.city}</p>
              </div>
            </PremiumCard>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="metal-surface grid gap-4 rounded-2xl border border-white/10 p-6 md:p-8"
        >
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
              <Label htmlFor="phone">Telefone *</Label>
              <Input id="phone" name="phone" type="tel" required maxLength={40} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="segment">Segmento</Label>
            <Select name="segment">
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
            <Input id="product_interest" name="product_interest" maxLength={120} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" name="message" rows={5} maxLength={2000} />
          </div>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Enviando…
              </>
            ) : (
              "Enviar mensagem"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
