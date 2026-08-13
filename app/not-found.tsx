import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | globltools',
  description: 'The page you requested could not be found. Explore Globltools for Instagram reels, videos, photos, stories, and audio downloads.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-soft px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-200/50 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          The page you were looking for doesn’t exist.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          The link may be outdated or the page may have moved. You can return to the homepage or jump straight to the main Instagram downloader tools.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Go to homepage
          </Link>
          <Link
            href="/instagram-reel-downloader"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            Open the reel downloader
          </Link>
        </div>
      </div>
    </main>
  );
}
