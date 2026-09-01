import { source } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = false;

function canGetText(
  page: ReturnType<typeof source.getPages>[number],
): page is typeof page & {
  data: { title: string; getText: (type: 'raw' | 'processed') => Promise<string> };
} {
  return page.type !== 'openapi' && typeof (page.data as { getText?: unknown }).getText === 'function';
}

export async function GET() {
  const sections = await Promise.all(
    source.getPages().map(async (page) => {
      if (!canGetText(page)) return null;
      const body = await page.data.getText('processed');
      return `# ${page.data.title}\n\n${page.url}\n\n${body}`;
    }),
  );

  const markdown = sections.filter((section): section is string => section !== null).join('\n\n---\n\n');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
