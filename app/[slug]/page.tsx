import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, toolPages } from '../../lib/toolPages';
import { makePageMetadata } from '../../lib/seo';
import { MultiStructuredData } from '../components/StructuredData';
import {
  makeBreadcrumbSchema,
  makeWebPageSchema,
  makeFAQSchema,
} from '../../lib/schemas';

export async function generateStaticParams() {
  return toolPages.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested globltools page does not exist.',
    };
  }

  const metadata = makePageMetadata({
    title: `${tool.title} | globltools`,
    description: tool.description,
    slug: tool.slug,
    keywords: [...tool.keywords, 'globltools', 'online downloader'],
    pageType: 'article',
  });

  // These programmatic platform pages remain available to users, but are not
  // indexed until each page has a dedicated, tested downloader experience.
  return {
    ...metadata,
    robots: { index: false, follow: true },
  };
}

const standaloneRoutes = new Set([
  'audio',
  'instagram-audio-downloader',
  'instagram-photo-downloader',
  'instagram-profile-picture-downloader',
  'instagram-reel-downloader',
  'instagram-story-downloader',
  'instagram-video-downloader',
  'photo',
  'story',
]);

function isValidRelatedSlug(slug: string) {
  return standaloneRoutes.has(slug) || Boolean(getToolBySlug(slug));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://globltools.com' },
    { name: tool.title, url: `https://globltools.com/${tool.slug}` },
  ];

  const toolPageSchema = makeWebPageSchema({
    headline: `${tool.title} | globltools`,
    description: tool.description,
    url: `https://globltools.com/${tool.slug}`,
    author: 'globltools',
  });

  return (
    <main id="main-content" className="min-h-screen bg-soft text-slate-900">
      <MultiStructuredData
        items={[
          makeBreadcrumbSchema(breadcrumbItems),
          toolPageSchema,
          makeFAQSchema(tool.faqs),
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{tool.title}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{tool.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">{tool.overview}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
                <h2 className="text-xl font-semibold text-slate-950">How it works</h2>
                <p className="mt-3">
                  {tool.title} uses a public link parser to detect the source media and generate a direct download path. Paste a supported public URL into globltools and follow the instructions to save the file instantly.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {tool.features.map((feature) => (
                  <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                    <p className="font-semibold text-slate-950">{feature}</p>
                  </div>
                ))}
              </div>

              <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-semibold text-slate-950">Frequently Asked Questions</h2>
                <div className="mt-5 space-y-4">
                  {tool.faqs.map((faq) => (
                    <div key={faq.question}>
                      <p className="font-semibold text-slate-950">{faq.question}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-emerald-50 p-6 shadow-sm shadow-emerald-100/80">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Quick access</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Use the same globltools link input on the homepage to download public media from supported sites.</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50">
                <h3 className="text-base font-semibold text-slate-950">Related tools</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {tool.relatedSlugs.filter(isValidRelatedSlug).slice(0, 4).map((slug) => (
                    <li key={slug}>
                      <Link href={`/${slug}`} className="text-emerald-700 hover:underline">
                        {slug.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
