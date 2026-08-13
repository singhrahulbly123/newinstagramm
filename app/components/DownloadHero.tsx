'use client';

import Image from 'next/image';
import { useState } from 'react';
import DownloadSection from '../../components/DownloadSection';
import { trackEvent } from './Analytics';
import { addDownloadHistory } from '../../lib/localDownloadHistory';

export default function DownloadHero() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewType, setPreviewType] = useState<'video' | 'image' | ''>('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setDownloadUrl('');
    setPreviewUrl('');
    setPreviewType('');

    if (!url.trim()) {
      setStatus('Please paste an Instagram link first.');
      trackEvent('download_validation_error');
      return;
    }

    trackEvent('download_submit', { source: 'instagram' });

    setLoading(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        trackEvent('download_failure', { status_code: response.status });
        setStatus(data.error || 'Unable to process the link.');
      } else if (data.success && data.downloadUrl) {
        const proxyUrl = data.proxyUrl || `/api/proxy?url=${encodeURIComponent(data.downloadUrl)}`;
        setDownloadUrl(`${proxyUrl}&download=1`);
        setPreviewUrl(proxyUrl);
        setPreviewType(data.previewType || (data.downloadUrl?.endsWith('.mp4') ? 'video' : 'image'));
        setStatus('Preview generated. You can download the reel below.');
        trackEvent('download_ready', { media_type: data.previewType || 'unknown' });
      } else {
        trackEvent('download_failure', { status_code: response.status });
        setStatus(data.error || 'Unable to extract the reel link.');
      }
    } catch (error) {
      trackEvent('download_network_error');
      setStatus('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-200/50 sm:grid-cols-[1fr_auto] sm:items-center">
        <label htmlFor="instagram-url" className="sr-only">Instagram link</label>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100">
          <span className="text-slate-400">🔗</span>
          <input
            id="instagram-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste Link Here..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex h-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          {loading ? 'Processing…' : 'Download'}
        </button>
      </form>


      

      {status ? <p className="rounded-[1.75rem] bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-200/50" role="alert" aria-live="polite">{status}</p> : null}
      {previewUrl ? (
        <div className="rounded-[1.75rem] bg-white px-4 py-5 text-sm text-slate-700 shadow-sm shadow-slate-200/50 m-auto ">
          <p className="font-semibold text-slate-950">Preview</p>
          <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 max-w-[342px] m-auto" style={{ minHeight: 340 }}>
            {previewType === 'video' ? (
              <video controls preload="metadata" className="w-full max-h-[600px] rounded-[1.5rem] bg-black object-contain">
                <source src={previewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={previewUrl}
                alt="Instagram preview"
                fill
                className="object-contain"
                sizes="(max-width: 342px) 100vw"
              />
            )}
          </div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              rel="noreferrer"
              download
              onClick={() => {
                trackEvent('download_click', { media_type: previewType || 'unknown' });
                addDownloadHistory({ tool: 'Instagram Downloader', title: `Instagram ${previewType || 'media'}`, sourceUrl: url.trim() });
              }}
              className="mt-4 inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Download Reel
            </a>
          ) : null}
        </div>
      ) : null}

      <DownloadSection />
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Service safeguards">
        {[
          ['Public links only', 'Private, removed, age-restricted, or region-blocked posts cannot be fetched.'],
          ['No Instagram login', 'Never enter your Instagram password or account credentials on this website.'],
          ['Respect creators', 'Download only content you own or have permission to save and reuse.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{description}</p>
          </article>
        ))}
      </section>
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800">
              Quick guide
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-950">How to download Instagram content</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Follow these simple steps to save reels, videos, stories, and photos using the same input field above.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-3xl border border-emerald-200/70 bg-white p-4 shadow-sm shadow-emerald-100">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-800">
                Step 1
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-center leading-10 text-lg">🔗</div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-950">Paste your Instagram link</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Copy the public post, reel, or story URL and paste it into the input field above.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-800">
                Step 2
              </div>
              <div className="h-10 w-10 rounded-2xl bg-teal-100 text-center leading-10 text-lg">🎬</div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-950">Auto-detect and preview</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">The tool checks the link instantly and shows a preview before you download the file.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-800">
                Step 3
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-100 text-center leading-10 text-lg">⬇️</div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-950">Download in one click</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Click the download button and save the file directly on your device with no extra steps.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
