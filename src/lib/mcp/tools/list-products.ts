import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List the industrial food equipment products offered by CENTERFRIOS (PA7 PRO, HS-22, HS-98).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { site } = await import("@/data/site");
    const products = (site.products ?? []).map((p: { slug: string; name: string; tagline?: string }) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      url: `https://centerfrioshub.lovable.app/produtos/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
