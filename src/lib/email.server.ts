import { Resend } from "resend";

const resendInstance = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface OrderConfirmationDetails {
  orderId: string;
  customerName: string;
  productName: string;
  productOptions?: string;
  totalPaid: number;
  paymentMethod: string;
  billingDocument?: string;
  shippingCity?: string;
  shippingState?: string;
}

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const LOGISTICS_PHRASE =
  "Seu pedido foi registrado e entrou em nossa programação de rota logística. Nas próximas horas, nosso time entrará em contato via WhatsApp para confirmar o prazo estimado de entrega específico para a sua localidade.";

function buildHtml(d: OrderConfirmationDetails): string {
  const safe = (s?: string) =>
    (s ?? "").replace(/[<>&"]/g, (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] ?? c,
    );

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Confirmação de pedido — CENTERFRIOS</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0d10;font-family:Inter,Arial,Helvetica,sans-serif;color:#e6e9ef;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d10;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#13171c;border:1px solid #1f242c;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#1a1f27,#0f1318);border-bottom:1px solid #1f242c;">
                <div style="font-size:12px;letter-spacing:4px;color:#7dd3fc;text-transform:uppercase;">Pedido confirmado</div>
                <div style="font-size:26px;font-weight:800;letter-spacing:2px;color:#ffffff;margin-top:6px;">CENTERFRIOS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 8px;font-size:16px;color:#e6e9ef;">Olá, <strong>${safe(d.customerName)}</strong>.</p>
                <p style="margin:0 0 20px;font-size:14px;color:#a4adba;line-height:1.55;">
                  Recebemos a confirmação do seu pagamento. Abaixo está o resumo da sua compra.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0f1318;border:1px solid #1f242c;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:12px;color:#7a8493;text-transform:uppercase;letter-spacing:1px;">Pedido</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#e6e9ef;text-align:right;font-family:ui-monospace,monospace;">${safe(d.orderId)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#a4adba;">Produto</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:14px;color:#ffffff;text-align:right;font-weight:600;">${safe(d.productName)}</td>
                  </tr>
                  ${
                    d.productOptions
                      ? `<tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#a4adba;">Configuração</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#e6e9ef;text-align:right;">${safe(d.productOptions)}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#a4adba;">Pagamento</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#e6e9ef;text-align:right;text-transform:uppercase;">${safe(d.paymentMethod)}</td>
                  </tr>
                  ${
                    d.billingDocument
                      ? `<tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#a4adba;">Documento</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#e6e9ef;text-align:right;font-family:ui-monospace,monospace;">${safe(d.billingDocument)}</td>
                  </tr>`
                      : ""
                  }
                  ${
                    d.shippingCity || d.shippingState
                      ? `<tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#a4adba;">Destino</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #1f242c;font-size:13px;color:#e6e9ef;text-align:right;">${safe(d.shippingCity ?? "")}${d.shippingCity && d.shippingState ? " — " : ""}${safe(d.shippingState ?? "")}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:18px 16px;font-size:14px;color:#7dd3fc;text-transform:uppercase;letter-spacing:1px;">Total pago</td>
                    <td style="padding:18px 16px;font-size:20px;color:#ffffff;text-align:right;font-weight:800;">${BRL(d.totalPaid)}</td>
                  </tr>
                </table>

                <div style="margin-top:24px;padding:18px 20px;background:#0f1318;border:1px solid #1f242c;border-radius:10px;">
                  <div style="font-size:12px;color:#7dd3fc;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Logística</div>
                  <p style="margin:0;font-size:14px;line-height:1.6;color:#cbd2dc;">${LOGISTICS_PHRASE}</p>
                </div>

                <p style="margin:24px 0 0;font-size:12px;color:#7a8493;line-height:1.55;">
                  Em caso de dúvidas, responda este e-mail ou fale com nosso time pelo WhatsApp.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#0f1318;border-top:1px solid #1f242c;text-align:center;font-size:11px;color:#7a8493;letter-spacing:2px;text-transform:uppercase;">
                CENTERFRIOS · Equipamentos profissionais
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendOrderConfirmation(
  customerEmail: string,
  orderDetails: OrderConfirmationDetails,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!resendInstance) {
    console.warn("[email.server] RESEND_API_KEY not configured; skipping send.");
    return { ok: false, error: "resend_not_configured" };
  }

  try {
    const { data, error } = await resendInstance.emails.send({
      from: "CENTERFRIOS <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `CENTERFRIOS — Confirmação do pedido ${orderDetails.orderId.slice(0, 8).toUpperCase()}`,
      html: buildHtml(orderDetails),
    });

    if (error) {
      console.error("[email.server] resend error:", error);
      return { ok: false, error: String(error.message ?? error) };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email.server] send threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
