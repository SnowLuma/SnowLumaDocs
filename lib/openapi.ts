import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: ['./public/openapi/snowluma.json'],
});
