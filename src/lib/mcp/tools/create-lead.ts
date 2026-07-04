import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "submit_quote",
  title: "Submit quote request",
  description: "Submit a sales quote / lead request to CENTERFRIOS. Use when a prospect wants a quote or to be contacted about a product.",
  inputSchema: {
    name: z.string().min(2).describe("Full name of the prospect."),
    email: z.string().email().describe("Contact email."),
    phone: z.string().min(8).describe("Contact phone (with area code)."),
    company: z.string().optional().describe("Company name, if applicable."),
    segment: z.string().optional().describe("Business segment (e.g. 'restaurantes')."),
    product_interest: z.string().optional().describe("Product of interest slug or name."),
    message: z.string().optional().describe("Additional notes from the prospect."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input) => {
    const { submitQuote } = await import("@/lib/leads.functions");
    try {
      const result = await submitQuote({ data: { ...input, source: "mcp" } });
      return {
        content: [{ type: "text", text: `Quote request submitted for ${input.name}.` }],
        structuredContent: { ok: true, result },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Failed to submit quote: ${msg}` }],
        isError: true,
      };
    }
  },
});
