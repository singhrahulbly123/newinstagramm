'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  audioUrl: string;
  previewUrl: string | null;
  title: string;
  author?: string | null;
};

export default function AudioPreview({ audioUrl, previewUrl, title, author }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [seeked, setSeeked] = useState(false);

  useEffect(() => {
    setSeeked(false);
  }, [previewUrl]);

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video || seeked) return;
    const targetTime = Math.min(1, video.duration || 1);
    video.currentTime = targetTime;
  }

  function handleSeeked() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setSeeked(true);
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Audio Preview</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">{title}</h3>
          {author ? <p className="mt-2 text-sm text-slate-600">By {author}</p> : null}
        </div>

        <div className="inline-flex items-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50">
          MP3 Ready
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_0.7fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
          <div className="relative mb-4 overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
            {previewUrl ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={previewUrl}
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={handleLoadedMetadata}
                  onSeeked={handleSeeked}
                  className="h-72 w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center bg-slate-950/40 py-2 text-sm uppercase tracking-[0.3em] text-white">
                  Audio Thumbnail
                </div>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center text-sm uppercase tracking-[0.3em] text-slate-400">
                Audio Thumbnail
              </div>
            )}
          </div>
          <audio controls preload="metadata" className="w-full">
            <source src={audioUrl} />
            Your browser does not support audio playback.
          </audio>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm shadow-slate-900/40">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Fast & Secure Instagram Audio Downloader</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Download high-quality audio from public Instagram Reels in seconds. No login required, no software installation needed. Preview the audio online and save MP3 files instantly for offline listening anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
