import type { Metadata } from 'next';
import StoryDownloader from '../../components/story/StoryDownloader';

export const metadata: Metadata = {
  title: 'Instagram Story Downloader - View and Download Public Stories',
  description: 'Download public Instagram stories instantly with a premium story browser, caching, and browser automation for reliable extraction.',
  keywords: ['instagram story downloader', 'download instagram stories', 'instagram story viewer', 'story preview', 'public instagram stories'],
  metadataBase: new URL('https://fastvideosave.net'),
  alternates: {
    canonical: 'https://fastvideosave.net/instagram-story-downloader',
  },
};

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-700 to-fuchsia-600 px-6 py-16 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(236,72,153,0.16), transparent 28%)' }} />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-white/10">
                <span className="text-violet-200">Stories</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-violet-400" />
                Public Instagram stories only
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Instagram Story Viewer & Downloader
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Explore public Instagram stories with an intelligent search experience, automatic caching, browser-backed extraction, and fast downloads. Paste a story URL or username to preview stories instantly.
              </p>
             
            </div>
            <div className="rounded-[2rem] p-6 mt-10 shadow-glow shadow-slate-950/30">
              <StoryDownloader />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Smart extraction for public Instagram stories</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              The story tool validates usernames and story URLs, loads public story metadata, and renders previews in a modern SaaS experience. When a cache miss occurs, it uses browser automation and retry logic for reliable extraction.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Username support',
              'Story URL support',
              'Responsive preview',
              'Download all stories',
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <p className="font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { title: 'Caching', description: 'Smart Redis caching stores story metadata and extraction results for faster repeat lookups.' },
            { title: 'Browser pool', description: 'A reusable Playwright browser pool improves reliability and avoids launching a browser per request.' },
            { title: 'Monitoring', description: 'Detailed story, cache, and queue diagnostics support operational visibility.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <p className="text-lg font-semibold text-slate-950">{feature.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
