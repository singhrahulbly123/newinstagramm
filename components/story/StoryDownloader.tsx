'use client';

import { useMemo, useState } from 'react';
import StoryProfile from './StoryProfile';
import StoryGrid from './StoryGrid';
import StoryPreview from './StoryPreview';
import StorySkeleton from './StorySkeleton';
import type { StoryExtractionResult, StoryItem } from '../../types/story';

const sampleUrls = ['https://www.instagram.com/stories/natgeo/', 'natgeo', '@natgeo'];

export default function StoryDownloader() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Paste a public Instagram story URL or username.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryExtractionResult | null>(null);
  const [previewItem, setPreviewItem] = useState<StoryItem | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const helperText = useMemo(() => {
    if (status) return status;
    if (result?.stories?.length) return 'Preview your story slides and download one or all assets instantly.';
    return 'Enter a public Instagram story username or story URL to preview the latest public stories.';
  }, [result, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setResult(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setStatus('Please enter a username or Instagram story URL.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = (await response.json()) as StoryExtractionResult & { success?: boolean; cached?: boolean; error?: string };

      if (!response.ok || data.success === false || !data.stories) {
        setStatus(data.error || 'Unable to extract public stories from the provided input.');
        setResult(null);
        return;
      }

      setResult({
        ...data,
        diagnostics: data.diagnostics ?? [],
      });
      setStatus(data.cached ? 'Cached story result loaded successfully.' : 'Stories extracted successfully.' );
    } catch {
      setStatus('A network error occurred while extracting Instagram stories. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function openPreview(item: StoryItem) {
    setPreviewItem(item);
  }

  function closePreview() {
    setPreviewItem(null);
  }

  function downloadAsset(item: StoryItem) {
    const anchor = document.createElement('a');
    anchor.href = item.downloadUrl;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  async function handleDownloadAll() {
    if (!result?.stories?.length) {
      return;
    }

    setDownloadingAll(true);
    setStatus('Preparing downloads for all visible stories...');

    for (const story of result.stories) {
      downloadAsset(story);
      await new Promise((resolve) => setTimeout(resolve, 280));
    }

    setDownloadingAll(false);
    setStatus('Download all sequence started. Check your browser downloads.');
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-[2rem] border border-white/20 bg-white/80 p-5 shadow-glow shadow-white/30 sm:grid-cols-[1fr_auto] sm:items-center">
        <label htmlFor="instagram-story-query" className="sr-only">
          Instagram story username or URL
        </label>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100">
          <span className="text-slate-400">👁️</span>
          <input
            id="instagram-story-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={sampleUrls[0]}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Instagram story username or URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Finding stories…' : 'Fetch Stories'}
        </button>
      </form>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm shadow-slate-200/50" aria-live="polite">
        <p className="font-semibold text-slate-950">Status</p>
        <p className="mt-2 leading-7 text-slate-600">{helperText}</p>
      </div>

      {result ? (
        <div className="space-y-6">
          <StoryProfile profile={result.profile} sourceUrl={result.sourceUrl} cached={result.extractedAt !== undefined && !loading} />

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-violet-600">Story assets</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{result.stories.length} story item{result.stories.length === 1 ? '' : 's'} available</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={downloadingAll}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingAll ? 'Starting download…' : 'Download All'}
                  </button>
                </div>
              </div>

              <StoryGrid stories={result.stories} onPreview={openPreview} onDownload={downloadAsset} />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.32em] text-violet-600">Insights</p>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-950">Cache</p>
                  <p>{status.includes('Cached') ? 'Loaded from cache' : 'Performed extraction'}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Source</p>
                  <p>{result.sourceUrl}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Extracted</p>
                  <p>{new Date(result.extractedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StorySkeleton />
          <StorySkeleton />
          <StorySkeleton />
        </div>
      ) : null}

      <StoryPreview item={previewItem} onClose={closePreview} />
    </div>
  );
}
