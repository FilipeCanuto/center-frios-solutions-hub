import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Status hierarchy — higher value wins. Notifications never regress a paid
// or refunded order back to pending/failed.
const STATUS_RANK: Record<string, number> = {
  pending: 0,
  failed: 1,
  cancelled: 2,
  refunded: 3,
  paid: 4,
};

function mapRedeStatus(raw: unknown): { order: string; transaction: string } | null {
  if (typeof raw !== "string") return null;
  const s = raw.toLowerCase();
  if (s === "captured" || s === "approved" || s === "paid") {
    return { order: "paid", transaction: "captured" };
  }
  if (s === "denied" || s === "failed") {
    return { order: "failed", transaction: "denied" };
  }
  if (s === "refunded") {
    return { order: "refunded", transaction: "refunded" };
  }
  if (s === "cancelled" || s === "canceled") {
    return { order: "cancelled", transaction: "cancelled" };
  }
  return null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/public/webhook/rede/$token")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expected = process.env.REDE_WEBHOOK_TOKEN;
        if (!expected) {
          console.error("[rede-webhook] REDE_WEBHOOK_TOKEN not configured");
          return json({ error: "Server misconfigured" }, 500);
        }
        if (!params.token || !timingSafeEqual(params.token, expected)) {
          return json({ error: "Unauthorized" }, 401);
        }

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const orderId = typeof body.reference === "string" ? body.reference : null;
        const tid =
          typeof body.tid === "string"
            ? body.tid
            : typeof body.transactionId === "string"
              ? body.transactionId
              : null;
        const mapped = mapRedeStatus(body.status);

        if (!orderId) {
          return json({ error: "Missing reference" }, 400);
        }

        const { data: order, error: orderErr } = await supabaseAdmin
          .from("orders")
          .select("id, status")
          .eq("id", orderId)
          .maybeSingle();

        if (orderErr) {
          console.error("[rede-webhook] order lookup failed", orderErr);
          return json({ error: "Lookup failed" }, 500);
        }
        if (!order) {
          return json({ error: "Order not found" }, 404);
        }

        // Unknown / ignored status — ack so Rede doesn't keep retrying.
        if (!mapped) {
          console.log("[rede-webhook] ignored status", body.status, "for", orderId);
          return json({ ok: true, ignored: true });
        }

        // Idempotency: if we already logged this exact tid for this order,
        // do nothing further.
        if (tid) {
          const { data: existing } = await supabaseAdmin
            .from("transactions")
            .select("id, status")
            .eq("order_id", orderId)
            .eq("gateway_transaction_id", tid)
            .maybeSingle();
          if (existing && existing.status === mapped.transaction) {
            return json({ ok: true, duplicate: true });
          }
        }

        // Log transaction (audit trail — always insert, even if order status
        // doesn't change, so we keep history).
        const amountRaw = body.amount;
        const amount =
          typeof amountRaw === "number"
            ? amountRaw > 1000
              ? amountRaw / 100 // assume cents
              : amountRaw
            : 0;

        const { error: txErr } = await supabaseAdmin.from("transactions").insert({
          order_id: orderId,
          gateway: "rede",
          gateway_transaction_id: tid,
          amount,
          status: mapped.transaction,
          raw_response: body as unknown as never,
        });
        if (txErr) {
          console.error("[rede-webhook] transaction insert failed", txErr);
        }

        // Update order status only if the new status is "higher" in the
        // hierarchy. This protects against late/out-of-order notifications.
        const currentRank = STATUS_RANK[order.status] ?? 0;
        const newRank = STATUS_RANK[mapped.order] ?? 0;
        if (newRank > currentRank) {
          const { error: updErr } = await supabaseAdmin
            .from("orders")
            .update({ status: mapped.order })
            .eq("id", orderId);
          if (updErr) {
            console.error("[rede-webhook] order update failed", updErr);
            return json({ error: "Update failed" }, 500);
          }
        }

        return json({ ok: true });
      },
    },
  },
});
