type Props = {
  title: string;
  author?: string | null;
  duration?: number | null;
  fileType?: string | null;
  fileSize?: number | null;
  description?: string | null;
};

function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || Number.isNaN(seconds)) return 'Unknown';
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number | null | undefined) {
  if (bytes == null || Number.isNaN(bytes) || bytes <= 0) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(1)} ${units[index]}`;
}

export default function AudioInfo({ title, author, duration, fileType, fileSize, description }: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Audio details</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Title</p>
          <p className="mt-2 font-semibold text-slate-950">{title}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Type</p>
          <p className="mt-2 font-semibold text-slate-950">{fileType || 'MP3'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Duration</p>
          <p className="mt-2 font-semibold text-slate-950">{formatDuration(duration)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Estimated size</p>
          <p className="mt-2 font-semibold text-slate-950">{formatSize(fileSize)}</p>
        </div>
      </div>

      {author ? (
        <div className="mt-5">
          <p className="text-sm text-slate-500">Creator</p>
          <p className="mt-2 font-semibold text-slate-950">{author}</p>
        </div>
      ) : null}

      {description ? (
        <div className="mt-5">
          <p className="text-sm text-slate-500">Audio caption</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
      ) : null}
    </div>
  );
}
