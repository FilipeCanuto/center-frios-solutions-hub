## Escopo

Atualizar **somente** o conteúdo da landing `/produtos/processador-pa7-pro-skymsen` com as informações reais do flyer Skymsen. Layout, componentes, checkout e sistema de design ficam intactos — só troca de copy/dados + duas seções novas que o flyer pede.

## Conteúdo extraído do flyer (será aplicado)

**Headline / claim oficial**
- "O melhor que a sua cozinha merece"
- Subheadline: "Cortes precisos e sem esforço, alta produtividade e grande variedade de cortes — agora também em cubos e palitos (julienne)."

**Diferenciais (8 do flyer, vou consolidar em 4 cards visuais e listar o restante)**
- Construção em aço inox · Câmara injetada · Tampa removível
- Bocal extra largo + empurrador cilíndrico
- Movimento único de alimentação
- Sensor de segurança na tampa
- Bivolt com chave seletora
- 7 discos com suporte inclusos

**Discos inclusos (7)** — E1 (fatiador 1mm), E3 (fatiador 3mm), V (ralador fino), Z3, Z5, Z8 (raladores), H7 (julienne 7×7mm)

**Specs reais (substitui os placeholders atuais)**
- Tensão: 127/220 V (bivolt com chave) · 60 Hz
- Potência nominal: 600 W
- Motor: 0,5 HP-CV
- Consumo: 0,6 kWh
- Rotação: 440 rpm
- Diâmetro do disco: 203 mm
- Produção: até 250 kg/h
- Dimensões: 590 × 325 × 520 mm (A×L×P)
- Embalagem: 640 × 400 × 620 mm
- Peso: 25,70 kg (líquido) / 29,70 kg (bruto)
- NCM: 84386000 · EAN: 7895707702608
- Origem: Indústria Brasileira · Garantia 12 meses

**Aplicações por segmento (do flyer "discos ideais para o seu negócio")**
- Pizzaria, Hamburgueria, Buffet livre, Seleta de legumes — cada um com os discos recomendados.

## Mudanças na página

### 1. Trocar texto/dados existentes (sem mexer no layout)
- Hero: novo H1, subheadline e bullets → claim oficial + 3 bullets reescritos.
- Trust strip: ajustar para "Bivolt 127/220V", "Indústria Brasileira", "Garantia 12m", "NR-12".
- Highlights (4 cards glass): reescritos com 250 kg/h, 7 discos, sensor de segurança, inox AISI 304.
- Showcase parallax (3 blocos): copy reescrito alinhado ao discurso Skymsen.
- Specs grid: substituir todas as 6 specs atuais pelas 11 do flyer.
- FAQ: adicionar pergunta sobre cubos/julienne e atualizar tensão.

### 2. Seções novas

**A. "Discos inclusos" (após Highlights)**
Grid com os 7 discos (E1, E3, V, Z3, Z5, Z8, H7). Cada card mostra um thumbnail do disco extraído do flyer + código + descrição (ex.: "E3 — Fatiador 3 mm"). Glassmorfismo + hover lift, mesmo idioma visual.

**B. "Ideal para o seu negócio" (antes do FAQ)**
4 cards (Pizzaria, Hamburgueria, Buffet livre, Seleta de legumes) listando os discos recomendados como chips. Cada card com ícone Lucide (Pizza, Beef, Salad, Carrot).

**C. Mini-banner "Acessórios opcionais" (curto, dentro de B ou após specs)**
Linha discreta mencionando "grades de cubo (8/10/14/20mm) e fatiadores adicionais disponíveis sob consulta". Sem entrar em catálogo completo de acessórios — mantém foco no PA7.

### 3. Imagens do flyer
- Copio os 7 thumbnails dos discos inclusos (`page_2_image_*`) para `src/assets/products/pa7-pro/discos/` e uso na seção "Discos inclusos".
- Não substituo as fotos principais do produto (já são as 10 que você enviou).

### 4. Pequenos ajustes
- `src/data/site.ts` PA7: atualiza `specs`, `tagline`, `description`, `longDescription`, `applications`, `compliance` com texto do flyer (também impacta o catálogo).
- `src/data/pa7.ts`: atualiza `PA7_HIGHLIGHTS`, `PA7_SHOWCASE`, `PA7_FAQ`; adiciona `PA7_INCLUDED_DISCS` e `PA7_USE_CASES`.

## Fora de escopo
- Preço real (mantenho o mock R$ 4.490).
- Catálogo completo de acessórios opcionais (kits, grades de cubo, etc.).
- Mudanças em qualquer outra página, header, footer.
- Integração de pagamento real.

## Próximo passo
Aprovado o plano, implemento direto: copio os thumbnails do flyer, atualizo os dois arquivos de dados, ajusto o hero e adiciono as duas seções novas dentro do `Pa7ProLanding.tsx` existente.