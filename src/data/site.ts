import heroImg from "@/assets/hero-equipamentos.jpg";
import pa7 from "@/assets/products/pa7-pro/main.png";
import hs98 from "@/assets/products/hs-98/homogeneizador foto principal.png";
import amp40 from "@/assets/produto-amp40.jpg";
import climatizador from "@/assets/produto-climatizador.jpg";
import segSupermercados from "@/assets/seg-supermercados.jpg";
import segRestaurantes from "@/assets/seg-restaurantes.jpg";
import segRedes from "@/assets/seg-redes.jpg";
import segCozinhas from "@/assets/seg-cozinhas.jpg";
import segHoteis from "@/assets/seg-hoteis.jpg";

export const CONTACT = {
  phone: "82 3223-2497",
  phoneHref: "tel:+558232232497",
  whatsappHref: "https://wa.me/558232232497",
  email: "marketing@centerfrios.com",
  emailHref: "mailto:marketing@centerfrios.com",
  instagram: "@centerfriosoficial",
  instagramHref: "https://instagram.com/centerfriosoficial",
  city: "Maceió, Alagoas — Brasil",
};

export const IMAGES = {
  hero: heroImg,
};

export type Segment = {
  slug: string;
  name: string;
  short: string;
  description: string;
  benefits: string[];
  image: string;
  recommendedProducts: string[]; // product slugs
};

export const SEGMENTS: Segment[] = [
  {
    slug: "supermercados",
    name: "Supermercados e Mercearias",
    short: "Refrigeração de alta eficiência para varejo alimentar.",
    description:
      "Soluções de exposição e armazenamento que mantêm a cadeia de frio inalterada, reduzem perdas e respondem ao alto giro do varejo.",
    benefits: [
      "Eficiência energética para operações 24/7",
      "Câmaras frias e ilhas com baixa manutenção",
      "Padronização técnica para múltiplas lojas",
    ],
    image: segSupermercados,
    recommendedProducts: ["climatizador-tudo-brisa", "balcao-refrigerado", "camara-fria-modular"],
  },
  {
    slug: "bares-restaurantes",
    name: "Bares, Restaurantes e Lanchonetes",
    short: "Equipamentos que sustentam o pico do salão.",
    description:
      "Da preparação ao serviço, equipamentos robustos para cozinhas que não podem parar nem nos horários mais críticos.",
    benefits: [
      "Agilidade no pré-preparo de larga escala",
      "Robustez para regime contínuo de trabalho",
      "Facilidade de higienização e manutenção",
    ],
    image: segRestaurantes,
    recommendedProducts: [
      "processador-pa7-pro-skymsen",
      "abridora-de-massa-amp40",
      "fritadeira-industrial",
    ],
  },
  {
    slug: "redes-franquias",
    name: "Redes e Franquias",
    short: "Padronização técnica para operações em escala.",
    description:
      "Projetos replicáveis com equipamentos calibrados para garantir o mesmo padrão de produção em todas as unidades da sua rede.",
    benefits: [
      "Especificação padronizada por unidade",
      "Suporte técnico próprio em campo",
      "Reposição rápida de peças críticas",
    ],
    image: segRedes,
    recommendedProducts: ["processador-pa7-pro-skymsen", "forno-de-lastro", "balcao-refrigerado"],
  },
  {
    slug: "cozinhas-industriais",
    name: "Cozinhas Industriais e Refeitórios",
    short: "Robustez extrema para alta produção.",
    description:
      "Hospitais, escolas, usinas e refeitórios industriais: equipamentos preparados para servir centenas de refeições por dia, todos os dias.",
    benefits: [
      "Capacidade volumétrica elevada",
      "Conformidade com normas sanitárias (RDC 216 / NR-36)",
      "Operação contínua sem queda de performance",
    ],
    image: segCozinhas,
    recommendedProducts: ["processador-pa7-pro-skymsen", "masseira-espiral", "camara-fria-modular"],
  },
  {
    slug: "hoteis",
    name: "Hotéis e Pousadas",
    short: "Bastidores impecáveis para a hospitalidade.",
    description:
      "Equipamentos silenciosos, eficientes e elegantes para suportar buffets, room service e a operação ininterrupta da hospedagem.",
    benefits: [
      "Operação silenciosa para áreas próximas aos hóspedes",
      "Acabamento premium em inox AISI 304",
      "Eficiência energética para reduzir custo operacional",
    ],
    image: segHoteis,
    recommendedProducts: ["balcao-refrigerado", "climatizador-tudo-brisa", "fritadeira-industrial"],
  },
];

