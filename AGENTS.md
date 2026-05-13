# AGENTS.md — Constituição do Sistema Multi-Agente
# Lido por todos os agentes antes de qualquer ação

## IDENTIDADE DO SISTEMA
Este projeto opera com um sistema de agentes especializados orquestrados
pelo MAESTRO. Todo agente deve ler este arquivo antes de iniciar qualquer tarefa.

## MODELO PADRÃO POR TIPO DE TAREFA
- Planejamento / Arquitetura / Decisões críticas → Claude Opus 4.6 (Thinking)
- Implementação de código / Features → Claude Opus 4.6 ou Gemini 3.1 Pro
- Tarefas rápidas / Boilerplate / Formatação → Gemini 3 Flash
- UI / Design / Frontend → Claude Opus 4.6 (Thinking) + skill frontend-design
- Segurança / Auditoria → Claude Opus 4.6 (Thinking) EXCLUSIVAMENTE

## REGRAS GLOBAIS — TODO AGENTE OBEDECE

### Qualidade
1. Nunca marque uma tarefa como concluída sem executar os testes
2. Todo código novo requer ao menos um teste unitário básico
3. Builds com erros são BLOQUEADOS — resolva antes de prosseguir
4. Zero warnings de lint ignorados em código novo

### Segurança
5. Nunca commite secrets, API keys ou senhas
6. Toda variável sensível vai em .env (nunca hardcoded)
7. .env está sempre no .gitignore — verifique antes de qualquer commit

### Processo
8. Antes de implementar algo grande: crie/atualize .agent/plans/active-plan.md
9. Após decisão arquitetural: documente em .agent/memory/decisions.md
10. Ao encontrar bloqueio após 2 tentativas: acione o **antigravity-engineer** antes de notificar o usuário
11. O **antigravity-engineer** deve ser acionado automaticamente em qualquer erro de ferramenta, build ou lint

## ORDEM DE ATIVAÇÃO PARA PROJETOS NOVOS
Quando o usuário tiver uma ideia nova ou vaga:
1. **brainstormer** → refina a ideia até virar um Mapa da Ideia aprovado
2. **maestro** → transforma o Mapa da Ideia em plano técnico
3. **architect** → define arquitetura e ADRs
4. **implementer / ui-designer / database-specialist** → execução paralela
5. **qa-guardian + security-reviewer** → validação
6. **deploy-specialist** → publicação

### Comunicação
11. Relatórios de progresso devem ser objetivos (máx. 5 linhas por update)
12. Sempre liste arquivos modificados ao finalizar uma tarefa
13. Sempre inclua o resultado do teste (PASS ✅ ou FAIL ❌) no relatório final

## STACK DO PROJETO
- Frontend: React + TypeScript + Vite
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Estilização: Tailwind CSS
- Deploy: [a ser configurado]

## AGENTES DISPONÍVEIS
| Agente | Arquivo | Responsabilidade |
|---|---|---|
| brainstormer | .agent/skills/brainstormer/SKILL.md | Refinamento criativo de ideias |
| maestro | .agent/skills/maestro/SKILL.md | Orquestrador principal |
| architect | .agent/skills/architect/SKILL.md | Arquitetura e decisões |
| implementer | .agent/skills/implementer/SKILL.md | Escrita de código |
| ui-designer | .agent/skills/ui-designer/SKILL.md | Interface e design |
| qa-guardian | .agent/skills/qa-guardian/SKILL.md | Testes e qualidade |
| security-reviewer | .agent/skills/security-reviewer/SKILL.md | Segurança |
| debug-specialist | .agent/skills/debug-specialist/SKILL.md | Debug e bugs |
| database-specialist | .agent/skills/database-specialist/SKILL.md | Banco de dados |
| deploy-specialist | .agent/skills/deploy-specialist/SKILL.md | Deploy e CI/CD |
| documentation-writer | .agent/skills/documentation-writer/SKILL.md | Documentação |
| aura | .agent/agents/aura.md | Global Brand Architect & CMO-as-a-Service |
| **antigravity-engineer** | .agent/skills/antigravity-engineer/SKILL.md | **Safety net: resolve erros do Antigravity, garante execução perfeita de cada comando** |

## HIERARQUIA DE RESOLUÇÃO DE ERROS
```
Erro detectado
  → antigravity-engineer tenta resolver (máx. 3 estratégias)
    → Resolveu? → Retoma tarefa original
    → Não resolveu? → Escala para o usuário com diagnóstico claro
```
