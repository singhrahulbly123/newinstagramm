import Link from 'next/link';

export default function Header() {
  return (
     <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200/40">F</div>
            <div>
              <p>FastVideoSave</p>
              <p className="text-xs font-normal text-slate-500">Instagram Reels Downloader</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="/" className="transition hover:text-slate-950">Video</a>
            <a href="/audio" className="transition hover:text-slate-950">Audio</a>
            <a href="/photo" className="transition hover:text-slate-950">Photo</a>
            <a href="/blog" className="transition hover:text-slate-950">Blog</a>
          </nav>
          
        </header>
  );
}
