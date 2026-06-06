export default function StorySkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className="h-72 rounded-[1.5rem] bg-slate-200" />
      <div className="mt-4 h-4 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-2 grid gap-2">
        <div className="h-3 rounded-full bg-slate-200" />
        <div className="h-3 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 h-12 rounded-[1rem] bg-slate-200" />
    </div>
  );
}
