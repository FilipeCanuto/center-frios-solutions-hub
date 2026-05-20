## Diagnóstico

O erro não é mais race condition no frontend. A causa atual é no banco: a migration anterior fez `REVOKE EXECUTE` da função `public.has_role` para `authenticated`.

Isso quebra as policies de RLS que usam `has_role(...)`, porque o usuário autenticado precisa ter permissão de execução para a policy ser avaliada. Por isso a consulta em `user_roles` retorna:

```text
permission denied for function has_role
```

## Plano de correção

1. **Criar migration de correção de permissões**
   - Restaurar permissão de execução da função de verificação de role para usuários autenticados.
   - Não liberar acesso anônimo.
   - Manter a função como `SECURITY DEFINER` e com `search_path = public`.

2. **Validar no banco**
   - Confirmar que `authenticated` aparece com permissão de execução em `has_role`.
   - Confirmar que o admin `filipecanuto@centerfrios.com` continua com role `admin`.

3. **Validar no app**
   - Pedir logout/login novamente.
   - Reabrir `/admin/pedidos`.
   - Verificar que a listagem de pedidos carrega sem o erro de permissão.

## SQL esperado

```sql
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
```

## Observação de segurança

Não vou conceder permissão para `anon`. A função só precisa funcionar para usuários logados, pois o painel e as policies administrativas usam a role `authenticated`.