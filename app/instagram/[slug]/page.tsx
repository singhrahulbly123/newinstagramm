import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KeywordContentPage } from '../../components/KeywordContentPage';
import { MultiStructuredData } from '../../components/StructuredData';
import { getKeywordPageBySlug, keywordPages } from '../../../lib/keywordPages';
import { makePageMetadata } from '../../../lib/seo';
import { makeBreadcrumbSchema, makeFAQSchema, makeWebPageSchema } from '../../../lib/schemas';

export async function generateStaticParams() {
  return keywordPages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getKeywordPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page does not exist.',
      robots: { index: false, follow: false },
    };
  }

  const metadata = makePageMetadata({
    title: `${page.title} | globltools`,
    description: page.description,
    slug: `instagram/${page.slug}`,
    keywords: [...page.keywords, 'instagram downloader'],
    pageType: 'article',
  });

  // These legacy query-variation guides are retained for users and old links,
  // but excluded from indexing until they are consolidated into primary tools.
  return {
    ...metadata,
    robots: { index: false, follow: true },
  };
}

export default async function InstagramKeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getKeywordPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const pageUrl = `https://globltools.com/instagram/${page.slug}`;
  const breadcrumbItems = [
    { name: 'Home', url: 'https://globltools.com' },
    { name: page.title, url: pageUrl },
  ];

  return (
    <>
      <MultiStructuredData
        items={[
          makeBreadcrumbSchema(breadcrumbItems),
          makeWebPageSchema({
            headline: `${page.title} | globltools`,
            description: page.description,
            url: pageUrl,
            author: 'globltools',
          }),
          makeFAQSchema(page.faqs),
        ]}
      />
      <KeywordContentPage page={page} />
    </>
  );
}
