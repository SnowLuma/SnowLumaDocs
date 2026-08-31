'use client';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';

export const OpenAPIPage = createOpenAPIPage({
  schemaUI: { showExample: true },
  showResponseSchema: true,
  playground: { enabled: true },
});
