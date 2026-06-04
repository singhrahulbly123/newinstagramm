'use client';

import type { InstagramPhotoItem } from '../../../lib/photo';

export default function PhotoPreview({ item }: { item: InstagramPhotoItem }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/50">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 flex items-center justify-center">
        <img
          src={item.url}
          alt={`Instagram photo ${item.id}`}
          className="max-h-48 w-auto object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-950">{item.filename}</p>
        <p className="mt-1 text-sm text-slate-600">
          {item.width ?? '–'} × {item.height ?? '–'} pixels
        </p>
      </div>
      <a
        href={`/api/proxy?url=${encodeURIComponent(item.url)}&download=1&filename=${encodeURIComponent(item.filename)}`}
        download={item.filename}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Download Photo
      </a>
    </div>
  );
}
