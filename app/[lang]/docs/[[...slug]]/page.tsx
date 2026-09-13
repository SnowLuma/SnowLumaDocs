import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { PageFeedback } from '@/components/page-feedback';
import type { Metadata } from 'next';
import { OpenAPIPage } from '@/components/api-page';

function lastUpdateOf(page: NonNullable<ReturnType<typeof source.getPage>>): Date | undefined {
  if (page.type === 'openapi') return undefined;
  const value = (page.data as { lastModified?: Date }).lastModified;
  return value instanceof Date ? value : undefined;
}

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const title = page.data.title;
  if (!title?.trim()) {
    throw new Error(`[docs] Missing page title: ${page.url}`);
  }

  const lastUpdate = lastUpdateOf(page);

  if (page.type === 'openapi') {
    return (
      <DocsPage toc={page.data.toc} full lastUpdate={lastUpdate}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <OpenAPIPage {...page.data.getOpenAPIPageProps()} />
        </DocsBody>
        <PageFeedback lang={params.lang} title={title} />
      </DocsPage>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} lastUpdate={lastUpdate}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
      <PageFeedback lang={params.lang} title={title} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
