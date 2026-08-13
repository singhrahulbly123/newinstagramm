'use client';

import { useState } from 'react';
import { trackEvent } from '../components/Analytics';

type Result = { caption: string; captionWithoutHashtags: string; hashtags: string[] };

export default function CaptionExtractorClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1800);
    trackEvent('caption_copy', { content_type: label });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setResult(null); setMessage('');
    trackEvent('caption_extractor_submit');
    try {
      const response = await fetch('/api/caption-hashtags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url.trim() }) });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error || 'Caption unavailable.'); trackEvent('caption_extractor_failure', { status_code: response.status }); return; }
      setResult(data); setMessage('Caption found. Copy the full caption, clean text, or hashtags.'); trackEvent('caption_extractor_ready');
    } catch { setMessage('A network error occurred. Please try again.'); }
    finally { setLoading(false); }
  }

  return <div className="space-y-5">
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto]">
      <label htmlFor="caption-url" className="sr-only">Instagram post or Reel URL</label>
      <input id="caption-url" required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a public Reel or post URL" className="min-h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500" />
      <button disabled={loading} className="min-h-14 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">{loading ? 'Extracting…' : 'Extract caption'}</button>
    </form>
    {message ? <p role="status" className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
    {result ? <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Full caption</h2><button onClick={() => copy('full_caption', result.caption)} className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-900">{copied === 'full_caption' ? 'Copied' : 'Copy'}</button></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{result.caption}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Caption without hashtags</h2><button onClick={() => copy('clean_caption', result.captionWithoutHashtags)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">{copied === 'clean_caption' ? 'Copied' : 'Copy'}</button></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{result.captionWithoutHashtags || 'No text remains after removing hashtags.'}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Hashtags ({result.hashtags.length})</h2><button disabled={!result.hashtags.length} onClick={() => copy('hashtags', result.hashtags.join(' '))} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold disabled:opacity-40">{copied === 'hashtags' ? 'Copied' : 'Copy all'}</button></div><div className="mt-4 flex flex-wrap gap-2">{result.hashtags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">{tag}</span>)}</div></section>
    </div> : null}
  </div>;
}
