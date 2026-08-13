import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { makeFAQSchema } from '../../lib/schemas';

const PhotoDownloader = dynamic(() => import('../components/photo/PhotoDownloader'), {
  ssr: true,
  loading: () => (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50">
      Loading Instagram Photo Downloader…
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Instagram Photo Downloader – Save Public Photos | globltools',
  description:
    'Save available JPG or PNG images from public Instagram photo and carousel posts, including multiple images from one post.',
  metadataBase: new URL('https://globltools.com'),
  alternates: {
    canonical: 'https://globltools.com/instagram-photo-downloader',
  },
  openGraph: {
    title: 'Instagram Photo Downloader – Save Public Photos',
    description:
      'Preview single photos or every available image in a public carousel, then save the supplied JPG or PNG files.',
    type: 'website',
    url: 'https://globltools.com/instagram-photo-downloader',
    siteName: 'globltools',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Photo Downloader – Save Public Photos',
    description:
      'Preview single photos or every available image in a public carousel, then save the supplied JPG or PNG files.',
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
    question: 'Can I download every photo from an Instagram carousel?',
    answer:
      'Yes. When a public post contains multiple images, the downloader lists the available carousel slides so you can save individual photos or use the available batch option instead of capturing them one by one.',
  },
  {
    question: 'Will the downloaded image be JPG or PNG?',
    answer:
      'The saved file uses the image format Instagram supplies, commonly JPG and sometimes PNG. The tool does not turn a compressed post into the creator\'s untouched original file or promise a different format.',
  },
  {
    question: 'What photo quality can I expect?',
    answer:
      'You receive the highest-resolution image exposed for the public post. Instagram can resize and compress uploads, so the available dimensions may be smaller than the photo originally uploaded by the creator.',
  },
  {
    question: 'Which Instagram photo link should I paste?',
    answer:
      'Paste the full public instagram.com/p/ URL from the photo post\'s share menu. A profile URL does not identify a specific image, while private, deleted, or login-only post links cannot be processed.',
  },
  {
    question: 'What happens when a carousel mixes photos and videos?',
    answer:
      'The photo results show the image slides Instagram makes available in the public carousel. Video slides are a different media type and may need the Instagram Video Downloader.',
  },
];

const featureItems = [
  {
    title: 'Best Available Resolution',
    description: 'Keep the largest image dimensions Instagram exposes for each supported public photo post.',
  },
  {
    title: 'JPG and PNG Files',
    description: 'Save photos in the image format supplied by the post, commonly JPG and, when available, PNG.',
  },
  {
    title: 'Complete Carousel Preview',
    description: 'See the available image slides from a multi-photo post before choosing what to download.',
  },
  {
    title: 'Individual or Batch Save',
    description: 'Download one carousel image at a time or use the available batch option for multiple photos.',
  },
  {
    title: 'No Added Overlay',
    description: 'globltools does not place its own logo or watermark over the retrieved photo files.',
  },
  {
    title: 'Public Posts, No Login',
    description: 'Process supported public photo links without sharing Instagram account credentials.',
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
                  url: 'https://globltools.com/instagram-photo-downloader',
                  description:
                    'Preview and save available JPG or PNG images from a supported public Instagram photo or multi-image carousel post.',
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
                      item: 'https://globltools.com',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Photo Downloader',
                      item: 'https://globltools.com/instagram-photo-downloader',
                    },
                  ],
                },
                {
                  '@type': 'HowTo',
                  name: 'How to download Instagram photos and carousel images',
                  description: 'Copy a public photo-post link, load its single image or carousel slides, and save the available JPG or PNG files.',
                  step: [
                    {
                      '@type': 'HowToStep',
                      position: 1,
                      name: 'Copy the photo-post URL',
                      text: 'Open the public single-photo or carousel post and copy its instagram.com/p/ link from the share menu.',
                    },
                    {
                      '@type': 'HowToStep',
                      position: 2,
                      name: 'Load the post images',
                      text: 'Paste the post link into globltools to load the available image or all supported photo slides.',
                    },
                    {
                      '@type': 'HowToStep',
                      position: 3,
                      name: 'Choose and save the photos',
                      text: 'Check the image previews, then download one photo or save multiple carousel images using the available JPG or PNG files.',
                    },
                  ],
                },
                makeFAQSchema(faqItems),
              ],
            }),
          }}
        />

        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-5 py-2 text-sm font-bolder text-emerald-800 shadow-sm shadow-emerald-100">
            Fast | High Quality | Free
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Instagram Photo Downloader
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Preview a public post's single photo or complete image carousel, then save the best available JPG or PNG files you need.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Save Instagram photos in four easy steps</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {[
              'Copy the public photo-post URL',
              'Paste the full /p/ link above',
              'Preview one photo or every carousel image',
              'Save individual or multiple JPG/PNG files',
            ].map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm shadow-slate-200/50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-white text-base font-semibold text-emerald-700">
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Features</p>
              <h2 className="text-3xl font-semibold text-white">Photo and carousel support in one focused tool.</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Handle a standalone feed photo and a multi-image carousel without treating them as the same result. Preview each available slide, compare its dimensions, and keep the JPG or PNG quality Instagram supplies for that post.
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
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Why Use Instagram Photo Downloader</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Keep single photos and full carousel sets organized.</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                A screenshot can crop the frame, reduce detail, and include Instagram interface elements. This tool retrieves the best image version exposed for the public post and preserves its supplied JPG or PNG format without adding an overlay.
              </p>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                For a carousel, every available image slide appears separately. That makes it easier to select one frame or save multiple photos from the same post while keeping the carousel order clear.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Frequently Asked Questions</p>
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
