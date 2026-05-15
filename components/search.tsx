'use client';

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { create } from '@orama/orama';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

// Static export uses the client-side Orama index — there's no
// `/api/search` route to call. The index is downloaded once and
// queried in-browser, so search works without a server. The Mandarin
// tokenizer is swapped in for `zh` so 中文 queries tokenize at word
// boundaries instead of byte-by-byte.
function initOrama(locale?: string) {
  return create({
    schema: { _: 'string' },
    components: {
      tokenizer: locale === 'zh' ? createTokenizer() : undefined,
    },
  });
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    initOrama,
    locale,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : null}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}
