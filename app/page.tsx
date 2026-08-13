import DownloadHero from './components/DownloadHero';
import { MultiStructuredData } from './components/StructuredData';
import {
  makeBreadcrumbSchema,
  makeWebPageSchema,
  makeFAQSchema,
  makeHowToSchema,
} from '../lib/schemas';

const faqItems = [
  {
    question: 'What can the Instagram downloader save?',
    answer:
      'globltools can process supported public Instagram links for reels, feed videos, photos, and audio. Available files depend on what Instagram exposes for the specific public post.',
  },
  {
    question: 'Do I need to log in to Instagram to download reels?',
    answer:
      'No, globltools works without Instagram login. It only supports public reels and videos, so you can save content quickly from any public post without entering your account details.',
  },
  {
    question: 'Why can an Instagram link fail?',
    answer:
      'A link may fail when the post is private, removed, expired, age-restricted, region-restricted, or temporarily unavailable to logged-out visitors.',
  },
  {
    question: 'Will the downloaded video be high quality?',
    answer:
      'The tool returns the best file made available for the public post. Instagram may resize or compress uploaded media, so the available resolution can differ between posts.',
  },
];

export default function HomePage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://globltools.com' },
  ];

  const homePageSchema = makeWebPageSchema({
    headline: 'globltools Instagram Downloader for Public Reels, Videos, Photos and Audio',
    description:
      'globltools processes supported public Instagram links for reels, videos, photos, stories, and audio without requiring an Instagram login.',
    url: 'https://globltools.com',
    author: 'globltools',
  });

  const howToSchema = makeHowToSchema({
    name: 'How to Download Public Instagram Content',
    description: 'A three-step process for supported public Instagram media links.',
    steps: [
      {
        name: 'Copy the public Instagram media link.',
        text: 'Open the public Reel, video, or photo post you are allowed to save and copy its URL.',
      },
      {
        name: 'Paste it into the globltools download field.',
        text: 'Visit globltools.com, paste the Instagram link into the input field, and let the service detect the media.',
      },
      {
        name: 'Preview and save the available file.',
        text: 'When processing succeeds, review the preview and use the download button to save the available media file.',
      },
    ],
  });

  return (
    <main id="main-content" className="min-h-screen bg-soft text-slate-900">
      <MultiStructuredData
        items={[
          breadcrumbItems.length > 0 ? makeBreadcrumbSchema(breadcrumbItems) : null,
          homePageSchema,
          howToSchema,
          makeFAQSchema(faqItems),
        ].filter(Boolean) as Record<string, any>[]}
      />
      <div className="mx-auto max-w-full">
        <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/95 to-teal-50/80 px-4 py-4 sm:px-6 sm:py-6 dark:from-stone-950/95 dark:to-teal-950/80 dark:border-slate-800">
          <div className="mx-auto max-w-6xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-emerald-50 px-4 py-2 sm:px-5 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm shadow-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
              ✨ Public links · Fast preview · Simple downloads
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
              Instagram <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Downloader</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              Save Instagram reels, stories, videos, and photos directly from public links in a few simple steps. No login or app installation is required.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🌐 Online Downloader</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Save reels, stories, videos and photos in one click.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <a href="/youtube-downloader" className="block">
                  <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">▶️ YouTube Shorts Downloader</p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download YouTube Shorts and Videos in HD quality.</p>
                </a>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🔒 No Login Required</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download public Instagram content without logging in.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-green-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-green-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">Public Links Only</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Private, deleted, and restricted media is not supported.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">📚 What is an Instagram Downloader?</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">A browser tool for supported public Instagram media</h2>
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              <p>
                An Instagram Downloader is a browser-based service designed to help you save public reels, videos, photos, and supported story content directly to your device. It removes the need for a dedicated app and works on Android, iPhone, Windows, and Mac.
              </p>
              <p>
                globltools is built for anyone who wants a reliable Instagram downloader, Instagram story downloader, and Instagram photo downloader in one place. By using only the Instagram link, the tool quickly fetches the original media file and converts it into a downloadable format without any watermark.
              </p>
              <p>
                This Instagram reel download service works with public Instagram content only. It is ideal for content creators, social media managers, students, and anyone saving personal clips for offline viewing. With globltools, you can keep your favorite reels, music videos, and visual stories accessible whenever you need them.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-slate-50/95 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">⚙️ How it Works</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">How the Instagram downloader processes public links</h2>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  globltools validates the submitted Instagram URL and checks the corresponding public page for media that is available to logged-out visitors. The result depends on the post type and what Instagram exposes for that link.
                </p>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  Processing happens on the server, so no Instagram account connection is required. When media can be prepared, the page presents a preview and download action; restricted or unavailable links return an error instead.
                </p>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  Dedicated pages explain the supported workflow for Reels, videos, photos, audio, stories, and profile images. File type, quality, and availability vary by public post.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">Four steps for supported Instagram content</h3>
                <ul className="mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">
                  <li>1. Copy the public Reel, video, or photo-post link.</li>
                  <li>2. Paste it into the globltools download field.</li>
                  <li>3. Click Download and wait a few seconds.</li>
                  <li>4. Preview and save the available media file.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">✨ Instagram Downloader Features</h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Built for clear, browser-based Instagram downloads</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">📹 HD Download</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  globltools returns the best media file made available for a supported public post. Resolution varies because Instagram can resize or compress uploaded videos before serving them.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">🔒 No Login Required</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  You can download Instagram reels without signing in. globltools is built to work with public content only, so there is no need to enter Instagram credentials or connect your account. This makes it safer and faster for everyday use.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">Public Content Only</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  Private, deleted, expired, age-restricted, and region-restricted posts may not be available. Test the link in a logged-out browser if the downloader cannot reach it.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">⚡ Fast Processing</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  Processing time depends on Instagram availability, media size, and network conditions. The page shows a preview when the requested public media can be prepared.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-gradient-to-b from-stone-950 via-emerald-950 to-teal-900 border-b border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-300">🎯 Step-by-Step Guide</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">How to process an Instagram media link</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {[
                'Copy the supported public Instagram URL from the app or browser.',
                'Paste it into the globltools input field.',
                'Click Download and save the file to your device.',
              ].map((step, index) => (
                <div key={step} className="rounded-lg sm:rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-7 text-center hover:border-emerald-500 transition-colors">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-stone-950 via-emerald-950 to-teal-900 text-sm sm:text-base font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm leading-6 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
              <p>
                The step-by-step guide is made to help you download Instagram reels without confusion. The entire workflow is just three actions: get the Instagram link, paste it in, and download. This is the fastest way to save an Instagram reel, regardless of whether you are on Android, iPhone, Windows, or Mac.
              </p>
              <p>
                After pasting the link, the Instagram reel downloader identifies the reel content, validates the URL, and creates a clean download button. You can also download Instagram photos and videos from public stories and posts using the same process.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">❓ Frequently Asked Questions</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Frequently Asked Questions About Instagram Downloader</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 sm:p-7 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30 hover:shadow-md transition-shadow">
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
