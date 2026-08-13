'use client';

import { useState } from 'react';

type FileResult = { name: string; size: number; type: string; hash: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function hashFile(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function DuplicateMediaFinderClient() {
  const [results, setResults] = useState<FileResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function inspect(files: FileList | null) {
    if (!files?.length) return;
    if (files.length < 2) { setMessage('Select at least two files to compare.'); return; }
    setLoading(true); setMessage(''); setResults([]);
    try {
      const checked: FileResult[] = [];
      for (const file of Array.from(files)) checked.push({ name: file.name, size: file.size, type: file.type || 'Unknown', hash: await hashFile(file) });
      setResults(checked);
      const duplicateCount = checked.length - new Set(checked.map((item) => item.hash)).size;
      setMessage(duplicateCount ? `${duplicateCount} duplicate file${duplicateCount === 1 ? '' : 's'} found.` : 'No exact duplicates found.');
    } catch { setMessage('Your browser could not compare these files. Try fewer or smaller files.'); }
    finally { setLoading(false); }
  }

  const groups = Object.values(results.reduce<Record<string, FileResult[]>>((all, item) => { (all[item.hash] ||= []).push(item); return all; }, {})).filter((group) => group.length > 1);

  return <div className="space-y-6"><label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center transition hover:bg-emerald-100"><span className="text-lg font-black text-slate-950">Choose media files</span><span className="mt-2 text-sm text-slate-600">Select two or more photos, videos, or audio files</span><input className="sr-only" type="file" multiple accept="image/*,video/*,audio/*" onChange={(event) => inspect(event.target.files)} /></label><div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><strong className="text-slate-950">Local processing:</strong> file hashes are calculated on your device. Files and hashes are not uploaded or saved.</div>{loading ? <p role="status" className="rounded-xl bg-slate-100 p-4 text-sm font-bold text-slate-700">Comparing files…</p> : null}{message ? <p role="status" className={`rounded-xl p-4 text-sm font-bold ${groups.length ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'}`}>{message}</p> : null}{groups.map((group,index)=><section key={group[0].hash} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"><h2 className="font-black text-slate-950">Duplicate group {index+1}</h2><ul className="mt-3 divide-y divide-slate-100">{group.map((file)=><li key={`${file.name}-${file.size}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="font-semibold text-slate-800">{file.name}</span><span className="text-slate-500">{formatBytes(file.size)}</span></li>)}</ul></section>)}</div>;
}
