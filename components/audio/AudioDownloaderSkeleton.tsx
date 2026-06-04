export default function AudioDownloaderSkeleton() {
  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-2/3 rounded-full bg-slate-200" />
        <div className="h-72 rounded-[1.75rem] bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-20 rounded-[1.5rem] bg-slate-200" />
          <div className="h-20 rounded-[1.5rem] bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
