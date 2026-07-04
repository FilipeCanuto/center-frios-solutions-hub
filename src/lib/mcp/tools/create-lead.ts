import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "create_lead",
  title: "Create sales lead",
  description: "Create a new sales lead for CENTERFRIOS. Use when a prospect wants a quote or to be contacted about a product.",
  inputSchema: {
    name: z.string().min(1).describe("Full name of the prospect."),
    email: z.string().email().describe("Contact email."),
    phone: z.string().min(6).describe("Contact phone (with area code)."),
    company: z.string().optional().describe("Company name, if applicable."),
    product: z.string().optional().describe("Product of interest slug or name (e.g. 'pa7-pro')."),
    message: z.string().optional().describe("Additional notes from the prospect."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, phone, company, product, message }) => {
    const { createLead } = await import("@/lib/leads.functions");
    try {
      const result = await createLead({
        data: { name, email, phone, company, product, message },
      });
      return {
        content: [{ type: "text", text: `Lead created for ${name}.` }],
        structuredContent: { ok: true, result },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Failed to create lead: ${msg}` }],
        isError: true,
      };
    }
  },
});
