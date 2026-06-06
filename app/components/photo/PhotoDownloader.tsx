'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import PhotoPreview from './PhotoPreview';
import type { InstagramPhotoItem } from '../../../lib/photo';

type PhotoApiResponse = {
  success: boolean;
  items?: InstagramPhotoItem[];
  previewUrl?: string;
  error?: string;
};

export default function PhotoDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState<InstagramPhotoItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const helperText = useMemo(() => {
    if (status) return status;
    if (items.length > 1) return 'Carousel images found. Download all images or save individual photos below.';
    if (items.length === 1) return 'Photo ready. Tap download to save the original image.';
    return 'Paste an Instagram photo URL to preview the highest resolution image.';
  }, [items.length, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setItems([]);
    setPreviewUrl('');
    setLoading(true);

    if (!url.trim()) {
      setStatus('Please paste an Instagram photo URL first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = (await response.json()) as PhotoApiResponse;
      if (!response.ok || !data.success || !data.items || data.items.length === 0) {
        setStatus(data.error || 'Unable to extract the photo. Please check the URL and try again.');
        return;
      }

      setItems(data.items);
      setPreviewUrl(data.previewUrl || data.items[0].url);
    } catch {
      setStatus('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function downloadFile(item: InstagramPhotoItem) {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(item.url)}`);
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = item.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleDownloadAll() {
    if (!items.length) return;
    setLoadingAll(true);
    setStatus('Downloading all images. Please wait...');

    try {
      for (const item of items) {
        await downloadFile(item);
      }
      setStatus('All images downloaded successfully.');
    } catch {
      setStatus('Unable to download all images. Please try the individual download buttons.');
    } finally {
      setLoadingAll(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-200/50 sm:grid-cols-[1fr_auto] sm:items-center">
        <label htmlFor="instagram-photo-url" className="sr-only">
          Instagram photo URL
        </label>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100">
          <span className="text-slate-400">📷</span>
          <input
            id="instagram-photo-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste Instagram photo URL here..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Instagram photo URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Preview Photo'}
        </button>
      </form>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm shadow-slate-200/50">
        <p className="font-semibold text-slate-950">Status</p>
        <p className="mt-2 leading-7 text-slate-600" aria-live="polite">
          {helperText}
        </p>
      </div>

      {previewUrl ? (
        <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950">
          <p className="font-semibold text-slate-950 dark:text-slate-100">Preview</p>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900" style={{ minHeight: 240 }}>
            <Image
              src={previewUrl}
              alt="Instagram photo preview"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Showing {items.length} image{items.length > 1 ? 's' : ''} from this post.
            </p>
            {items.length > 1 ? (
              <button
                type="button"
                disabled={loadingAll}
                onClick={handleDownloadAll}
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAll ? 'Downloading…' : 'Download All Images'}
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <PhotoPreview key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm shadow-slate-200/50">
        <p className="font-semibold text-slate-950">Best practices</p>
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>Only download photos from public Instagram posts.</li>
          <li>Respect creator rights and use downloaded images for personal use.</li>
          <li>If a link is not working, confirm it is a valid Instagram post URL.</li>
        </ul>
      </div>
    </div>
  );
}
