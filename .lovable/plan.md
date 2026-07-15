
## Diagnóstico ancorado na doc oficial

Manual e-Rede v1.32 (03/2026) que você enviou, pág. 136, **"QR Code Pix request"**, mostra o payload correto textualmente:

```json
{
    "kind": "pix",
    "reference": "pix{{reference}}",
    "amount": "3900",
    "qrCode": {
        "dateTimeExpiration": "2023-09-30T13:15:59"
    }
}
```

*(No PDF aparece `"Date timeExpiration"` — é artefato de OCR. O nome real do campo é `dateTimeExpiration`, formato `YYYY-MM-DDThh:mm:ss`, expiração até 15 dias.)*

Isso **invalida as duas tentativas anteriores**:

| Tentativa | Status |
|---|---|
| `{ Capture: true, Amount, Reference, QrCode: true }` (PascalCase) | ❌ Chaves inexistentes no schema. Causa direta do **Error 167 – Invalid request JSON**. |
| `{ capture, kind:"pix", reference, amount }` (meu chute anterior) | ❌ PIX **não tem `capture`**. |

**Endpoint (confirmado pág. 12 do manual):** `POST https://api.userede.com.br/erede/v2/transactions` — o atual `REDE_API_BASE` já está certo, não muda.

**Resposta oficial (pág. 137)** — precisamos ler os campos corretos:
```json
{
  "reference": "...", "tid": "...", "amount": 3900,
  "qrCodeResponse": {
    "dateTimeExpiration": "...",
    "qrCodeImage": "<base64>",    // imagem PNG do QR
    "qrCodeData": "<EMV string>"  // copia-e-cola
  },
  "returnCode": "00",
  "returnMessage": "Success."
}
```

O `chargePix` atual lê `raw.pix.qrCodeBase64` / `raw.pix.qrCodeString` — **caminho inexistente**. Mesmo se o payload estivesse certo, nunca acharia o QR.

## Escopo da mudança

Só `src/lib/payments/rede.ts` e `src/lib/payments/rede.test.ts`. Nada de UI, GTM, `/obrigado`, CEP `57`, cartão, OAuth ou middlewares.

## Mudanças em `src/lib/payments/rede.ts`

1. **Trocar `RedePixTransactionPayload`** para o contrato oficial:
   ```ts
   export type RedePixTransactionPayload = {
     kind: "pix";
     reference: string;
     amount: number;         // inteiros em centavos (doc: Numeric, até 10 dígitos)
     qrCode: { dateTimeExpiration: string };
   };
   ```
   Remover `Capture`, `Amount`, `Reference`, `QrCode: true`.

2. **Reescrever `buildPixTransactionPayload(orderId, amountCents, expiresInMinutes?)`**:
   - `kind: "pix"`
   - `reference`: manter timestamp para unicidade → `${orderId}-${Date.now()}` (respeita "Until 16" caracteres — se `orderId` for longo, truncar como já fazemos hoje)
   - `amount`: `amountCents` como número inteiro
   - `qrCode.dateTimeExpiration`: default = agora + 30 min, no formato `YYYY-MM-DDTHH:mm:ss` (sem timezone, sem milissegundos, como no exemplo da doc)

3. **`chargePix`**:
   - Continua fazendo `POST ${REDE_API_BASE}/transactions` com `Authorization: Bearer <token>`, `Content-Type: application/json`, `JSON.stringify(payload)` uma única vez (já está assim).
   - Ler resposta pelo caminho oficial: `raw.qrCodeResponse.qrCodeImage` (base64) e `raw.qrCodeResponse.qrCodeData` (EMV copy-paste).
   - Manter formato de retorno público (`{ status, qrCodeBase64, qrCodeString, rawText, code, message }`) para não quebrar chamadores em `payments.functions.ts`.
   - Sucesso = `res.ok && returnCode === "00"` e ambos os campos QR presentes.

4. **Remover** comentários antigos que falam de "PascalCase estrito" — trocar por referência à pág. 136 do manual.

## Mudanças em `src/lib/payments/rede.test.ts`

- Trocar as asserções PascalCase por camelCase:
  - `expect(payload.kind).toBe("pix")`
  - `expect(payload).not.toHaveProperty("capture")`
  - `expect(payload).not.toHaveProperty("Capture")`
  - `expect(payload.qrCode.dateTimeExpiration).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)`
  - `expect(payload.amount).toBe(<centavos>)` (número, não string — a doc mostra `"3900"` como string mas o tipo declarado é Numeric; mantemos number como já mandamos hoje no cartão que funciona)
- Adicionar teste garantindo que `JSON.stringify(payload)` **não contém** `"Capture"`, `"Amount"`, `"Reference"`, `"QrCode":true`.

## Validação

1. `bun test src/lib/payments/rede.test.ts` — deve passar.
2. Tentar gerar QR no checkout real. Esperado: `returnCode: "00"` + `qrCodeResponse.qrCodeImage` populado. Se ainda voltar 400/167, a próxima causa provável é PIX não habilitado no PV — aí é chamado técnico Rede, não código.

## Guardrails (não mexer)

- `chargeCreditCard` (já funciona, doc confirma que credit usa outro contrato).
- OAuth (`fetchRedeAccessToken`), endpoints, headers.
- GTM, `/obrigado`, CEP `57`, UI de checkout, `payments.functions.ts` (só consome o mesmo retorno público de `chargePix`).
- `JSON.stringify` continua sendo chamado **exatamente uma vez**, no `fetch`.

## Referência

Manual e.Rede v1.32 (`documentação_e-rede-24032026.pdf`) que você anexou:
- pág. 12 — endpoint canônico `POST /erede/v2/transactions`
- pág. 135-138 — seção "Pix / QR Code Pix request" com payload e resposta
