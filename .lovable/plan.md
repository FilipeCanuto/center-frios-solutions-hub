## Objetivo
Substituir o fluxo atual de "Comprar" (CheckoutDialog com PIX/Boleto fake) por uma integração real com a **API e-Rede (Itaú)**, aceitando:
- Crédito à vista e parcelado (Visa, Master, Elo, Amex, Hipercard)
- Débito online (3DS)
- PIX (via Rede/Itaú)

Sem PCI escopo D: cartão é tokenizado no navegador via SDK da Rede; nossa server function recebe **apenas o token** e processa via API REST e-Rede.

---

## Fluxo do usuário

```text
Card HS-22/HS-98/PA7 → "Comprar"
   └─ CheckoutDialog (passos)
       1. Dados do cliente (nome, CPF/CNPJ, e-mail, telefone, endereço entrega)
       2. Escolha meio: [Crédito] [Débito] [PIX]
       3a. Crédito/Débito → form com tokenização Rede no front → 3DS (se débito) → confirma
       3b. PIX → server gera QR Code + copia-e-cola → polling de status
       4. Tela de resultado (aprovado / recusado / pendente)
   └─ Webhook Rede atualiza status → e-mail/WhatsApp
```

---

## Arquitetura técnica

### 1. Secrets (Lovable Cloud)
Pediremos via `add_secret`:
- `REDE_PV` — código do estabelecimento (produção)
- `REDE_TOKEN` — token de integração (produção)
- `REDE_ENV` — `production` (com fallback `sandbox` quando necessário)
- `REDE_WEBHOOK_SECRET` — segredo HMAC para validar callbacks
- `RESEND_API_KEY` (ou conector) — notificação por e-mail ao cliente e ao vendedor

### 2. Banco (migration)
Tabela `orders`:
- `id uuid pk`, `created_at`, `updated_at`
- `customer_name`, `customer_doc`, `customer_email`, `customer_phone`
- `shipping_address jsonb`
- `product_slug` (`hs-22` | `hs-98` | `pa7-pro` | ...)
- `product_name`, `unit_price_cents`, `quantity`, `total_cents`
- `payment_method` (`credit` | `debit` | `pix`)
- `installments int null`
- `rede_tid text` (transaction id), `rede_reference text` (nosso ref único)
- `status` (`pending` | `authorized` | `captured` | `denied` | `failed` | `refunded`)
- `pix_qr_code text null`, `pix_copy_paste text null`, `pix_expires_at timestamptz null`
- `raw_response jsonb` (último payload Rede; sem dados sensíveis de cartão)

RLS:
- INSERT: público (anon) só via server function (não direto do client)
- SELECT/UPDATE/DELETE: bloqueados para anon; admin via role `admin` (tabela `user_roles` + `has_role`)

### 3. Server functions (`src/lib/rede.functions.ts` + helpers em `*.server.ts`)
- `createCardOrder({ customer, product, qty, installments, cardToken, method })`
  - Cria registro `orders` com status `pending`
  - POST `https://api.userede.com.br/erede/v1/transactions` com PV/Token Basic Auth
  - Crédito: `kind: "credit"`, `installments`, `capture: true`
  - Débito: `kind: "debit"`, payload 3DS (`threeDSecure`)
  - Atualiza `orders.status` + `rede_tid`
- `createPixOrder({ customer, product, qty })`
  - POST endpoint PIX da Rede → retorna `qrCode` + `qrCodeBase64`
  - Persiste `pix_*` e devolve para o front
  - Front faz polling em `getOrderStatus(reference)` a cada 3s
- `getOrderStatus(reference)` — lê do banco (admin client) e devolve status mascarado
- `listOrders` (autenticada, admin) — para um futuro painel

### 4. Server route (webhook)
`src/routes/api/public/rede-webhook.tsx`
- Valida HMAC `REDE_WEBHOOK_SECRET`
- Atualiza `orders.status` por `rede_tid`
- Dispara e-mail de confirmação (Resend) quando `captured` ou PIX `paid`

### 5. Frontend
- Refatorar `CheckoutDialog` em wizard (3 passos) com `react-hook-form` + `zod`
- Carregar SDK de tokenização Rede via `<script>` injetado no dialog (só quando abre)
- Tokenizar cartão no submit → enviar somente token + bin + brand para `createCardOrder`
- Tela PIX: QR Code (`qrcode.react`), botão "copiar código", contagem regressiva
- Tela de resultado com status + número do pedido

### 6. Notificações
- Resend (e-mail) para cliente (confirmação) e vendedor (novo pedido)
- WhatsApp fica para fase 2 (manter botão "Falar no WhatsApp" como fallback humano)

---

## Pontos de atenção

- **PCI-DSS SAQ-A-EP**: nunca logar PAN/CVV; nunca persistir token bruto além do necessário; HTTPS obrigatório (já é).
- **CPF/CNPJ**: validação no front (`zod` + algoritmo de dígito); obrigatório pela Rede.
- **3DS débito**: fluxo com redirect/iframe — implementar via SDK oficial.
- **Antifraude**: começamos sem Cybersource; revisar após primeiras vendas.
- **Idempotência**: enviar `reference` único por pedido para evitar duplicação em retries.
- **Parcelamento**: definiremos política (ex.: até 6x sem juros, 7-12x com juros repassados) — preciso confirmar com você na implementação.

---

## Entregáveis por fase

**Fase 1 — Fundação (esta entrega)**
1. Migration `orders` + RLS + `user_roles`
2. Secrets cadastrados
3. Server functions de Crédito + PIX
4. Webhook
5. CheckoutDialog refatorado (wizard) ligado aos 3 produtos (HS-22, HS-98, PA7 Pro)
6. E-mail de confirmação (Resend)

**Fase 2 — Polimento (depois)**
7. Débito 3DS
8. Painel admin de pedidos
9. Antifraude / regras de risco
10. WhatsApp transacional

---

## O que preciso de você antes de implementar
1. **PV + Token de produção** da Rede (vou pedir via `add_secret` quando começarmos)
2. **Política de parcelamento** (quantas vezes sem juros / com juros)
3. **E-mail do vendedor** que recebe "novo pedido"
4. **Confirmação**: começo pela **Fase 1** (Crédito + PIX). Débito entra na Fase 2?