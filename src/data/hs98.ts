import hero from "@/assets/products/hs-98/hero.png";
import front from "@/assets/products/hs-98/front.png";
import threeQuarter from "@/assets/products/hs-98/three-quarter.png";
import top from "@/assets/products/hs-98/top.png";
import side from "@/assets/products/hs-98/side.png";
import rear from "@/assets/products/hs-98/rear.png";
import bocal from "@/assets/products/hs-98/bocal.png";
import switchImg from "@/assets/products/hs-98/switch.png";
import pedal from "@/assets/products/hs-98/pedal-clean.png";
import internal from "@/assets/products/hs-98/internal-clean.png";

export const HS98_IMAGES = {
  main: hero,
  hero,
  front,
  threeQuarter,
  top,
  side,
  rear,
  bocal,
  switch: switchImg,
  pedal,
  internal,
  // legacy aliases (not referenced in components anymore)
  ambient1: threeQuarter,
  ambient2: front,
  topView: top,
  sideView: side,
  rearView: rear,
  detail7: bocal,
};

export const HS98_GALLERY = [
  { src: hero, alt: "HS-98 vista 3/4 com pedal de acionamento" },
  { src: front, alt: "Vista frontal — painel selado e moedor frontal" },
  { src: threeQuarter, alt: "Perspectiva lateral 3/4 — corpo em inox" },
  { src: side, alt: "Vista lateral — caçamba e cavalete reforçado" },
  { src: top, alt: "Vista superior — caçamba aberta para abastecimento" },
  { src: rear, alt: "Vista traseira — botão de emergência e ventilação" },
  { src: bocal, alt: "Boca e caracol microfundido em inox" },
  { src: internal, alt: "Caçamba interna 41 L — pás homogeneizadoras" },
  { src: switchImg, alt: "Chave geral com bloqueio e selo de segurança" },
  { src: pedal, alt: "Pedal industrial — operação hands-free" },
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
    title: "900 kg/h sem pausa",
    desc: "Aguenta o sábado de manhã inteiro. Sem superaquecer, sem parar a fila do balcão.",
  },
  {
    title: "Inox microfundido",
    desc: "Boca e caracol em inox de fundição. Resistem ao osso, ao tendão e ao ano todo de uso pesado.",
  },
  {
    title: "Mói + homogeneíza",
    desc: "Um ciclo só. A gordura entra na massa, a carne sai vermelha. O cliente decide pelo olho.",
  },
  {
    title: "Motor 3 CV",
    desc: "Torque industrial. Não patina, não esquenta, não compromete a textura do produto.",
  },
];

export const HS98_FEATURES = {
  productivity: [
    "Vermelho uniforme — pronto para a vitrine",
    "Reduz a gordura aparente sem retirar sabor",
    "Operação automática libera o açougueiro",
    "900 kg/h em regime contínuo, sem queda",
  ],
  durability: [
    "Construção 100% em aço inox AISI 304",
    "Boca e caracol em inox microfundido",
    "Cavalete com gaveta para caixas plásticas",
    "Motor industrial 3 CV refrigerado",
  ],
  safety: [
    "Painel selado IP54, intuitivo e firme",
    "Sensor magnético na tampa — para na hora",
    "Trava mecânica de bloqueio das partes móveis",
    "Caçamba 41 L · 31 kg por ciclo",
  ],
};

export const HS98_SPECS = [
  { label: "Produção aproximada", value: "Até 900 kg/h" },
  { label: "Capacidade da caçamba", value: "41 L · 31 kg" },
  { label: "Potência do motor", value: "3 CV" },
  { label: "Tensão", value: "220 V ou 380 V trifásico" },
  { label: "Consumo", value: "2,58 kWh" },
  { label: "Peso líquido", value: "183 kg" },
  { label: "Dimensões (A×L×P)", value: "1.300 × 520 × 1.200 mm" },
  { label: "Conformidade", value: "NR-12 · INMETRO" },
];

export const HS98_COMPARISON = [
  {
    point: "Apresentação no balcão",
    common: "Carne esbranquiçada, gordura aparente",
    hs98: "Vermelho uniforme, gordura na massa",
  },
  {
    point: "Quebra por aspecto ruim",
    common: "5% a 12% do lote vai pra promoção",
    hs98: "Quase 100% sai pelo preço cheio",
  },
  {
    point: "Tempo do açougueiro",
    common: "Parado abastecendo e empurrando carne",
    hs98: "Livre para vender e atender o cliente",
  },
  {
    point: "Volume processado",
    common: "Até 250 kg/h num moedor convencional",
    hs98: "900 kg/h sem perder a textura",
  },
  {
    point: "Fiscalização e NR-12",
    common: "Adaptações improvisadas, multa no risco",
    hs98: "Conjunto patenteado, conformidade total",
  },
];

export const HS98_ROI = {
  headline: "Quanto custa não ter um HS-98?",
  body: "Açougue de 200 kg/dia. Quebra média de 6% por má apresentação. São R$ 11.000 jogados fora todo mês — antes de contar luz, folha e aluguel. O HS-98 fecha essa torneira em menos de uma temporada de alta.",
  bullets: [
    "Recupera margem perdida na quebra de carne",
    "Aumenta o giro no balcão refrigerado",
    "Libera o açougueiro pra vender, não pra empurrar",
    "Acaba com reclamação de aspecto e textura",
  ],
};

export const HS98_FAQ = [
  {
    q: "O HS-98 está em conformidade com a NR-12?",
    a: "Está. Sai com o Conjunto Único de Segurança Skymsen — sensor magnético na tampa e trava mecânica nas partes móveis. Documentação técnica e ART acompanham a nota.",
  },
  {
    q: "Qual a diferença real para um moedor comum?",
    a: "O HS-98 mói e homogeneíza no mesmo ciclo. Distribui a gordura na massa, elimina o aspecto branco e entrega um produto pronto pro auto serviço. Um moedor comum não faz isso, mesmo passando duas vezes — só esquenta a carne.",
  },
  {
    q: "Preciso de instalação especial?",
    a: "Sim: ponto trifásico (220 V ou 380 V) e área refrigerada. A engenharia da Center Frios envia o memorial de infraestrutura antes da entrega — você recebe a máquina pronta pra ligar.",
  },
  {
    q: "Qual o prazo e a assistência?",
    a: "7 dias úteis para capitais, até 12 dias úteis para o interior. Assistência autorizada Skymsen no Brasil todo, com peças originais em estoque na Center Frios.",
  },
  {
    q: "Vocês emitem NF-e e atendem CNPJ?",
    a: "Sempre. NF-e na hora, CNPJ de qualquer porte. Condições especiais para redes, franquias e compras recorrentes.",
  },
];

export const HS98_TESTIMONIAL = {
  quote:
    "Trocamos três moedores comuns por um HS-98. A quebra caiu pra quase zero, o cliente comenta a vitrine. Pagou em quatro meses.",
  author: "Comprador técnico",
  role: "Rede de supermercados — Nordeste",
};
