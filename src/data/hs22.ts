import heroMain from "@/assets/products/hs-22/HS-22CC (3).png";
import ambientKitchen from "@/assets/products/hs-22/A_professional_restaurant_kitchen_setting_with_an_-1758822845916.png";
import ambientButchers from "@/assets/products/hs-22/A_stainless_steel_commercial-grade_meat_grinder_e-1758821196563.png";
import pedalDetail from "@/assets/products/hs-22/HS-22CC (16).png";
import bocalDetail from "@/assets/products/hs-22/HS-22CC (17).png";
import panelDetail from "@/assets/products/hs-22/HS-22CC (18).png";
import rearDetail from "@/assets/products/hs-22/HS-22CC (21).png";
import side1 from "@/assets/products/hs-22/HS-22CC (1).png";
import side2 from "@/assets/products/hs-22/HS-22CC (2).png";
import side3 from "@/assets/products/hs-22/HS-22CC (3).png";
import side5 from "@/assets/products/hs-22/HS-22CC (5).png";
import side7 from "@/assets/products/hs-22/HS-22CC (7).png";

export const HS22_IMAGES = {
  main: heroMain,
  hero: heroMain,
  heroMain,
  ambientKitchen,
  ambientButchers,
  pedalDetail,
  bocalDetail,
  panelDetail,
  rearDetail,
  side1,
  side2,
  side3,
  side5,
  side7,
};

// Preço ainda não definido pelo time comercial.
// Quando informado, mudar para { amount, installments, pixDiscountPct }.
export const HS22_PRICE: {
  amount: number;
  installments: number;
  pixDiscountPct: number;
} | null = null;

export const HS22_NICKNAME = "O Monstro Compacto";

export const HS22_AUDIENCE = "Açougues gourmet e supermercados de médio porte";

export const HS22_DIFF =
  "Tampa em policarbonato transparente — o gerente vê a textura da carne em tempo real";

export const HS22_QUICK_SPECS = [
  { label: "Produção", value: "600 kg/h" },
  { label: "Caçamba", value: "22 L · 16 kg" },
  { label: "Bocal", value: "Boca 22" },
  { label: "Motor", value: "2 CV" },
];

export const HS22_SPECS = [
  { label: "Produção aproximada", value: "Até 600 kg/h" },
  { label: "Capacidade da caçamba", value: "22 L · 16 kg" },
  { label: "Potência do motor", value: "2 CV" },
  { label: "Tensão", value: "220 V ou 380 V trifásico" },
  { label: "Consumo", value: "1,72 kWh" },
  { label: "Peso líquido", value: "115 kg" },
  { label: "Dimensões (A×L×P)", value: "1.255 × 480 × 990 mm" },
  { label: "Conformidade", value: "NR-12 · INMETRO" },
];

export const HS22_GALLERY = [
  { src: ambientKitchen, alt: "Cozinha profissional de alta performance" },
  { src: pedalDetail, alt: "Pedal de acionamento — operação mãos livres" },
  { src: bocalDetail, alt: "Boca e caracol em inox microfundido" },
  { src: panelDetail, alt: "Painel intuitivo e tampa transparente" },
  { src: rearDetail, alt: "Sensores de segurança e botão de emergência" },
  { src: ambientButchers, alt: "Durabilidade e higiene no padrão internacional" },
];

export const HS22_FEATURES = {
  productivity: [
    "Vermelho uniforme — pronto para a vitrine",
    "Reduz a gordura aparente sem retirar sabor",
    "Operação automática libera o açougueiro",
    "600 kg/h em regime contínuo",
  ],
  durability: [
    "Construção robusta em aço inox",
    "Boca e caracol em inox Microfundido",
    "Motor dimensionado para operação intensa",
    "Fácil higienização pós-turno",
  ],
  safety: [
    "Painel intuitivo e botão de emergência",
    "Sensor magnético na tampa de policarbonato",
    "Conjunto único de segurança patenteado",
    "Em total conformidade com a NR-12",
  ],
};
