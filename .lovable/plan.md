## Objetivo

Implementar 3DS 2.0 na cobrança de crédito via e-Rede (Opção A), mantendo PAN/CVV apenas em memória server-side, sem persistência nem logs, e preservar a telemetria estruturada (`returnCode`, `returnMessage`, `httpStatus`, `tid`).

## Mudanças

### 1. `src/lib/payments/rede.ts` — adicionar 3DS 2.0 + sanitização de logs

- Adicionar tipo `ThreeDSInput` com dados do portador exigidos pelo 3DS da e-Rede:
  - `embedded: true` (fluxo frictionless/challenge embutido)
  - `onFailure: "continue"` (configurável; default `"decline"` para máxima proteção)
  - `userAgent`, `device.colorDepth`, `device.deviceType`, `device.javaEnabled`, `device.language`, `device.screenHeight`, `device.screenWidth`, `device.timeZoneOffset`
  - `billingAddress` (rua, número, cidade, estado, país, CEP — todos via `onlyDigits` quando aplicável)
  - `cardHolder`: `name`, `email`, `mobilePhone` (com DDI), `documentNumber` (CPF, sanitizado)
  - `browser`: `acceptHeader`
- Estender `CreditChargeInput` com `threeDS: ThreeDSInput` (obrigatório).
- No `chargeCreditCard`, incluir `threeDSecure: { ... }` no payload conforme spec e-Rede.
- Tratar dois novos campos no `RedeRawResponse`: `threeDSecure.url` e `threeDSecure.paReq` (caso challenge não-embedded) — devolver no `RedeChargeResult` como `threeDS?: { url, paReq } | null`.
- **Sanitização de logs**: garantir que `console.error/log` NUNCA inclua `cardNumber`, `securityCode`, `expirationMonth`, `expirationYear`, `cardholderName` nem o objeto `payload`. Logar apenas `orderId`, `httpStatus`, `returnCode`, `returnMessage`, `tid`. O `raw` da e-Rede continua sendo persistido em `transactions.raw_response` (resposta — não contém PAN/CVV), mas removeremos qualquer eco de campos sensíveis antes de logar.
- Adicionar utilitário `redactRawForLog(raw)` que remove chaves `cardNumber`, `securityCode`, `cvv` se a e-Rede algum dia ecoar.

### 2. `src/lib/test-charge.functions.ts` — coletar 3DS, não persistir cartão

- Estender o `TestChargeSchema` (Zod) com objeto `threeDS` contendo os campos descritos acima (validados, com limites: `documentNumber` 11 dígitos, `mobilePhone` 10–15, CEP 8, etc.).
- Repassar `threeDS` para `chargeCreditCard`.
- Garantir que nenhum campo de cartão (PAN, CVV, expMonth/Year, holderName) seja inserido em `orders` nem em `transactions` (já está assim — manter e adicionar comentário explícito).
- Em caso de erro, devolver ao cliente apenas: `approved`, `returnCode`, `returnMessage`, `httpStatus`, `tid`, `orderId`, `status`. Nunca devolver `raw`, payload ou eco de cartão.

### 3. `src/routes/_authenticated.admin.teste-pagamento.tsx` — coletar 3DS no browser

- Adicionar coleta automática (em `useEffect` no submit) de:
  - `navigator.userAgent`
  - `screen.colorDepth`, `screen.width`, `screen.height`
  - `navigator.language`
  - `new Date().getTimezoneOffset()`
  - `navigator.javaEnabled?.() ?? false`
  - `"application/json"` como `acceptHeader`
  - `deviceType: "BROWSER"`
- Adicionar campos no formulário: **CPF do portador**, **email**, **celular com DDI** (default `+55`), **endereço de cobrança** (CEP, rua, número, cidade, UF, país default `BR`).
- Sanitizar (apenas dígitos) CPF, telefone, CEP antes de enviar.
- Submeter `threeDS` montado para `chargeTestPayment`.
- Render de resultado: se `threeDS.url` voltar, exibir aviso "challenge requerido — abra a URL retornada"; nas demais, mostrar `Aprovado/Negado` como hoje.

### 4. `src/lib/payments.functions.ts` — paridade no checkout público

- Mesma extensão de schema/payload aplicada ao fluxo público em `CheckoutDialog`. Coletar 3DS no front (mesma estratégia) e repassar.
- Garantir que `cardNumber`, `securityCode`, `expirationMonth`, `expirationYear` não sejam persistidos em `orders`, nem incluídos em `raw_response` enviado ao banco (limpar antes do insert se necessário).

### 5. `src/components/site/pa7/CheckoutDialog.tsx` — coletar 3DS

- Adicionar coleta automática do device/browser igual ao admin.
- Reaproveitar nome, email, telefone, CPF/CNPJ e endereço já capturados no checkout para popular o objeto `threeDS` (sem novos campos visíveis para o cliente — todos já existem).

## Segurança / Garantias

- **PAN/CVV/expiração**: apenas variáveis locais nas server functions; jamais em `orders`, `transactions.raw_response`, nem em `console.*`.
- **Logs**: somente `orderId`, `httpStatus`, `returnCode`, `returnMessage`, `tid`, `stack` em erro de rede.
- **Resposta para cliente**: shape estrito sem `raw`, sem payload de entrada.
- **3DS `onFailure**`: default `"decline"` (recusa se autenticação falhar) — alinhado a "transferência de responsabilidade".

## Teste R$ 1,00

Após implementação, a rota `/admin/teste-pagamento` aceita cobrança real de R$ 1,00 com 3DS 2.0 ativo. Logs de produção mostrarão `returnCode`, `httpStatus` e `tid` para auditoria.

## Pergunta para confirmar antes de codar

1. `**onFailure**`: `"decline"` (recusa quando 3DS falha — recomendado, máxima proteção) ou `"continue"` (segue mesmo sem autenticação)?
2. No **checkout público** (CheckoutDialog) hoje **não** há campo de CPF nem endereço de cobrança completo (só envio). Posso adicionar esses campos ao formulário do cliente? Sem eles, o 3DS da e-Rede rejeita o payload.  
  
Respostas:  
1. opção 1 (recomendada)  
2. Sim