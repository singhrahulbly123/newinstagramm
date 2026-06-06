import DownloadHero from '../components/DownloadHero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Reel Downloader - Download Reels in HD Free | FastVideoSave',
  description: 'Download Instagram reels in high quality without watermark. Free, instant, no login required. FastVideoSave is the best online Instagram reel downloader.',
  keywords: [
    'instagram reel downloader',
    'download instagram reels',
    'reel downloader online',
    'instagram reel download no watermark',
    'download reels HD',
    'instagram reel saver',
  ],
  metadataBase: new URL('https://fastvideosave.net'),
  alternates: {
    canonical: 'https://fastvideosave.net/instagram-reel-downloader',
  },
  openGraph: {
    title: 'Instagram Reel Downloader - Download Reels in HD Free',
    description: 'Download Instagram reels in high quality without watermark. Free, instant, no login required.',
    type: 'website',
    url: 'https://fastvideosave.net/instagram-reel-downloader',
    siteName: 'FastVideoSave',
    locale: 'en_US',
  },
};

const faqItems = [
  {
    question: 'What is an Instagram Reel Downloader and how does it work?',
    answer:
      'An Instagram Reel Downloader is a web tool that converts Instagram reel URLs into downloadable video files. FastVideoSave finds the reel video, prepares it in high definition, and gives you a simple download button without any watermark.',
  },
  {
    question: 'Do I need to log in to Instagram to download reels?',
    answer:
      'No, FastVideoSave works without Instagram login. It only supports public reels and videos, so you can save content quickly from any public post without entering your account details.',
  },
  {
    question: 'Can I download unlimited reels and Instagram videos?',
    answer:
      'Yes, there are no download limits. FastVideoSave lets you download unlimited reels, videos, and photos from Instagram for personal offline use.',
  },
  {
    question: 'Will the downloaded video be high quality?',
    answer:
      'Yes, the tool preserves the original video quality whenever possible. If the Instagram reel is available in HD, you will receive the same resolution in your downloaded file.',
  },
];

export default function ReelDownloaderPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-full">
        <section className="border-b border-slate-200 bg-gradient-to-b from-white/95 to-white/80 px-4 py-8 sm:px-6 sm:py-12 dark:from-slate-950/95 dark:to-slate-950/80 dark:border-slate-800">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'FastVideoSave',
                url: 'https://fastvideosave.net',
                description:
                  'FastVideoSave is the easiest Instagram downloader for reels, photos, videos, and audio. Download Instagram content in high quality without watermark or app.',
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              }),
            }}
          />
          <div className="mx-auto max-w-6xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-violet-50 px-4 py-2 sm:px-5 text-xs sm:text-sm font-bold text-violet-700 shadow-sm shadow-violet-100 dark:bg-violet-900/30 dark:text-violet-300">
              ✨ No Logo · High Quality · Free
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
              Instagram <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">Reel Downloader</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              Download Instagram reels instantly in HD without watermark. FastVideoSave is the fastest online reel downloader – no login, no apps, just paste and download.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 p-4 sm:p-5 border border-violet-200/50 shadow-sm dark:from-violet-900/20 dark:to-violet-800/10 dark:border-violet-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🌐 Online Tool</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Save reels in one click – no app needed.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 border border-blue-200/50 shadow-sm dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🔒 No Login</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download without Instagram credentials.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 p-4 sm:p-5 border border-green-200/50 shadow-sm dark:from-green-900/20 dark:to-green-800/10 dark:border-green-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">♾️ Unlimited</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download as many reels as you want.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">📚 About</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">What is an Instagram Reel Downloader?</h2>
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              <p>
                An Instagram Reel Downloader is a browser-based service that lets you save Instagram reel videos directly to your device. FastVideoSave removes the need for apps – just paste the reel link and download the video in seconds.
              </p>
              <p>
                Our downloader works with public Instagram content only. It's perfect for content creators, social media managers, and anyone who wants to keep their favorite reels available offline.
              </p>
              <p>
                With FastVideoSave, you get high-quality downloads without watermarks, no login required, and unlimited access. Download as many reels as you need – we support Android, iPhone, Windows, and Mac.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">❓ FAQ</p>
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
