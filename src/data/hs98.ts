import main from "@/assets/products/hs-98/homogeneizador foto principal.png";
import ambient1 from "@/assets/products/hs-98/homogeneizador inserido em um ambiente de cozinha industrial.png";
import ambient2 from "@/assets/products/hs-98/homogeneizador inserido em um ambiente de cozinha industrial 2.png";
import topView from "@/assets/products/hs-98/Hs98 (6) vista superior completa.png";
import sideView from "@/assets/products/hs-98/Hs98 (8) vista lateral.png";
import rearView from "@/assets/products/hs-98/Hs98 (10)vista traseira.png";
import bocal from "@/assets/products/hs-98/Hs98 (14) bocal.png";
import internal from "@/assets/products/hs-98/vista-interna.png";
import pedal from "@/assets/products/hs-98/pedal.png";
import detail7 from "@/assets/products/hs-98/Hs98 (7).png";

export const HS98_IMAGES = {
  main,
  ambient1,
  ambient2,
  topView,
  sideView,
  rearView,
  bocal,
  internal,
  pedal,
  detail7,
};

export const HS98_GALLERY = [
  { src: main, alt: "HS-98 — vista editorial" },
  { src: ambient1, alt: "HS-98 instalado em cozinha industrial" },
  { src: ambient2, alt: "HS-98 em operação no ambiente de produção" },
  { src: internal, alt: "Caçamba interna em aço inox" },
  { src: bocal, alt: "Boca e caracol em inox microfundido" },
  { src: topView, alt: "Vista superior completa" },
  { src: sideView, alt: "Vista lateral" },
  { src: rearView, alt: "Vista traseira" },
  { src: pedal, alt: "Pedal de acionamento" },
];

export const HS98_PRICE = {
  amount: 32900,
  installments: 12,
  pixDiscountPct: 5,
};

export const HS98_PROOF = [
  { value: "900", unit: "kg/h", label: "Produção contínua" },
  { value: "31", unit: "kg", label: "Por ciclo na caçamba" },
  { value: "3", unit: "CV", label: "Motor industrial" },
  { value: "12", unit: "meses", label: "Garantia em campo" },
];

export const HS98_HIGHLIGHTS = [
  {
    title: "Até 900 kg/h",
    desc: "Produtividade real para alta demanda — pensada para o pico do auto serviço, sem perda de cadência.",
  },
  {
    title: "100% Inox",
    desc: "Boca e caracol em inox microfundido. Estrutura preparada para regime contínuo nos sete dias da semana.",
  },
  {
    title: "Homogeneização",
    desc: "Mói e mistura no mesmo ciclo. A gordura é redistribuída e a carne ganha aquele vermelho que vende sozinho.",
  },
  {
    title: "Motor 3 CV",
    desc: "Torque bruto para processar grandes volumes sem aquecer, sem patinar e sem comprometer a textura.",
  },
];

export const HS98_FEATURES = {
  productivity: [
    "Melhora a apresentação no balcão e na bandeja",
    "Reduz a gordura aparente, valoriza o corte",
    "Operação automática — libera o operador",
    "Processa até 900 kg/h em regime contínuo",
  ],
  durability: [
    "Construção 100% em aço inox",
    "Boca e caracol em inox microfundido",
    "Cavalete com gaveta para caixas plásticas",
    "Motor industrial de 3 CV refrigerado",
  ],
  safety: [
    "Painel de controle intuitivo e selado",
    "Sensor de segurança magnético na tampa",
    "Trava mecânica de bloqueio das partes móveis",
    "Caçamba 41 L / 31 kg por ciclo",
  ],
};

export const HS98_SPECS = [
  { label: "Produção aproximada", value: "Até 900 kg/h" },
  { label: "Capacidade da caçamba", value: "41 L / 31 kg" },
  { label: "Potência do motor", value: "3 CV" },
  { label: "Tensão", value: "220 V ou 380 V (Trifásico)" },
  { label: "Consumo", value: "2,58 kWh" },
  { label: "Peso líquido", value: "183 kg" },
  { label: "Dimensões (A×L×P)", value: "1.300 × 520 × 1.200 mm" },
  { label: "Conformidade", value: "NR-12 · INMETRO" },
];

export const HS98_COMPARISON = [
  {
    point: "Apresentação no balcão",
    common: "Carne com aspecto esbranquiçado, gordura visível",
    hs98: "Vermelho uniforme, gordura distribuída na massa",
  },
  {
    point: "Quebra por má apresentação",
    common: "5% a 12% do lote rebaixado para promoção",
    hs98: "Aproveitamento próximo de 100% do lote",
  },
  {
    point: "Tempo de operação",
    common: "Operador parado abastecendo e empurrando",
    hs98: "Operação automática, operador livre para o atendimento",
  },
  {
    point: "Volume processado",
    common: "Até 250 kg/h em moedores convencionais",
    hs98: "Até 900 kg/h sem perder textura",
  },
  {
    point: "Segurança e fiscalização",
    common: "Adaptações improvisadas para passar na NR-12",
    hs98: "Conjunto de segurança patenteado, conformidade total",
  },
];

export const HS98_ROI = {
  headline: "Quanto custa não ter um HS-98 no seu PDV?",
  body: "Em um açougue que processa 200 kg de carne por dia, uma quebra média de apenas 6% por má apresentação representa cerca de R$ 11.000 por mês jogados fora. O HS-98 paga a si mesmo em menos de uma temporada de alta.",
  bullets: [
    "Recupera margem perdida em quebra de carne",
    "Aumenta o giro de produto no balcão refrigerado",
    "Libera o operador para vender, não para empurrar carne",
    "Reduz reclamação de cliente sobre aspecto e textura",
  ],
};

export const HS98_FAQ = [
  {
    q: "O HS-98 atende a NR-12?",
    a: "Sim. O equipamento é entregue com o Conjunto Único de Segurança Skymsen — sensor magnético na tampa e trava mecânica — em conformidade total com a NR-12. Documentação técnica acompanha a nota.",
  },
  {
    q: "Qual a diferença real para um moedor comum?",
    a: "O HS-98 mói e homogeneíza no mesmo ciclo. Isso elimina o aspecto de carne branca, distribui a gordura uniformemente e entrega um produto pronto para o auto serviço — algo que um moedor convencional não faz, mesmo passando duas vezes.",
  },
  {
    q: "Preciso de instalação especial?",
    a: "Sim, ponto trifásico (220 V ou 380 V) e área refrigerada. Nossa equipe técnica envia o memorial descritivo de infraestrutura antes da entrega para que tudo esteja pronto no dia.",
  },
  {
    q: "Qual o prazo de entrega e como funciona a assistência?",
    a: "Entregamos em até 7 dias úteis para capitais e até 12 dias úteis para o interior. Assistência técnica autorizada Skymsen em todo o Brasil, com peças originais em estoque na Center Frios.",
  },
  {
    q: "Vocês emitem nota fiscal e aceitam compra para CNPJ?",
    a: "Sempre. Toda operação é com NF-e, emissão imediata, e atendemos pessoa jurídica de qualquer porte com condições especiais para redes e franquias.",
  },
];

export const HS98_TESTIMONIAL = {
  quote:
    "Trocamos três moedores comuns por um HS-98 e a quebra de carne caiu para quase zero. O cliente comenta a diferença na vitrine — esse equipamento se pagou em quatro meses.",
  author: "Comprador técnico",
  role: "Rede de supermercados, Nordeste",
};
