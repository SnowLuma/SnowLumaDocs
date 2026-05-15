import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// Static export: emit a JSON index at build time. The client-side
// search dialog (`components/search.tsx`) fetches and queries it
// in-browser; there is no server search endpoint.
//
// Orama doesn't ship a built-in `chinese` language — we hand it the
// Mandarin tokenizer instead so 中文 search terms get word-segmented.
// The client mirrors the same tokenizer via
// `@orama/tokenizers/mandarin` in `components/search.tsx`.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  localeMap: {
    zh: { tokenizer: createTokenizer() },
    en: { language: 'english' },
  },
});
