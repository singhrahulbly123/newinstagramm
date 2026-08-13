'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type YoutubeQuality = { label: string; url: string };

type YoutubeExtractionResponse = {
  success: boolean;
  title?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
  qualities?: YoutubeQuality[];
  error?: string;
  debug?: string[];
};

export default function YoutubeDownloaderClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<YoutubeExtractionResponse | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setStatus('Please paste a YouTube URL first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as YoutubeExtractionResponse;
      if (!res.ok || !data.success) {
        setStatus(data.error || 'Unable to extract YouTube video.');
        setResult(data);
        return;
      }
      setResult(data);
      if (data.qualities && data.qualities.length > 0) setSelectedQuality(data.qualities[0].label);
      setStatus('Video found! Choose quality and download.');
    } catch (err) {
      setStatus('Network error. Please try again.');
      setResult({ success: false, error: 'Network error', debug: [err instanceof Error ? err.message : String(err)] });
    } finally {
      setLoading(false);
    }
  }

  const selectedQualityUrl = useMemo(() => result?.qualities?.find((q) => q.label === selectedQuality)?.url, [result, selectedQuality]);
  const filename = useMemo(() => {
    const safeTitle = (result?.title || 'youtube-video').replace(/[^a-zA-Z0-9-_\. ]/g, '_');
    return `${safeTitle}-${selectedQuality}.mp4`;
  }, [result, selectedQuality]);

  const downloadUrl = selectedQualityUrl ? `/api/youtube-download?url=${encodeURIComponent(selectedQualityUrl)}&filename=${encodeURIComponent(filename)}` : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm sm:px-5 sm:text-sm">
              ▶️ YouTube Shorts & Video Downloader
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              YouTube <span className="bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 bg-clip-text text-transparent">Shorts</span> & Video Downloader
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 md:text-lg">
              Download YouTube Shorts and Videos in HD quality instantly. Paste a YouTube link, preview the video, select quality, and download.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="youtube-url" className="block text-sm font-semibold text-slate-900 dark:text-white">YouTube URL</label>
                <div className="flex gap-3">
                  <input
                    id="youtube-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none"
                    required
                  />
                  <button type="submit" disabled={loading} className="rounded-lg bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 px-6 py-3 text-sm font-semibold text-white">
                    {loading ? 'Working…' : 'Extract'}
                  </button>
                </div>
              </div>
            </form>

            {status && <div className="mt-3 text-sm text-slate-600">{status}</div>}

            {result && (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h2 className="font-semibold text-lg">{result.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">{result.description}</p>
                    <div className="mt-4 rounded-lg bg-slate-950 text-white">
                      {result.thumbnail ? (
                        <Image
                          src={result.thumbnail}
                          alt={result.title || 'Video thumbnail'}
                          width={400}
                          height={225}
                          className="w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center rounded-lg bg-slate-900 text-slate-300">Preview unavailable</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="flex flex-wrap gap-2 text-xs uppercase text-slate-500">Debug</div>
                    <div className="mt-3 text-sm text-slate-700">
                      <p>Duration: {result.duration ?? '—'}</p>
                    </div>
                    {result.debug && result.debug.length > 0 && (
                      <div className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-600">
                        <strong>Logs</strong>
                        <pre className="mt-2 overflow-x-auto text-[11px] leading-5">{result.debug.join('\n')}</pre>
                      </div>
                    )}
                  </div>
                </div>

                <aside className="rounded-lg border p-4">
                  <p className="text-xs uppercase text-slate-500">Available Qualities</p>
                  <div className="mt-3 grid gap-2">
                    {result.qualities?.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => setSelectedQuality(q.label)}
                        className={`rounded-md px-3 py-2 text-left text-sm font-semibold ${selectedQuality === q.label ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <a href={downloadUrl ?? '#'} className="block w-full rounded-md bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 px-4 py-3 text-center text-white font-semibold">
                      Download {selectedQuality}
                    </a>
                  </div>
                </aside>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
