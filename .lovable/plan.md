## Objetivo

Transformar a landing atual do HS-98 numa **landing da tecnologia de homogeneização Skymsen**, que vende o método (não o modelo) e termina obrigando o cliente a escolher entre **HS-22** (médio porte) ou **HS-98** (grande porte) no checkout.

URL mantida: `/produtos/moedor-homogeneizador-hs-98` (preserva SEO já indexado e a entrada da allowlist do gate de visibilidade — não preciso mexer em `visibility.ts` nem em `robots.txt`).

---

## Nova arquitetura da página

```text
1. HERO universal
   "Carne pálida não vende. Funcionário preso no moedor não dá lucro."
   Promessa: homogeneização Skymsen — vermelho de vitrine + mãos livres.
   Visual: composição cinematográfica com as DUAS máquinas lado a lado
           (HS-22 menor à esq., HS-98 maior à dir.) sobre o halo conic.
   CTAs: "Escolher minha máquina" (âncora #bifurcacao) + WhatsApp.
   Barra de prova: 900 kg/h · NR-12 · Pedal hands-free · 12 meses garantia.

2. MANIFESTO (mantém o atual, com copy ajustada p/ "tecnologia", não modelo)
   "Não é um moedor. É a diferença entre vender a R$ 39,90 ou rebaixar
    para R$ 29,90 às seis da tarde."

3. BENEFÍCIOS UNIVERSAIS (3 pilares — valem para HS-22 e HS-98)
   a) Operação Mãos Livres — pedal dobra velocidade de embandejamento.
   b) Segurança de Aço — NR-12, sensores magnéticos, zero processo.
   c) O Ritual do Lucro — moer → caçamba → homogeneizar → padrão internacional.
   Substitui o atual Highlights 2x2; vira grid 3 colunas com ícone+copy hard.

4. RITUAL VISUAL (mantém Showcase asymmetric 7/5 reescrito)
   2 blocos com imagens HS-98 ambient (cozinha + interna) explicando
   "vermelho uniforme" e "ciclo automático sem operador parado".
   Copy reescrita para falar da TECNOLOGIA, não do modelo HS-98.

5. ROI / DOR ECONÔMICA (mantém estrutura atual, copy reforçada)
   "Quanto custa NÃO ter homogeneização?" — cálculo de quebra.

6. COMPARATIVO (mantém — moedor comum vs. homogeneizador Skymsen,
   não mais "comum vs HS-98")

7. ===== BIFURCAÇÃO ===== #bifurcacao
   Headline: "Duas máquinas. Uma decisão. Quanto a sua operação processa?"
   Subhead: medidor visual de capacidade (régua 0 → 1.000 kg/h) mostrando
            zona HS-22 (até 600) e zona HS-98 (até 900).
   Dois cards lado a lado, edge-to-edge, com selo de "Diferencial Exclusivo":

   ┌─ HS-22 ──────────────┐   ┌─ HS-98 ──────────────┐
   │ [foto HS-22 c/ tampa │   │ [foto HS-98 inox     │
   │  policarbonato       │   │  cavalete piso]      │
   │  transparente]       │   │                      │
   │ "O MONSTRO COMPACTO" │   │ "O GIGANTE DA        │
   │                      │   │  PRODUÇÃO"           │
   │ Açougues gourmet e   │   │ Grandes supermercados│
   │ supermercados médios │   │ e frigoríficos       │
   │                      │   │                      │
   │ 600 kg/h · 22 L      │   │ 900 kg/h · 41 L      │
   │ 16 kg/ciclo · boca 22│   │ 31 kg/ciclo · boca 98│
   │                      │   │                      │
   │ ✦ Tampa policarbonato│   │ ✦ Construção 100%    │
   │   transparente —     │   │   inox cavalete      │
   │   vê textura em      │   │   piso, regime       │
   │   tempo real         │   │   contínuo sem parar │
   │                      │   │                      │
   │ R$ XX.XXX            │   │ R$ 32.900            │
   │ [Comprar HS-22]      │   │ [Comprar HS-98]      │
   └──────────────────────┘   └──────────────────────┘

   Microcopy abaixo: "Processa até 600 kg/h? HS-22.
                     Precisa de quase 1 tonelada/h? HS-98."

8. CHECKOUT por modelo
   Cada botão "Comprar" abre o CheckoutDialog atual (PIX/Boleto/TED)
   com o modelo, preço e parcelas certos. Hoje o CheckoutDialog é
   ditado pelas constantes do PA7; vou parametrizá-lo por produto.

9. FAQ + Footer CTA (mantém; copy revisada para "linha HS Skymsen").
```

