## Diagnóstico

Já existe um handler em `src/routes/api.webhook.ts` (`POST /api/webhook`) que recebe notificações da Rede e atualiza `orders.status` + insere em `transactions`. Pontos a corrigir:

1. **Caminho errado para uso público**: `/api/webhook` fica sob a proteção de auth do site publicado. Webhooks externos devem ficar sob `/api/public/*`.
2. **Sem autenticação**: qualquer um pode chamar a URL e marcar pedidos como `paid`. A Rede não envia assinatura HMAC nativa, então o padrão recomendado é validar um **token compartilhado** enviado no path/header configurado no painel da Rede.
3. **Sem idempotência**: a Rede pode reenviar a mesma notificação várias vezes. Hoje cada chamada cria uma nova linha em `transactions` e pode regredir o status (ex.: `paid` → `pending`).
4. **Status do pedido pode regredir**: se chegar uma notificação atrasada/`pending` depois de já estar `paid`, hoje sobrescreve. Precisa respeitar a hierarquia.
5. **URL para a Rede**: o cliente precisa de uma URL estável para colar no painel da Rede.

## Plano

### 1. Novo endpoint público com token
Criar `src/routes/api.public.webhook.rede.$token.ts` (caminho: `/api/public/webhook/rede/{TOKEN}`):
- Lê o `token` do path e compara em tempo constante com `process.env.REDE_WEBHOOK_TOKEN`.
- Se inválido, retorna `401` sem detalhes.
- Mantém o método `POST` apenas; demais retornam `405`.

### 2. Pedir o secret
Solicitar `REDE_WEBHOOK_TOKEN` (string aleatória forte que vamos gerar e o usuário cola no painel da Rede como parte da URL de notificação).

### 3. Lógica de processamento (refatorada)
Dentro do handler:
- `body.reference` → `orderId` (UUID do pedido).
- Buscar o pedido. Se não existir → `404`.
- Mapear `body.status` da Rede para nosso status:
  - `captured` / `approved` → `paid`
  - `denied` / `failed` → `failed`
  - `refunded` → `refunded`
  - `cancelled` → `cancelled`
  - outros → ignora (responde 200 sem alterar).
- **Idempotência por TID**: antes de inserir em `transactions`, checar se já existe `gateway_transaction_id = body.tid` para esse `order_id`. Se já existe com mesmo status, responde 200 imediatamente.
- **Não regredir status**: se pedido já está `paid` ou `refunded`, não voltar para `pending`/`failed`. Definir hierarquia: `paid > refunded > failed > pending`.
- Atualizar `orders.status` só quando o novo status for "superior" ou for `refunded` vindo de `paid` (estorno legítimo).
- Inserir transação com `raw_response` completo para auditoria.
- Responder `200 { ok: true }` para a Rede não reenviar.

### 4. Manter compatibilidade
- Apagar o handler antigo `src/routes/api.webhook.ts` (ou redirecionar 410 Gone). A URL antiga ainda não foi configurada em produção, então é seguro remover.

### 5. Migration leve
Criar índice para acelerar a checagem de idempotência:
```text
CREATE INDEX IF NOT EXISTS idx_transactions_order_tid
  ON public.transactions (order_id, gateway_transaction_id);
```

### 6. Validação
- Chamar a nova URL com token errado → `401`.
- Chamar com token certo + `reference` inexistente → `404`.
- Simular `captured` para um pedido `pending` em sandbox → vira `paid` e cria 1 linha em `transactions`.
- Reenviar a mesma notificação → continua 1 linha, status estável.
- Enviar `pending` depois de `paid` → status permanece `paid`.

### 7. Entregar para o usuário
Após deploy, informar a URL final pronta para colar no painel da Rede:
```text
https://centerfrioshub.lovable.app/api/public/webhook/rede/{REDE_WEBHOOK_TOKEN}
```

## Observações de segurança
- Token vai no path para facilitar configuração na Rede (que nem sempre permite headers customizados). Comparação em tempo constante para evitar timing attack.
- Endpoint não retorna detalhes do pedido — só `ok`/erro genérico.
- Continua usando `supabaseAdmin` (service role), correto para webhook server-side.
