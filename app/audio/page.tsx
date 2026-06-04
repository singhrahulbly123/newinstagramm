import type { Metadata } from 'next';
import AudioDownloader from '../../components/audio/AudioDownloader';

export const metadata: Metadata = {
  title: 'Instagram Audio Downloader - Download Instagram Reel Audio MP3 Free',
  description:
    'Download Instagram Reel audio in MP3 format instantly. Free Instagram Audio Downloader with high quality audio extraction, fast downloads, and secure processing.',
  keywords: [
    'instagram audio downloader',
    'instagram mp3 downloader',
    'download instagram audio',
    'instagram reel audio download',
    'instagram reel mp3',
    'reel to mp3 converter',
  ],
  metadataBase: new URL('https://fastvideosave.net'),
  alternates: {
    canonical: 'https://fastvideosave.net/audio',
  },
  openGraph: {
    title: 'Instagram Audio Downloader - Download Instagram Reel Audio MP3 Free',
    description:
      'Download Instagram Reel audio in MP3 format instantly. Free Instagram Audio Downloader with high quality audio extraction, fast downloads, and secure processing.',
    type: 'website',
    url: 'https://fastvideosave.net/audio',
    siteName: 'FastVideoSave',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Audio Downloader - Download Instagram Reel Audio MP3 Free',
    description:
      'Download Instagram Reel audio in MP3 format instantly. Free Instagram Audio Downloader with high quality audio extraction, fast downloads, and secure processing.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  },
};

const faqItems = [
  {
    question: 'Is this free?',
    answer:
      'Yes. Instagram Audio Downloader is completely free to use and does not require payment, sign-up, or any software installation.',
  },
  {
    question: 'Can I download Reel music?',
    answer:
      'You can extract audio from public Instagram reels, including original creator audio, trending music, and music-backed reel content.',
  },
  {
    question: 'Is login required?',
    answer:
      'No login is required. The tool works with public Instagram reel links only and does not request your Instagram credentials.',
  },
  {
    question: 'Is it safe?',
    answer:
      'Yes. All processing happens on the server using secure Instagram content extraction, and we never store your login information or personal data.',
  },
  {
    question: 'Can I use it on mobile?',
    answer:
      'Absolutely. The downloader is mobile-friendly and works well on phones and tablets with fast downloads and responsive layout.',
  },
];

const featureItems = [
  {
    title: 'High Quality MP3',
    description: 'Extract clean audio from Instagram reels and download MP3 files optimized for playback and sharing.',
  },
  {
    title: 'Fast Processing',
    description: 'The tool validates your reel URL and extracts audio quickly through a secure server-side API route.',
  },
  {
    title: 'Free Forever',
    description: 'Use the Instagram Audio Downloader without paying or creating an account. It stays free for public Instagram content.',
  },
  {
    title: 'Mobile Friendly',
    description: 'Designed for phones and tablets, the interface works smoothly on every screen size.',
  },
  {
    title: 'Secure Downloads',
    description: 'Audio content is processed securely and delivered through a trusted proxy for fast downloads.',
  },
  {
    title: 'No Login Required',
    description: 'Simply paste a public reel link and download audio without Instagram authentication.',
  },
];

export default function AudioPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <section className="mx-auto max-w-full border border-white/80 bg-white/90 py-6 shadow-glow backdrop-blur-xl sm:p-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  name: 'Instagram Audio Downloader',
                  url: 'https://fastvideosave.net/audio',
                  description:
                    'Download Instagram Reel audio in MP3 format instantly. Free Instagram Audio Downloader with high quality audio extraction, fast downloads, and secure processing.',
                  applicationCategory: 'Utilities',
                  operatingSystem: 'Web',
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://fastvideosave.net',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Audio Downloader',
                      item: 'https://fastvideosave.net/audio',
                    },
                  ],
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer,
                    },
                  })),
                },
              ],
            }),
          }}
        />

        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-violet-50 px-5 py-2 text-sm font-bolder text-violet-700 shadow-sm shadow-violet-100">
            Fast | High Quality | MP3
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Instagram Audio Downloader
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Convert public Instagram reels to MP3 instantly. Paste your reel link, extract audio, and download high-quality audio files without login.
          </p>
        </div>

        <div className="mx-auto mt-8 sm:max-w-4xl sm:rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <AudioDownloader />
        </div>
      </section>

      <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Extract audio in four easy steps</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {[
              'Copy the Instagram reel URL',
              'Paste the URL into the audio tool',
              'Extract the reel audio source',
              'Download the MP3 file instantly',
            ].map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm shadow-slate-200/50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-200 bg-white text-base font-semibold text-violet-600">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-full bg-slate-950/95 p-8 text-white shadow-xl shadow-slate-900/60">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Features</p>
              <h2 className="text-3xl font-semibold text-white">Premium audio download experience for Instagram reels.</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                The tool is built for speed, quality, and privacy. Extract audio from public reels and receive a ready-to-download MP3 file with a single paste.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.05fr]">
              {featureItems.map((feature) => (
                <div key={feature.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/90 p-5 shadow-sm shadow-black/10">
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-600">Why Use Instagram Audio Downloader</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Get MP3 audio from reels without extra apps or pain.</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Instagram does not provide a direct MP3 download option. This tool fills the gap by extracting the reel audio source and preparing it for clean audio downloads without login.
              </p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 text-sm leading-7 text-slate-600 shadow-sm shadow-slate-200/50">
              <p className="font-semibold text-slate-950">Privacy Notice</p>
              <p className="mt-3">
                We only process public Instagram reels and do not request your Instagram credentials. Use the service responsibly and respect creator rights when saving audio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Frequently Asked Questions</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Everything you need to know before downloading.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqItems.map((faq) => (
              <div key={faq.question} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
                <p className="font-semibold text-slate-950">{faq.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
