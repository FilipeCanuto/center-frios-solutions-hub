import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description: "Return CENTERFRIOS contact channels (phone, WhatsApp, email, Instagram) for sales inquiries and quotes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { CONTACT } = await import("@/data/site");
    return {
      content: [{ type: "text", text: JSON.stringify(CONTACT, null, 2) }],
      structuredContent: CONTACT,
    };
  },
});
