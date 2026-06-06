'use client';

import Image from 'next/image';
import type { InstagramPhotoItem } from '../../../lib/photo';

export default function PhotoPreview({ item }: { item: InstagramPhotoItem }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 flex items-center justify-center dark:border-slate-700 dark:bg-slate-900" style={{ minHeight: 192 }}>
        <Image
          src={item.url}
          alt={`Instagram photo ${item.id}`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{item.filename}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
