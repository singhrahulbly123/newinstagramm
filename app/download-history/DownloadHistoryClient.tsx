'use client';

import { useEffect, useState } from 'react';
import { clearDownloadHistory, getDownloadHistory, type DownloadHistoryItem } from '../../lib/localDownloadHistory';

export default function DownloadHistoryClient() {
  const [items, setItems] = useState<DownloadHistoryItem[]>([]);
  useEffect(() => {
    const refresh = () => setItems(getDownloadHistory());
    refresh();
    window.addEventListener('globltools:history-updated', refresh);
    return () => window.removeEventListener('globltools:history-updated', refresh);
  }, []);

  function clear() {
    if (!window.confirm('Clear download history stored in this browser?')) return;
    clearDownloadHistory();
    setItems([]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm text-emerald-950"><strong>Private by design:</strong> this list stays in your browser and is never uploaded to our server.</p>
        {items.length ? <button onClick={clear} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50">Clear history</button> : null}
      </div>
      {items.length ? (
        <ol className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.tool}</p>
                </div>
                <time className="text-xs text-slate-500" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
              </div>
              {item.sourceUrl ? <p className="mt-3 truncate text-xs text-slate-400" title={item.sourceUrl}>{item.sourceUrl}</p> : null}
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-black text-slate-950">No downloads yet</h2>
          <p className="mt-2 text-sm text-slate-600">Completed downloads will appear here on this device.</p>
        </div>
      )}
    </div>
  );
}
