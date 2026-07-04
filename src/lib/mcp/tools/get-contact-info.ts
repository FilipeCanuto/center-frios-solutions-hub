import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description: "Return CENTERFRIOS contact channels (WhatsApp, email, site) for sales inquiries and quotes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { site } = await import("@/data/site");
    const info = {
      brand: "CENTERFRIOS",
      site: "https://centerfrioshub.lovable.app",
      whatsapp: site.whatsapp ?? null,
      email: site.email ?? null,
      phone: site.phone ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
