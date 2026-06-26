// Mirror of @snowluma/mcp's CatalogAction — the docs build's only contract with
// the main repo (see docs/public/api/catalog.json, bot-synced by the
// sync-docs-catalog workflow). The shape is the seam, not a shared package type.

export interface CatalogParam {
  name: string;
  type: string;
  required: boolean;
  default?: unknown;
  desc?: string;
  values?: ReadonlyArray<string | number>;
  schema?: Record<string, unknown>;
}

export interface CatalogAction {
  name: string;
  aliases: string[];
  category?: string;
  summary?: string;
  returns?: string;
  returnsSchema?: Record<string, unknown>;
  readOnly: boolean;
  params: CatalogParam[];
  invariants: string[];
  inputSchema: Record<string, unknown>;
}
