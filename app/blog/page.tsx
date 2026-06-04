import Link from 'next/link';
import type { Metadata } from 'next';
import { blogPosts } from './posts';

export const metadata: Metadata = {
  title: 'FastVideoSave Blog - Instagram Reels Download Tips',
  description:
    'Read expert tips for downloading Instagram reels, videos, photos, and audio with FastVideoSave. Four helpful blog posts on fast Instagram download methods.',
  keywords: [
    'instagram downloader blog',
    'instagram reels download tips',
    'download instagram reels free',
    'how to download instagram reels',
    'instagram reel downloader online',
    'save instagram video',
    'download instagram photo',
    'instagram download guide',
  ],
  alternates: {
    canonical: 'https://fastvideosave.net/blog',
  },
  openGraph: {
    title: 'FastVideoSave Blog - Instagram Reels Download Tips',
    description:
      'Read expert tips for downloading Instagram reels, videos, photos, and audio with FastVideoSave. Four helpful blog posts on fast Instagram download methods.',
    type: 'website',
    url: 'https://fastvideosave.net/blog',
    siteName: 'FastVideoSave',
    locale: 'en_US',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            FastVideoSave Blog
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            4 Easy Posts About Downloading Instagram Reels
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Browse simple English guides on how to download Instagram reels, videos, photos, and audio without installing anything. Tap any post to read the full details.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-2xl font-semibold text-slate-950">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Read full post
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-violet-50 p-8 shadow-sm shadow-violet-100/80">
            <h2 className="text-2xl font-semibold text-slate-950">Popular Search Keywords</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              These are the terms people search for when they want to download Instagram reels and videos quickly.
            </p>
            <ul className="mt-6 space-y-2 text-sm leading-7 text-slate-600 list-disc pl-5">
              <li>download instagram reels</li>
              <li>instagram reel downloader online</li>
              <li>download reels without watermark</li>
              <li>save instagram video</li>
              <li>download instagram photo</li>
              <li>instagram downloader free</li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
            <h2 className="text-2xl font-semibold text-slate-950">Why This Blog Helps</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The blog is written for everyday users who want a simple and safe Instagram download process. Get practical advice so you can save reels fast without confusion.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              FastVideoSave works from any browser, so you can use it on mobile, tablet, or desktop without installing anything.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
