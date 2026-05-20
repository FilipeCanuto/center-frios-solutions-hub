import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin(userId: string | undefined) {
      if (!userId) {
        if (!cancelled) setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (cancelled) return;
      if (error) {
        console.error("[useAuth] role check failed", error);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(Boolean(data?.some((r) => r.role === "admin")));
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // defer to avoid deadlocks inside the auth callback
      setTimeout(() => {
        void checkAdmin(s?.user?.id);
      }, 0);
    });

    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(s);
      await checkAdmin(s?.user?.id);
      if (!cancelled) setLoading(false);
    })();

    const onFocus = () => {
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        void checkAdmin(s?.user?.id);
      });
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return { loading, session, user: session?.user ?? null, isAdmin };
}
