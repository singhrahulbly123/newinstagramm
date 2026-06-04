/**
 * Shared Instagram media extraction utilities used by both Reels Downloader and Audio Downloader.
 * This module contains the proven extraction logic that successfully extracts video URLs from Instagram.
 */

export function normalizeInstagramUrl(url: string) {
  const parsed = new URL(url.trim());
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString();
}

export function decodeInstagramUrl(value: string) {
  const decoded = value
    .replace(/&amp;/gi, '&')
    .replace(/\\u([0-9A-Fa-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\//g, '/');

  try {
    return decodeURIComponent(decoded);
  } catch {
    return decoded;
  }
}

export function extractMetaTag(html: string, property: string) {
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

export function extractVideoUrlFromJsonHtml(html: string) {
  const start = html.indexOf('"video_versions"');
  if (start === -1) return null;

  const urlRegex = /"url"\s*:\s*"((?:\\.|[^"\\])+)"/gi;
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    const candidate = decodeInstagramUrl(match[1]);
    if (candidate.includes('.mp4')) {
      return candidate;
    }
  }

  return null;
}

export function extractUrlsFromAppJsonScripts(html: string) {
  const urls: { url: string; type: 'video' | 'image' }[] = [];
  const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const urlRegex = /(https?:\/\/[^"'\s>]+\.(?:mp4)(?:\?[^"'\s>]*)?)/gi;
  const imgRegex = /(https?:\/\/[^"'\s>]+\.(?:jpe?g|png|webp)(?:\?[^"'\s>]*)?)/gi;

  while ((m = scriptRegex.exec(html)) !== null) {
    const content = m[1];
    let um;
    while ((um = urlRegex.exec(content)) !== null) {
      try {
        urls.push({ url: decodeInstagramUrl(um[1]), type: 'video' });
      } catch {}
    }
    let im;
    while ((im = imgRegex.exec(content)) !== null) {
      try {
        urls.push({ url: decodeInstagramUrl(im[1]), type: 'image' });
      } catch {}
    }
  }

  return urls.find((item) => item.type === 'video') || urls[0] || null;
}

export function parseJsonFromScript(html: string) {
  const match = html.match(/<script[^>]*>\s*window\._sharedData\s*=\s*(\{.*?\});\s*<\/script>/s);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export type InstagramVideoExtractionSource =
  | 'video_versions'
  | 'playback_url'
  | 'playback_uri'
  | 'embed_json'
  | 'xdt_shortcode_media'
  | 'og_video'
  | 'video_url'
  | null;

export type InstagramVideoExtractionResult = {
  videoUrl: string | null;
  source: InstagramVideoExtractionSource;
  diagnostics: string[];
};

type VideoCandidate = {
  url: string;
  source: InstagramVideoExtractionSource;
  width?: number;
  height?: number;
  bitrate?: number;
};

function safeJsonParse(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function findJsonBlock(html: string, startIndex: number): string | null {
  const opening = html[startIndex];
  if (opening !== '{' && opening !== '[') return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIndex; i < html.length; i += 1) {
    const char = html[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === opening) {
      depth += 1;
      continue;
    }

    if ((opening === '{' && char === '}') || (opening === '[' && char === ']')) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(startIndex, i + 1);
      }
    }
  }

  return null;
}

function extractJsonBlocks(html: string): Array<{ data: unknown; source: InstagramVideoExtractionSource }> {
  const jsonBlocks: Array<{ data: unknown; source: InstagramVideoExtractionSource }> = [];

  const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const parsed = safeJsonParse(scriptMatch[1]);
    if (parsed !== null) {
      jsonBlocks.push({ data: parsed, source: 'embed_json' });
    }
  }

  const patterns: Array<{ regex: RegExp; source: InstagramVideoExtractionSource }> = [
    { regex: /window\._sharedData\s*=\s*([{[])/g, source: 'embed_json' },
    { regex: /window\.__additionalDataLoaded\([^,]+,\s*([{[])/g, source: 'embed_json' },
    { regex: /RelayPrefetchedStreamCache\s*=\s*([{[])/g, source: 'embed_json' },
    { regex: /xdt_shortcode_media\s*:\s*([{[])/g, source: 'xdt_shortcode_media' },
    { regex: /video_versions\s*:\s*([{[])/g, source: 'video_versions' },
    { regex: /playback_url\s*:\s*"/g, source: 'playback_url' },
    { regex: /playback_uri\s*:\s*"/g, source: 'playback_uri' },
    { regex: /video_dash_manifest\s*:\s*"/g, source: 'embed_json' },
    { regex: /dash_manifest\s*:\s*"/g, source: 'embed_json' },
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(html)) !== null) {
      const openBracketIndex = match.index + match[0].length - 1;
      const jsonText = findJsonBlock(html, openBracketIndex);
      if (jsonText) {
        const parsed = safeJsonParse(jsonText);
        if (parsed !== null) {
          jsonBlocks.push({ data: parsed, source: pattern.source });
        }
      }
    }
  }

  return jsonBlocks;
}

function extractNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function addVideoCandidate(
  candidates: VideoCandidate[],
  url: string,
  source: InstagramVideoExtractionSource,
  metadata: { width?: number; height?: number; bitrate?: number } = {},
) {
  if (!url || !url.includes('.mp4')) return;

  candidates.push({
    url: decodeInstagramUrl(url),
    source,
    width: metadata.width,
    height: metadata.height,
    bitrate: metadata.bitrate,
  });
}

function collectVideoCandidates(value: unknown, candidates: VideoCandidate[], defaultSource: InstagramVideoExtractionSource = 'embed_json') {
  if (value === null || value === undefined) return;

  if (typeof value === 'string') {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectVideoCandidates(item, candidates, defaultSource);
    }
    return;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.video_versions)) {
      for (const item of record.video_versions) {
        if (item && typeof item === 'object') {
          const videoItem = item as Record<string, unknown>;
          const url = typeof videoItem.url === 'string' ? videoItem.url : undefined;
          const width = extractNumber(videoItem.width);
          const height = extractNumber(videoItem.height);
          const bitrate = extractNumber(videoItem.bitrate);
          if (url) {
            addVideoCandidate(candidates, url, 'video_versions', { width, height, bitrate });
          }
        }
      }
    }

    if (typeof record.video_url === 'string') {
      addVideoCandidate(candidates, record.video_url, 'video_url');
    }
    if (typeof record.playback_url === 'string') {
      addVideoCandidate(candidates, record.playback_url, 'playback_url');
    }
    if (typeof record.playback_uri === 'string') {
      addVideoCandidate(candidates, record.playback_uri, 'playback_uri');
    }
    if (typeof record.contentUrl === 'string') {
      addVideoCandidate(candidates, record.contentUrl, defaultSource);
    }
    if (typeof record.url === 'string' && record.url.includes('.mp4')) {
      addVideoCandidate(candidates, record.url, defaultSource);
    }

    if (record.xdt_shortcode_media && typeof record.xdt_shortcode_media === 'object') {
      collectVideoCandidates(record.xdt_shortcode_media, candidates, 'xdt_shortcode_media');
    }
    if (record.RelayPrefetchedStreamCache && typeof record.RelayPrefetchedStreamCache === 'object') {
      collectVideoCandidates(record.RelayPrefetchedStreamCache, candidates, 'embed_json');
    }
    if (record.__additionalDataLoaded && typeof record.__additionalDataLoaded === 'object') {
      collectVideoCandidates(record.__additionalDataLoaded, candidates, 'embed_json');
    }

    for (const nested of Object.values(record)) {
      collectVideoCandidates(nested, candidates, defaultSource);
    }
  }
}

function rateVideoCandidate(candidate: VideoCandidate) {
  const sizeScore = candidate.width && candidate.height ? candidate.width * candidate.height : 0;
  const bitrateScore = candidate.bitrate || 0;
  const urlScore = candidate.url.length;
  return sizeScore * 10 + bitrateScore * 5 + urlScore;
}

function chooseBestVideoCandidate(candidates: VideoCandidate[]): VideoCandidate | null {
  const valid = candidates.filter((candidate) => candidate.url.includes('.mp4'));
  if (!valid.length) return null;
  valid.sort((a, b) => rateVideoCandidate(b) - rateVideoCandidate(a));
  return valid[0];
}

export function extractInstagramVideoUrlResult(html: string, originalUrl: string): InstagramVideoExtractionResult {
  const diagnostics: string[] = [];
  const videoMeta = extractMetaTag(html, 'og:video');
  const alternateVideoMeta = extractMetaTag(html, 'og:video:url');

  if (videoMeta || alternateVideoMeta) {
    const found = decodeInstagramUrl(videoMeta || alternateVideoMeta || '');
    diagnostics.push('[AUDIO] Strategy og_video success');
    console.log('[AUDIO] Strategy og_video success');
    return { videoUrl: found, source: 'og_video', diagnostics };
  }

  const jsonBlocks = extractJsonBlocks(html);
  const candidates: VideoCandidate[] = [];

  jsonBlocks.forEach((block) => {
    collectVideoCandidates(block.data, candidates, block.source);
    diagnostics.push(`[AUDIO] Parsed JSON block source=${block.source}`);
  });

  if (candidates.length > 0) {
    const best = chooseBestVideoCandidate(candidates);
    if (best) {
      diagnostics.push(`[AUDIO] Selected best video candidate from ${best.source}`);
      console.log('[AUDIO] Selected best video candidate', { source: best.source, url: best.url });
      return { videoUrl: best.url, source: best.source, diagnostics };
    }
  }

  const appJsonFound = extractUrlsFromAppJsonScripts(html);
  if (appJsonFound && appJsonFound.type === 'video') {
    diagnostics.push('[AUDIO] Strategy embed_json success via application/json script');
    console.log('[AUDIO] Strategy embed_json success');
    return { videoUrl: appJsonFound.url, source: 'embed_json', diagnostics };
  }

  const videoMatch = html.match(/"video_url"\s*:\s*"(https:[^"\\]+)"/i);
  if (videoMatch) {
    const candidate = decodeInstagramUrl(videoMatch[1]);
    diagnostics.push('[AUDIO] Strategy video_url success');
    console.log('[AUDIO] Strategy video_url success');
    return { videoUrl: candidate, source: 'video_url', diagnostics };
  }

  diagnostics.push('[AUDIO] Main extraction failed');
  console.log('[AUDIO] Main extraction failed');

  diagnostics.push('[AUDIO] Trying embed extraction');
  console.log('[AUDIO] Trying embed extraction');

  const embedCandidates = candidates.filter((candidate) =>
    candidate.source === 'embed_json' || candidate.source === 'xdt_shortcode_media',
  );
  const embedBest = chooseBestVideoCandidate(embedCandidates);
  if (embedBest) {
    diagnostics.push('[AUDIO] Embed extraction success');
    console.log('[AUDIO] Embed extraction success');
    return {
      videoUrl: embedBest.url,
      source: embedBest.source === 'xdt_shortcode_media' ? 'xdt_shortcode_media' : 'embed_json',
      diagnostics,
    };
  }

  return { videoUrl: null, source: null, diagnostics };
}

export function extractInstagramVideoUrl(html: string, originalUrl: string): string | null {
  const result = extractInstagramVideoUrlResult(html, originalUrl);
  return result.videoUrl;
}
