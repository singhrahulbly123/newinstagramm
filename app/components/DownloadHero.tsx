'use client';

import { useState } from 'react';

const sampleUrls = [
  'https://www.instagram.com/reel/Cx123abc/',
  'https://www.instagram.com/p/Cx456def/',
];

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
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || 'Unable to process the link.');
      } else if (data.success && data.downloadUrl) {
        const proxyUrl = data.proxyUrl || `/api/proxy?url=${encodeURIComponent(data.downloadUrl)}`;
        setDownloadUrl(`${proxyUrl}&download=1`);
        setPreviewUrl(proxyUrl);
        setPreviewType(data.previewType || (data.downloadUrl?.endsWith('.mp4') ? 'video' : 'image'));
        setStatus('Preview generated. You can download the reel below.');
      } else {
        setStatus(data.error || 'Unable to extract the reel link.');
      }
    } catch (error) {
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
          className="inline-flex h-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Paste'}
        </button>
      </form>

      {status ? <p className="rounded-[1.75rem] bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-200/50">{status}</p> : null}
      {previewUrl ? (
        <div className="rounded-[1.75rem] bg-white px-4 py-5 text-sm text-slate-700 shadow-sm shadow-slate-200/50 m-auto ">
          <p className="font-semibold text-slate-950">Preview</p>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 max-w-[342px] m-auto">
            {previewType === 'video' ? (
              <video controls preload="metadata" className="w-full max-h-[600px] rounded-[1.5rem] bg-black object-contain">
                <source src={previewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={previewUrl} alt="Instagram preview" className="w-full max-h-[600px] rounded-[1.5rem] object-contain" />
            )}
          </div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              rel="noreferrer"
              download
              className="mt-4 inline-flex items-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Download Reel
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
