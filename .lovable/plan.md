## Objetivo
Ao concluir o pagamento com sucesso no PA7 Pro (PIX confirmado ou cartão autorizado), permanecer na mesma página (sem redirect para `/obrigado`), esconder os campos de checkout e renderizar um bloco inline de sucesso — disparando `dataLayer.push({ event: 'compra_sucesso_pa7' })`. Além disso, restringir as rotas de produto apenas ao PA7 Pro e ao HS-98.

## Mudanças

### 1. `src/components/site/pa7/CheckoutDialog.tsx`
- Adicionar prop opcional `onSuccess?: () => void`.
- Nos dois pontos em que `setStep(4)` é chamado (confirmação do PIX no `useEffect` de polling e retorno positivo do cartão em `handlePayment`), invocar `onSuccess?.()` logo em seguida.
- Remover qualquer navegação/`window.location`/redirect para `/obrigado` (não existe hoje — apenas confirmar).
- Manter intactos: `selectedOptionalDiscs`, cálculo de frete grátis Alagoas (CEP 57), Resend, e-Rede, PCI hygiene.

### 2. `src/components/site/pa7/Pa7ProLanding.tsx`
- Novo estado `const [purchaseSuccess, setPurchaseSuccess] = useState(false)`.
- Handler `handlePurchaseSuccess`:
  - `setPurchaseSuccess(true)`
  - `window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'compra_sucesso_pa7' })`
  - Fechar o `CheckoutDialog` (`setOpen(false)`) após pequeno delay para transição suave.
  - Scroll suave até a âncora `#checkout-pa7`.
- Passar `onSuccess={handlePurchaseSuccess}` ao `CheckoutDialog`.
- Quando `purchaseSuccess === true`:
  - Não renderizar `<CheckoutSection …>` nem `<StickyBuyBar …>`.
  - Renderizar em seu lugar um novo componente `<Pa7SuccessInline />` (mesma âncora `id="checkout-pa7"`), com visual coerente ao restante da landing (dark, borda/glow âmbar, `CheckCircle2`, título "Obrigado! Seu pedido foi confirmado.", subtítulo com próximos passos, CTA WhatsApp + link "Ver mais produtos").

### 3. `src/components/site/pa7/Pa7SuccessInline.tsx` (novo arquivo)
- Componente puramente apresentacional (sem lógica de pagamento), reutilizando tokens/tipografia já usados em `CheckoutSection`.

### 4. Restrição de rotas de produto — `src/routes/produtos.$slug.tsx`
- No `loader`, além de checar `getProduct(slug)`, permitir apenas os slugs:
  - `processador-pa7-pro-skymsen`
  - `moedor-homogeneizador-hs-98`
- Qualquer outro slug → `throw notFound()` (mantém o `notFoundComponent` já existente).

## Guardrails respeitados
- Sem alterações em: lógica de `selectedOptionalDiscs`, frete grátis Alagoas, `payments.functions.ts`, hooks Resend, e-Rede, MCP, rota `/obrigado` (permanece intacta como fallback global).
- Nenhum redirect é adicionado no fluxo do PA7 Pro.
- Marca preservada como "CENTERFRIOS".

## Verificação
- `bun run build` para conferir type-safety.
- Fluxo manual: abrir dialog → mock success (PIX/cartão) → confirmar que a página não navega, o checkout some, o bloco inline aparece e o evento `compra_sucesso_pa7` chega ao `dataLayer`.
