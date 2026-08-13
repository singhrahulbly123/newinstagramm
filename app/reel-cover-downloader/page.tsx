import type { Metadata } from 'next';
import ReelCoverClient from './ReelCoverClient';

export const metadata: Metadata = {
  title: 'Instagram Reel Cover Downloader | globltools',
  description: 'Preview and download the cover image available for a supported public Instagram Reel. No Instagram login required.',
  alternates: { canonical: 'https://globltools.com/reel-cover-downloader' },
};

export default function ReelCoverDownloaderPage() {
  return (
    <main id="main-content" className="bg-slate-50 px-4 pb-6 pt-12 text-slate-900 sm:px-6 lg:pt-16">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-xl shadow-emerald-100/40 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Reel utility</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Instagram Reel Cover Downloader</h1>
          <p className="mt-5 max-w-3xl leading-8 text-slate-600">Paste a full public Reel URL to preview and save the cover image Instagram makes available for that Reel.</p>
          <div className="mt-8"><ReelCoverClient /></div>
        </section>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['Full Reel URL', 'Use an instagram.com/reel/ link copied from the share menu.'],
            ['Public Reels only', 'Private, deleted, or restricted Reels cannot be accessed.'],
            ['Creator rights', 'Downloading a cover does not grant permission to reuse it.'],
          ].map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}
        </section>
      </div>
    </main>
  );
}
