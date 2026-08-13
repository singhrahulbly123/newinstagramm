import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Instagram Download Tools for Reels, Videos, Photos, Audio and Stories | globltools',
  description: 'Choose the globltools workflow that matches your public Instagram link: Reel, feed video, photo or carousel, audio, Story, or profile picture.',
  alternates: { canonical: 'https://globltools.com/instagram' },
};

const tools = [
  {
    href: '/instagram-reel-downloader',
    title: 'Reel Downloader',
    description: 'Save the available MP4 from a public vertical short-form Reel.',
  },
  {
    href: '/instagram-video-downloader',
    title: 'Video Downloader',
    description: 'Handle supported public feed videos and accessible legacy IGTV-style posts.',
  },
  {
    href: '/instagram-photo-downloader',
    title: 'Photo Downloader',
    description: 'Preview a single photo or the available images in a public carousel.',
  },
  {
    href: '/instagram-audio-downloader',
    title: 'Audio Downloader',
    description: 'Extract the available soundtrack from a supported public Reel as MP3.',
  },
  {
    href: '/instagram-story-downloader',
    title: 'Story Downloader',
    description: 'Check currently active public photo and video Story slides before expiry.',
  },
  {
    href: '/instagram-profile-picture-downloader',
    title: 'Profile Picture Downloader',
    description: 'Preview the public profile image available for a supported username.',
  },
];

export default function InstagramToolsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-soft px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Instagram tools</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Choose the right downloader for your Instagram link</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Reels, feed videos, photos, audio, Stories, and profile pictures behave differently. Start with the focused tool that matches the public media you are trying to save.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <article key={tool.href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{tool.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{tool.description}</p>
              <Link href={tool.href} className="mt-5 inline-flex font-bold text-emerald-800 hover:underline">
                Open tool →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-slate-700">
          globltools works with supported public Instagram content and does not bypass private accounts, Close Friends audiences, login requirements, or regional restrictions. Download and reuse media only when you have the necessary rights.
        </div>
      </section>
    </main>
  );
}
