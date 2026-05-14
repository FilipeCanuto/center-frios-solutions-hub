## Plano: Remover spotlight e destacar logomarca

### Objetivo
Eliminar o efeito de luz que segue o cursor em todo o site e adicionar um leve contorno/realce na logomarca do header para melhorar sua legibilidade.

### Mudanças

**1. Remover o MouseSpotlight**
- Localizar onde `<MouseSpotlight />` é renderizado (provavelmente em `src/routes/__root.tsx` ou em `Hs98Landing.tsx`/`Pa7ProLanding.tsx`) e remover a chamada e o import.
- Manter o arquivo `src/components/site/MouseSpotlight.tsx` no projeto (não usado), ou removê-lo se não houver outras referências — decidir após o grep.

**2. Realce sutil na logomarca**
- Em `src/components/site/Header.tsx`, aplicar um leve contorno/glow na logo:
  - `drop-shadow` sutil com cor do `--accent` (ex.: `filter: drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 35%, transparent))`)
  - Opcional: `stroke`/`outline` discreto se a logo for SVG inline; se for `<img>`, usar apenas `drop-shadow`.
- Intensidade leve, sem competir com o conteúdo. Mantém legibilidade tanto sobre fundo escuro da hero quanto fundos claros.

### Fora de escopo
- Não trocar a logo, não alterar o restante do header, nem mexer em outras páginas além do necessário para remover o spotlight.
