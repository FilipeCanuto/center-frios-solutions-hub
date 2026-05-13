import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/segmentos")({
  head: () => ({
    meta: [
      { title: "Segmentos atendidos — Center Frios" },
      {
        name: "description",
        content:
          "Soluções específicas por segmento: supermercados, restaurantes, redes, cozinhas industriais e hotéis.",
      },
      { property: "og:title", content: "Segmentos atendidos — Center Frios" },
      {
        property: "og:description",
        content: "Equipamentos especificados para o ritmo do seu setor.",
      },
    ],
  }),
  component: () => <Outlet />,
});
