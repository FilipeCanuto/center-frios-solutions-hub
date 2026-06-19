# Plano — Refino Visual do Checkout PA7 Pro

Auditoria visual da landing `/produtos/processador-pa7-pro-skymsen` e do `CheckoutDialog` (transparente e-Rede). Nenhuma alteração em lógica, estado, `processPayment`, validação Zod, polling PIX ou payloads 3DS. Apenas CSS/Tailwind, classes utilitárias, ordem de elementos JSX presentational, e tokens de design.

## Token a corrigir antes (pré-requisito visual)

`src/styles.css` define `--color-brand-yellow: var(--accent)` — mas `--accent` está mapeado para `--electric` (azul). Ou seja, "amarelo de conversão" hoje renderiza azul. Vou:
- Adicionar `--brand-yellow: oklch(0.86 0.17 92)` (aprox. `#F5C300`) e `--brand-yellow-foreground: oklch(0.18 0.02 250)`.
- Remapear `--color-brand-yellow: var(--brand-yellow)` em `@theme inline`.
- Não vou trocar `--accent` (manteria a identidade já consolidada da página). O amarelo será usado pontualmente no CTA final, conforme pilar 3.

---

## Pilar 1 — Trust Anchors & Security Alignment

**Arquivos:** `src/components/site/pa7/CheckoutDialog.tsx` (step 3 e aside).

Problemas observados:
- Selo "Lock · SSL · PCI Compliance" aparece no rodapé do step 3 como texto pequeno (linhas 761–764), longe dos campos de cartão.
- Aside (linhas 841–851) lista ShieldCheck / Lock / Truck no fim — invisível durante o scroll do form.
- Nenhuma referência visual a "Processado pela e-Rede / Itaú" (token de marca da adquirente).

Ações (somente JSX/CSS, sem mudar comportamento):
1. Criar um `TrustStrip` presentational interno ao arquivo (sem estado), com 3 chips compactos: `Lock` "SSL 256-bit", `ShieldCheck` "PCI-DSS", logo textual "Processado por e-Rede". Layout: `flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-muted-foreground` com ícones `size-3.5 text-accent`.
2. Inserir o `TrustStrip` **imediatamente acima do `PayCta`** dentro de cada `TabsContent` (PIX e Cartão), ancorando o trust ao gesto de compra.
3. Substituir o parágrafo solto (linhas 761–764) por uma linha mais discreta apenas com "Ambiente certificado" — o peso vai para o strip acima do botão.
4. No `aside` (sidebar), agrupar os 3 selos atuais num bloco `rounded-2xl border border-white/10 bg-white/[0.02] p-4` com título "Garantias da transação" em `text-[10px] uppercase tracking-[0.2em] text-muted-foreground`, dando hierarquia ao bloco sem aumentar área.

## Pilar 2 — Input Visual States (Tailwind v4)

**Arquivos:** `src/components/ui/input.tsx`, `src/components/site/pa7/CheckoutDialog.tsx` (campos do cartão e select de parcelas).

Estado atual:
- `Input` já tem foco com `border-[color:var(--electric)] + shadow-[var(--shadow-glow-blue)]` — bom, mas não há `focus-visible:ring`. O `<select>` (linhas 722–741) duplica classes manualmente e usa `ring-ring` (genérico).
- Não há estilo visual para erro inline — hoje a validação só dispara toast.

Ações:
1. **`Input`:** adicionar `focus-visible:ring-2 focus-visible:ring-[color:var(--electric)]/40 focus-visible:ring-offset-0` (anel suave, sem deslocar layout). Adicionar suporte a `aria-invalid="true"` via seletor: `aria-[invalid=true]:border-[color:var(--destructive)] aria-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_25%,transparent)]`. Transição já existe (`transition-all duration-200`). Isso é puramente visual — nenhum código precisa setar `aria-invalid` agora, mas a estilização fica pronta para quando for plugada.
2. Remover as classes redundantes `bg-background border-white/10 text-foreground` dos `Input` do cartão (linhas 675, 687, 704, 716) — elas sobrescrevem o tema. Deixar só o que difere (`pr-10` no número do cartão).
3. **Select de parcelas:** extrair as ~8 utilitárias longas para uma classe `@utility select-field` em `src/styles.css` espelhando o `Input` (mesma altura, border, focus-ring, hover de borda). Aplicar `className="select-field"`.
4. Adicionar uma micro-`@utility field-error-text` (12px, `text-destructive`, `mt-1`) reservada para futuras mensagens inline — sem inserir nenhuma mensagem agora (zero impacto funcional).
5. Garantir que o ícone `CreditCard` no campo do número (linha 689–691) use `text-muted-foreground/70` e troque para `text-[color:var(--electric)]` quando o input estiver focado, via `peer` pattern (envolver `Input` com `peer` e o ícone com `peer-focus:text-[color:var(--electric)]`). Apenas visual.

## Pilar 3 — Visual Hierarchy & Pricing Scannability

**Arquivos:** `src/components/site/pa7/CheckoutDialog.tsx` (sidebar e CTAs), `src/components/site/pa7/CheckoutSection.tsx` (CTA "Finalizar Compra"), `src/styles.css` (token amarelo + variante de botão).

Problemas:
- O total final no aside (linha 835) tem o mesmo `text-2xl font-semibold` do total PIX da aba — sem diferenciação tipográfica do "preço de fechamento".
- `PayCta` usa `variant="default"` (gradient azul), mesma cor de **todos** os botões secundários ("Continuar para entrega", "Continuar para pagamento", "Voltar"). O CTA terminal não se distingue.
- Falta respiro entre o preço e o botão final.

