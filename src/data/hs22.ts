import hero from "@/assets/products/hs-22/hero.png";
import ambient from "@/assets/products/hs-22/ambient.png";
import transparentLid from "@/assets/products/hs-22/transparent-lid.png";

export const HS22_IMAGES = {
  main: hero,
  hero,
  ambient,
  transparentLid,
};

// Preço ainda não definido pelo time comercial.
// Quando informado, mudar para { amount, installments, pixDiscountPct }.
export const HS22_PRICE: {
  amount: number;
  installments: number;
  pixDiscountPct: number;
} | null = null;

export const HS22_NICKNAME = "O Monstro Compacto";

export const HS22_AUDIENCE =
  "Açougues gourmet e supermercados de médio porte";

export const HS22_DIFF =
  "Tampa em policarbonato transparente — o gerente vê a textura da carne em tempo real";

export const HS22_QUICK_SPECS = [
  { label: "Produção", value: "600 kg/h" },
  { label: "Caçamba", value: "22 L · 16 kg" },
  { label: "Bocal", value: "Boca 22" },
  { label: "Tampa", value: "Policarbonato transparente" },
];
