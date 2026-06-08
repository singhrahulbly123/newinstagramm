'use client';

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

export default function YoutubeDownloaderPage() {
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

  // derive embed id for preview (prefer extracted thumbnail/video id from result.debug if available)
  const embedId = useMemo(() => {
    try {
      // try to parse common youtube id from provided url or original input
      const candidate = result?.debug?.find(Boolean) || url;
      const m = (candidate || '').match(/(?:v=|\/shorts\/|youtu\.be\/)([\w-_-]{11})/);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  }, [result, url]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 shadow-sm sm:px-5 sm:text-sm">
              ▶️ YouTube Shorts & Video Downloader
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              YouTube <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">Shorts</span> & Video Downloader
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
                  <button type="submit" disabled={loading} className="rounded-lg bg-gradient-to-r from-red-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white">
                    {loading ? 'Working…' : 'Extract'}
                  </button>
                </div>
              </div>
            </form>

            {status && <div className="mt-3 text-sm text-slate-600">{status}</div>}

            {result?.success && (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="rounded-xl border p-4">
                    <h2 className="font-semibold text-lg">{result.title}</h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">{result.description}</p>
                    <div className="mt-4">
                      {embedId ? (
                        <div className="relative" style={{ paddingTop: '56.25%' }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${embedId}`}
                            title={result.title}
                            className="absolute inset-0 w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      ) : result.thumbnail ? (
                        <img src={result.thumbnail} alt={result.title} className="w-full rounded-lg" />
                      ) : null}
                    </div>
                  </div>
                </div>

                <aside className="rounded-xl border p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Available Qualities</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {result.qualities?.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setSelectedQuality(q.label)}
                        className={`rounded-md px-3 py-2 text-xs font-semibold ${selectedQuality === q.label ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <a href={downloadUrl || '#'} className="inline-block w-full rounded-md bg-gradient-to-r from-red-600 to-pink-500 px-4 py-3 text-center text-white font-semibold">
                      Download {selectedQuality}
                    </a>
                  </div>
                </aside>
              </div>
            )}

            {/* FAQ + SEO JSON-LD */}
            <div className="mt-8 text-sm text-slate-600">
              <h3 className="font-semibold">FAQ</h3>
              <p className="mt-2">Supports YouTube standard watch URLs, youtu.be short links, and shorts links.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Related Tools</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Relate To YouTube
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Download YouTube content with a variety of tools for videos, music, shorts, and more.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'YouTube Video Downloader', subtitle: 'Download videos in HD, Full HD, or MP4.', icon: '▶️' },
                { title: 'YouTube to MP3', subtitle: 'Convert YouTube videos to MP3 quickly.', icon: '🎵' },
                { title: 'YouTube to MP4', subtitle: 'Save MP4 files in high quality.', icon: '📹' },
                { title: 'YouTube Audio Downloader', subtitle: 'Extract audio tracks from videos.', icon: '🎧' },
                { title: 'YouTube Music', subtitle: 'Download music from YouTube easily.', icon: '🎶' },
                { title: 'YouTube Shorts', subtitle: 'Save YouTube Shorts without watermark.', icon: '🎬' },
                { title: 'YouTube Song Downloader', subtitle: 'Download songs from YouTube videos.', icon: '🎤' },
                { title: 'YouTube Movies', subtitle: 'Download movie clips from YouTube.', icon: '🎞️' },
                { title: 'YouTube Downloader', subtitle: 'A complete YouTube downloading solution.', icon: '⬇️' },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.subtitle}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'YouTube Shorts & Video Downloader',
            description: 'Download YouTube Shorts and Videos in HD quality instantly.',
          }),
        }}
      />
    </main>
  );
}