Ações:
1. **Token amarelo (já descrito acima)** + nova variante `conversion` em `src/components/ui/button.tsx`:
   ```
   conversion: "bg-[color:var(--brand-yellow)] text-[color:var(--brand-yellow-foreground)] shadow-[var(--shadow-2)] hover:-translate-y-px hover:shadow-[0_10px_28px_-6px_color-mix(in_oklab,var(--brand-yellow)_55%,transparent)] active:translate-y-0 font-semibold tracking-tight"
   ```
2. `PayCta` recebe `variant="conversion"` + tamanho mantido `lg`, `className="mt-5 w-full rounded-full h-14 text-base"`. Botões intermediários ("Continuar para…") permanecem `default` (azul) — hierarquia restabelecida: azul = avanço, amarelo = compra.
3. **CheckoutSection** (linhas 174–180 do arquivo): aplicar a mesma `variant="conversion"` no botão "Finalizar Compra", com micro-ajuste de espaçamento (`py-7 → h-14`, manter `rounded-full`).
4. **Sidebar — bloco "Total no PIX"** (linhas 831–839): aumentar contraste tipográfico para `text-3xl font-bold tracking-tight text-foreground`, adicionar label "VOCÊ PAGA" em `text-[10px] uppercase tracking-[0.22em] text-[color:var(--electric)]`, e mover o "Ou {total} em 12x…" para tipografia secundária `text-[11px]`. Cria escada clara: valor > parcelamento > selos.
5. Garantir `gap-y` maior (mudar `gap-5` → `gap-6`) no container do step 3 para isolar visualmente o CTA do bloco de inputs.

## Pilar 4 — Transactional Feedback (CTA Async)

**Arquivos:** `src/components/site/pa7/CheckoutDialog.tsx` (`PayCta` e área PIX pós-geração).

Estado atual:
- `PayCta` já alterna para "Processando…" com `Loader2` quando `loading` é true — bom. Mas: o botão muda de label sem nenhum tratamento visual de "trava" (apenas `disabled`), e o restante do form não dá feedback de bloqueio.
- O bloco "Aguardando detecção do pagamento via Rede…" (linhas 653–656) é estático demais.

Ações (todas apenas presentational, sem tocar em `submitting`/`pixResult`/`useEffect`):
1. `PayCta` em estado `loading`:
   - Adicionar `aria-busy={loading}` (puramente A11y/visual).
   - Aplicar `data-[loading=true]:cursor-progress data-[loading=true]:opacity-90` via `data-loading={loading || undefined}`.
   - Trocar o spinner por um composto: `Loader2` + barra de progresso indeterminada (CSS-only) usando `@utility cta-progress-bar` em `src/styles.css` — uma pseudo `::after` `absolute inset-x-0 bottom-0 h-[2px]` com `background: linear-gradient(90deg, transparent, color-mix(in oklab, var(--electric) 70%, transparent), transparent)` animada com keyframes `cta-shimmer 1.4s linear infinite`. Adicionar `relative overflow-hidden` no botão.
   - Texto: "Processando pagamento com segurança…" (uma única troca de copy, sem alterar prop `label` do componente — uso `loading ? "Processando pagamento com segurança…" : label`).
2. Envolver o `<form>` do cartão (linhas 663–748) com `<fieldset disabled={submitting}>` para auto-desabilitar inputs durante o submit — `<fieldset>` é puramente declarativo e não altera o fluxo de `handlePayment`. Aplicar `className="grid gap-4 disabled:opacity-60 disabled:pointer-events-none transition-opacity"` no fieldset.
3. **Bloco "Aguardando PIX"** (653–656): trocar `Loader2 animate-spin` por uma combinação visual mais viva — manter o `Loader2` + adicionar 3 pulse-dots (`<span class="size-1.5 rounded-full bg-accent animate-pulse" style="animationDelay:Xms" />`) e um sutil `animate-pulse` no card inteiro (`bg-accent/10 → bg-accent/[0.08] animate-pulse`). Sem polling novo — apenas decoração do estado já existente.
4. Definir keyframes em `src/styles.css`:
   ```
   @keyframes cta-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
   ```

---

## Arquivos a editar (resumo)

```text
src/styles.css                                  → +brand-yellow token, +@utility select-field, cta-progress-bar, @keyframes
src/components/ui/input.tsx                     → focus-visible:ring + aria-invalid styles
src/components/ui/button.tsx                    → variant "conversion"
src/components/site/pa7/CheckoutDialog.tsx      → TrustStrip, fieldset, PayCta visuals, sidebar pricing hierarchy, select-field, peer icon
src/components/site/pa7/CheckoutSection.tsx     → variant="conversion" + altura h-14
```

## O que NÃO será tocado (garantia)

- `handleStepOne`, `handleStepTwo`, `handlePayment`, `lookupCep`, `processPayment`, polling `useEffect`, máscaras `handleCardNumberChange/Expiry/Cvv`, payload 3DS, schemas Zod, `useState`/`setStep`/`reset`/`handleClose`, props de `CheckoutDialog`/`PayCta`, integração `supabase`, `PA7_PRICE`, cálculo de `total`/`totalPix`/`discountPix`. Nenhum import lógico novo.

## Validação após aplicar

1. Abrir `/produtos/processador-pa7-pro-skymsen`, clicar "Comprar agora", percorrer os 3 steps em 1440px e 390px (screenshots).
2. Verificar foco com Tab nos campos (anel azul visível, sem deslocamento).
3. Forçar `aria-invalid="true"` via DevTools num input para confirmar borda vermelha.
4. Clicar "Gerar QR Code PIX" e "Pagar R$…" para conferir o shimmer + fieldset disabled.
5. Build sem warnings novos.