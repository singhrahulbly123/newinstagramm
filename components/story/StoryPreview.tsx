import Image from 'next/image';
import type { StoryItem } from '../../types/story';

type Props = {
  item: StoryItem | null;
  onClose: () => void;
};

export default function StoryPreview({ item, onClose }: Props) {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-900/70">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-400">Preview</p>
            <p className="mt-1 text-lg font-semibold text-white">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-slate-950/20">
            {item.mediaType === 'video' ? (
              <video
                controls
                src={item.previewUrl}
                className="w-full rounded-[1.5rem] bg-black"
                poster={item.thumbnailUrl}
              />
            ) : (
              <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-slate-900" style={{ aspectRatio: '16 / 9' }}>
                <Image
                  src={item.previewUrl}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Filename</p>
              <p className="mt-2 break-words">{item.filename}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Type</p>
              <p className="mt-2">{item.mediaType === 'video' ? 'Video story' : 'Image story'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
