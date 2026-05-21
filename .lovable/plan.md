# Tokenização frontend e-Rede (Checkout Transparente)

Objetivo: remover PAN/CVV do nosso servidor. O navegador troca os dados sensíveis diretamente com a e-Rede e devolve um `tokenCartao` (one-time token). Só esse token vai pro nosso backend.

## 1. Carregamento do script oficial da e-Rede

- Criar `src/lib/payments/useRedeScript.ts`: hook que injeta `<script src="https://sandbox.userede.com.br/static/js/erede.min.js">` (ou URL de produção quando confirmada) uma única vez, retorna `{ ready, error }`.
- Necessário rodar só no cliente (sem SSR). `useEffect` + checagem `window.$` / `window.eRede`.

> Observação: a e-Rede expõe duas variantes de tokenização. Vamos usar a de **Checkout Transparente / Tokenização JS** que recebe `PV` público + dados do cartão e devolve `tokenCartao`. URL e nome exatos do método são confirmados no console da e-Rede (já temos PV/Token).

## 2. Expor PV público ao frontend

- `REDE_PV` hoje é runtime-only no servidor. Para o JS oficial precisamos do PV no browser.
- Adicionar `VITE_REDE_PV` (mesmo valor do `REDE_PV`, é público — é só o identificador do estabelecimento, não dá pra cobrar sem o token secret).
- Usar `import.meta.env.VITE_REDE_PV` ao inicializar o script.

## 3. Novo componente de cartão tokenizado

`src/components/payments/RedeCardForm.tsx`:
- Campos: nome, número, validade (MM/AA), CVV — controlados localmente, **nunca enviados ao backend**.
- Botão "Tokenizar e cobrar" chama o SDK e-Rede no browser → recebe `{ tokenCartao, bin, last4, brand, expMonth, expYear }`.
- `onToken(payload)` callback devolve apenas os dados não sensíveis + token.
- Estados: idle / tokenizing / error (com `returnCode`/`returnMessage` do SDK quando houver).

## 4. Refatorar `chargeTestPayment` e fluxo de checkout

Em `src/lib/payments/rede.ts`:
- Adicionar `chargeCreditCardWithToken({ orderId, amountCents, installments, cardToken, cardholderName, last4, brand, softDescriptor })`.
- Payload e-Rede: usar campo `cardToken` (sem `cardNumber`, `securityCode`, `expirationMonth/Year`). Manter `capture: true`, `kind: "credit"`, logging estruturado (`returnCode`, `returnMessage`, `httpStatus`, `tid`) idêntico.
- Manter `chargeCreditCard` (PAN) por enquanto marcado como `@deprecated` para podermos removê-lo depois da validação.

Em `src/lib/test-charge.functions.ts`:
- Trocar schema Zod: remover `cardNumber/expirationMonth/expirationYear/securityCode`; aceitar `cardToken: string`, `cardholderName`, `last4: string(4)`, `brand: string`, `installments`, `amount`, `description`.
- Chamar `chargeCreditCardWithToken`.
- Inserir em `transactions.raw_response` o `last4`/`brand`/`bin` (sem PAN).

Mesma troca em `src/lib/payments.functions.ts` (`createOrderAndCharge` ou equivalente do checkout público) para o fluxo do `CheckoutDialog`.

## 5. Atualizar páginas

`src/routes/_authenticated.admin.teste-pagamento.tsx`:
- Substituir os inputs de cartão pelo `<RedeCardForm onToken={...} />`.
- Mutação só dispara depois que `onToken` resolve; envia `{ amount, description, installments, cardToken, cardholderName, last4, brand }`.
- Bloco de resultado continua mostrando TID/HTTP/returnCode/returnMessage (já funciona).

`src/components/site/pa7/CheckoutDialog.tsx`:
- Mesma substituição na etapa cartão de crédito.

## 6. Logs e observabilidade (preservar)

- Mantemos toda a estrutura `[rede] charge approved/rejected/network error` no servidor — o token muda o payload mas a resposta da e-Rede continua igual (`returnCode`, `returnMessage`, `tid`, `httpStatus`).
- Adicionar log no frontend (`console.error("[rede.tokenize] failed", {...})`) quando a tokenização falhar, sem dados sensíveis.

## 7. Secrets / configuração

- Pedir ao usuário (via `add_secret`) o `VITE_REDE_PV` se ele aceitar expor o PV no bundle. Geralmente o PV é público — confirmar.
- Confirmar URL exata do script JS oficial em produção (sandbox vs prod). Se a documentação não estiver à mão, peço o link antes de implementar.

## Arquivos afetados

- novo `src/lib/payments/useRedeScript.ts`
- novo `src/components/payments/RedeCardForm.tsx`
- edit `src/lib/payments/rede.ts` (adicionar `chargeCreditCardWithToken`)
- edit `src/lib/test-charge.functions.ts` (schema + handler)
- edit `src/lib/payments.functions.ts` (checkout público)
- edit `src/routes/_authenticated.admin.teste-pagamento.tsx`
- edit `src/components/site/pa7/CheckoutDialog.tsx`

## Perguntas antes de implementar

1. Confirma que posso adicionar `VITE_REDE_PV` (mesmo valor do `REDE_PV`) como variável pública no frontend?
2. Tem em mãos a **URL exata do JS de tokenização de produção** da e-Rede e o nome do método (ex.: `$.eRede.tokenize(...)` ou `eRede.create(...)`)? Se sim, me envia — caso contrário, sigo com a URL padrão `https://api.userede.com.br/static/js/erede.min.js` da documentação pública e ajustamos se a e-Rede pedir outra.
