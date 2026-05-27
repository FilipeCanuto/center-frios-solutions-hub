## Objetivo

Substituir a hero atual de 2 colunas por uma hero **full-bleed cinematográfica**: as imagens do HS-98 e HS-22 ocupam o fundo inteiro da seção em grande escala, transmitindo a robustez industrial dos equipamentos. O texto fica sobreposto à esquerda, protegido por um gradiente de leitura.

## Escopo

Apenas `src/components/site/hs98/TechHero.tsx`. Sem mudanças em dados, rotas, lógica ou outros componentes. Tokens/cores do design system mantidos.

## Estrutura nova da hero

```text
┌────────────────────────────────────────────────────────────┐
│  [gradient overlay esquerda → direita, escuro→transparente] │
│                                                            │
│  BADGE                                          ╔════════╗ │
│  H1 grande                          [HS-98 GIGANTE em     │
│  Subcopy                             escala dominante,    │
│  [CTA] [CTA outline]                 ~90% altura da hero] │
│  trust strip                                              │
│                                     [HS-22 sobreposto     │
│                                      em primeiro plano,   │
│                                      ~70% altura]         │
│  hotspots permanecem ancorados nas máquinas               │
└────────────────────────────────────────────────────────────┘
```

### Mudanças concretas

1. **Layout**: trocar `grid lg:grid-cols-12` por um container `relative` full-bleed. Altura mínima `min-h-[88vh]` no desktop, `min-h-[680px]` no mobile.
2. **Imagens (camada de fundo)**:
   - HS-98: posicionado `absolute right-[-4%] top-[6%]`, altura `h-[92%]`, `object-contain`, z-10. Drop-shadow reforçado (3 camadas) e ground-shadow elíptico abaixo.
   - HS-22: `absolute right-[28%] bottom-[4%]`, altura `h-[72%]`, z-20, sobrepondo levemente o HS-98 para criar profundidade.
   - No mobile (`<lg`): empilhar — máquinas viram um bloco no rodapé com altura `h-[60vh]`, texto acima.
3. **Pedestal/halos**: mover os halos cônicos e o radial accent para trás das máquinas (z-0), aumentar raio. Pedestal escovado vira uma faixa elíptica larga no rodapé da hero (não mais um círculo).
4. **Overlay de leitura**: gradiente `linear-gradient(90deg, var(--background) 0%, var(--background)/85 35%, transparent 70%)` cobrindo a metade esquerda para garantir contraste do texto sobre as imagens. Adicional vinheta no topo/base para coesão cinematográfica.
5. **Bloco de texto**: `absolute inset-y-0 left-0 flex items-center` em coluna `max-w-[620px]` com padding generoso. H1 cresce para `md:text-[88px] leading-[0.98]`. Mantém badge, subcopy, CTAs e trust strip atuais — só ajusta hierarquia.
6. **Hotspots**: mantidos, mas reposicionados (`x`/`y`) para casarem com as novas posições das máquinas. 6 hotspots preservados.
7. **Tags HS-22 / HS-98**: realocadas para flutuar ao lado de cada máquina no novo layout.
8. **Performance/SEO**: `loading="eager"` e `fetchPriority="high"` mantidos. `alt` mantidos.

### Responsivo

- `lg+`: layout descrito acima (texto à esquerda sobre imagens à direita).
- `md`: imagens em ~55% da largura à direita, gradiente mais agressivo.
- `<md`: stack vertical — texto no topo (sem overlay), máquinas em bloco abaixo com pedestal elíptico cobrindo a base.

### Acessibilidade

- Contraste garantido pelo overlay (texto sempre sobre área escura sólida).
- Hotspots seguem com `aria-label` e foco visível.
- Reduzir `motion` honra `prefers-reduced-motion` (manter as transições já existentes via framer-motion).

## Validação

- Visualizar em 1440px, 1024px, 768px e 390px (screenshots).
- Confirmar zero overlap entre texto e máquinas em todos os breakpoints.
- Build sem erros.

## Fora de escopo

- Não trocar assets de imagem.
- Não mexer em outras seções (`UniversalBenefits`, `ModelBifurcation`, etc.).
- Não alterar copy.
