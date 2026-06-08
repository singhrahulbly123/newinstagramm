'use client';

import { useMemo, useState } from 'react';

type YoutubeFormat = {
  itag: number;
  quality: string;
  mimeType: string;
  url: string;
  container?: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  bitrate?: number;
  audioBitrate?: number;
};

type YoutubeExtractionResponse = {
  success: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
  formatsCount?: number;
  adaptiveFormatsCount?: number;
  formats?: YoutubeFormat[];
  error?: string;
  debug?: string[];
};

export default function YoutubePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<YoutubeExtractionResponse | null>(null);
  const [selectedItag, setSelectedItag] = useState<number | null>(null);

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setResult(null);
    setSelectedItag(null);

    const url = input.trim();
    if (!url) {
      setStatus('Please paste a YouTube URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as YoutubeExtractionResponse;
      if (!res.ok || !data.success) {
        setStatus(data.error || 'Extraction failed');
        setResult(data);
        return;
      }
      setResult(data);
      setSelectedItag(data.formats?.[0]?.itag ?? null);
      setStatus('Video extracted — select quality and download.');
    } catch (err) {
      setStatus('Network error');
      setResult({ success: false, error: 'Network error', debug: [err instanceof Error ? err.stack || err.message : String(err)] });
    } finally {
      setLoading(false);
    }
  }

  const selectedFormat = useMemo(
    () => result?.formats?.find((q) => q.itag === selectedItag) ?? null,
    [result, selectedItag],
  );

  const filename = useMemo(() => {
    const safeTitle = (result?.title || 'youtube-video').replace(/[^a-zA-Z0-9-_\. ]/g, '_');
    return `${safeTitle}-${selectedFormat?.quality || 'sd'}.mp4`;
  }, [result, selectedFormat]);

  const previewUrl = selectedFormat
    ? `/api/youtube-download?videoId=${encodeURIComponent(result?.videoId || '')}&itag=${selectedFormat.itag}&mode=preview`
    : undefined;
  const downloadUrl = selectedFormat
    ? `/api/youtube-download?videoId=${encodeURIComponent(result?.videoId || '')}&itag=${selectedFormat.itag}&filename=${encodeURIComponent(filename)}`
    : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">▶️ YouTube Downloader</div>
          <h1 className="text-3xl font-bold">YouTube Shorts & Video Downloader</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">Paste a YouTube link and extract downloadable MP4 qualities safely through the server.</p>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <form onSubmit={handleExtract} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-lg border px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-red-600 to-pink-500 px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? 'Working…' : 'Extract'}
            </button>
          </form>

          {status && <div className="mt-3 text-sm text-slate-600">{status}</div>}

          {result && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h2 className="font-semibold text-lg">{result.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{result.description}</p>
                  <div className="mt-4 rounded-lg bg-slate-950 text-white">
                    {previewUrl && selectedFormat?.hasVideo && selectedFormat?.hasAudio ? (
                      <video src={previewUrl} controls poster={result.thumbnail || undefined} className="w-full rounded-lg bg-black" />
                    ) : result.thumbnail ? (
                      <img src={result.thumbnail} alt={result.title} className="w-full rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded-lg bg-slate-900 text-slate-300">Preview unavailable</div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-slate-50">
                  <div className="flex flex-wrap gap-2 text-xs uppercase text-slate-500">Debug</div>
                  <div className="mt-3 text-sm text-slate-700">
                    <p>Formats: {result.formatsCount ?? '—'}</p>
                    <p>Adaptive formats: {result.adaptiveFormatsCount ?? '—'}</p>
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
                <p className="text-xs uppercase text-slate-500">Choose quality</p>
                <div className="mt-3 grid gap-2">
                  {result.formats?.map((format) => (
                    <button
                      key={format.itag}
                      type="button"
                      onClick={() => setSelectedItag(format.itag)}
                      className={`rounded-md px-3 py-2 text-left text-sm font-semibold ${selectedItag === format.itag ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-900'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{format.quality}</span>
                        <span className="text-[11px] uppercase text-slate-500">{format.mimeType}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {format.hasVideo && format.hasAudio ? 'Video + Audio' : format.hasVideo ? 'Video only' : 'Audio only'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <a
                    href={downloadUrl ?? '#'}
                    className="block w-full text-center rounded-md bg-gradient-to-r from-red-600 to-pink-500 px-4 py-3 text-white"
                  >
                    Download {selectedFormat?.quality ?? 'video'}
                  </a>
                </div>
              </aside>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
