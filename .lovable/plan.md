## O que está acontecendo

As imagens **existem** e carregam — o problema é de curadoria, não de acesso. Os arquivos originais do upload estavam com nomes que tinham espaços e parênteses (ex.: `Hs98 (1).png`, `homogeneizador inserido em um ambiente de cozinha industrial.png`), então foram criadas cópias com nomes limpos (`hero.png`, `front.png`, etc.) e o `src/data/hs98.ts` aponta para elas. Tudo carrega normalmente.

O que ficou ruim:

- A `hero.png` atual é um **recorte do produto flutuando em fundo branco** — o mesmo arquivo que está como "foto principal" do catálogo. Visualmente fraco para uma hero de landing premium.
- A galeria está com **10 imagens**, várias redundantes (três ângulos 3/4 muito parecidos, um "pedal sozinho" sem informação, um "rear" que é praticamente um 3/4 invertido).
- As **duas fotos ambientadas** (homogeneizador em cozinha industrial real, com açougueiro e bandejas de carne moída no balcão) **não estão sendo usadas em lugar nenhum** — são as imagens mais fortes do conjunto e estão guardadas.

## Proposta de curadoria

### Hero (substituir)
Trocar a `hero.png` cutout pela **cena de cozinha industrial nº 2** (`homogeneizador inserido em um ambiente de cozinha industrial.png`) — açougueiros trabalhando, bandejas de carne vermelha em primeiro plano, o HS-98 ao centro. É a imagem que vende o produto no contexto real do comprador.

### Galeria (10 → 8 fotos, todas com função clara)

```text
01 Cena ambientada nº 1   → cozinha clean com chef e bandejas (apoio social)
02 3/4 hero com pedal     → Hs98 (1) — a hero atual vira segunda da galeria
03 Vista frontal limpa    → Hs98 (3) — painel selado + moedor centralizado
04 Vista lateral          → Hs98 (8) — perfil completo do conjunto
05 Boca e caracol em inox → Hs98 (14) — close do moedor microfundido
06 Caçamba interna        → internal-clean — pás homogeneizadoras à mostra
07 Chave geral c/ trava   → Hs98 (2) — argumento de NR-12 e segurança
08 Vista traseira c/ pedal→ Hs98 (11) — rodapé/cavalete + pedal hands-free
```

Removidas por redundância: `top.png` (vista superior parcial), `three-quarter.png` (ângulo muito próximo do 3/4 com pedal), `rear.png` (outro 3/4 invertido), `pedal-clean.png` (pouca informação isolada).

### Fora de escopo
- Não mexer no carrossel, lightbox, copy ou layout — só trocar o conjunto de imagens e ajustar os `alt`.
- Não regenerar imagens nem gerar novas via IA.

## Detalhes técnicos

1. Em `src/data/hs98.ts`:
   - Importar a cena ambientada como `ambientKitchen` (copiando o arquivo para `src/assets/products/hs-98/ambient-kitchen.png` para evitar o nome com espaços no import).
   - Importar a segunda cena como `ambientButchers` para usar como `HS98_IMAGES.main` (hero).
   - Reduzir `HS98_GALLERY` para os 8 itens listados, na ordem acima, com `alt` revisado.
   - Atualizar `HS98_IMAGES.hero` e `.main` para apontar para `ambientButchers`.

2. Nenhum componente precisa mudar — `Hs98Landing.tsx` e `Hs98Gallery.tsx` consomem `HS98_IMAGES.main` e `HS98_GALLERY`, então a troca propaga sozinha.

3. Os arquivos antigos (`hero.png`, `top.png`, `three-quarter.png`, `rear.png`, `pedal-clean.png`) ficam no disco mas deixam de ser referenciados — sem impacto no bundle (Vite só inclui o que é importado).
