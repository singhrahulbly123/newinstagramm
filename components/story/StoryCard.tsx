import type { StoryItem } from '../../types/story';

type StoryCardProps = {
  item: StoryItem;
  onPreview: (item: StoryItem) => void;
  onDownload: (item: StoryItem) => void;
};

export default function StoryCard({ item, onPreview, onDownload }: StoryCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="relative block h-72 w-full overflow-hidden bg-slate-950"
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {item.mediaType === 'video' ? (
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              ▶ Video story
            </span>
          </div>
        ) : (
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
              📷 Image story
            </span>
          </div>
        )}
      </button>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
          <span>{item.mediaType === 'video' ? 'Video' : 'Image'}</span>
          <span>{item.duration ? `${Math.round(item.duration)}s` : 'Story'}</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-950 truncate">{item.title}</p>
          <p className="text-xs text-slate-500 truncate">{item.filename}</p>
        </div>
        <button
          type="button"
          onClick={() => onDownload(item)}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Download
        </button>
      </div>
    </article>
  );
}
