import DownloadHero from '../components/DownloadHero';
import type { Metadata } from 'next';
import { makeFAQSchema } from '../../lib/schemas';

export const metadata: Metadata = {
  title: 'Instagram Video Downloader – Save Public Videos | globltools',
  description: 'Paste a public Instagram video post link, preview the available file, and save it from your browser without signing in.',
  metadataBase: new URL('https://globltools.com'),
  alternates: {
    canonical: 'https://globltools.com/instagram-video-downloader',
  },
  openGraph: {
    title: 'Instagram Video Downloader – Save Public Videos',
    description: 'Preview and save video files made available for supported public Instagram posts.',
    type: 'website',
    url: 'https://globltools.com/instagram-video-downloader',
    siteName: 'globltools',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Video Downloader – Save Public Videos',
    description: 'Preview and save video files made available for supported public Instagram posts.',
  },
};

const faqItems = [
  {
    question: 'Which Instagram video-post link should I use?',
    answer:
      'Use the public URL for the feed post that contains the video, usually an instagram.com/p/ link. This page is intended for standard feed videos and accessible older IGTV-style posts; instagram.com/reel/ links belong in the Reel Downloader.',
  },
  {
    question: 'Can the tool handle longer Instagram videos?',
    answer:
      'It can process a supported public feed post when Instagram exposes its video file, including posts that run longer than a typical short-form clip. The downloadable duration and quality always come from the original post.',
  },
  {
    question: 'What happens to an older IGTV video link?',
    answer:
      'Instagram has folded IGTV into its broader video experience, but some older videos still resolve as public posts. If the link opens publicly and exposes a video source, the downloader can attempt to preview it; removed or login-only uploads will not work.',
  },
  {
    question: 'Is a feed video downloaded with its original quality?',
    answer:
      'The downloader saves the best file made available for that public post. Instagram may resize or compress landscape, square, and portrait uploads, so the result may differ from the creator\'s original recording.',
  },
];

export default function VideoDownloaderPage() {
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
                    name: 'Instagram Video Downloader',
                    url: 'https://globltools.com/instagram-video-downloader',
                    description: 'Preview and save the available file from a supported public Instagram feed video or accessible legacy IGTV-style post without signing in.',
                    applicationCategory: 'Utilities',
                    operatingSystem: 'Web',
                  },
                  {
                    '@type': 'HowTo',
                    name: 'How to download an Instagram feed video',
                    description: 'Copy a public feed video URL, submit it for a media check, and save the available video file after reviewing the post preview.',
                    step: [
                      {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Find the feed video post',
                        text: 'Open the standard feed post or accessible older IGTV-style upload and copy its public post URL.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Submit the post URL',
                        text: 'Enter the complete instagram.com/p/ link so globltools can check the post for an available video source.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Review and save the video',
                        text: 'Confirm the feed post in the preview, then download the quality and duration Instagram makes available.',
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
              Instagram <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Video Downloader</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              Save public feed videos, longer-form posts, and accessible legacy IGTV uploads from their post URLs—without connecting your Instagram account.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🌐 Web Based</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download videos online without apps.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-emerald-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-emerald-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🔒 Private</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">No account or login needed.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 p-4 sm:p-5 border border-green-200/50 shadow-sm dark:from-emerald-900/20 dark:to-teal-800/10 dark:border-green-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">Public Posts</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Private and restricted posts are not supported.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">📚 About</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">What is an Instagram Video Downloader?</h2>
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              <p>
                Instagram video posts cover more than fast, vertical clips. A feed upload may be square, landscape, or portrait and can carry a longer tutorial, interview, product demo, event recap, or recorded conversation. This downloader is designed around those public post videos rather than the swipe-first Reel format.
              </p>
              <p>
                Standard feed videos commonly use an instagram.com/p/ address. Accessible videos published through the older IGTV experience may also resolve as feed posts, so their public post links can be checked here. Dedicated instagram.com/reel/ URLs should be sent to the separate Reel Downloader.
              </p>
              <p>
                Feed uploads vary widely in aspect ratio, running time, and resolution. globltools checks the linked post and presents the best video file Instagram makes publicly available, while the preview lets you confirm the correct longer-form post before saving it.
              </p>
              <p>
                The tool is useful for backing up your own feed uploads or keeping authorized training, campaign, and reference videos available offline. Download or reuse another creator's work only with permission; private, deleted, restricted, and login-only posts are not supported.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-emerald-50/60 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">How It Works</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Download from a public video post</h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
                Use the post address—not a profile page—to identify the exact feed video or accessible legacy IGTV upload.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Open the video post',
                  text: 'Go to the public feed video and copy its full post URL, commonly an instagram.com/p/ link.',
                },
                {
                  step: '2',
                  title: 'Check the media source',
                  text: 'Paste the post URL above so the downloader can look for the video Instagram exposes publicly.',
                },
                {
                  step: '3',
                  title: 'Confirm and download',
                  text: 'Review the post preview, then save the available file with its supplied aspect ratio, quality, and duration.',
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
