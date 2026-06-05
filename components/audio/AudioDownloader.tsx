'use client';

import { useMemo, useState } from 'react';
import AudioInfo from './AudioInfo';
import AudioPreview from './AudioPreview';
import type { AudioApiResponse } from '../../types/audio';

const sampleUrls = ['https://www.instagram.com/reel/Cx123abc/'];

export default function AudioDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AudioApiResponse | null>(null);

  const downloadUrl = useMemo(() => {
    if (!result?.audioUrl) return '';
    const url = new URL(result.audioUrl, window.location.origin);
    url.searchParams.set('download', '1');
    return url.toString();
  }, [result]);

  const previewAudioUrl = useMemo(() => {
    if (!result?.audioUrl) return '';
    return result.audioUrl;
  }, [result]);

  const statusMessage = useMemo(() => {
    if (status) return status;
    if (result?.success) return 'Audio extracted successfully. Download your MP3 below.';
    return 'Paste a public Instagram reel URL to extract audio and download MP3.';
  }, [result, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setResult(null);

    if (!url.trim()) {
      setStatus('Please paste an Instagram reel URL first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = (await response.json()) as AudioApiResponse;
      if (!response.ok || !data.success || !data.audioUrl) {
        setResult(null);
        setStatus(data.error || 'Unable to extract audio from the provided Instagram link.');
        return;
      }

      setResult(data);
      setStatus('Audio extraction completed. You can download the MP3 now.');
    } catch {
      setResult(null);
      setStatus('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-200/50 sm:grid-cols-[1fr_auto] sm:items-center">
        <label htmlFor="instagram-audio-url" className="sr-only">
          Instagram reel URL
        </label>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100">
          <span className="text-slate-400">🎵</span>
          <input
            id="instagram-audio-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={sampleUrls[0]}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Instagram reel URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Extract Audio'}
        </button>
      </form>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm shadow-slate-200/50" aria-live="polite">
        <p className="font-semibold text-slate-950">Status</p>
        <p className="mt-2 leading-7 text-slate-600">{statusMessage}</p>
      </div>

      {result?.debug?.length ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm shadow-slate-200/50">
          <p className="font-semibold text-slate-950">Extraction diagnostics</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-xs text-slate-600">
            {result.debug.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result?.success && result.audioUrl ? (
        <div className="grid gap-6">
          <div className="space-y-6">
            <AudioPreview audioUrl={previewAudioUrl} previewUrl={result.previewUrl || null} title={result.title || 'Instagram Reel Audio'} author={result.author || null} />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Download MP3</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={downloadUrl}
                  download={result.filename || 'instagram-audio.mp3'}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Download MP3
                </a>
                <div className="rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  {result.filename || 'instagram-audio.mp3'}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The MP3 download is prepared from the reel source and served through a secure proxy for fast playback and file transfer.
              </p>
            </div>
          </div>

          <AudioInfo
            title={result.title || 'Instagram Reel Audio'}
            author={result.author || null}
            duration={result.duration ?? null}
            fileType={result.fileType || 'audio/mpeg'}
            fileSize={result.fileSize ?? null}
            description={result.description || null}
          />
        </div>
      ) : null}
    </div>
  );
}
