## Objetivo

Elevar a apresentação do produto na Hero da landing do HS-98 para algo claramente premium, e reverter a seção "Quatro decisões que mudam o sábado de manhã" ao layout anterior (sem imagem na coluna esquerda), que tinha melhor ritmo visual.

Escopo: apenas `src/components/site/hs98/Hs98Landing.tsx`. Sem mudanças em dados, rotas, copy ou outras seções.

---

## 1. Hero — apresentação Premium do homogeneizador

Hoje a foto do produto fica "solta" sobre um halo simples + reflexo no chão pouco convincente. Vou trocar por uma composição em camadas tipo "studio shot" que a faça respirar e parecer cara.

Mudanças na coluna direita do Hero:

- **Pedestal/palco circular**: anel duplo concêntrico em `border-white/10` + glow radial mais denso em `--accent`, criando a sensação de produto sobre um spotlight de showroom.
- **Spotlight cônico atrás do produto**: gradiente cônico suave girando lentamente (28s) — alinhado com a estética que já existe no fundo do Hero, mas localizado atrás da máquina.
- **Halo principal mais rico**: dois radial-gradients sobrepostos (accent quente + azul frio no rim), em vez do halo único atual. Reforça o efeito cinematográfico já presente no fundo do Hero.
- **Drop shadow do produto**: sombra mais profunda e direcional (não só um blur centralizado), aumentando a sensação de peso/material.
- **Reflexo no chão**: substituído por uma "elipse de contato" sutil (gradiente radial achatado embaixo do produto). O reflexo invertido atual deixa a peça com aspecto duplicado e pouco elegante; uma sombra de contato dá ancoragem sem competir.
- **Floating chip "Pronta entrega"**: redesenhado em vidro mais limpo (border accent leve, micro-texto bem hierarquizado) e revelado também no mobile como bolha menor, para reforçar o "premium pronto pra sair".
- **Selo flutuante adicional** no canto oposto: pequeno badge "NR-12 · INMETRO" em estilo glass, reforçando autoridade técnica sem poluir.
- **Animação de entrada**: a imagem entra com leve scale + fade (já existe), mas o halo/spotlight também ganham `animate-pulse` muito sutil para dar "vida" sem distrair.

Tudo continua usando tokens semânticos (`--accent`, `--border`, `--card`, `--background`, `--foreground`, `--muted-foreground`). Sem cores hardcoded fora do que já existe no arquivo.

---

## 2. "Quatro decisões que mudam o sábado de manhã" — reverter

Reverter a coluna esquerda (`lg:col-span-5`) ao estado anterior à última iteração: apenas título + parágrafo de apoio, **sem o bloco de imagem do produto**. A coluna direita (cards 2x2) continua igual.

Resultado: o ritmo visual volta ao que estava — bloco textual respirando à esquerda, grade de cards densa à direita. A imagem do produto continua presente em peso máximo no Hero (agora redesenhado) e na galeria abaixo, então não há perda de presença visual do equipamento.

---

## Fora de escopo

- Não muda `Showcase`, `Manifesto`, galeria, checkout, FAQ, copy, preço, dados ou rotas.
- Não muda `src/data/hs98.ts` nem `src/data/site.ts` (mudanças anteriores ficam como estão).
- Sem novos assets — usa apenas as imagens já importadas.

## Detalhes técnicos

Arquivo único editado: `src/components/site/hs98/Hs98Landing.tsx`.

- `Hero()`: substituir o bloco `{/* Hero visual */}` (linhas ~120–161) pela nova composição de pedestal + spotlight + dois floating chips.
- `Highlights()`: dentro de `lg:col-span-5 > .lg:sticky`, remover o `<div className="relative mt-10 aspect-square ...">...</div>` (linhas ~232–253). Manter `<h2>` e `<p>`.

Sem novas dependências. `framer-motion` já está em uso no arquivo.
