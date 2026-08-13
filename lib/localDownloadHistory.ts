export type DownloadHistoryItem = {
  id: string;
  tool: string;
  title: string;
  sourceUrl?: string;
  createdAt: string;
};

const STORAGE_KEY = 'globltools.downloadHistory.v1';
const MAX_ITEMS = 50;

export function getDownloadHistory(): DownloadHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export function addDownloadHistory(item: Omit<DownloadHistoryItem, 'id' | 'createdAt'>) {
  if (typeof window === 'undefined') return;
  const next: DownloadHistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...getDownloadHistory()].slice(0, MAX_ITEMS)));
  window.dispatchEvent(new Event('globltools:history-updated'));
}

export function clearDownloadHistory() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('globltools:history-updated'));
}
