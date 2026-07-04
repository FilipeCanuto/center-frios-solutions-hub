import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List CENTERFRIOS industrial food equipment products with name, tagline and product URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { PRODUCTS } = await import("@/data/site");
    const products = PRODUCTS.map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: (p as { tagline?: string }).tagline ?? null,
      url: `https://centerfrioshub.lovable.app/produtos/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
