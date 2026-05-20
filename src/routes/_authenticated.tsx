import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { loading, session, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta ({user?.email}) não tem permissão de administrador.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
          >
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/admin/pedidos" className="text-sm font-semibold">
              Painel Admin
            </Link>
            <Link to="/admin/pedidos" className="text-sm text-muted-foreground hover:text-foreground">
              Pedidos
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{user?.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/login" });
              }}
              className="hover:text-foreground"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
