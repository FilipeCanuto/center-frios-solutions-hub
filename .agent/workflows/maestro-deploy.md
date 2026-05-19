---
name: deploy
description: Preparar e executar deploy para produção com todos os gates de qualidade
---

Execute sequencialmente:

1. qa-guardian → todos os testes passando?
2. security-reviewer → código seguro para produção?
3. Se ambos aprovarem → deploy-specialist executa o deploy
4. Confirme URL de produção e teste o fluxo crítico

Se qualquer gate falhar: pare, notifique o usuário, não faça deploy.
