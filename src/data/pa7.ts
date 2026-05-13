import main from "@/assets/products/pa7-pro/main.png";
import img01 from "@/assets/products/pa7-pro/01.png";
import img06 from "@/assets/products/pa7-pro/06.png";
import img07 from "@/assets/products/pa7-pro/07.png";
import img09 from "@/assets/products/pa7-pro/09.png";
import img10 from "@/assets/products/pa7-pro/10.png";
import img14 from "@/assets/products/pa7-pro/14.png";
import img19 from "@/assets/products/pa7-pro/19.png";
import img20 from "@/assets/products/pa7-pro/20.png";
import img23 from "@/assets/products/pa7-pro/23.png";

export const PA7_IMAGES = {
  main,
  img01,
  img06,
  img07,
  img09,
  img10,
  img14,
  img19,
  img20,
  img23,
};

export const PA7_GALLERY = [
  { src: main, alt: "PA7 Pro Skymsen — vista lateral com bocal de alimentação" },
  { src: img06, alt: "PA7 Pro Skymsen — vista frontal com tampa fechada" },
  { src: img10, alt: "PA7 Pro Skymsen — perfil mostrando saída de processamento" },
  { src: img14, alt: "PA7 Pro Skymsen — visão superior do bocal e cuba inox" },
  { src: img20, alt: "PA7 Pro Skymsen — câmara de processamento aberta" },
];

export const PA7_PRICE = {
  // Preço fictício para visual do checkout. Trocar quando integrar gateway.
  amount: 4490,
  installments: 12,
  pixDiscountPct: 5,
};

export const PA7_HIGHLIGHTS = [
  {
    title: "Até 250 kg/h",
    desc: "Capacidade contínua de processamento — sustenta a produção das cozinhas que não podem parar nos horários de pico.",
  },
  {
    title: "07 discos com suporte",
    desc: "Fatiadores E1 e E3, raladores V, Z3, Z5 e Z8 e julienne H7 acompanham o equipamento, prontos para uso.",
  },
  {
    title: "Sensor de segurança",
    desc: "Trava na tampa interrompe o motor automaticamente — operação segura em conformidade com a NR-12.",
  },
  {
    title: "Bivolt 127/220 V",
    desc: "Chave seletora integrada permite instalar em qualquer unidade da rede sem necessidade de transformador.",
  },
];

export const PA7_SHOWCASE = [
  {
    image: img06,
    eyebrow: "Engenharia robusta",
    title: "Construído para regime contínuo",
    body:
      "Estrutura em aço inox com câmara injetada e motor de 0,5 HP-CV calibrado para 600 W de potência nominal a 440 rpm — performance estável em horas seguidas de operação.",
  },
  {
    image: img20,
    eyebrow: "Higienização rápida",
    title: "Tampa removível, limpeza sem ferramentas",
    body:
      "Câmara de processamento com tampa removível e bocal extra largo. Troca de discos e limpeza profunda em segundos — atende aos requisitos sanitários da RDC 216.",
  },
  {
    image: img14,
    eyebrow: "Versatilidade",
    title: "Fatia, rala e corta em julienne",
    body:
      "Disco de 203 mm com bocal extra largo e empurrador cilíndrico em movimento único de alimentação. Fatia, rala fino e grosso e corta em palitos — e ainda aceita grades de cubo opcionais.",
  },
];

export const PA7_INCLUDED_DISCS = [
  { code: "E1", group: "Fatiador", desc: "1 mm" },
  { code: "E3", group: "Fatiador", desc: "3 mm" },
  { code: "V", group: "Ralador fino", desc: "Queijo, coco" },
  { code: "Z3", group: "Ralador", desc: "3 mm" },
  { code: "Z5", group: "Ralador", desc: "5 mm" },
  { code: "Z8", group: "Ralador", desc: "8 mm" },
  { code: "H7", group: "Julienne", desc: "7 × 7 mm" },
];

export const PA7_USE_CASES = [
  {
    icon: "Pizza",
    name: "Pizzaria",
    discs: ["E1", "E3", "V", "Z8"],
    desc: "Fatias finas de tomate, calabresa e cebola, e queijos ralados na medida certa.",
  },
  {
    icon: "Beef",
    name: "Hamburgueria",
    discs: ["E2", "E3", "E8", "H10", "W3"],
    desc: "Cebola caramelizada, picles, alface e batata em palitos para acompanhamentos premium.",
  },
  {
    icon: "Salad",
    name: "Buffet livre",
    discs: ["E2", "E3", "E5", "GC8 PRO", "H10", "Z8"],
    desc: "Saladas variadas, cubos uniformes para vinagrete e raspas decorativas em alta produção.",
  },
  {
    icon: "Carrot",
    name: "Seleta de legumes",
    discs: ["E1", "E3", "KC10", "KC14", "W3", "Z5"],
    desc: "Mix de legumes em cubos médios e grandes, com cortes ondulados e raladuras finas.",
  },
];

export const PA7_FAQ = [
  {
    q: "O equipamento é bivolt?",
    a: "Sim. O PA7 Pro Skymsen é bivolt (127/220 V) com chave seletora integrada — basta posicionar a chave na tensão da sua unidade antes de ligar.",
  },
  {
    q: "Quais discos vêm inclusos?",
    a: "Acompanha 07 discos com suporte: E1 e E3 (fatiadores 1 e 3 mm), V (ralador fino), Z3, Z5 e Z8 (raladores 3, 5 e 8 mm) e H7 (julienne 7 × 7 mm).",
  },
  {
    q: "É possível cortar em cubos?",
    a: "Sim. Combinando uma grade de cubo opcional (GC8, GC10, GC14 ou GC20 PRO) com um disco fatiador, o PA7 Pro corta em cubos uniformes — ideal para vinagrete, seleta de legumes e frutas.",
  },
  {
    q: "Qual é a capacidade real?",
    a: "Produção aproximada de 250 kg/h, com motor de 0,5 HP-CV (600 W) a 440 rpm. Disco de 203 mm de diâmetro e bocal extra largo aceleram a alimentação.",
  },
  {
    q: "Qual é a garantia?",
    a: "12 meses de garantia de fábrica Skymsen. A Center Frios oferece suporte técnico próprio em campo durante e após o período de garantia.",
  },
  {
    q: "Vocês emitem nota fiscal e atendem CNPJ?",
    a: "Sim. Operamos exclusivamente B2B com emissão de nota fiscal, condições especiais para CNPJ e atendimento técnico consultivo.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Entregamos em todo o Brasil com transportadoras parceiras. Prazo e valor do frete são calculados pelo CEP no checkout. Peso bruto: 29,70 kg.",
  },
  {
    q: "Posso parcelar?",
    a: "Sim. O checkout aceita cartão de crédito em até 12x sem juros, além de PIX (com desconto), boleto e transferência bancária.",
  },
];

export const PA7_BANK = {
  bank: "Banco do Brasil",
  agency: "0001-2",
  account: "12345-6",
  cnpj: "00.000.000/0001-00",
  holder: "Center Frios Comércio Ltda.",
  pixKey: "marketing@centerfrios.com",
};
