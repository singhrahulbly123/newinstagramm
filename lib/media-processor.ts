import type { StoryItem } from '../types/story';

const STORY_CDN_BASE = process.env.STORY_CDN_BASE_URL?.replace(/\/+$/, '') || '';

function getFileExtension(url: string, defaultExt = 'mp4'): string {
  try {
    const cleaned = url.split('?')[0].split('#')[0];
    const lastSegment = cleaned.split('/').pop() ?? ''; 
    const ext = lastSegment.split('.').pop();
    if (ext && /^[a-zA-Z0-9]+$/.test(ext)) {
      return ext.toLowerCase();
    }
  } catch {
    // ignore
  }
  return defaultExt;
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_\.]/g, '-').replace(/--+/g, '-');
}

function buildProxyQuery(url: string, filename: string, download = false): string {
  const params = new URLSearchParams({ url, filename });
  if (download) {
    params.set('download', '1');
  }
  return `/api/proxy?${params.toString()}`;
}

export function transformStoryItem(item: Omit<StoryItem, 'previewUrl' | 'proxyUrl' | 'downloadUrl'>): StoryItem {
  const extension = getFileExtension(item.primaryUrl, item.mediaType === 'image' ? 'jpg' : 'mp4');
  const filename = sanitizeFilename(item.filename || `${item.id}.${extension}`);
  const proxyUrl = buildProxyQuery(item.primaryUrl, filename, false);
  const downloadUrl = buildProxyQuery(item.primaryUrl, filename, true);

  return {
    ...item,
    filename,
    previewUrl: proxyUrl,
    proxyUrl,
    downloadUrl,
  };
}

export function createInitialStoryItem(item: Omit<StoryItem, 'previewUrl' | 'proxyUrl' | 'downloadUrl'>): StoryItem {
  return transformStoryItem(item);
}

export function getCdnUrl(filename: string): string {
  if (!STORY_CDN_BASE) {
    return filename;
  }
  return `${STORY_CDN_BASE}/${sanitizeFilename(filename)}`;
}
