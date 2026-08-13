import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '../posts';
import { findBlogPost } from '../../../lib/blogAutomation';
import { MultiStructuredData } from '../../components/StructuredData';
import {
  makeBreadcrumbSchema,
  makeArticleSchema,
} from '../../../lib/schemas';

function renderSectionBody(body: string) {
  const normalized = body.trim();
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 3 && lines.every((line) => line.includes('|'))) {
    const rows = lines
      .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
      .filter((row) => row.length > 0);

    if (rows.length >= 2) {
      const [header, separator, ...dataRows] = rows;
      const isSeparatorRow = separator.every((cell) => /^:?-{3,}:?$/.test(cell));

      if (isSeparatorRow) {
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm leading-7 text-slate-600">
              <thead>
                <tr>
                  {header.map((cell, index) => (
                    <th key={`${cell}-${index}`} className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-900">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="border border-slate-200 px-3 py-2 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
  }

  if (/<([a-z][\w:-]*)(\s[^>]*)?>/i.test(normalized)) {
    return <div className="text-sm leading-7 text-slate-600" dangerouslySetInnerHTML={{ __html: normalized }} />;
  }

  return <div className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{body}</div>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPost(slug);

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested blog post could not be found.',
    };
  }

  const metaTitle = post.metaTitle || `${post.title} | globltools Blog`;
  const metaDescription = post.metaDescription || post.description;
  const image = post.image
    ? new URL(post.image, 'https://globltools.com').toString()
    : 'https://globltools.com/opengraph-image';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: ['instagram', 'download', 'reels', 'video', 'tutorial', 'guide', post.title],
    alternates: {
      canonical: `https://globltools.com/blog/${post.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: `https://globltools.com/blog/${post.slug}`,
      siteName: 'globltools',
      locale: 'en_US',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [{ url: image, alt: post.imageAlt || post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findBlogPost(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://globltools.com' },
    { name: 'Blog', url: 'https://globltools.com/blog' },
    { name: post.title, url: `https://globltools.com/blog/${post.slug}` },
  ];

  const overviewParagraphs = post.overview
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const articleContent = `${post.overview}\n\n${post.sections
    .map((s) => `${s.heading}\n${s.body}${s.points ? '\n' + s.points.join('\n') : ''}`)
    .join('\n\n')}`;

  const articleSchema = makeArticleSchema({
    headline: post.title,
    description: post.description,
    url: `https://globltools.com/blog/${post.slug}`,
    datePublished: post.datePublished || new Date().toISOString().split('T')[0],
    dateModified: post.dateModified || new Date().toISOString().split('T')[0],
    author: 'globltools Editorial Team',
    articleBody: articleContent,
    image: post.image ? new URL(post.image, 'https://globltools.com').toString() : undefined,
  });

  return (
    <main id="main-content" className="min-h-screen bg-soft text-slate-900">
      <MultiStructuredData
        items={[
          makeBreadcrumbSchema(breadcrumbItems),
          articleSchema,
        ]}
      />
      <div className="mx-auto max-w-7xl px-2 py-10 sm:px-0 lg:pb-4">
        <nav className="mb-5" aria-label="Breadcrumb">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-emerald-800 transition hover:text-teal-950">← Back to all guides</Link>
        </nav>
        <article className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">globltools Blog</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-slate-100 py-4 text-sm text-slate-500">
              <p className="font-bold text-slate-700">globltools Editorial Team</p>
              <time dateTime={post.datePublished || new Date().toISOString().split('T')[0]} className="font-medium">
                Published on {post.datePublished ? new Date(post.datePublished + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
              </time>
              {post.dateModified ? (
                <time dateTime={post.dateModified} className="font-medium">
                  Last reviewed on {new Date(post.dateModified + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              ) : null}
            </div>
            {post.image ? (
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <img
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}
            <div className="mx-auto mt-7 max-w-6xl space-y-4 text-lg leading-9 text-slate-600">
              {overviewParagraphs.map((paragraph, index) => {
                if (/<([a-z][\w:-]*)(\s[^>]*)?>/i.test(paragraph)) {
                  return <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />;
                }

                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">Editorial note</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              This guide is checked against the current globltools workflow using public-link examples. Private or restricted content is not used in testing. Platform behaviour can change, so the article shows its last-reviewed date and avoids guaranteeing availability or a fixed media quality.
            </p>
          </div>

          <div className="mx-auto max-w-6xl space-y-10">
          {post.sections.map((section, idx) => (
            <section key={idx} className="scroll-mt-24 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{section.heading}</h2>
              {renderSectionBody(section.body)}
              {section.points?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
            <h2 className="text-xl font-bold text-slate-950">Quick tip</h2>
            <p className="mt-3">
              Always use public Instagram links and respect creator rights. globltools is best for personal saving and offline viewing.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Back to blog
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Use downloader now
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
