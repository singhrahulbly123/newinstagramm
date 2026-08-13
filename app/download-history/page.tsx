import type { Metadata } from 'next';
import DownloadHistoryClient from './DownloadHistoryClient';

export const metadata: Metadata = {
  title: 'Local Download History | globltools',
  description: 'View download activity saved privately in this browser. Nothing is stored on our server.',
  robots: { index: false, follow: true },
};

export default function DownloadHistoryPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Local only</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Download history</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">Find your recent globltools downloads on this device. Clearing browser data also removes this list.</p>
      <div className="mt-8"><DownloadHistoryClient /></div>
    </main>
  );
}
