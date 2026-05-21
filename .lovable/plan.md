
## Diagnóstico atual (antes de mexer)

Li `src/lib/payments.functions.ts`, `src/lib/test-charge.functions.ts` e o webhook `src/routes/api.public.webhook.rede.$token.ts`. Achados:

1. **Endpoint**: hoje usamos `https://api.userede.com.br/erede/v1/transactions`. Esse **é** o endpoint de produção do produto e-Rede padrão. O `eresplit/v1/` que você citou é de outro produto (e-Rede **Split**, para marketplaces). **Preciso confirmar com você qual é o seu produto contratado** antes de trocar — trocar pra `eresplit` num PV não-split derruba 100% das transações.
2. **Modo sandbox silencioso**: em `payments.functions.ts` existe `isSandbox = !REDE_PV || !REDE_TOKEN`. Se uma das secrets falhar em runtime, o checkout “aprova” sem chamar a Rede e o cliente acha que pagou. Isso explica por que nada chega no painel.
3. **Erros engolidos**: o `catch` da chamada à Rede só faz `console.error("[processPayment] e-Rede API request error:", apiError)` e segue. Não logamos `returnCode`/`returnMessage` da resposta quando ela vem com erro mas `res.ok` é true. O response cru vai pra `transactions.raw_response`, mas nenhuma trilha estruturada.
4. **Valor**: já vai em centavos (`Math.round(total * 100)`) — ok.
5. **Documentos**: `customer_cnpj` e `customer_phone` são gravados como o usuário digitou (com máscara). Não enviamos hoje no payload da Rede (a API e-Rede `/transactions` credit não exige), mas se você precisa antifraude/3DS, precisamos enviar limpos.
6. **Tokenização no frontend**: hoje **não há** tokenização — `CheckoutDialog` manda PAN, CVV e validade direto pro server function, que repassa pra Rede. Isso funciona, mas mantém o app no escopo PCI-DSS SAQ D. O “checkout transparente” da Rede usa um JS que tokeniza no browser e devolve um token; só ele vai pro backend.

---

## Plano de correção

### 1. Forçar produção e falhar alto se faltar credencial
- `src/lib/payments.functions.ts` e `src/lib/test-charge.functions.ts`:
  - Remover o caminho `isSandbox` que simula aprovação. Se `REDE_PV` ou `REDE_TOKEN` faltarem, **lançar erro** com mensagem clara (sem criar order como “paid”).
  - Centralizar a base URL numa constante `REDE_API_BASE = "https://api.userede.com.br/erede/v1"` (ou `eresplit/v1` se você confirmar split) num arquivo único `src/lib/payments/rede-client.ts` para os dois fluxos consumirem.

### 2. Logging profundo da resposta da Rede
Em ambos os handlers, depois do `fetch`:
- Logar `res.status`, `res.statusText`, `rawResponse.returnCode`, `rawResponse.returnMessage`, `rawResponse.tid`, `order.id` num único `console.error("[rede] reject", {...})` quando `returnCode !== "00"` ou `!res.ok`.
- No `catch` (erro de rede), logar `apiError.name`, `apiError.message` e o stack.
- Salvar sempre `raw_response` no `transactions` (já fazemos no checkout real; ampliar no teste).

### 3. Sanitização do payload
Criar `src/lib/payments/sanitize.ts` com:
- `onlyDigits(value)` → remove tudo que não é dígito.
- Aplicar em `cardNumber`, `securityCode`, `expirationMonth`, `expirationYear` (já fazemos pro cardNumber; padronizar).
- Normalizar `expirationYear` pra 4 dígitos sempre.
- Em `payments.functions.ts`, limpar `customer_phone` e `customer_cnpj` antes do insert no banco e antes de qualquer envio externo.
- Garantir `amount = Math.round(total * 100)` como `number` inteiro (assert).

### 4. Decisão sobre tokenização (precisa de aprovação sua)
Duas opções, escolha uma:
- **A — Manter PAN no servidor (rápido)**: nada muda no frontend. Você assume compliance PCI SAQ D. É como está hoje, só com os logs/sanitização corrigidos.
- **B — Adotar checkout transparente da Rede (recomendado)**: incluir o JS oficial da Rede no `CheckoutDialog`, tokenizar no browser usando `REDE_PV` público e enviar só o token pro `processPayment`. Reduz escopo PCI. Requer 1 etapa extra de desenvolvimento e validação com a Rede.

### 5. Endpoint de auditoria rápida
Adicionar `GET /api/admin/rede-healthcheck` (protegido por admin) que:
- Confirma presença de `REDE_PV` e `REDE_TOKEN` (sem expô-los).
- Faz uma chamada `GET /transactions/{tid_fake}` que deve retornar 404/400 da Rede — comprova que estamos atingindo o endpoint de produção certo com credenciais aceitas.

---

## Perguntas antes de implementar
1. **Seu PV é e-Rede padrão ou e-Rede Split?** (define `erede/v1` vs `eresplit/v1`)
2. **Tokenização**: opção A ou B?
3. Posso **remover de vez** o caminho “sandbox simulado” do `payments.functions.ts`? (recomendo sim, mas confirma)

Assim que você responder, abro a implementação no próximo turno.
