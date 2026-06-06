import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { Suspense } from 'react';

const PhotoDownloader = dynamic(() => import('../components/photo/PhotoDownloader'), {
  ssr: true,
  loading: () => (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50">
      Loading Instagram Photo Downloader…
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Instagram Photo Downloader - Download Instagram Photos in HD Free',
  description:
    'Download Instagram photos in original HD quality instantly. Free Instagram Photo Downloader with fast downloads, high quality images, and secure processing.',
  keywords: [
    'instagram photo downloader',
    'download instagram photo',
    'instagram image downloader',
    'instagram thumbnail downloader',
    'save instagram photo',
    'hd instagram photo downloader',
  ],
  metadataBase: new URL('https://fastvideosave.net'),
  alternates: {
    canonical: 'https://fastvideosave.net/instagram-photo-downloader',
  },
  openGraph: {
    title: 'Instagram Photo Downloader - Download Instagram Photos in HD Free',
    description:
      'Download Instagram photos in original HD quality instantly. Free Instagram Photo Downloader with fast downloads, high quality images, and secure processing.',
    type: 'website',
    url: 'https://fastvideosave.net/instagram-photo-downloader',
    siteName: 'FastVideoSave',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Photo Downloader - Download Instagram Photos in HD Free',
    description:
      'Download Instagram photos in original HD quality instantly. Free Instagram Photo Downloader with fast downloads, high quality images, and secure processing.',
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
    question: 'Is this tool free?',
    answer:
      'Yes, this Instagram Photo Downloader is completely free. You can save public Instagram photos without installing anything or paying a fee.',
  },
  {
    question: 'Can I download HD photos?',
    answer:
      'Absolutely. The downloader extracts the highest available image resolution from public Instagram posts so you get quality photo files.',
  },
  {
    question: 'Can I download carousel images?',
    answer:
      'Yes. Multi-image posts are supported and the tool shows every available photo from carousel posts for individual or batch download.',
  },
  {
    question: 'Do I need an account?',
    answer:
      'No account is required. The service works with public Instagram posts only, so you can paste a post link and download immediately.',
  },
  {
    question: 'Is it safe?',
    answer:
      'Yes. The downloader processes links securely on the server and never stores personal account credentials. Only public post data is accessed.',
  },
];

const featureItems = [
  {
    title: 'Original Resolution',
    description: 'Get the highest available photo quality directly from Instagram without resizing or compression.',
  },
  {
    title: 'Fast Downloads',
    description: 'Optimized server-side processing and a clean interface make downloads fast on mobile and desktop.',
  },
  {
    title: 'No Watermark',
    description: 'Downloaded photos are delivered without added logos, watermark overlays, or branding elements.',
  },
  {
    title: 'Free Forever',
    description: 'The tool is free to use for everyone and does not require sign-up or paid plans.',
  },
  {
    title: 'Secure Processing',
    description: 'Instagram links are validated and fetched safely with a secure server-side API route.',
  },
  {
    title: 'Mobile Friendly',
    description: 'Designed to work smoothly on phones, tablets, and desktop displays.',
  },
];

export default function PhotoPage() {
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
                  name: 'Instagram Photo Downloader',
                  url: 'https://fastvideosave.net/instagram-photo-downloader',
                  description:
                    'Download Instagram photos in original HD quality instantly. Free Instagram Photo Downloader with fast downloads, high quality images, and secure processing.',
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
                      name: 'Photo Downloader',
                      item: 'https://fastvideosave.net/instagram-photo-downloader',
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
            Fast | High Quality | Free
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Instagram Photo Downloader
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Save photo and thumbnail images from public Instagram posts in original resolution. Download multiple carousel images, preview content, and keep every photo sharp.
          </p>
        </div>

        <div className="mx-auto mt-8 sm:max-w-4xl sm:rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <Suspense
            fallback={
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50">
                Loading Instagram Photo Downloader...
              </div>
            }
          >
            <PhotoDownloader />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Save Instagram photos in four easy steps</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {[
              'Copy Instagram photo URL',
              'Paste the URL into the input',
              'Preview available images',
              'Download original quality',
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
          <div className="grid gap-8 lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Features</p>
              <h2 className="text-3xl font-semibold text-white">A modern tool built for fast Instagram photo downloads.</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Use a clean, mobile-first downloader designed for both single images and carousel posts. The tool focuses on fast preview, accurate dimensions, and the best image quality Instagram offers.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
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
              <p className="text-sm uppercase tracking-[0.3em] text-violet-600">Why Use Instagram Photo Downloader</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Download photos reliably without extra apps or loss of detail.</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Instagram does not offer a native download button for public photos. This tool fills that gap by providing a direct, secure way to save images in full resolution with no watermark and no account required.
              </p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 text-sm leading-7 text-slate-600 shadow-sm shadow-slate-200/50">
              <p className="font-semibold text-slate-950">Privacy Note</p>
              <p className="mt-3">
                We only process public Instagram posts and never request your Instagram login. Use the tool responsibly and respect creator rights when downloading content.
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
