import main from "@/assets/products/hs-98/Hs98 (1).png";
import img3 from "@/assets/products/hs-98/Hs98 (3).png";
import img5 from "@/assets/products/hs-98/Hs98 (5).png";
import topView from "@/assets/products/hs-98/Hs98 (6) vista superior completa.png";
import img7 from "@/assets/products/hs-98/Hs98 (7).png";
import sideView from "@/assets/products/hs-98/Hs98 (8) vista lateral.png";
import img9 from "@/assets/products/hs-98/Hs98 (9).png";
import pedal from "@/assets/products/hs-98/pedal.png";
import internal from "@/assets/products/hs-98/vista-interna.png";

export const HS98_IMAGES = {
  main,
  img3,
  img5,
  topView,
  img7,
  sideView,
  img9,
  pedal,
  internal,
};

export const HS98_GALLERY = [
  { src: main, alt: "Moedor HS-98 Skymsen — vista principal" },
  { src: topView, alt: "Moedor HS-98 Skymsen — vista superior completa" },
  { src: sideView, alt: "Moedor HS-98 Skymsen — vista lateral" },
  { src: internal, alt: "Moedor HS-98 Skymsen — vista interna da ca\u00E7amba" },
  { src: pedal, alt: "Moedor HS-98 Skymsen — pedal de acionamento" },
];

export const HS98_PRICE = {
  amount: 32900, // Pre\u00E7o base estimado para visual
  installments: 12,
  pixDiscountPct: 5,
};

export const HS98_HIGHLIGHTS = [
  {
    title: "At\u00E9 900 kg/h",
    desc: "Alta produtividade para grandes opera\u00E7\u00F5es — ideal para venda no auto servi\u00E7o.",
  },
  {
    title: "100% Inox",
    desc: "Constru\u00E7\u00E3o robusta com boca e caracol em inox microfundido para durabilidade extrema.",
  },
  {
    title: "Homogeneiza\u00E7\u00E3o",
    desc: "Mistura e mói simultaneamente, reduzindo a gordura aparente e melhorando a apresenta\u00E7\u00E3o.",
  },
  {
    title: "Motor 3 CV",
    desc: "Pot\u00EAncia bruta para processar grandes volumes sem perda de performance.",
  },
];

export const HS98_FEATURES = {
  productivity: [
    "Melhora a apresenta\u00E7\u00E3o do produto final",
    "Reduz a gordura aparente da carne",
    "Opera\u00E7\u00E3o autom\u00E1tica (operador livre)",
    "Processa at\u00E9 900 kg/h"
  ],
  durability: [
    "Constru\u00E7\u00E3o 100% em a\u00E7o inox",
    "Boca e caracol em inox microfundido",
    "Cavalete com gaveta para caixas",
    "Motor potente de 3 CV"
  ],
  safety: [
    "Painel de controle intuitivo",
    "Sensor de seguran\u00E7a na tampa",
    "Trava de seguran\u00E7a mec\u00E2nica",
    "Ca\u00E7amba de 41 L / 31 kg"
  ]
};

export const HS98_SPECS = [
  { label: "Produ\u00E7\u00E3o aproximada", value: "At\u00E9 900 kg/h" },
  { label: "Capacidade da ca\u00E7amba", value: "41 L / 31 kg" },
  { label: "Pot\u00EAncia motor", value: "3 CV" },
  { label: "Tens\u00E3o", value: "220V ou 380V (Trif\u00E1sico)" },
  { label: "Consumo", value: "2,58 kWh" },
  { label: "Peso L\u00EDquido", value: "183 kg" },
  { label: "Dimens\u00F5es (A\u00D7L\u00D7P)", value: "1.300 \u00D7 520 \u00D7 1.200 mm" },
];