---

## Detalhes técnicos

### Dados (`src/data/hs22.ts` — NOVO)

Espelha `hs98.ts`:

- `HS22_IMAGES` (hero, ambient, transparent-lid, front, side, internal)
- `HS22_PRICE` — **bloqueador: preciso do valor do HS-22**. Vou
  implementar com `null` e ocultar o preço no card até você informar
  (o card cai automaticamente para "Solicitar orçamento" via QuoteDialog).
- `HS22_SPECS`: 600 kg/h · caçamba 22 L · 16 kg/ciclo · boca 22 ·
  motor (deixar genérico até você confirmar CV/V) · tampa policarbonato.
- `HS22_DIFF` + `HS98_DIFF` (string curta de "Diferencial Exclusivo").

### Dados (`src/data/hs98.ts`)

- Atualizar copy de `HS98_HIGHLIGHTS` p/ os 3 pilares universais
  (Mãos Livres / Segurança de Aço / Ritual do Lucro).
- Adicionar `HS98_DIFF = "Construção 100% inox cavalete piso"`.

### Imagens HS-22 (geração via IA — placeholder)

3 renders salvos em `src/assets/products/hs-22/`:

- `hero.png` — vista 3/4, tampa policarbonato transparente visível,
  fundo neutro estúdio, paleta consistente com fotos HS-98.
- `ambient.png` — bancada de açougue gourmet, máquina menor sobre
  mesa, vermelho de carne moída em destaque.
- `transparent-lid.png` — close da tampa transparente mostrando carne
  sendo homogeneizada por dentro (diferencial-chave).
  Gerados com `imagegen--generate_image` (premium para fidelidade). Trocamos
  pelas reais quando você enviar.

### Componentes

**NOVO** `src/components/site/hs98/TechHero.tsx`
Hero universal substituindo o atual focado em HS-98.

**NOVO** `src/components/site/hs98/UniversalBenefits.tsx`
3 pilares com ícones (Footprints/pedal, ShieldCheck, Workflow).

**NOVO** `src/components/site/hs98/ModelBifurcation.tsx`
Régua de capacidade + dois ProductChoiceCard.

**NOVO** `src/components/site/hs98/ProductChoiceCard.tsx`
Card de escolha (imagem hero, nome, apelido, specs em chips,
diferencial exclusivo, preço opcional, CTA → abre CheckoutDialog
com `product` prop).

**EDIT** `src/components/site/pa7/CheckoutDialog.tsx`
Parametrizar por produto:

- aceitar prop `product: { name, slug, price, installments, pixDiscountPct, image }`
- fallback para defaults do PA7 quando não passado (não quebra a página do PA7)
- mensagens (WhatsApp, copy do PIX/boleto) usam `product.name`

**EDIT** `src/components/site/hs98/Hs98Landing.tsx`
Reordena seções conforme nova arquitetura. Remove o CheckoutSection
único do HS-98 (vira parte do card de escolha do HS-98 na bifurcação).

### SEO / metadata

Em `src/routes/produtos.$slug.tsx` (head do slug `moedor-homogeneizador-hs-98`),
ajustar:

- `<title>`: "Homogeneizadores Skymsen HS-22 e HS-98 — Center Frios"
- `description`: hard copy sobre fim do encalhe + escolha de capacidade.
- og:image continua sendo a foto principal do HS-98 (visual mais forte).

Não precisa alterar `robots.txt` nem `sitemap.xml` — URL é a mesma.

---

## Itens em aberto (preciso confirmar antes do build)

1. **Preço do HS-22** — sem isso o card HS-22 fica com CTA "Solicitar
   orçamento" em vez de checkout direto. Tudo bem assim como provisório?
2. **Imagens reais do HS-22** — sigo com renders IA. Quando você enviar
   as fotos reais, troco em um turno só.
3. **Especs extras do HS-22** (motor CV, tensão, peso) — uso valores
   genéricos "consultar" ou você confirma? Posso pesquisar no site
   oficial Skymsen se preferir.

Posso prosseguir com a implementação assumindo placeholders nos 3 itens
acima, ou prefere me passar os dados antes?
