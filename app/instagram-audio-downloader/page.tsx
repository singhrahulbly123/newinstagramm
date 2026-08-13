import type { Metadata } from 'next';
import AudioDownloader from '../../components/audio/AudioDownloader';
import { makeFAQSchema } from '../../lib/schemas';

export const metadata: Metadata = {
  title: 'Instagram Audio Downloader – Extract Audio from Public Reels | globltools',
  description:
    'Extract music, speech, or other available audio from a supported public Instagram Reel and prepare a 192 kbps MP3 without logging in.',
  metadataBase: new URL('https://globltools.com'),
  alternates: {
    canonical: 'https://globltools.com/instagram-audio-downloader',
  },
  openGraph: {
    title: 'Instagram Audio Downloader – Extract Audio from Public Reels',
    description:
      'Extract the available Reel soundtrack and prepare it as a widely compatible 192 kbps MP3.',
    type: 'website',
    url: 'https://globltools.com/instagram-audio-downloader',
    siteName: 'globltools',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Audio Downloader – Extract Audio from Public Reels',
    description:
      'Extract the available Reel soundtrack and prepare it as a widely compatible 192 kbps MP3.',
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
    question: 'How is music extracted from an Instagram Reel?',
    answer:
      'The tool reads the media source exposed for a supported public Reel, separates its audio track from the video, and converts that track into an MP3. The visual part of the Reel is not included in the audio download.',
  },
  {
    question: 'What bitrate does the downloaded MP3 use?',
    answer:
      'The MP3 is encoded at 192 kbps for a practical balance of listening quality and file size. Encoding at 192 kbps cannot restore detail already lost in Instagram\'s compressed or low-quality source audio.',
  },
  {
    question: 'Can I extract voices and sound effects as well as music?',
    answer:
      'Yes. Extraction captures the Reel\'s combined soundtrack, which may contain music, narration, dialogue, ambient sound, or effects. It cannot isolate vocals or remove background music from that mixed track.',
  },
  {
    question: 'Why can a Reel produce no MP3?',
    answer:
      'The Reel may be muted, private, deleted, region-restricted, or unavailable without an Instagram login. Extraction also fails when Instagram does not expose a usable media track for the public link.',
  },
  {
    question: 'Can I edit or reuse music taken from a Reel?',
    answer:
      'An MP3 download does not grant rights to the music, voice, or recording. Use it for editing or publishing only when you own the audio, have permission, or your intended use is otherwise legally allowed.',
  },
];

const featureItems = [
  {
    title: 'Reel-to-MP3 Extraction',
    description: 'Separate the available soundtrack from a public Reel and save an audio-only MP3 file.',
  },
  {
    title: '192 kbps MP3 Output',
    description: 'Encode the extracted track at 192 kbps while recognizing that final clarity is limited by the Reel source.',
  },
  {
    title: 'Music, Voice, and Effects',
    description: 'Keep the combined soundtrack, whether it contains a song, spoken quote, narration, or sound effects.',
  },
  {
    title: 'Audio Preview',
    description: 'Listen to the prepared result before saving it so you can confirm the correct Reel audio was extracted.',
  },
  {
    title: 'Playback Compatibility',
    description: 'Use the MP3 with common phones, computers, music players, and audio-editing applications.',
  },
  {
    title: 'Public Links, No Login',
    description: 'Extract from supported public Reel URLs without providing Instagram account credentials.',
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
                  url: 'https://globltools.com/instagram-audio-downloader',
                  description:
                    'Extract the available music, speech, or mixed soundtrack from a supported public Instagram Reel and prepare a 192 kbps MP3.',
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
                      name: 'Audio Downloader',
                      item: 'https://globltools.com/instagram-audio-downloader',
                    },
                  ],
                },
                {
                  '@type': 'HowTo',
                  name: 'How to extract audio from an Instagram Reel',
                  description: 'Copy a public Reel link, detect its soundtrack, convert the extracted track to MP3, and save the audio-only result.',
                  step: [
                    {
                      '@type': 'HowToStep',
                      position: 1,
                      name: 'Copy the Reel link',
                      text: 'Open the public Reel containing the music or spoken audio you need and copy its share URL.',
                    },
                    {
                      '@type': 'HowToStep',
                      position: 2,
                      name: 'Detect the soundtrack',
                      text: 'Paste the Reel link into globltools so the available media source and its audio track can be detected.',
                    },
                    {
                      '@type': 'HowToStep',
                      position: 3,
                      name: 'Preview and save the MP3',
                      text: 'Listen to the extracted result, then save the prepared 192 kbps MP3 audio file to your device.',
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
            Fast | High Quality | MP3
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Instagram Audio Downloader
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Turn the available music, narration, or mixed soundtrack from a public Reel into a 192 kbps MP3—without downloading the video itself.
          </p>
        </div>

        <div className="mx-auto mt-8 sm:max-w-4xl sm:rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <AudioDownloader />
        </div>
      </section>

      <section className="mx-auto max-w-full bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Extract audio in four easy steps</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {[
              'Copy the public Reel share URL',
              'Paste the link into the audio extractor',
              'Detect and separate the soundtrack',
              'Preview and save the 192 kbps MP3',
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
              <h2 className="text-3xl font-semibold text-white">A focused Reel soundtrack extractor.</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Remove the visual layer and keep the combined soundtrack as a compatible MP3. The file is encoded at 192 kbps, while its real clarity remains limited by the audio quality Instagram supplies for that Reel.
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
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Why Use Instagram Audio Downloader</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Keep the sound when you do not need the video.</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                A Reel may contain a useful song reference, voiceover, interview quote, pronunciation sample, or sound effect. Audio extraction separates that combined soundtrack from the picture and prepares a smaller MP3 for listening or authorized editing.
              </p>
              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Previewing the track before download helps confirm that the Reel is not silent and that the extracted audio is the one you expected. The conversion preserves the source duration but does not split stems, isolate vocals, or improve audio already compressed by Instagram.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Frequently Asked Questions</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">MP3 extraction, bitrate, and Reel audio answers.</h2>
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
