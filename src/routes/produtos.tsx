import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Center Frios | Equipamentos para Gastronomia" },
      {
        name: "description",
        content:
          "Catálogo de equipamentos de alta performance: processadores, abridoras de massa, climatizadores, fornos, câmaras frias e mais.",
      },
      { property: "og:title", content: "Produtos Center Frios" },
      {
        property: "og:description",
        content:
          "Equipamentos certificados para regime de trabalho contínuo. Veja o catálogo completo.",
      },
    ],
  }),
  component: () => <Outlet />,
});
