import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import type { MDXComponents } from 'mdx/types';
import { ApiCatalog } from '@/components/api-catalog';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Popup,
    PopupContent,
    PopupTrigger,
    ApiCatalog,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;
