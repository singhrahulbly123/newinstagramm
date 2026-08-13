import Link from 'next/link';
import type { Metadata } from 'next';
import { MultiStructuredData } from '../components/StructuredData';
import {
  makeBreadcrumbSchema,
  makeWebPageSchema,
} from '../../lib/schemas';
import { getAllBlogPosts } from '../../lib/blogAutomation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Public Instagram Media Guides & Troubleshooting | globltools',
  description:
    'Read tested guides for working with supported public Instagram reels, videos, photos, and audio while respecting creator rights.',
  keywords: [
    'instagram downloader blog',
    'instagram reels download tips',
    'download instagram reels free',
    'how to download instagram reels',
    'instagram reel downloader online',
    'save instagram video',
    'download instagram photo',
    'instagram download guide',
    'download instagram reels on android',
    'instagram downloader android',
    'download reels on android',
    'instagram reels android',
  ],
  alternates: {
    canonical: 'https://globltools.com/blog',
  },
  openGraph: {
    title: 'Public Instagram Media Guides & Troubleshooting',
    description:
      'Read tested guides for supported public Instagram media workflows and common download problems.',
    type: 'website',
    url: 'https://globltools.com/blog',
    siteName: 'globltools',
    locale: 'en_US',
  },
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  const breadcrumbItems = [
    { name: 'Home', url: 'https://globltools.com' },
    { name: 'Blog', url: 'https://globltools.com/blog' },
  ];

  const blogPageSchema = makeWebPageSchema({
    headline: 'globltools Blog - Instagram Reels Download Tips',
    description:
      'Read tested guides for supported public Instagram media workflows and common download problems.',
    url: 'https://globltools.com/blog',
    author: 'globltools',
  });

  // Collection schema for blog posts
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'globltools Blog',
    url: 'https://globltools.com/blog',
    description: 'Read reviewed guides for supported public Instagram media workflows and troubleshooting.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPosts.map((post, idx) => ({
        '@type': 'BlogPosting',
        position: idx + 1,
        headline: post.title,
        description: post.description,
        url: `https://globltools.com/blog/${post.slug}`,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        author: {
          '@type': 'Organization',
          name: 'globltools',
        },
      })),
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-soft text-slate-900">
      <MultiStructuredData
        items={[
          makeBreadcrumbSchema(breadcrumbItems),
          blogPageSchema,
          collectionSchema,
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-900 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 p-7 text-white shadow-2xl shadow-emerald-950/15 sm:p-12">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
          <p className="relative text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
            globltools Blog
          </p>
          <h1 className="relative mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Public Instagram media guides
          </h1>
          <p className="relative mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Practical, reviewed guides for supported public Reels, videos, photos, and audio—with clear limitations and troubleshooting steps.
          </p>
          <div className="relative mt-7 flex flex-wrap gap-2 text-xs font-bold text-emerald-100">
            {['Public-link testing', 'Reviewed dates', 'Creator-rights guidance'].map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">{item}</span>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Guide library</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Reviewed walkthroughs</h2>
          </div>
          <p className="hidden text-sm font-semibold text-slate-500 sm:block">{blogPosts.length} guides</p>
        </div>

        <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60 ${index === 0 ? 'md:col-span-2 lg:col-span-2 lg:grid lg:grid-cols-2' : ''}`}
              aria-label={`Blog post: ${post.title}`}
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className={`w-full object-cover transition duration-300 group-hover:scale-[1.02] ${index === 0 ? 'h-full min-h-72' : 'aspect-[16/9]'}`}
                />
              ) : null}
              <div className="flex h-full flex-col p-7">
                {index === 0 ? <span className="mb-4 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">Featured guide</span> : null}
                {post.datePublished ? (
                  <time dateTime={post.datePublished} className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    {new Date(post.datePublished + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                ) : null}
                <h2 className={`mt-3 font-black leading-tight text-slate-950 ${index === 0 ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{post.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{post.description}</p>
                <Link
                href={`/blog/${post.slug}`}
                  className="mt-auto inline-flex min-h-11 w-fit items-center pt-6 text-sm font-black text-emerald-800 transition hover:text-teal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  aria-label={`Read full post: ${post.title}`}
                >
                  Read guide <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-sm shadow-emerald-100/80">
            <h2 className="text-2xl font-bold text-slate-950">How guides are reviewed</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Each guide is checked against the current public-link workflow and displays its published and last-reviewed dates. Platform behaviour can change, so availability and fixed media quality are never guaranteed.
            </p>
            <ul className="mt-6 space-y-2 text-sm leading-7 text-slate-700 list-disc pl-5">
              <li>Public test links only</li>
              <li>Clear unsupported-content limitations</li>
              <li>Creator rights and responsible-use guidance</li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
            <h2 className="text-2xl font-bold text-slate-950">Find the right answer faster</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The blog is written for everyday users who want a simple and safe Instagram download process. Get practical advice so you can save reels fast without confusion.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              globltools works from any browser, so you can use it on mobile, tablet, or desktop without installing anything.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
