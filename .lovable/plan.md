
# Auditoria e-Rede — PA7 Pro (pré-launch)

## 1. OAuth 2.0 — STATUS: CONFORME ✅

`src/lib/payments/rede.ts` (`getRedeAccessToken`) já implementa o padrão correto:

- POST `https://api.userede.com.br/redelabs/oauth2/token`
- `Authorization: Basic base64(PV:TOKEN)` + `grant_type=client_credentials`
- Token cacheado em memória com `expires_in` + buffer de 30s
- PV tem zeros à esquerda removidos (exigência manual v1.32 pág. 16)
- Bearer dinâmico injetado em cada chamada `/v2/transactions`

**Nenhum uso do header estático legado.** Auditoria de presença/tamanho de Secrets está correta (não loga valores).

→ **Nada a corrigir aqui.**

## 2. Manuseio de dados de cartão — STATUS: PARCIALMENTE CONFORME ⚠️

**Fluxo atual:** PAN + CVV digitados no `CheckoutDialog.tsx`, mantidos em React state (`cardNumber`, `securityCode`), enviados via `createServerFn` (HTTPS same-origin) para `processPayment`, que repassa server-to-server para `/v2/transactions`.

### Achados
- 🟢 PAN/CVV **nunca** persistidos no banco; `sanitizeRawForStorage` + `redactForLog` removem ecos em `raw_response`.
- 🟢 PAN/CVV **nunca** logados.
- 🟢 Transporte exclusivamente server-side (sem JS direto do browser para e-Rede).
- 🟡 É arquitetura **Direct PAN (server-to-server)** — válida pelo manual e-Rede, mas coloca o domínio no escopo **PCI-DSS SAQ D** (vs. SAQ A se usássemos Zero/Tokenization). Para launch hoje, é aceitável; ideal para a v2.
- 🔴 **PAN/CVV permanecem em memória do React** mesmo após sucesso/erro. `reset()` zera, mas em erro de rede o state persiste até o usuário fechar.
- 🔴 Inputs de cartão **não usam `autoComplete="cc-number|cc-csc"`** nem `inputMode="numeric"` corretos — prejudica UX e impede que o browser ofereça preenchimento seguro.
- 🔴 Faltam atributos `autoComplete="off"` em CVV (recomendação PCI) e `aria-autocomplete`.

### Recomendação para hoje
- Limpar `cardNumber`/`securityCode` no `finally` do `handlePayment` mesmo em erro recuperável após exibir toast.
- Adicionar atributos `autoComplete` corretos e `inputMode="numeric"`.
- Logar advisory `// TODO: migrar para e-Rede Zero (tokenização client-side) na v2` em `rede.ts`.

## 3. Tradução de erros — STATUS: NÃO CONFORME 🔴

Hoje o `catch` em `CheckoutDialog.tsx` exibe a mensagem crua que vem do servidor (ex.: `"Transação recusada (78): Cartão bloqueado pelo emissor"`), e em alguns casos vaza HTTP status / texto da Rede. Isso queima conversão e expõe internals.

### Códigos críticos a humanizar (manual e-Rede v1.32 Anexo A)
| Code | Mensagem técnica | Mensagem humanizada sugerida |
|---|---|---|
| 00 | Approved | (sucesso, sem toast de erro) |
| 51 | Insufficient funds | "Limite insuficiente. Tente outro cartão ou parcele em mais vezes." |
| 54 | Expired card | "Cartão vencido. Verifique a data de validade." |
| 57 / 62 | Transaction not permitted | "Seu cartão não permite compras online. Contate o emissor." |
| 78 / 83 | Card blocked | "Cartão bloqueado pelo emissor. Tente outro cartão." |
| 14 / 56 | Invalid card | "Número do cartão inválido. Confira os dígitos." |
| 82 | Invalid CVV | "Código de segurança (CVV) incorreto." |
| 91 / 96 | Issuer unavailable | "Banco emissor temporariamente indisponível. Tente novamente em 1 minuto." |
| 05 / 30 / default | Generic deny | "Pagamento não autorizado. Tente outro cartão ou use PIX (5% off)." |
| 203 | 3DS not registered | (interno — não exibir; logar e seguir sem 3DS) |
| 253 | Invalid parameter size | (interno — logar para devops) |
| network/timeout | fetch failed | "Conexão instável. Verifique sua internet e tente novamente." |
| rate-limit | 429-like | "Muitas tentativas. Aguarde 1 minuto e tente de novo." |

