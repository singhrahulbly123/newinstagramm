'use client';

import { useState } from 'react';
import { trackEvent } from '../components/Analytics';
import { addDownloadHistory } from '../../lib/localDownloadHistory';

export default function ReelCoverClient() {
  const [url, setUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreviewUrl('');
    setDownloadUrl('');
    setMessage('');
    setLoading(true);
    trackEvent('reel_cover_submit');

    try {
      const response = await fetch('/api/reel-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Unable to find a Reel cover.');
        trackEvent('reel_cover_failure', { status_code: response.status });
        return;
      }
      setPreviewUrl(data.previewUrl);
      setDownloadUrl(data.downloadUrl);
      setMessage('Cover found. Preview it below before downloading.');
      trackEvent('reel_cover_ready');
    } catch {
      setMessage('A network error occurred. Please try again.');
      trackEvent('reel_cover_failure', { status_code: 0 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto]">
        <label htmlFor="reel-cover-url" className="sr-only">Public Instagram Reel URL</label>
        <input id="reel-cover-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.instagram.com/reel/..." className="min-h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500" />
        <button disabled={loading} className="min-h-14 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60">{loading ? 'Finding cover…' : 'Get Reel cover'}</button>
      </form>
      {message ? <p role="status" aria-live="polite" className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
      {previewUrl ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Reel cover preview</h2>
          <img src={previewUrl} alt="Cover extracted from the submitted public Instagram Reel" className="mx-auto mt-5 max-h-[620px] w-auto max-w-full rounded-2xl border border-slate-200 object-contain" />
          <a href={downloadUrl} download onClick={() => { trackEvent('reel_cover_download'); addDownloadHistory({ tool: 'Reel Cover Downloader', title: 'Instagram Reel cover', sourceUrl: url.trim() }); }} className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-6 text-sm font-bold text-white hover:bg-teal-800">Download cover</a>
        </section>
      ) : null}
    </div>
  );
}
