# Registro de Decisões Arquiteturais

> Este arquivo é atualizado automaticamente pelo agente `architect`
> após cada decisão significativa de arquitetura.

## Formato ADR
```
## [DATA] — [TÍTULO]
**Contexto:** [por que foi necessário decidir]
**Decisão:** [o que foi decidido]
**Alternativas rejeitadas:** [outras opções e por quê foram descartadas]
**Consequências:** [impacto no sistema]
**Guardrails:** [o que o implementer NÃO pode fazer]
```

<!-- As decisões serão registradas aqui automaticamente pelo agente architect -->

## 2026-05-01 — Sistema de Geração de Documentos (PDF)
**Contexto:** O projeto precisa permitir que o usuário gere Contratos e Recibos dinâmicos baseados nos dados que ele insere em tempo real e em sua identidade visual. O documento final precisa ser baixável em formato PDF com aparência profissional.
**Decisão:** Usaremos `react-hook-form` e `zod` para o preenchimento de dados do lado esquerdo. Do lado direito, um preview em tamanho A4 real reagirá a esse estado. A exportação para PDF usará `html2canvas` para tirar uma 'foto' do DOM do template A4, e `jspdf` para injetar essa imagem em um documento PDF real.
**Alternativas rejeitadas:** 
- @react-pdf/renderer (Rejeitado por ser muito complexo de integrar dinamicamente com Tailwind sem reescrever todo o layout).
- Geração server-side (Rejeitado porque queremos manter tudo rodando rápido e sem custos adicionais de servidor).
**Consequências:** A exportação dependerá da qualidade visual do DOM (`html2canvas`), o que significa que fontes e sombras pesadas precisam ser testadas para não quebrar a impressão.
**Guardrails:**
- O implementer NÃO DEVE usar `window.print()`. A exportação deve ser via botão dedicado gerando arquivo `.pdf`.
- O design do documento (lado direito) DEVE manter estritamente as proporções de um A4 (aspect-ratio).
