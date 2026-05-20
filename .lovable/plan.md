# Opção A — Página admin de teste de pagamento

Criar uma rota oculta, protegida por admin, que permite cobrar um valor simbólico (ex.: R$ 1,00) num cartão real via e-Rede, sem mexer no checkout de produção.

## O que será criado

### 1. Rota protegida `/admin/teste-pagamento`
- Arquivo: `src/routes/_authenticated/admin/teste-pagamento.tsx`
- Acessível apenas para usuários com role `admin` (mesma proteção das outras telas `/admin/*`)
- Não aparece em nenhum menu — só quem souber a URL acessa

### 2. Formulário de teste
Campos:
- **Valor (R$)** — livre, default `1.00`
- **Descrição** — default "Teste e-Rede"
- **Nome no cartão**
- **Número do cartão**
- **Validade (MM/AA)**
- **CVV**
- **Parcelas** — default 1x

Botão **"Cobrar agora"** chama o server function de pagamento.

### 3. Server function `chargeTestPayment`
- Arquivo: `src/lib/payments/test-charge.functions.ts`
- Cria uma `order` no banco com:
  - `customer_name` = "TESTE ADMIN"
  - `customer_email` = email do admin logado
  - `product_name` = descrição informada
  - `total_price` = valor informado
  - `payment_method` = "credit_card"
  - `status` = "pending"
- Chama a API da e-Rede (mesma integração já feita no checkout) usando `process.env.REDE_PV` e `REDE_TOKEN`
- Atualiza a `order` para `paid` ou `failed` conforme retorno
- Insere linha em `transactions` com `raw_response` completo
- Retorna `{ orderId, tid, status, message }` para a UI exibir

### 4. Resultado na tela
Depois da cobrança, mostra um card com:
- Status (aprovado / negado) com cor
- TID da Rede
- Mensagem de retorno
- Link "Ver pedido em /admin/pedidos"

## Fluxo de validação que poderemos rodar

1. Abrir `/admin/teste-pagamento` (logado como admin)
2. Preencher R$ 1,00 + dados do cartão virtual → **Cobrar**
3. Confirmar `status: paid` na tela e em `/admin/pedidos`
4. Confirmar linha em `transactions` com `tid` e `raw_response`
5. Disparar manualmente o webhook (`/api/public/webhook/rede/<token>`) com o mesmo `tid` para validar:
   - Reenvio do mesmo evento → `200 { duplicate: true }`
   - Token errado → `401`
   - `pending` depois de `paid` → status permanece `paid`

## Detalhes técnicos

- A integração com a e-Rede já existe no checkout; vamos **reutilizar a mesma função/cliente** que faz `POST /v1/transactions` — só muda o ponto de entrada (formulário admin em vez de checkout público).
- Nenhuma alteração no checkout real, nos preços ou no webhook.
- A página é client-side com `useServerFn` + `useMutation`; o cartão **nunca** trafega pelo banco — vai direto do browser → server function → e-Rede.
- Validação Zod no `inputValidator` (valor > 0, número de cartão 13-19 dígitos, CVV 3-4 dígitos, validade futura).

## Arquivos a criar/editar

- `src/routes/_authenticated/admin/teste-pagamento.tsx` (novo)
- `src/lib/payments/test-charge.functions.ts` (novo)
- Reaproveita o cliente da Rede que já existe (vou localizar e reutilizar — sem duplicar lógica)

Posso seguir?