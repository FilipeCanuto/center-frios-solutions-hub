# Padrões de Código

## Geral

- Funções com mais de 30 linhas devem ser quebradas em funções menores
- Nomes descritivos — sem abreviações (userId não uid, getUserById não getUser)
- Comentários explicam o "porquê", não o "o quê"
- Zero código comentado commitado (use git para histórico)

## TypeScript/JavaScript

- Tipos explícitos em todas as funções públicas
- Evite `any` — use `unknown` se necessário
- Prefira `const` sobre `let`, nunca `var`
- `async/await` sobre `.then()/.catch()`

## Python

- Type hints em todas as funções
- Docstrings em funções públicas
- PEP 8 sempre

## Git

- Commits atômicos (uma mudança por commit)
- Mensagem: `[tipo]: [descrição]` (feat:, fix:, refactor:, docs:, test:)
- Nunca commite diretamente em main — sempre via PR
