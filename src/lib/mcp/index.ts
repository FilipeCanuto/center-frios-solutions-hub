import { defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getContactInfo from "./tools/get-contact-info";
import submitQuoteTool from "./tools/create-lead";

export default defineMcp({
  name: "centerfrios-mcp",
  title: "CENTERFRIOS MCP",
  version: "0.1.0",
  instructions:
    "Tools for the CENTERFRIOS industrial food equipment site. Use `list_products` to discover the catalog, `get_contact_info` to reach the sales team, and `submit_quote` to register a qualified lead.",
  tools: [listProducts, getContactInfo, submitQuoteTool],
});
