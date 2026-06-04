type Props = {
  audioUrl: string;
  previewUrl: string | null;
  title: string;
  author?: string | null;
};

export default function AudioPreview({ audioUrl, previewUrl, title, author }: Props) {
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
          <div className="mb-4 overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${title} thumbnail`}
                className="h-72 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm uppercase tracking-[0.3em] text-slate-400">Audio Thumbnail</div>
            )}
          </div>
          <audio controls preload="metadata" className="w-full"> 
            <source src={audioUrl} />
            Your browser does not support audio playback.
          </audio>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm shadow-slate-900/40">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Fast and secure</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Stream the audio preview in your browser and download the MP3 instantly. The tool extracts public Instagram reel audio without login and prepares it for quick offline use.
          </p>
        </div>
      </div>
    </div>
  );
}