### Plano
- Criar `src/lib/payments/error-messages.ts` exportando `humanizeRedeError(returnCode, returnMessage, httpStatus?)`.
- Em `payments.functions.ts`, quando lançar erro, anexar `returnCode` numa propriedade serializável (ex.: `throw new Error(JSON.stringify({ code, message, http }))` ou um Error customizado com `cause`).
- No `CheckoutDialog.tsx`, parsear no `catch` e passar para `humanizeRedeError`. Fallback: "Não foi possível processar. Tente PIX (5% off) ou outro cartão."
- Adicionar CTA secundário no toast de erro de cartão: **"Pagar com PIX"** que comuta `paymentMethod` e re-submete — recupera conversão em ~30% dos declines.

---

## Plano de Implementação (aprovação para executar)

### Passo 1 — Mapa de erros humanizado (novo arquivo)
- Criar `src/lib/payments/error-messages.ts` com tabela completa de `returnCode → mensagem PT-BR` + categoria (`retry|other_card|use_pix|invalid_input|temporary|fatal`).

### Passo 2 — Propagar `returnCode` do servidor
- `src/lib/payments.functions.ts`: substituir `throw new Error(\`Transação recusada (${returnCode}): ${returnMessage}\`)` por `throw new Error(JSON.stringify({ kind: "rede_declined", code: returnCode, message: returnMessage, http: httpStatus }))`.
- Idem para `Falha ao gerar PIX` e rate-limit (incluir `kind: "rate_limit"`).

### Passo 3 — Consumir no checkout
- `src/components/site/pa7/CheckoutDialog.tsx`: `catch` parseia JSON; se válido → `humanizeRedeError`; se não → fallback genérico.
- Quando categoria for `use_pix`, mostrar toast com action button "Pagar com PIX" que faz `setPaymentMethod("pix")` e dispara `handlePayment` automaticamente.

### Passo 4 — Hardening dos inputs de cartão
- `cardNumber`: `autoComplete="cc-number"` `inputMode="numeric"` `pattern="[0-9 ]*"`.
- `cardholderName`: `autoComplete="cc-name"`.
- `expiryDate`: `autoComplete="cc-exp"` `inputMode="numeric"`.
- `securityCode`: `autoComplete="cc-csc"` `inputMode="numeric"`.
- No `finally` do `handlePayment`, em caso de erro de cartão zerar `setCardNumber("")` e `setSecurityCode("")` (mantém nome/validade para retry rápido).

### Passo 5 — Comentário advisory PCI
- Adicionar TODO no topo de `src/lib/payments/rede.ts` documentando o roadmap para e-Rede Zero (tokenização) na v2 — reduz escopo PCI para SAQ A.

### Arquivos a tocar
- `src/lib/payments/error-messages.ts` (NOVO)
- `src/lib/payments.functions.ts` (3 throws ajustados)
- `src/components/site/pa7/CheckoutDialog.tsx` (catch + atributos `autoComplete` em 4 inputs + reset condicional)
- `src/lib/payments/rede.ts` (comentário TODO)

### Fora de escopo
- Migração para e-Rede Zero/tokenização (v2 pós-launch).
- Reativação 3DS (depende de contratação no PV — Code 203).
- Mudanças visuais no checkout além dos atributos HTML.
- Qualquer alteração no webhook ou no schema do banco.

### Verificação pós-implementação
- Disparar pagamento com cartão de teste recusado (Code 51 sandbox) → toast deve mostrar "Limite insuficiente…".
- PAN/CVV: confirmar via React DevTools que state é zerado após erro de cartão.
- `grep` confirma 0 ocorrências de `returnMessage` ou `returnCode` em strings cruas no UI.

Aprova para implementar?
