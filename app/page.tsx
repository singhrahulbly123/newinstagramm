import DownloadHero from './components/DownloadHero';

const discoverItems = [
  { title: 'Video downloader', description: 'Download reels, posts, stories, and videos in one click.' },
  { title: 'TV & Video', description: 'Save content for offline viewing on any device.' },
  { title: 'Video saving tool', description: 'Store downloaded files directly to your gallery or downloads.' },
];

const featureItems = [
  'Original quality without watermark or logo',
  'Download reels video in gallery on any device',
  'Download by link using your browser (No software)',
  '100% Lifetime Free with simple ads support',
];

const cards = [
  {
    title: 'Super-Fast Downloader',
    description:
      'Our Instagram reels downloader allows users to fetch reels and video content fast and free. It is built for speed and ease of use.',
  },
  {
    title: 'Content Formats',
    description:
      'Download reels in MP4 or MP3 format. The tool supports videos, audio, and photos with a single clean link.',
  },
];

const faqItems = [
  {
    question: 'Is Fastvideosave free to use?',
    answer: 'Yes, Fastvideosave is a 100% free online tool. You can download as many reels, videos, and photos as you want without any hidden costs.',
  },
  {
    question: 'Do I need to install any software or app?',
    answer: 'No, there is no installation required. Fastvideosave works directly in your browser on mobile and desktop.',
  },
  {
    question: 'What is the quality of the downloaded videos?',
    answer: 'We retrieve media at its original resolution. If the source is 1080p or higher, your download will preserve that quality.',
  },
  {
    question: 'Can I download content from private accounts?',
    answer: 'For privacy reasons, our tool only supports public Instagram content.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-full">
        <section className="mx-auto max-w-full border border-white/80 bg-white/90 py-5 shadow-glow backdrop-blur-xl sm:p-10">
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
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Is Fastvideosave free to use?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, Fastvideosave is a 100% free online tool. You can download as many reels, videos, and photos as you want without any hidden costs.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Do I need to install any software or app?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'No, there is no installation required. FastVideoSave works directly in your browser on mobile and desktop.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the quality of the downloaded videos?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'We retrieve media at its original resolution. If the source is 1080p or higher, your download will preserve that quality.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I download content from private accounts?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'For privacy reasons, our tool only supports public Instagram content.',
                    },
                  },
                ],
              }),
            }}
          />
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-50 px-5 py-2 text-sm font-bolder text-violet-700 shadow-sm shadow-violet-100">
              No Logo · High Quality · Free
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Instagram <span className="text-violet-600">Reels</span> Downloader
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Quickly download Instagram reels, photos, videos, and audio with one clean link. No app required, no watermark, and 100% free for mobile and desktop.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 sm:max-w-4xl sm:rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            {discoverItems.map((item) => (
              <div key={item.title} className="flex items-center justify-between border-b border-slate-200 py-4 last:border-b-0">
                <div>
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                </div>
                <span className="text-xl font-semibold text-slate-300">›</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
          <div className="max-w-4xl mx-auto">
                  <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Steps to Download Reels From Instagram</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Here’s a quick and easy way to do it:</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              'Copy Link of the video.',
              'Paste Link into input box.',
              'Tap Download Video button.',
            ].map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm shadow-slate-200/50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-200 bg-white text-base font-semibold text-violet-600">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-600">{step}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
         <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">How Instagram Downloader Works?</p>
              <h2 className="text-3xl font-semibold text-slate-950">An Instagram reels downloader that works without watermark or app.</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Fastvideosave.net is an online tool that helps you download Instagram reels, videos, and photos in high quality using only the post URL. Save Instagram content as MP4 or JPG instantly, with no watermark and no app required.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {featureItems.map((item) => (
                  <div key={item} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm shadow-slate-200/50">
                    <p className="font-semibold text-slate-950">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {cards.map((card) => (
                <div key={card.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
                  <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
         </div>
        </section>

        <section className="mx-auto max-w-full bg-slate-950/95 p-8 text-white shadow-xl shadow-slate-900/60">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Why use Fastvideosave.net?</p>
              <h2 className="mt-4 text-3xl font-semibold">Download Instagram reels without the app.</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-300">
                Instagram doesn’t allow direct downloads from the app or website. Fastvideosave.net helps you get clean, high-quality files quickly and easily.
              </p>
            </div>
            <div className="rounded-[2rem] bg-slate-900/95 p-6 text-sm leading-7 text-slate-300">
              <p className="font-semibold text-white">Note:</p>
              <p className="mt-3">Downloaded videos or audio cannot be used for commercial purposes.</p>
            </div>
          </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
         <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Frequently Asked Questions</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Everything you need to know about Fastvideosave.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
                <p className="font-semibold text-slate-950">{item.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
         </div>
        </section>

      </div>
    </main>
  );
}
