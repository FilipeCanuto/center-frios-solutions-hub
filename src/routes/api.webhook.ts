import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log("[Webhook] Received e-Rede notification:", body);

          const orderId = body.reference; // reference we passed during creation
          const status = body.status; // captured, denied, refunded
          const tid = body.tid;

          if (!orderId) {
            return new Response(JSON.stringify({ error: "Missing reference/orderId" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Check if order exists
          const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .select("id, status")
            .eq("id", orderId)
            .single();

          if (orderError || !order) {
            console.warn(`[Webhook] Order with reference ${orderId} not found.`);
            return new Response(JSON.stringify({ error: "Order not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          let orderStatus = "pending";
          let transactionStatus = "pending";

          if (status === "captured") {
            orderStatus = "paid";
            transactionStatus = "captured";
          } else if (status === "denied" || status === "failed") {
            orderStatus = "failed";
            transactionStatus = "denied";
          } else if (status === "refunded") {
            orderStatus = "cancelled";
            transactionStatus = "refunded";
          }

          // Update order status in Supabase
          const { error: updateOrderError } = await supabaseAdmin
            .from("orders")
            .update({ status: orderStatus })
            .eq("id", orderId);

          if (updateOrderError) {
            console.error("[Webhook] Failed to update order status:", updateOrderError);
          }

          // Upsert transaction status
          const { error: transactionError } = await supabaseAdmin.from("transactions").insert({
            order_id: orderId,
            gateway: "rede",
            gateway_transaction_id: tid || null,
            amount: body.amount ? body.amount / 100 : 0,
            status: transactionStatus,
            raw_response: body,
          });

          if (transactionError) {
            console.error("[Webhook] Failed to log transaction:", transactionError);
          }

          return new Response(JSON.stringify({ status: "ok", processed: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: unknown) {
          console.error("[Webhook] Processing error:", err);
          const msg = err instanceof Error ? err.message : "Unknown error";
          return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
