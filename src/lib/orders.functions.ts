import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) {
    throw new Error("Acesso restrito a administradores.");
  }
}

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        status: z.string().optional(),
        method: z.string().optional(),
        limit: z.number().min(1).max(200).optional(),
      })
      .parse(input ?? {})
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    let q = supabaseAdmin
      .from("orders")
      .select("id, created_at, customer_name, customer_email, product_name, total_price, payment_method, status")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 100);

    if (data.status) q = q.eq("status", data.status);
    if (data.method) q = q.eq("payment_method", data.method);

    const { data: orders, error } = await q;
    if (error) throw new Error(error.message);
    return { orders: orders ?? [] };
  });

export const getOrderById = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !order) throw new Error("Pedido não encontrado.");

    const { data: transactions } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("order_id", data.id)
      .order("created_at", { ascending: false });

    return { order, transactions: transactions ?? [] };
  });
