import type { Folder, Item, Node } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import Link from 'fumadocs-core/link';

function textOf(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
}

function pagesOf(node: Folder): Item[] {
  const out: Item[] = [];
  const walk = (nodes: Node[]) => {
    for (const child of nodes) {
      if (child.type === 'page') out.push(child);
      else if (child.type === 'folder') {
        if (child.index) out.push(child.index);
        walk(child.children);
      }
    }
  };
  walk(node.children);
  return out;
}

function findApiFolder(lang: string): Folder | undefined {
  const tree = source.getPageTree(lang);
  return tree.children.find(
    (node): node is Folder => node.type === 'folder' && node.$ref?.folder === 'api',
  );
}

export function ApiCatalog({ lang }: { lang: string }) {
  const api = findApiFolder(lang);
  if (!api) return null;
  const zh = lang === 'zh';
  const groups = api.children.filter((node): node is Folder => node.type === 'folder');

  return (
    <div className="not-prose mt-8 grid gap-6">
      {groups.map((group) => {
        const pages = pagesOf(group);
        if (pages.length === 0) return null;
        return (
          <section key={group.$ref?.folder ?? textOf(group.name)}>
            <h2 className="mb-2 text-lg font-semibold">{group.name}</h2>
            <p className="mb-3 text-sm text-fd-muted-foreground">
              {zh ? `${pages.length} 个动作` : `${pages.length} actions`}
            </p>
            <ul className="grid gap-1 sm:grid-cols-2">
              {pages.map((page) => (
                <li key={page.url}>
                  <Link
                    href={page.url}
                    className="flex items-center justify-between gap-3 rounded-lg border border-fd-border px-3 py-2 text-sm hover:border-fd-primary"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2 font-medium">{page.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