export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription?: string;
  image?: string;
  highlight?: boolean;
  detailed: boolean;
  specs: Spec[];
  applications?: string[];
  compliance?: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "processador-pa7-pro-skymsen",
    name: "Processador de Alimentos PA7 Pro Skymsen",
    category: "Processamento",
    tagline: "O melhor que a sua cozinha merece.",
    description:
      "Cortes precisos e sem esforço, alta produtividade e grande variedade de cortes — agora também em cubos e palitos (julienne).",
    longDescription:
      "O PA7 Pro Skymsen entrega até 250 kg/h de processamento contínuo com motor de 0,5 HP-CV, câmara injetada e construção em aço inox. Acompanha 07 discos com suporte (fatiadores, raladores e julienne) e aceita grades de cubo opcionais — substitui múltiplos equipamentos no pré-preparo profissional.",
    image: pa7,
    highlight: true,
    detailed: true,
    specs: [
      { label: "Produção aproximada", value: "Até 250 kg/h" },
      { label: "Potência nominal", value: "600 W" },
      { label: "Motor", value: "0,5 HP-CV" },
      { label: "Rotação", value: "440 rpm" },
      { label: "Diâmetro do disco", value: "203 mm" },
      { label: "Tensão / frequência", value: "Bivolt 127/220 V · 60 Hz" },
      { label: "Consumo", value: "0,6 kWh" },
      { label: "Dimensões (A×L×P)", value: "590 × 325 × 520 mm" },
      { label: "Embalagem (A×L×P)", value: "640 × 400 × 620 mm" },
      { label: "Peso líquido / bruto", value: "25,70 kg / 29,70 kg" },
      { label: "NCM / EAN-13", value: "84386000 · 7895707702608" },
      { label: "Origem / Garantia", value: "Indústria Brasileira · 12 meses" },
    ],
    applications: [
      "Restaurantes e bares com produção contínua",
      "Pizzarias, hamburguerias e operações de delivery",
      "Buffets livres, refeitórios e cozinhas industriais",
      "Redes e franquias com padronização de pré-preparo",
    ],
    compliance: [
      "Construção em aço inox em conformidade com NR-12",
      "Sensor de segurança na tampa interrompe o motor automaticamente",
      "Materiais aprovados para contato com alimentos (RDC 91)",
      "Bivolt 127/220 V com chave seletora integrada",
    ],
  },
  {
    slug: "moedor-homogeneizador-hs-98",
    name: "Moedor Homogeneizador HS-98 Skymsen",
    category: "Processamento de Carnes",
    tagline: "Mais que um moedor de carne.",
    description:
      "Mistura e mói simultaneamente, aumentando a produtividade e qualidade do auto serviço.",
    longDescription:
      "Ideal para grandes produções com capacidade de até 900 kg/h. Operação automática que libera o operador e sistema de homogeneização que reduz a gordura aparente, agregando valor final ao produto.",
    image: hs98,
    highlight: true,
    detailed: true,
    specs: [
      { label: "Produção aproximada", value: "Até 900 kg/h" },
      { label: "Capacidade da caçamba", value: "41 L / 31 kg" },
      { label: "Potência motor", value: "3 CV" },
      { label: "Tensão", value: "220V ou 380V (Trifásico)" },
      { label: "Peso Líquido", value: "183 kg" },
      { label: "Garantia", value: "12 meses" },
    ],
    applications: [
      "Açougues de alto volume",
      "Supermercados e hipermercados",
      "Indústrias de embutidos",
      "Cozinhas industriais de grande escala",
    ],
    compliance: [
      "Segurança INMETRO",
      "Certificação UL",
      "Conformidade NR-12",
      "Patente de conjunto de segurança exclusivo",
    ],
  },
  {
    slug: "abridora-de-massa-amp40",
    name: "Abridora de Massa de Pizza AMP40",
    category: "Panificação & Pizzaria",
    tagline: "Otimize a produção de pizzas com precisão milimétrica.",
    description:
      "Cilindros de aço inox que abrem discos de massa uniformes em segundos, eliminando o gargalo do preparo manual.",
    longDescription:
      "A AMP40 garante espessura regulável e abertura consistente, transformando a produção de pizzas em um processo previsível. Construção robusta em inox para resistir ao uso intenso e facilitar a limpeza diária.",
    image: amp40,
    highlight: true,
    detailed: true,
    specs: [
      { label: "Diâmetro de abertura", value: "Até 400 mm" },
      { label: "Espessura", value: "Regulável de 1 a 10 mm" },
      { label: "Cilindros", value: "Aço inox AISI 304" },
      { label: "Motor", value: "0,5 CV" },
      { label: "Produção", value: "Até 600 discos/hora" },
      { label: "Garantia", value: "12 meses" },
    ],
    applications: [
      "Pizzarias com alto volume de produção",
      "Redes e franquias de fast food",
      "Operações de delivery em horário de pico",
    ],
    compliance: [
      "Conformidade com NR-12 (segurança em máquinas)",
      "Materiais aptos para contato com alimentos",
      "Estrutura de fácil higienização (RDC 216)",
    ],
  },
  {
    slug: "climatizador-tudo-brisa",
    name: "Climatizador de Ambientes Tudo Brisa",
    category: "Climatização Industrial",
    tagline: "Mantenha sua operação produtiva em qualquer temperatura.",
    description:
      "Climatização evaporativa de alta vazão para cozinhas, áreas produtivas e ambientes onde o ar-condicionado convencional não é viável.",
    longDescription:
      "O Tudo Brisa entrega conforto térmico imediato com baixíssimo consumo de energia. Ideal para áreas amplas, cozinhas profissionais e galpões — mantém colaboradores produtivos e reduz a temperatura de operação.",
    image: climatizador,
    highlight: true,
    detailed: true,
    specs: [
      { label: "Vazão de ar", value: "18.000 m³/h" },
      { label: "Área de cobertura", value: "Até 150 m²" },
      { label: "Reservatório", value: "60 litros" },
      { label: "Consumo", value: "Até 90% menor que ar-condicionado" },
      { label: "Estrutura", value: "Polietileno de alta resistência" },
      { label: "Garantia", value: "12 meses" },
    ],
    applications: [
      "Cozinhas industriais e refeitórios",
      "Galpões, depósitos e áreas de produção",
      "Bares e restaurantes com varanda",
    ],
    compliance: [
      "Baixo consumo energético (NBR 16401)",
      "Sem uso de gases refrigerantes",
      "Filtro lavável de fácil manutenção",
    ],
  },
  // ——— Catálogo placeholder ———
  {
    slug: "forno-de-lastro",
    name: "Forno de Lastro Profissional",
    category: "Cocção",
    tagline: "Cocção uniforme para panificação e pizzaria.",
    description:
      "Câmaras independentes em pedra refratária para resultado profissional em pães artesanais e pizzas.",
    detailed: false,
    specs: [
      { label: "Câmaras", value: "2 a 4" },
      { label: "Temperatura", value: "Até 350 °C" },
    ],
  },
  {
    slug: "camara-fria-modular",
    name: "Câmara Fria Modular",
    category: "Refrigeração",
    tagline: "Armazenamento em escala com isolamento de alta performance.",
    description:
      "Estrutura modular com painéis isotérmicos e unidade condensadora dimensionada para o seu volume.",
    detailed: false,
    specs: [
      { label: "Painéis", value: "100 mm PUR" },
      { label: "Faixa térmica", value: "+5 °C a -22 °C" },
    ],
  },
  {
    slug: "balcao-refrigerado",
    name: "Balcão Refrigerado",
    category: "Refrigeração",
    tagline: "Conservação e exposição em um único equipamento.",
    description:
      "Vidros panorâmicos, iluminação interna e controle digital de temperatura para varejo e self-service.",
    detailed: false,
    specs: [
      { label: "Comprimento", value: "1,5 m a 3,0 m" },
      { label: "Temperatura", value: "+2 °C a +8 °C" },
    ],
  },
  {
    slug: "fritadeira-industrial",
    name: "Fritadeira Industrial Inox",
    category: "Cocção",
    tagline: "Alta vazão de fritura com controle preciso.",
    description:
      "Cubas independentes em inox com filtragem de óleo e termostato de precisão para uso intensivo.",
    detailed: false,
    specs: [
      { label: "Cubas", value: "1 ou 2" },
      { label: "Capacidade", value: "10 a 25 L por cuba" },
    ],
  },
  {
    slug: "liquidificador-industrial",
    name: "Liquidificador Industrial",
    category: "Processamento",
    tagline: "Trituração contínua para sucos, sopas e massas.",
    description:
      "Copo em inox monobloco e motor reforçado para regime de trabalho contínuo em cozinhas profissionais.",
    detailed: false,
    specs: [
      { label: "Capacidade", value: "2 a 25 L" },
      { label: "Motor", value: "Alta rotação" },
    ],
  },
  {
    slug: "masseira-espiral",
    name: "Masseira Espiral",
    category: "Panificação & Pizzaria",
    tagline: "Massas mais bem desenvolvidas em menos tempo.",
    description:
      "Movimento espiral que respeita a rede de glúten e reduz o tempo total de batimento da massa.",
    detailed: false,
    specs: [
      { label: "Capacidade", value: "10 kg a 50 kg" },
      { label: "Velocidades", value: "2 (lenta e rápida)" },
    ],
  },
];

export const FEATURED_PRODUCT_SLUGS = [
  "processador-pa7-pro-skymsen",
  "moedor-homogeneizador-hs-98",
  "abridora-de-massa-amp40",
  "climatizador-tudo-brisa",
];

export const SEGMENT_NAMES: Record<string, string> = SEGMENTS.reduce(
  (acc, s) => ({ ...acc, [s.slug]: s.name }),
  {} as Record<string, string>,
);

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs.map(getProduct).filter(Boolean) as Product[];
}
