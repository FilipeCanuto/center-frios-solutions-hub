## Problema

A tela `/admin/pedidos` mostra "Acesso restrito" mesmo com o role `admin` já atribuído a `filipecanuto@centerfrios.com` (confirmado no banco). Duas causas combinadas:

1. **Race condition em `src/lib/auth.ts`** — `onAuthStateChange` e `getSession` disparam consultas a `user_roles` em paralelo; o callback que terminar por último (às vezes com `setIsAdmin(false)` antes do dado chegar) define o estado final.
2. **Erros silenciosos** — se a query a `user_roles` falhar (rede, RLS, token expirado), o hook simplesmente assume `isAdmin = false` sem logar nada, o que dificulta o diagnóstico.

Bonus: o token JWT atualmente em uso no browser foi emitido antes do role existir. Embora a RLS use `auth.uid()` (não o JWT), um logout/login garante um estado limpo.

## Mudanças

### 1. Refatorar `src/lib/auth.ts`

- Centralizar a checagem de role numa única função `checkAdmin(userId)`.
- Eliminar a corrida: usar uma flag `cancelled` no `useEffect` e só atualizar `isAdmin` para a sessão mais recente.
- Tratar `error` da query e logar no console (`console.error`) em vez de cair em silêncio para `false`.
- Re-checar role quando o usuário voltar à aba (`window` event `focus`) — pega o caso "admin acabou de me promover".
- Manter `loading: true` até a primeira checagem de role completar, evitando o flash de "Acesso restrito".

### 2. Sem alteração de schema, RLS ou outras rotas

As policies de `user_roles` já estão corretas (usuário lê suas próprias roles).

### 3. Passo do usuário

Após o deploy da correção: **logout → login novamente** em `/login` para garantir um JWT novo. A página `/admin/pedidos` deve renderizar normalmente.

## Detalhes técnicos

Novo `useAuth` (esboço):

```ts
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin(userId: string | undefined) {
      if (!userId) { if (!cancelled) setIsAdmin(false); return; }
      const { data, error } = await supabase
        .from("user_roles").select("role").eq("user_id", userId);
      if (cancelled) return;
      if (error) { console.error("[useAuth] role check failed", error); setIsAdmin(false); return; }
      setIsAdmin(Boolean(data?.some((r) => r.role === "admin")));
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setTimeout(() => checkAdmin(s?.user?.id), 0);
    });

    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(s);
      await checkAdmin(s?.user?.id);
      if (!cancelled) setLoading(false);
    })();

    const onFocus = () => {
      supabase.auth.getSession().then(({ data: { session: s } }) => checkAdmin(s?.user?.id));
    };
    window.addEventListener("focus", onFocus);

    return () => { cancelled = true; subscription.unsubscribe(); window.removeEventListener("focus", onFocus); };
  }, []);

  return { loading, session, user: session?.user ?? null, isAdmin };
}
```

## Próximos passos após desbloqueio

Retomar Fase 2 — configuração do domínio de e-mails `mail.centerfrios.com` e templates transacionais (confirmação de pedido, PIX, notificação interna para `vendas@centerfrios.com`).