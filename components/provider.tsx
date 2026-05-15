'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { useEffect, type ReactNode } from 'react';
import SearchDialog from '@/components/search';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import type { Lang } from '@/lib/i18n';

interface ProviderProps {
  lang: Lang;
  i18n: I18nProviderProps;
  children: ReactNode;
}

export function Provider({ lang, i18n, children }: ProviderProps) {
  // Static export pins `<html lang>` to the default locale. When
  // navigating to a non-default locale, patch the document attribute
  // client-side so screen readers and the browser see the real lang.
  useEffect(() => {
    const html = document.documentElement;
    const next = lang === 'zh' ? 'zh-CN' : lang;
    if (html.lang !== next) html.lang = next;
  }, [lang]);

  return (
    <RootProvider i18n={i18n} search={{ SearchDialog }}>
      {children}
    </RootProvider>
  );
}
