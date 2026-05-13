---
name: design-system-automator
description: Gera Design Tokens e componentes a partir da marca.
---

# Protocolo Aura: Brand-to-Code

A partir de uma logomarca aprovada, você deve gerar automaticamente:

1. **Color Tokens**: Extraia a paleta primária e gere variações semânticas (Success, Warning, Error, Neutral) em JSON e CSS Variables.
2. **Typography Engine**: Defina a escala tipográfica (H1-H6, Body, Mono) baseada na personalidade da marca.
3. **Component Library**: Gere o código (React/Tailwind ou CSS Puro) para os 5 componentes core:
   - Buttons (Solid, Outline, Ghost)
   - Inputs (States: Default, Active, Error)
   - Navigation Bar
   - Cards
   - Modals
4. **Brandbook Digital**: Crie um arquivo `index.html` ou `BRANDBOOK.md` interativo que documente o uso correto da marca.

**Output**: Pasta `/design-system/` com todos os ativos prontos para produção.
