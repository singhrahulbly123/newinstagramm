const FACEBOOK_REEL_REGEX = /^https?:\/\/(?:www\.)?facebook\.com\/reel\/[A-Za-z0-9_-]+(?:[\/\?].*)?$/i;
const FB_WATCH_REGEX = /^https?:\/\/fb\.watch\/[A-Za-z0-9_-]+(?:[\/\?].*)?$/i;
const MOBILE_FACEBOOK_REGEX = /^https?:\/\/m\.facebook\.com\/.+/i;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

export type FacebookReelExtractionResult = {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  debug: string[];
};

function normalizeFacebookString(value: string) {
  return value
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

function extractMetaContent(html: string, property: string) {
  const regex = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const match = regex.exec(html);
  return match?.[1] ? normalizeFacebookString(match[1]) : null;
}

function extractJsonProperty(html: string, key: string) {
  const regex = new RegExp(`["']${key}["']\s*:\s*["']([^"']+)["']`, 'gi');
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      return normalizeFacebookString(match[1]);
    }
  }
  return null;
}

function collectVideoCandidates(html: string) {
  const candidates = new Set<string>();
  
  // Try meta tags first
  const rawValues = [
    extractMetaContent(html, 'og:video:secure_url'),
    extractMetaContent(html, 'og:video:url'),
    extractMetaContent(html, 'og:video'),
    extractJsonProperty(html, 'playable_url_quality_hd'),
    extractJsonProperty(html, 'playable_url'),
    extractJsonProperty(html, 'video_url'),
    extractJsonProperty(html, 'src'),
  ];

  for (const value of rawValues) {
    if (value) {
      candidates.add(value);
    }
  }

  // Search for video URLs in HTML content
  const mp4Matches = Array.from(html.matchAll(/https?:\/\/[^"'<>\s\\]+\.mp4(?:\?[^"'<>\s\\]*)?/gi)).map((match) => 
    normalizeFacebookString(match[0])
  );
  for (const value of mp4Matches) {
    if (value && value.length > 0) {
      candidates.add(value);
    }
  }

  // Search for escaped URLs
  const escapedMatches = Array.from(html.matchAll(/https?:\\\/\\\/[^"'<>\s\\]+\.mp4(?:\?[^"'<>\s\\]*)?/gi)).map((match) => 
    normalizeFacebookString(match[0])
  );
  for (const value of escapedMatches) {
    if (value && value.length > 0) {
      candidates.add(value);
    }
  }

  // Search in JavaScript variables
  const jsVideoMatches = Array.from(html.matchAll(/"playableUrl[^"]*":[\s]*"([^"]*\.mp4[^"]*)"/gi)).map((match) => 
    normalizeFacebookString(match[1])
  );
  for (const value of jsVideoMatches) {
    if (value && value.length > 0) {
      candidates.add(value);
    }
  }

  return Array.from(candidates).filter((url) => url && url.length > 0);
}

function selectBestVideoUrl(candidates: string[]) {
  const normalized = candidates
    .map((value) => value.replace(/\s+/g, ''))
    .filter((value) => value.startsWith('https://'))
    .map(normalizeFacebookString);

  return normalized.find((value) => value.includes('.mp4')) || normalized[0] || null;
}

export function isSupportedFacebookReelUrl(url: string) {
  return FACEBOOK_REEL_REGEX.test(url) || FB_WATCH_REGEX.test(url) || MOBILE_FACEBOOK_REGEX.test(url);
}

export function normalizeFacebookReelUrl(url: string) {
  try {
    const parsed = new URL(url.trim());
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

export function extractFacebookReelMetadata(html: string, pageUrl: string): FacebookReelExtractionResult {
  const debug: string[] = [];
  const title = extractMetaContent(html, 'og:title');
  const description = extractMetaContent(html, 'og:description');
  const thumbnailUrl = extractMetaContent(html, 'og:image');

  const videoCandidates = collectVideoCandidates(html);
  debug.push(`Found ${videoCandidates.length} video candidate(s)`);
  for (const candidate of videoCandidates.slice(0, 5)) {
    debug.push(`candidate: ${candidate}`);
  }

  const videoUrl = selectBestVideoUrl(videoCandidates);

  return {
    videoUrl,
    thumbnailUrl: thumbnailUrl || null,
    title: title || null,
    description: description || null,
    debug,
  };
}

export async function fetchFacebookPageHtml(pageUrl: string) {
  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://www.facebook.com/',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
      'Sec-CH-UA': '"Chromium";v="126", "Not=A?Brand";v="99", "Google Chrome";v="126"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Facebook page.');
  }

  return await response.text();
}
