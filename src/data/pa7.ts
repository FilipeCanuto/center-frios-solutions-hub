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
    desc: "Capacidade contínua para cozinhas que não podem parar nos horários de pico.",
  },
  {
    title: "07 discos inclusos",
    desc: "Corta, rala, fatia e desfia hortifrúti, queijos e proteínas com uniformidade profissional.",
  },
  {
    title: "Inox AISI 304",
    desc: "Construção robusta, fácil higienização e resistência ao uso intensivo diário.",
  },
  {
    title: "Conforme NR-12",
    desc: "Sistema de segurança com chave geral e proteções para operação tranquila.",
  },
];

export const PA7_SHOWCASE = [
  {
    image: img06,
    eyebrow: "Engenharia robusta",
    title: "Construído para regime contínuo",
    body:
      "Estrutura monobloco em aço inox AISI 304 e motor calibrado para operar horas a fio sem perda de performance — o equipamento ideal para restaurantes, refeitórios e redes em alta produção.",
  },
  {
    image: img20,
    eyebrow: "Acesso rápido",
    title: "Higienização em minutos",
    body:
      "Câmara de processamento com abertura ampla e acabamento sanitário. Troca de discos e limpeza profunda sem ferramentas — atende aos requisitos da RDC 216.",
  },
  {
    image: img14,
    eyebrow: "Versatilidade",
    title: "Sete cortes profissionais em um só equipamento",
    body:
      "Discos para fatiar, ralar grosso e fino, cortar em cubos, desfiar e raspar. Substitui múltiplos equipamentos no pré-preparo, ganha espaço e padroniza o resultado.",
  },
];

export const PA7_FAQ = [
  {
    q: "O equipamento é compatível com 127 V e 220 V?",
    a: "Sim. O PA7 Pro Skymsen está disponível nas duas tensões. Confirme a tensão da sua operação no momento do pedido.",
  },
  {
    q: "Quais discos vêm inclusos?",
    a: "São 07 discos inclusos para fatiar, ralar (grosso/fino), cortar em cubos, desfiar e raspar — atendendo as principais necessidades do pré-preparo profissional.",
  },
  {
    q: "Qual é a garantia?",
    a: "12 meses de garantia de fábrica. A Center Frios oferece suporte técnico próprio em campo para acionamentos durante o período de garantia.",
  },
  {
    q: "Vocês emitem nota fiscal e atendem CNPJ?",
    a: "Sim. Operamos exclusivamente B2B com emissão de nota fiscal, condições especiais para CNPJ e atendimento técnico consultivo.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Entregamos em todo o Brasil com transportadoras parceiras. O prazo e o valor do frete são calculados pelo CEP no checkout.",
  },
  {
    q: "Posso parcelar?",
    a: "Sim. O checkout aceita cartão de crédito em até 12x, além de PIX (com desconto), boleto e transferência bancária.",
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
