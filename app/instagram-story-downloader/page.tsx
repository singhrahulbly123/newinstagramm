import type { Metadata } from 'next';
import StoryDownloader from '../../components/story/StoryDownloader';

export const metadata: Metadata = {
  title: 'Instagram Story Downloader – View and Download Public Stories | globltools',
  description: 'Preview active public Instagram Stories and save available photo or video slides before their 24-hour window ends. Highlights and expired Stories have different availability.',
  metadataBase: new URL('https://globltools.com'),
  openGraph: {
    title: 'Instagram Story Downloader – View and Download Public Stories',
    description: 'Check active public Instagram Stories and save available photo or video slides before they expire.',
    type: 'website',
    url: 'https://globltools.com/instagram-story-downloader',
    siteName: 'globltools',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://globltools.com/instagram-story-downloader',
  },
};

const faqItems = [
  {
    question: 'How long does an Instagram Story remain active?',
    answer:
      'A standard Instagram Story is generally visible for 24 hours after it is posted unless the creator deletes it sooner. Submit the public profile or Story link while the slide is still active and accessible.',
  },
  {
    question: 'Can this tool recover a Story after it expires?',
    answer:
      'No. Once a Story has expired, been deleted, or stopped being publicly available, the downloader cannot bring it back. It only checks media Instagram currently exposes for the public profile.',
  },
  {
    question: 'Are Instagram Highlights the same as active Stories?',
    answer:
      'No. A Highlight is a Story the account owner has chosen to keep on their profile beyond the normal 24-hour window. This tool focuses on active public Stories, so a Highlight is not guaranteed to appear in the results.',
  },
  {
    question: 'Can I save both photo and video Story slides?',
    answer:
      'Yes, when Instagram exposes them for a supported public profile. The preview identifies image and video slides separately, allowing you to download one available item or all currently visible Story media.',
  },
  {
    question: 'Why can an active Story still be unavailable?',
    answer:
      'The account may be private, or the Story may require login, have an age or region restriction, be limited to Close Friends, or have already been removed. The downloader does not bypass those controls.',
  },
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-emerald-950 to-teal-900 px-6 py-16 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(236,72,153,0.16), transparent 28%)' }} />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-white/10">
                <span className="text-emerald-200">Stories</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Public Instagram stories only
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@graph': [
                      {
                        '@type': 'WebApplication',
                        name: 'Instagram Story Downloader',
                        url: 'https://globltools.com/instagram-story-downloader',
                        description: 'Check active public Instagram Stories and save available photo or video slides before their 24-hour window ends.',
                        applicationCategory: 'Utilities',
                        operatingSystem: 'Web',
                      },
                      {
                        '@type': 'HowTo',
                        name: 'How to preview and download Instagram stories',
                        description: 'Use a public profile or Story link, check its active 24-hour slides, and save the available photo or video media before it expires.',
                        step: [
                          {
                            '@type': 'HowToStep',
                            position: 1,
                            name: 'Open the active Story',
                            text: 'Before the 24-hour window ends, open the public Story or its profile and copy the link or username.',
                          },
                          {
                            '@type': 'HowToStep',
                            position: 2,
                            name: 'Check the public profile',
                            text: 'Paste the Story URL, profile URL, or username into globltools to look for currently active slides.',
                          },
                          {
                            '@type': 'HowToStep',
                            position: 3,
                            name: 'Preview and save before expiry',
                            text: 'Review each available photo or video slide, then download one item or all visible Story media before it disappears.',
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
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Instagram Story Viewer & Downloader
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Check the photo and video slides currently available from a supported public profile, then save what you need before the usual 24-hour Story window closes.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Stories are time-sensitive; Highlights are different because the creator chooses to keep them on the profile. Expired, Close Friends, private, and login-only media cannot be recovered here.
              </p>
             
            </div>
            <div className="rounded-[2rem] p-6 mt-10 shadow-glow shadow-slate-950/30">
              <StoryDownloader />
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 dark:bg-slate-950/90 dark:border-slate-800">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">How to Download</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Save an active Story before its 24-hour window ends</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Use a public Story URL, profile URL, or username while the slides are still live. The tool checks current availability; it does not retrieve an expired Story from an archive.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: 'Find the active Story',
                    description: 'Open the public Story before it expires, then copy its link or note the profile username.',
                    icon: '🔗',
                  },
                  {
                    title: 'Check current slides',
                    description: 'Paste the Story link, profile link, or username above to load media that is still publicly visible.',
                    icon: '📎',
                  },
                  {
                    title: 'Save before expiry',
                    description: 'Preview each available photo or video slide, then download one item or all visible Stories in time.',
                    icon: '⬇️',
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg dark:bg-emerald-900/40">{item.icon}</div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-8 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">FAQ</p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">Story expiry and Highlight questions</h3>
                <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {faqItems.map((item) => (
                    <div key={item.question}>
                      <p className="font-semibold text-slate-950 dark:text-white">{item.question}</p>
                      <p className="mt-2">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Before you start</p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">Check availability before the Story disappears</h3>
                <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">Confirm that the Story is still active</p>
                    <p className="mt-2">A normal Story lasts about 24 hours. If the profile ring or Story slide has disappeared, the downloader cannot restore it.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">Check public access</p>
                    <p className="mt-2">Private accounts, Close Friends slides, and Stories blocked for logged-out viewers remain unavailable.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">Do not confuse Stories with Highlights</p>
                    <p className="mt-2">Highlights can remain on a profile after 24 hours, but this active-Story checker does not guarantee Highlight results.</p>
                  </div>
                </div>
              </article>
            </section>
          </div>
          </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">A live check for temporary Story media</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              The tool validates the username or Story URL and checks the public profile for slides that are active at that moment. Available images and videos appear as separate previews, while expired or access-controlled media stays unavailable.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Username or Story URL',
              'Active slide detection',
              'Photo and video previews',
              'Single or download-all options',
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <p className="font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { title: '24-hour Stories', description: 'Save an available slide while it is live; expired or deleted Story media cannot be reconstructed.' },
            { title: 'Highlights are different', description: 'A creator can preserve a Story as a profile Highlight, but Highlight media is not guaranteed in active Story results.' },
            { title: 'Public access only', description: 'Private, Close Friends, age-restricted, region-restricted, and login-only Stories cannot be retrieved.' },
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
