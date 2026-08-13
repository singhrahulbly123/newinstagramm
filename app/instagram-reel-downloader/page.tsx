import DownloadHero from '../components/DownloadHero';
import type { Metadata } from 'next';
import { makeFAQSchema } from '../../lib/schemas';

export const metadata: Metadata = {
  title: 'Instagram Reel Downloader – Save Public Reels | globltools',
  description: 'Paste a public Instagram Reel link, preview the available MP4, and save it from your browser without an Instagram login.',
  metadataBase: new URL('https://globltools.com'),
  alternates: {
    canonical: 'https://globltools.com/instagram-reel-downloader',
  },
  openGraph: {
    title: 'Instagram Reel Downloader – Save Public Reels',
    description: 'Preview and save the available MP4 from a supported public Instagram Reel link.',
    type: 'website',
    url: 'https://globltools.com/instagram-reel-downloader',
    siteName: 'globltools',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Reel Downloader – Save Public Reels',
    description: 'Preview and save the available MP4 from a supported public Instagram Reel link.',
  },
};

const faqItems = [
  {
    question: 'How do I copy the link to an Instagram Reel?',
    answer:
      'Open the Reel in Instagram, tap the Share button, and choose Copy link. Paste the complete public instagram.com/reel/ URL into the downloader; private or login-only Reels cannot be accessed.',
  },
  {
    question: 'What format and quality will my Reel use?',
    answer:
      'Your Reel is saved as an MP4 using the best quality available from the public post. Because Instagram compresses uploaded Reels, the final resolution and clarity depend on the original vertical video.',
  },
  {
    question: 'Can I save trending Reels for content ideas?',
    answer:
      'You can save an accessible public Reel for offline viewing or creative reference. If you plan to repost, edit, or publish someone else\'s Reel, get the creator\'s permission and respect their copyright.',
  },
  {
    question: 'Why is a Reel unavailable even when I have its link?',
    answer:
      'The Reel may be private, deleted, age- or region-restricted, or unavailable to logged-out visitors. Confirm that the post is public and copy a fresh URL directly from its Share button.',
  },
];

export default function ReelDownloaderPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-full">
        <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/95 to-teal-50/80 px-4 py-4 sm:px-6 sm:py-6 dark:from-stone-950/95 dark:to-teal-950/80 dark:border-slate-800">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'WebApplication',
                    name: 'Instagram Reel Downloader',
                    url: 'https://globltools.com/instagram-reel-downloader',
                    description:
                      'Paste a supported public Instagram Reel link, preview the available MP4, and save it without connecting an Instagram account.',
                    applicationCategory: 'Utilities',
                    operatingSystem: 'Web',
                  },
                  {
                    '@type': 'HowTo',
                    name: 'How to download an Instagram Reel',
                    description: 'Copy a public reel link, paste it into the tool, preview the result, and save the MP4.',
                    step: [
                      {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Copy the Reel link',
                        text: 'Open the public Reel, tap the Share button, and choose Copy link.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Paste the link',
                        text: 'Paste the complete instagram.com/reel/ URL into the downloader and start processing it.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Preview and download the MP4',
                        text: 'Check that the vertical video is the correct Reel, then save the available MP4 to your device.',
                      },
                    ],
                  },
                  makeFAQSchema(faqItems),
                ],
              }),
            }}
          />
          <div className="mx-auto max-w-6xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-emerald-50 px-4 py-2 sm:px-5 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm shadow-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
              ✨ No Logo · High Quality · Free
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
              Instagram <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Reel Downloader</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              Paste a supported public Reel URL, preview the available video, and save the MP4 from your browser. No Instagram login is required.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🌐 Online Tool</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Save reels in one click – no app needed.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🔒 No Login</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download without Instagram credentials.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-green-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-green-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">Public Reels</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Private and restricted Reels are not supported.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">📚 About</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">What is an Instagram Reel Downloader?</h2>
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              <p>
                Instagram Reels are vertical short-form videos built for quick entertainment, tutorials, trends, and creative storytelling. This downloader gives those clips a Reel-specific workflow: paste the public Reel link, confirm the preview, and save the available video as an MP4.
              </p>
              <p>
                The MP4 format works across common phones, computers, editors, and media players. The tool retrieves the best quality exposed for the public post, although the final resolution depends on the original upload and Instagram's own compression.
              </p>
              <p>
                It is useful when you want to revisit a trending Reel offline, keep your own published work backed up, or collect examples of hooks, transitions, pacing, and vertical framing for a creator project. Other people's work should only be reused or republished with permission.
              </p>
              <p>
                Only publicly accessible Reels are supported. There is no Instagram sign-in step, and the preview helps you verify the clip before downloading it to your device.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-emerald-50/60 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">How It Works</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Save a Reel in three quick steps</h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
                Start with the Reel's own share link so the downloader can identify the correct vertical video.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Copy from Share',
                  text: 'Open the public Reel, tap the Share button, and select Copy link.',
                },
                {
                  step: '2',
                  title: 'Paste the Reel URL',
                  text: 'Place the full instagram.com/reel/ link in the field above and start the downloader.',
                },
                {
                  step: '3',
                  title: 'Save the MP4',
                  text: 'Verify the vertical video preview, then download the available MP4 quality to your device.',
                },
              ].map((item) => (
                <div key={item.step} className="rounded-lg sm:rounded-2xl border border-emerald-200/70 bg-white p-6 sm:p-7 shadow-sm dark:border-emerald-900 dark:bg-slate-950">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{item.step}</span>
                  <h3 className="mt-4 font-bold text-base sm:text-lg text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">❓ FAQ</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 sm:p-7 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                  <p className="font-bold text-sm sm:text-base text-slate-950 dark:text-white">{item.question}</p>
                  <p className="mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
