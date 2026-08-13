import React from 'react';

export default function DownloadSection() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white grid place-items-center text-lg">📷</div>
          <div>
            <p className="font-semibold text-sm text-slate-900">Photos</p>
            <p className="text-xs text-slate-600">Preview and download images from Instagram posts.</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white grid place-items-center text-lg">🎬</div>
          <div>
            <p className="font-semibold text-sm text-slate-900">Videos & Reels</p>
            <p className="text-xs text-slate-600">Save reels and video posts in high quality.</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white grid place-items-center text-lg">🎵</div>
          <div>
            <p className="font-semibold text-sm text-slate-900">Audio</p>
            <p className="text-xs text-slate-600">Extract MP3 from reels and videos.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
