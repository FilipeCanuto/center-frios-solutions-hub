## Fase 2 — Débito 3DS, Painel Admin e E-mails de Confirmação

### 1. Débito Online com 3DS (e-Rede)

**Backend (`src/lib/payments.functions.ts`)**
- Adicionar `kind: "debit"` ao fluxo de `processPayment`
- Incluir bloco `threeDSecure` no payload (obrigatório para débito):
  - `embedded: true`
  - `onFailure: "decline"` (recusa se 3DS falhar)
  - `userAgent`, `device` (mobile/desktop), `returnUrl`
- Tratar resposta `threeDSecure.url` → redirecionar o cliente ao banco emissor
- Após retorno do 3DS, capturar transação

**Frontend (`CheckoutDialog.tsx`)**
- Adicionar opção "Débito Online" no seletor de método
- Quando débito selecionado: ocultar campo "parcelas"
- Após `processPayment` retornar `threeDSecureUrl` → abrir em modal/iframe ou redirecionar
- Tela de retorno: ler `tid` da query string e exibir status

---

### 2. Painel Admin de Pedidos

**Autenticação**
- Habilitar Supabase Auth (e-mail/senha + Google)
- Criar enum `app_role` (`admin`, `user`) + tabela `user_roles`
- Function `has_role(uuid, app_role)` (SECURITY DEFINER)
- Atualizar RLS de `orders` e `transactions`:
  - SELECT permitido para `has_role(auth.uid(), 'admin')`
  - INSERT/UPDATE continuam restritos ao service role

**Rotas**
- `/admin/login` — tela de login (pública)
- `/_authenticated/admin/pedidos` — listagem (tabela com filtros: status, método, data)
- `/_authenticated/admin/pedidos/$id` — detalhe (cliente, endereço, transações, raw_response)
- Layout `_authenticated.tsx` valida sessão + role admin no `beforeLoad`

**Server functions** (`src/lib/orders.functions.ts`)
- `listOrders({ status?, method?, from?, to? })` com `requireSupabaseAuth` + check de role
- `getOrderById(id)`
- `refundOrder(id)` (chama e-Rede `/transactions/{tid}/refunds`)

---

### 3. E-mails de Confirmação (Lovable Emails)

**Setup**
- Configurar domínio de envio via Lovable Emails
- Scaffold de infra de email (filas pgmq, cron dispatcher)
- Scaffold de templates transacionais

**Templates** (`src/lib/email-templates/`)
- `order-confirmation.tsx` — para o cliente (pedido recebido + dados de pagamento)
- `pix-instructions.tsx` — para PIX (QR Code + copia-cola + validade)
- `payment-approved.tsx` — pagamento confirmado (acionado pelo webhook)
- `seller-new-order.tsx` — notificação interna ao vendedor

**Triggers**
- Após criação de pedido (cartão aprovado) → `order-confirmation` + `seller-new-order`
- Após criação de pedido PIX → `pix-instructions` + `seller-new-order`
- Webhook `paid` → `payment-approved` (somente se PIX, pois cartão já estava aprovado)

---

### 4. Ajustes complementares

- Adicionar coluna `customer_user_id` (nullable) em `orders` para vincular pedido a usuário logado (futuro)
- Página `/meus-pedidos` (Fase 3, fora de escopo agora)
- Logs estruturados nas server functions de pagamento

---

### Perguntas antes de implementar

1. **E-mail do vendedor** que recebe "novo pedido"? (ex: `vendas@centerfrios.com`)
2. **Domínio de envio** dos e-mails? Sugiro `notify.centerfrios.com` (subdomínio dedicado para não conflitar com e-mail corporativo).
3. **Primeiro admin**: qual e-mail cadastro como admin inicial? (depois ele promove os outros)
4. **Refund/estorno** no painel: liberar agora ou só visualização?

Posso começar pela ordem: (1) Auth + Admin → (2) E-mails → (3) Débito 3DS. Confirma essa ordem ou prefere outra?