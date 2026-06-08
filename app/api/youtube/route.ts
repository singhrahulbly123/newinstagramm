import ytdl from '@distube/ytdl-core';
import { browserPool } from '../../../lib/browser-pool';

const CACHE_TTL_MS = 10 * 60 * 1000;
const youtubeExtractionCache = new Map<string, { expires: number; response: any }>();

type YoutubeFormat = {
  itag: number;
  quality: string;
  mimeType: string;
  url: string;
  container?: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  bitrate?: number;
  audioBitrate?: number;
  downloadMode?: 'progressive' | 'video-only' | 'audio-only' | 'unknown';
};

type PerformanceReport = {
  cacheHit: boolean;
  cacheLookupMs: number;
  watchPageFetchMs: number;
  playerResponseParseMs: number;
  formatProcessingMs: number;
  totalExecutionMs: number;
};

type DebugReport = {
  videoId?: string;
  formatsFound: number;
  adaptiveFormatsFound: number;
  streamingDataExists: boolean;
  antiBotDetected: boolean;
  extractionMethod: string;
  htmlMarkers?: Record<string, boolean>;
  extractionAttempts: string[];
};

type YoutubeExtractionResponse = {
  success: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
  formatsCount?: number;
  adaptiveFormatsCount?: number;
  formats?: YoutubeFormat[];
  error?: string;
  debug?: string[];
  debugReport?: DebugReport;
};

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay(): number {
  // Random delay between 500ms and 1500ms to mimic human behavior
  return Math.random() * 1000 + 500;
}

function getCacheEntry(videoId: string) {
  const entry = youtubeExtractionCache.get(videoId);
  if (entry && entry.expires > Date.now()) {
    return entry.response;
  }
  youtubeExtractionCache.delete(videoId);
  return null;
}

function setCacheEntry(videoId: string, response: any) {
  youtubeExtractionCache.set(videoId, {
    expires: Date.now() + CACHE_TTL_MS,
    response,
  });
}

function parseQualityValue(quality: string): number {
  const match = quality.match(/(\d+)p/i);
  if (match) return Number(match[1]);
  return 0;
}

function downloadModePriority(mode: 'progressive' | 'video-only' | 'audio-only' | 'unknown'): number {
  switch (mode) {
    case 'progressive':
      return 3;
    case 'video-only':
      return 2;
    case 'audio-only':
      return 1;
    default:
      return 0;
  }
}

function sortFormats(formats: YoutubeFormat[]) {
  return formats.slice().sort((a, b) => {
    const aQuality = parseQualityValue(a.quality || '');
    const bQuality = parseQualityValue(b.quality || '');
    if (aQuality !== bQuality) return bQuality - aQuality;

    const aPriority = downloadModePriority(a.downloadMode || 'unknown');
    const bPriority = downloadModePriority(b.downloadMode || 'unknown');
    if (aPriority !== bPriority) return bPriority - aPriority;

    const aAudio = a.audioBitrate || 0;
    const bAudio = b.audioBitrate || 0;
    return bAudio - aAudio || (b.bitrate || 0) - (a.bitrate || 0);
  });
}

function groupFormats(formats: YoutubeFormat[]) {
  return {
    progressive: formats.filter((format) => format.downloadMode === 'progressive'),
    videoOnly: formats.filter((format) => format.downloadMode === 'video-only'),
    audioOnly: formats.filter((format) => format.downloadMode === 'audio-only'),
  };
}

function normalizeYoutubeUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();

    if (hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/watch?v=${id}` : null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'music.youtube.com') {
      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2];
        console.log('[youtube/extract] Converting Shorts URL to watch:', id);
        return id ? `https://www.youtube.com/watch?v=${id}` : null;
      }
      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.split('/')[2];
        console.log('[youtube/extract] Converting embed URL to watch:', id);
        return id ? `https://www.youtube.com/watch?v=${id}` : null;
      }
      if (url.searchParams.has('v')) {
        return `https://www.youtube.com/watch?v=${url.searchParams.get('v')}`;
      }
      return input;
    }

    return null;
  } catch {
    return null;
  }
}

function extractVideoId(input: string): string | null {
  try {
    const normalized = normalizeYoutubeUrl(input);
    if (!normalized) return null;
    return ytdl.getURLVideoID(normalized);
  } catch {
    return null;
  }
}

function extractJsonObject(text: string, marker: string): any | null {
  const startIndex = text.indexOf(marker);
  if (startIndex < 0) return null;
  const openBrace = text.indexOf('{', startIndex + marker.length);
  if (openBrace < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  let endIndex = -1;

  console.log('[EXTRACT JSON] found marker for parsing:', marker.trim());
  console.log('[EXTRACT JSON] raw text includes:', {
    url: text.includes('"url"'),
    signatureCipher: text.includes('"signatureCipher"'),
    cipher: text.includes('"cipher"'),
  });
  const adaptiveFormatsIndex = text.indexOf('"adaptiveFormats"', openBrace);
  if (adaptiveFormatsIndex !== -1) {
    const snippetStart = Math.max(0, adaptiveFormatsIndex - 250);
    const snippetEnd = Math.min(text.length, adaptiveFormatsIndex + 250);
    console.log('[EXTRACT JSON] snippet before parse:', text.slice(snippetStart, snippetEnd));
  }

  for (let i = openBrace; i < text.length; i += 1) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{' || char === '[') {
        depth += 1;
      } else if (char === '}' || char === ']') {
        depth -= 1;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex < 0) {
    console.log('[EXTRACT JSON] failed to locate matching closing brace/bracket', {
      marker: marker.trim(),
      startIndex,
      openBrace,
      textLength: text.length,
    });
    return null;
  }

  const json = text.slice(openBrace, endIndex + 1);
  console.log('[EXTRACT JSON] parsed range:', { startIndex: openBrace, endIndex, length: json.length, htmlLength: text.length });

  try {
    return JSON.parse(json);
  } catch (error) {
    console.log('[EXTRACT JSON] JSON parsing failed:', error);
    return null;
  }
}

function findInitialPlayerResponse(html: string): any | null {
  const markers = [
    'ytInitialPlayerResponse = ',
    'ytInitialPlayerResponse=',
    'window["ytInitialPlayerResponse"] = ',
    'window["ytInitialPlayerResponse"]=',
    'window.ytInitialPlayerResponse = ',
    'window.ytInitialPlayerResponse=',
  ];
  for (const marker of markers) {
    const response = extractJsonObject(html, marker);
    if (response) {
      console.log('[youtube/extract] Found ytInitialPlayerResponse via marker:', marker.trim());
      const firstAdaptive = response?.streamingData?.adaptiveFormats?.[0];
      if (firstAdaptive) {
        console.log('[EXTRACT JSON] adaptiveFormats[0] sample:', {
          url: firstAdaptive.url,
          signatureCipher: firstAdaptive.signatureCipher,
          cipher: firstAdaptive.cipher,
        });
      }
      return response;
    }
  }

  const directMarker = 'playerResponse: ';
  const response = extractJsonObject(html, directMarker);
  if (response) {
    console.log('[youtube/extract] Found playerResponse via direct marker');
    const firstAdaptive = response?.streamingData?.adaptiveFormats?.[0];
    if (firstAdaptive) {
      console.log('[EXTRACT JSON] adaptiveFormats[0] sample:', {
        url: firstAdaptive.url,
        signatureCipher: firstAdaptive.signatureCipher,
        cipher: firstAdaptive.cipher,
      });
    }
    return response;
  }
  return null;
}

function checkHtmlMarkers(html: string) {
  return {
    ytInitialPlayerResponse: html.includes('ytInitialPlayerResponse'),
    ytInitialData: html.includes('ytInitialData'),
    streamingData: html.includes('streamingData'),
    adaptiveFormats: html.includes('adaptiveFormats'),
    formats: html.includes('formats'),
  };
}

function findInnertubeApiKey(html: string): string | null {
  const match = html.match(/INNERTUBE_API_KEY\s*"\s*:\s*"([^"]+)"/);
  if (match) return match[1];
  const match2 = html.match(/"INNERTUBE_API_KEY"\s*:\s*"([^"]+)"/);
  if (match2) return match2[1];
  return null;
}

function findInnertubeClientVersion(html: string): string | null {
  const match = html.match(/INNERTUBE_CONTEXT_CLIENT_VERSION\s*"\s*:\s*"([^"]+)"/);
  if (match) return match[1];
  const match2 = html.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION"\s*:\s*"([^"]+)"/);
  if (match2) return match2[1];
  return null;
}

function isAntiBotPage(html: string): boolean {
  const lower = html.toLowerCase();
  const markers = [
    "sign in to confirm you're not a bot",
    "sign in to confirm you are not a bot",
    'consent.youtube.com',
    'unusual traffic',
    'please try again later',
    'blocked',
  ];
  for (const marker of markers) {
    if (lower.includes(marker)) {
      console.log('[youtube/extract] Anti-bot marker detected:', marker);
      return true;
    }
  }
  return false;
}

async function fetchHtmlPage(url: string, retryCount: number = 0): Promise<{ ok: boolean; status: number; text: string; isAntiBotPage: boolean; isRateLimited?: boolean }> {
  console.log('[youtube/extract] Fetching watch page with Playwright:', url, retryCount > 0 ? `(retry ${retryCount})` : '');
  
  // Maximum 3 retries with exponential backoff
  const MAX_RETRIES = 3;
  const BASE_DELAY = 5000; // 5 seconds for first retry
  
  // Try Playwright first (works in production)
  try {
    let context = null;
    try {
      context = await browserPool.acquireContext();
      const page = await context.newPage();
      
      // Set realistic headers to avoid bot detection
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'max-age=0',
      });

      // Navigate with timeout and wait for network idle
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      }).catch(err => {
        console.log('[youtube/extract] Page goto error:', err instanceof Error ? err.message : String(err));
        return null;
      });

      if (!response || !response.ok()) {
        const status = response?.status() || 0;
        console.log('[youtube/extract] page fetch failed:', status);
        
        // If rate-limited (429), retry with exponential backoff
        if (status === 429 && retryCount < MAX_RETRIES) {
          const delayMs = BASE_DELAY * Math.pow(2, retryCount) + Math.random() * 1000;
          console.log(`[youtube/extract] Rate limited (429). Waiting ${delayMs}ms before retry...`);
          await sleep(delayMs);
          await page.close();
          if (context) await browserPool.releaseContext(context);
          return fetchHtmlPage(url, retryCount + 1);
        }
        
        return { ok: false, status, text: '', isAntiBotPage: true, isRateLimited: status === 429 };
      }

      // Add a small delay to ensure content is fully rendered
      await page.waitForTimeout(1000);

      // Extract HTML
      const html = await page.content();
      console.log('[youtube/extract] Watch Page Status: 200, Size:', html.length);

      // Check for anti-bot markers in HTML
      const lower = html.toLowerCase();
      const antiBotMarkers = [
        "sign in to confirm you're not a bot",
        "sign in to confirm you are not a bot",
        'unusual traffic',
        'please try again later',
      ];
      
      const hasAntiBot = antiBotMarkers.some(marker => lower.includes(marker));
      
      await page.close();
      return { ok: true, status: 200, text: html, isAntiBotPage: hasAntiBot, isRateLimited: false };
    } catch (err) {
      console.log('[youtube/extract] Playwright fetch error:', err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      if (context) {
        await browserPool.releaseContext(context);
      }
    }
  } catch (playwrightErr) {
    // Fallback to HTTP-based extraction with better headers
    console.log('[youtube/extract] Playwright unavailable, using HTTP fallback:', playwrightErr instanceof Error ? playwrightErr.message : String(playwrightErr));
    
    const USER_AGENTS = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    ];
    
    const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    // Add a delay before making the request to avoid rate limiting
    await sleep(2000 + Math.random() * 1000); // 2-3 second delay
    
    // Retry logic for rate limiting (429)
    const MAX_RETRIES = 3;
    const BASE_DELAY = 5000; // 5 seconds for first retry
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': randomUserAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          method: 'GET',
          redirect: 'follow',
        });
        
        clearTimeout(timeoutId);
        const text = await response.text();
        console.log('[youtube/extract] Watch Page Status:', response.status, 'Size:', text.length);
        
        // If rate-limited, retry with exponential backoff
        if (response.status === 429 && attempt < MAX_RETRIES) {
          const delayMs = BASE_DELAY * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(`[youtube/extract] Rate limited (429). Waiting ${delayMs}ms before retry (attempt ${attempt + 1}/${MAX_RETRIES})...`);
          await sleep(delayMs);
          continue; // Retry the loop
        }
        
        return { ok: response.ok, status: response.status, text, isAntiBotPage: false, isRateLimited: response.status === 429 };
      } catch (fetchErr) {
        console.log('[youtube/extract] HTTP fetch attempt', attempt + 1, 'error:', fetchErr instanceof Error ? fetchErr.message : String(fetchErr));
        if (attempt === MAX_RETRIES) {
          return { ok: false, status: 0, text: '', isAntiBotPage: false, isRateLimited: false };
        }
      }
    }
    
    return { ok: false, status: 0, text: '', isAntiBotPage: false, isRateLimited: false };
  }
}

async function fetchInnertubePlayer(
  videoId: string,
  apiKey: string,
  clientVersion: string,
  clientName: string,
  pageUrl: string,
) {
  const endpoint = `https://www.youtube.com/youtubei/v1/player?key=${apiKey}`;
  const body = {
    context: {
      client: {
        hl: 'en',
        gl: 'US',
        clientName,
        clientVersion,
        osName: clientName === 'ANDROID' ? 'Android' : clientName === 'TVHTML5' ? 'Linux' : 'Windows',
        osVersion: clientName === 'ANDROID' ? '13' : undefined,
      },
    },
    videoId,
  };
  console.log(`[youtube/extract] Trying Innertube ${clientName} client...`);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: 'https://www.youtube.com',
      Referer: pageUrl,
    },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => null);
  console.log(`[youtube/extract] Innertube ${clientName} status:`, response.status);
  return { ok: response.ok, status: response.status, json };
}

function parseCipherString(cipherString: string) {
  const params = new URLSearchParams(cipherString);
  const url = params.get('url');
  if (!url) return null;
  return {
    url,
    s: params.get('s'),
    sp: params.get('sp') || 'signature',
    sig: params.get('sig'),
  };
}

const resolveUrlDiagnostics = {
  directUrlCount: 0,
  signatureCipherCount: 0,
  cipherCount: 0,
  nullCount: 0,
};

function resolveFormatUrl(format: any): string | null {
  console.log('RESOLVE URL INPUT', {
    itag: format?.itag,
    hasUrl: typeof format?.url === 'string' && format.url.trim() !== '',
    hasSignatureCipher: typeof format?.signatureCipher === 'string' && format.signatureCipher.trim() !== '',
    hasCipher: typeof format?.cipher === 'string' && format.cipher.trim() !== '',
  });

  if (!format || typeof format !== 'object') {
    resolveUrlDiagnostics.nullCount += 1;
    console.log('RETURN_NULL', { itag: format?.itag, reason: 'invalid format object' });
    return null;
  }

  if (typeof format.url === 'string' && format.url.trim() !== '') {
    const directUrl = format.url.trim();
    resolveUrlDiagnostics.directUrlCount += 1;
    console.log('RETURN_DIRECT_URL', {
      itag: format.itag,
      urlPreview: directUrl.slice(0, 150),
    });
    return directUrl;
  }

  const hasSignatureCipher = typeof format.signatureCipher === 'string' && format.signatureCipher.trim() !== '';
  const hasCipher = typeof format.cipher === 'string' && format.cipher.trim() !== '';
  const cipherString = hasSignatureCipher
    ? format.signatureCipher.trim()
    : hasCipher
    ? format.cipher.trim()
    : null;

  if (!cipherString) {
    resolveUrlDiagnostics.nullCount += 1;
    console.log('RETURN_NULL', {
      itag: format.itag,
      reason: 'no url or cipherString',
      hasSignatureCipher,
      hasCipher,
    });
    return null;
  }

  const cipher = parseCipherString(cipherString);
  if (!cipher) {
    resolveUrlDiagnostics.nullCount += 1;
    console.log('RETURN_NULL', {
      itag: format.itag,
      reason: 'parseCipherString failed',
      cipherStringPreview: cipherString.slice(0, 150),
    });
    return null;
  }

  const { url: encodedUrl, s, sp, sig } = cipher;
  if (!encodedUrl) {
    resolveUrlDiagnostics.nullCount += 1;
    console.log('RETURN_NULL', {
      itag: format.itag,
      reason: 'cipher missing url',
      cipherStringPreview: cipherString.slice(0, 150),
    });
    return null;
  }

  const signature = sig || s;
  const returnLabel = hasSignatureCipher ? 'RETURN_SIGNATURE_CIPHER_URL' : 'RETURN_CIPHER_URL';
  let decodedUrl = encodedUrl;
  try {
    decodedUrl = decodeURIComponent(encodedUrl);
  } catch {
    // keep original encoded url if decodeURIComponent fails
  }

  try {
    const parsedUrl = new URL(decodedUrl);
    if (signature && !parsedUrl.searchParams.has(sp)) {
      parsedUrl.searchParams.set(sp, signature);
    }
    if (hasSignatureCipher) {
      resolveUrlDiagnostics.signatureCipherCount += 1;
    } else {
      resolveUrlDiagnostics.cipherCount += 1;
    }
    console.log(returnLabel, {
      itag: format.itag,
      urlPreview: parsedUrl.toString().slice(0, 150),
    });
    return parsedUrl.toString();
  } catch {
    if (hasSignatureCipher) {
      resolveUrlDiagnostics.signatureCipherCount += 1;
    } else {
      resolveUrlDiagnostics.cipherCount += 1;
    }
    const fallbackUrl = signature && !decodedUrl.includes(`${sp}=`)
      ? `${decodedUrl}${decodedUrl.includes('?') ? '&' : '?'}${sp}=${encodeURIComponent(signature)}`
      : decodedUrl;
    console.log(returnLabel, {
      itag: format.itag,
      urlPreview: fallbackUrl.slice(0, 150),
      note: 'decode fallback',
    });
    return fallbackUrl;
  }
}

function getFormatRejectionReason(format: any): string {
  if (!format || typeof format !== 'object') return 'invalid format object';

  const rawItag = format.itag ?? format.itag;
  const itagString = rawItag != null ? String(rawItag).trim() : '';
  const itagNumber = Number(itagString);
  if (!itagString || Number.isNaN(itagNumber) || itagNumber <= 0) {
    return 'invalid itag';
  }

  if (typeof format.url === 'string' && format.url.trim() !== '') {
    return 'unknown parsing failure';
  }

  if (typeof format.signatureCipher === 'string' && format.signatureCipher.trim() !== '') {
    const cipher = parseCipherString(format.signatureCipher);
    if (!cipher) return 'invalid signatureCipher';
    if (!cipher.url) return 'signatureCipher missing url';
    return cipher.s ? `signatureCipher parsed, needs deciphering (sp=${cipher.sp})` : `signatureCipher parsed, no signature param`;
  }

  if (typeof format.cipher === 'string' && format.cipher.trim() !== '') {
    const cipher = parseCipherString(format.cipher);
    if (!cipher) return 'invalid cipher';
    if (!cipher.url) return 'cipher missing url';
    return cipher.s ? `cipher parsed, needs deciphering (sp=${cipher.sp})` : `cipher parsed, no signature param`;
  }

  return 'no url or cipher';
}

function parseRawFormat(format: any) {
  if (!format || typeof format !== 'object') return null;

  const rawItag = format.itag ?? format.itag;
  const itagString = rawItag != null ? String(rawItag).trim() : '';
  const itagNumber = Number(itagString);
  if (!itagString || Number.isNaN(itagNumber) || itagNumber <= 0) {
    console.log('[PARSE] Skipping format with invalid itag:', format.itag);
    return null;
  }

  const mime = String(format.mimeType || '');
  console.log('FORMAT DIAG', {
    itag: format.itag,
    quality: format.qualityLabel,
    mimeType: format.mimeType,
    hasUrl: !!format.url,
    hasSignatureCipher: !!format.signatureCipher,
    hasCipher: !!format.cipher,
    signatureCipherPreview: format.signatureCipher?.slice(0, 150),
    cipherPreview: format.cipher?.slice(0, 150),
  });
  const url = resolveFormatUrl(format);
  if (!url) return null;

  const qualityLabel =
    format.qualityLabel ||
    (typeof format.height === 'number' ? `${format.height}p` : '');

  const hasVideo =
    mime.includes('avc1') ||
    mime.includes('vp8') ||
    mime.includes('vp9') ||
    mime.startsWith('video/');
  const hasAudio =
    mime.includes('mp4a') ||
    mime.includes('opus') ||
    mime.includes('vorbis') ||
    mime.startsWith('audio/');

  console.log({
    itag: itagNumber,
    mimeType: mime,
    hasVideo,
    hasAudio,
    hasUrl: !!format.url,
    hasCipher: !!format.signatureCipher || !!format.cipher,
  });

  const container = mime.includes('mp4')
    ? 'mp4'
    : mime.includes('webm')
    ? 'webm'
    : 'unknown';

  return {
    itag: itagNumber,
    qualityLabel,
    mimeType: mime,
    url,
    bitrate: typeof format.bitrate === 'number' ? format.bitrate : 0,
    audioBitrate: typeof format.audioBitrate === 'number' ? format.audioBitrate : undefined,
    container,
    hasVideo,
    hasAudio,
    downloadMode: hasVideo && hasAudio
      ? 'progressive'
      : hasVideo
      ? 'video-only'
      : hasAudio
      ? 'audio-only'
      : 'unknown',
  };
}

function normalizeFormat(format: any): YoutubeFormat | null {
  if (!format || !format.url) return null;

  const hasVideo = Boolean(format.hasVideo);
  const hasAudio = Boolean(format.hasAudio);
  const downloadMode = hasVideo && hasAudio
    ? 'progressive'
    : hasVideo
    ? 'video-only'
    : hasAudio
    ? 'audio-only'
    : 'unknown';

  return {
    itag: Number(format.itag || 0),
    quality: format.qualityLabel || format.quality || (format.height ? `${format.height}p` : 'unknown'),
    mimeType: format.mimeType || format.codecs || 'unknown',
    url: String(format.url),
    container: format.container || 'unknown',
    hasVideo,
    hasAudio,
    bitrate: typeof format.bitrate === 'number' ? format.bitrate : undefined,
    audioBitrate: typeof format.audioBitrate === 'number' ? format.audioBitrate : undefined,
    downloadMode,
  };
}

function filterValidFormats(formats: any[]) {
  return formats.filter((format) => format && Boolean(format.url));
}

function uniqByItag(formats: any[]) {
  const map = new Map<string, any>();
  const removed: Array<{itag: string; reason: string; quality?: string; mimeType?: string}> = [];
  for (const format of formats) {
    if (!format) continue;
    const rawItag = format.itag;
    if (rawItag == null || rawItag === '') {
      console.log('[DEDUP KEY]', rawItag, typeof rawItag, '-> missing itag');
      removed.push({
        itag: String(rawItag),
        reason: 'missing itag',
        quality: format?.qualityLabel || format?.quality,
        mimeType: format?.mimeType,
      });
      continue;
    }

    const itagKey = String(rawItag).trim();
    console.log('[DEDUP KEY]', rawItag, typeof rawItag, '->', itagKey);

    if (itagKey === '') {
      removed.push({
        itag: itagKey,
        reason: 'missing itag',
        quality: format?.qualityLabel || format?.quality,
        mimeType: format?.mimeType,
      });
      continue;
    }

    if (map.has(itagKey)) {
      removed.push({
        itag: itagKey,
        reason: 'duplicate itag',
        quality: format?.qualityLabel || format?.quality,
        mimeType: format?.mimeType,
      });
      continue;
    }

    map.set(itagKey, format);
  }

  console.log('[DEDUP] MAP KEYS', [...map.keys()]);
  if (removed.length > 0) {
    console.log('[DEDUP] Removed formats:', removed.length);
    console.table(removed.map((entry) => ({
      itag: entry.itag,
      reason: entry.reason,
      quality: entry.quality,
      mimeType: entry.mimeType,
    })));
  }

  return Array.from(map.values());
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.url !== 'string') {
      return jsonResponse({ success: false, error: 'Invalid request payload.' }, 400);
    }

    const originalUrl = body.url.trim();
    const debugMode = Boolean(body.debug);
    const timeline: string[] = [];
    
    console.log('[STEP 1] URL Received:', originalUrl);
    timeline.push('Step 1: URL received');

    const normalizedUrl = normalizeYoutubeUrl(originalUrl);
    console.log('[STEP 2] URL Normalized:', normalizedUrl);
    timeline.push('Step 2: URL normalized');

    if (!normalizedUrl) {
      console.log('[FAIL] URL normalization failed');
      timeline.push('Step X: URL normalization failed - stopping');
      return jsonResponse({ 
        success: false, 
        error: 'YouTube URL normalization failed',
        debugReport: {
          videoId: 'N/A',
          formatsFound: 0,
          adaptiveFormatsFound: 0,
          streamingDataExists: false,
          antiBotDetected: false,
          extractionMethod: 'none',
          extractionAttempts: [],
          exactFailureReason: 'URL normalization failed',
          timeline,
        }
      }, 400);
    }

    const requestStartTime = Date.now();
    const cacheLookupStart = Date.now();

    const videoId = extractVideoId(normalizedUrl);
    console.log('[STEP 3] Video ID Extracted:', videoId);
    timeline.push(`Step 3: Video ID extracted (${videoId})`);

    const cacheLookupMs = Date.now() - cacheLookupStart;
    const cachedResponse = videoId ? getCacheEntry(videoId) : null;
    if (cachedResponse) {
      console.log('[CACHE] Returning cached extraction result for videoId:', videoId);
      const response = {
        ...cachedResponse,
        cached: true,
        performanceReport: {
          ...cachedResponse.performanceReport,
          cacheHit: true,
          cacheLookupMs,
          totalExecutionMs: Date.now() - requestStartTime,
        },
      };
      return jsonResponse(response, 200);
    }

    if (!videoId) {
      console.log('[FAIL] Video ID extraction failed');
      timeline.push('Step X: Video ID extraction failed - stopping');
      return jsonResponse({ 
        success: false, 
        error: 'Video ID extraction failed',
        debugReport: {
          videoId: 'extraction_failed',
          formatsFound: 0,
          adaptiveFormatsFound: 0,
          streamingDataExists: false,
          antiBotDetected: false,
          extractionMethod: 'none',
          extractionAttempts: [],
          exactFailureReason: 'Video ID extraction failed',
          timeline,
        }
      }, 400);
    }

    const debugReport: DebugReport & { 
      inputUrl?: string; 
      normalizedUrl?: string;
      requestStatus?: number;
      htmlLength?: number;
      ytInitialPlayerResponseFound?: boolean;
      htmlPreview?: string;
      exactFailureReason?: string;
      timeline?: string[];
      rejectedFormats?: Array<{itag: number; reason: string}>;
    } = {
      videoId,
      formatsFound: 0,
      adaptiveFormatsFound: 0,
      streamingDataExists: false,
      antiBotDetected: false,
      extractionMethod: 'none',
      extractionAttempts: [],
      inputUrl: originalUrl,
      normalizedUrl: normalizedUrl || undefined,
      timeline,
      rejectedFormats: [],
    };

    console.log('[STEP 4] Request Started - Fetching HTML');
    timeline.push('Step 4: Fetching watch page');
    const watchPageFetchStart = Date.now();
    
    const { ok, status, text: html, isAntiBotPage: pageIsAntiBot, isRateLimited } = await fetchHtmlPage(normalizedUrl);
    const watchPageFetchMs = Date.now() - watchPageFetchStart;
    debugReport.requestStatus = status;
    debugReport.htmlLength = html.length;
    
    console.log('[STEP 5] Response Received - Status:', status, 'HTML Size:', html.length, 'FetchMs:', watchPageFetchMs);
    timeline.push(`Step 5: Response received (status: ${status}, size: ${html.length})`);

    if (!ok) {
      console.log('[FAIL] HTML fetch failed with status:', status);
      if (isRateLimited || status === 429) {
        console.log('[FAIL] Rate limited (429) by YouTube');
        debugReport.antiBotDetected = true;
        debugReport.exactFailureReason = 'Rate limited by YouTube (HTTP 429)';
        timeline.push('Step X: Rate limited detected - stopping extraction');
        return jsonResponse({ 
          success: false, 
          error: 'YouTube rate limit exceeded. Please try again later.',
          debugReport,
        }, 429);
      }
      debugReport.exactFailureReason = `HTTP ${status} error during page fetch`;
      timeline.push(`Step X: HTTP ${status} error - stopping extraction`);
      return jsonResponse({ 
        success: false, 
        error: `Unable to fetch YouTube page (HTTP ${status})`,
        debugReport,
      }, 502);
    }

    // Save HTML preview for debugging
    debugReport.htmlPreview = html.slice(0, 2000);

    console.log('[STEP 6] HTML Parsed - Checking markers');
    const htmlMarkers = checkHtmlMarkers(html);
    debugReport.htmlMarkers = htmlMarkers;
    timeline.push(`Step 6: HTML markers checked`);
    console.log('[DEBUG] HTML Markers:', htmlMarkers);

    // STRICT anti-bot detection - only if specific markers present
    const antiBotMarkers = [
      "sign in to confirm you're not a bot",
      "sign in to confirm you are not a bot",
      'consent.youtube.com',
      'unusual traffic',
    ];
    const hasAntiBotMarker = antiBotMarkers.some(m => html.toLowerCase().includes(m));

    if (pageIsAntiBot || hasAntiBotMarker) {
      console.log('[FAIL] Anti-bot protection detected');
      debugReport.antiBotDetected = true;
      debugReport.exactFailureReason = 'YouTube anti-bot protection page detected';
      timeline.push('Step X: Anti-bot markers found - stopping extraction');
      return jsonResponse(
        {
          success: false,
          error: 'YouTube anti-bot protection detected',
          debugReport,
        },
        429,
      );
    }

    const debugLines: string[] = [];
    debugLines.push(`Video ID: ${videoId}`);
    debugLines.push(`HTML Markers: ${JSON.stringify(htmlMarkers)}`);

    let formats: any[] = [];
    let adaptiveFormats: any[] = [];
    let streamingData: any = null;
    let playerResponse: any = null;
    const playerResponseParseStart = Date.now();

    console.log('[STEP 7] Attempting player response extraction');
    timeline.push('Step 7: Extracting player response');
    
    console.log('[HTML CHECK] raw html includes:', {
      url: html.includes('"url"'),
      signatureCipher: html.includes('"signatureCipher"'),
      cipher: html.includes('"cipher"'),
    });

    const adaptiveFormatsIndex = html.indexOf('"adaptiveFormats"');
    if (adaptiveFormatsIndex !== -1) {
      const snippetStart = Math.max(0, adaptiveFormatsIndex - 250);
      const snippetEnd = Math.min(html.length, adaptiveFormatsIndex + 250);
      console.log('[HTML SNIPPET] around first adaptiveFormats:', html.slice(snippetStart, snippetEnd));
    }

    playerResponse = findInitialPlayerResponse(html);
    console.log('[STREAMING DATA RAW SAMPLE]', JSON.stringify(playerResponse?.streamingData?.adaptiveFormats?.[0], null, 2));
    if (playerResponse) {
      console.log('[FOUND] ytInitialPlayerResponse found');
      debugReport.extractionAttempts.push('ytInitialPlayerResponse');
      debugReport.ytInitialPlayerResponseFound = true;
      streamingData = playerResponse?.streamingData;
      formats = Array.isArray(streamingData?.formats) ? streamingData.formats : [];
      adaptiveFormats = Array.isArray(streamingData?.adaptiveFormats) ? streamingData.adaptiveFormats : [];
      console.log('[STEP 8] Streaming Data Found:', !!streamingData);
      console.log('[DEBUG] Method 1 - ytInitialPlayerResponse');
      console.log('[DEBUG] Raw Formats:', formats.length);
      console.log('[DEBUG] Raw AdaptiveFormats:', adaptiveFormats.length);
      debugReport.streamingDataExists = !!streamingData;
      debugReport.formatsFound = formats.length;
      debugReport.adaptiveFormatsFound = adaptiveFormats.length;
      debugReport.extractionMethod = 'ytInitialPlayerResponse';
      timeline.push(`Step 8: Streaming data found - Formats: ${formats.length}, Adaptive: ${adaptiveFormats.length}`);
    } else {
      console.log('[NOT FOUND] ytInitialPlayerResponse not found in HTML');
      timeline.push('Step 7: ytInitialPlayerResponse not found - trying Innertube API');
    }

    if (formats.length === 0 && adaptiveFormats.length === 0) {
      console.log('[INFO] No formats from HTML, attempting Innertube API');
      const apiKey = findInnertubeApiKey(html);
      const clientVersion = findInnertubeClientVersion(html) || '2.20251107.00.00';
      if (apiKey) {
        console.log('[TRY] Innertube WEB client (apiKey found)');
        debugLines.push(`Attempting Innertube WEB client (apiKey=${apiKey.slice(0, 8)}...)`);
        debugReport.extractionAttempts.push('innertube-WEB');
        await sleep(getRandomDelay());
        const innertube = await fetchInnertubePlayer(videoId, apiKey, clientVersion, 'WEB', normalizedUrl);
        if (innertube.ok && innertube.json) {
          const response = innertube.json;
          const candidateResponse = response.playerResponse || response;
          streamingData = candidateResponse?.streamingData;
          formats = Array.isArray(streamingData?.formats) ? streamingData.formats : formats;
          adaptiveFormats = Array.isArray(streamingData?.adaptiveFormats) ? streamingData.adaptiveFormats : adaptiveFormats;
          console.log('[SUCCESS] Innertube WEB - Formats:', formats.length, 'Adaptive:', adaptiveFormats.length);
          debugReport.formatsFound = formats.length;
          debugReport.adaptiveFormatsFound = adaptiveFormats.length;
          debugReport.extractionMethod = 'innertube-WEB';
          timeline.push(`Innertube WEB: Formats ${formats.length}, Adaptive ${adaptiveFormats.length}`);
        } else {
          console.log('[FAILED] Innertube WEB returned:', innertube.status);
          timeline.push(`Innertube WEB failed with status ${innertube.status}`);
        }
      } else {
        console.log('[SKIP] No API key found for Innertube WEB');
        timeline.push('Step X: No API key found - cannot try Innertube WEB');
      }
    }

    if (formats.length === 0 && adaptiveFormats.length === 0) {
      console.log('[TRY] Innertube ANDROID client');
      const apiKey = findInnertubeApiKey(html);
      if (apiKey) {
        debugLines.push(`Attempting Innertube ANDROID client`);
        debugReport.extractionAttempts.push('innertube-ANDROID');
        await sleep(getRandomDelay());
        const innertube = await fetchInnertubePlayer(videoId, apiKey, '19.43.48', 'ANDROID', normalizedUrl);
        if (innertube.ok && innertube.json) {
          const response = innertube.json;
          const candidateResponse = response.playerResponse || response;
          streamingData = candidateResponse?.streamingData;
          formats = Array.isArray(streamingData?.formats) ? streamingData.formats : formats;
          adaptiveFormats = Array.isArray(streamingData?.adaptiveFormats) ? streamingData.adaptiveFormats : adaptiveFormats;
          console.log('[SUCCESS] Innertube ANDROID - Formats:', formats.length, 'Adaptive:', adaptiveFormats.length);
          debugReport.formatsFound = formats.length;
          debugReport.adaptiveFormatsFound = adaptiveFormats.length;
          debugReport.extractionMethod = 'innertube-ANDROID';
          timeline.push(`Innertube ANDROID: Formats ${formats.length}, Adaptive ${adaptiveFormats.length}`);
        }
      }
    }

    if (formats.length === 0 && adaptiveFormats.length === 0) {
      console.log('[TRY] Innertube TVHTML5 client');
      const apiKey = findInnertubeApiKey(html);
      if (apiKey) {
        debugLines.push(`Attempting Innertube TVHTML5 client`);
        debugReport.extractionAttempts.push('innertube-TVHTML5');
        await sleep(getRandomDelay());
        const innertube = await fetchInnertubePlayer(videoId, apiKey, '2.20251107.00.00', 'TVHTML5', normalizedUrl);
        if (innertube.ok && innertube.json) {
          const response = innertube.json;
          const candidateResponse = response.playerResponse || response;
          streamingData = candidateResponse?.streamingData;
          formats = Array.isArray(streamingData?.formats) ? streamingData.formats : formats;
          adaptiveFormats = Array.isArray(streamingData?.adaptiveFormats) ? streamingData.adaptiveFormats : adaptiveFormats;
          console.log('[SUCCESS] Innertube TVHTML5 - Formats:', formats.length, 'Adaptive:', adaptiveFormats.length);
          debugReport.formatsFound = formats.length;
          debugReport.adaptiveFormatsFound = adaptiveFormats.length;
          debugReport.extractionMethod = 'innertube-TVHTML5';
          timeline.push(`Innertube TVHTML5: Formats ${formats.length}, Adaptive ${adaptiveFormats.length}`);
        }
      }
    }

    const playerResponseParseMs = Date.now() - playerResponseParseStart;
    debugLines.push(`Player response parse time: ${playerResponseParseMs}ms`);

    const rawFormats = Array.isArray(formats) ? formats : [];
    const rawAdaptiveFormats = Array.isArray(adaptiveFormats) ? adaptiveFormats : [];
    
    console.log('[STEP 9] Formats Found - Raw:', rawFormats.length, 'Raw Adaptive:', rawAdaptiveFormats.length);
    timeline.push(`Step 9: Total raw formats collected: ${rawFormats.length + rawAdaptiveFormats.length}`);
    
    // Log all formats before filtering
    if (rawFormats.length > 0 || rawAdaptiveFormats.length > 0) {
      console.log('[DEBUG] All formats before filtering:');
      const allRaw = [...rawFormats, ...rawAdaptiveFormats];
      console.table(
        allRaw.map((f) => ({
          itag: f.itag,
          mimeType: f.mimeType,
          quality: f.qualityLabel,
          url: !!f.url,
          signatureCipher: !!f.signatureCipher,
          cipher: !!f.cipher,
        })),
      );
      console.log('[DEBUG] Adaptive formats raw details:');
      console.table(
        rawAdaptiveFormats.map((f) => ({
          itag: f.itag,
          mimeType: f.mimeType,
          quality: f.qualityLabel,
          url: !!f.url,
          signatureCipher: !!f.signatureCipher,
          cipher: !!f.cipher,
        })),
      );
      console.log('Adaptive format sample:');
      console.log(JSON.stringify(rawAdaptiveFormats.slice(0, 3), null, 2));
    }

    const formatProcessingStart = Date.now();
    const parseBatch = async (formats: any[]) => {
      return Promise.all(formats.map(async (format) => parseRawFormat(format)));
    };

    const [parsedRawFormatsWithNulls, parsedAdaptiveFormatsWithNulls] = await Promise.all([
      parseBatch(rawFormats),
      parseBatch(rawAdaptiveFormats),
    ]);

    const parsedRawFormats = parsedRawFormatsWithNulls.filter(
      (format): format is NonNullable<typeof format> => format !== null,
    );
    const parsedAdaptiveFormats = parsedAdaptiveFormatsWithNulls.filter(
      (format): format is NonNullable<typeof format> => format !== null,
    );

    const adaptiveFormatDebug = rawAdaptiveFormats.map((format, index) => {
      const parsed = parsedAdaptiveFormatsWithNulls[index];
      return {
        itag: format?.itag,
        mimeType: format?.mimeType,
        quality: format?.qualityLabel,
        url: !!format?.url,
        signatureCipher: !!format?.signatureCipher,
        cipher: !!format?.cipher,
        kept: Boolean(parsed),
        reason: parsed ? 'kept' : getFormatRejectionReason(format),
      };
    });

    const adaptiveKept = adaptiveFormatDebug.filter((entry) => entry.kept);
    const adaptiveRejected = adaptiveFormatDebug.filter((entry) => !entry.kept);

    console.log('[DEBUG] Adaptive formats kept:', adaptiveKept.length);
    console.table(
      adaptiveKept.map((entry) => ({
        itag: entry.itag,
        mimeType: entry.mimeType,
        quality: entry.quality,
        url: entry.url,
        signatureCipher: entry.signatureCipher,
        cipher: entry.cipher,
        reason: entry.reason,
      })),
    );
    console.log('[DEBUG] Adaptive formats rejected:', adaptiveRejected.length);
    console.table(
      adaptiveRejected.map((entry) => ({
        itag: entry.itag,
        mimeType: entry.mimeType,
        quality: entry.quality,
        url: entry.url,
        signatureCipher: entry.signatureCipher,
        cipher: entry.cipher,
        reason: entry.reason,
      })),
    );

    console.log('RESOLVE URL COUNTS', resolveUrlDiagnostics);
    console.log('ADAPTIVE FORMAT URL PRESENCE', {
      directUrlCount: rawAdaptiveFormats.filter(
        (format) => typeof format?.url === 'string' && format.url.trim() !== '',
      ).length,
      signatureCipherCount: rawAdaptiveFormats.filter(
        (format) => typeof format?.signatureCipher === 'string' && format.signatureCipher.trim() !== '',
      ).length,
      cipherCount: rawAdaptiveFormats.filter(
        (format) => typeof format?.cipher === 'string' && format.cipher.trim() !== '',
      ).length,
      nullCount: parsedAdaptiveFormatsWithNulls.filter((format) => format === null).length,
    });

    const rawParsedFormats = [...parsedRawFormats, ...parsedAdaptiveFormats];
    console.log('Raw format count:', rawParsedFormats.length);
    console.log('[BEFORE DEDUP] itags:', rawParsedFormats.map((f) => f.itag));
    console.table(
      rawParsedFormats.slice(0, 10).map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        downloadMode: f.downloadMode,
        hasUrl: !!f.url,
      })),
    );

    console.log('=== BEFORE DEDUP ===');
    console.table(
      rawParsedFormats.map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        downloadMode: f.downloadMode,
      })),
    );
    console.log('Before dedup count:', rawParsedFormats.length);

    const itagCounts: Record<string, number> = {};
    for (const f of rawParsedFormats) {
      const key = String(f.itag);
      itagCounts[key] = (itagCounts[key] || 0) + 1;
    }
    console.table(itagCounts);

    const deduped = uniqByItag(rawParsedFormats);

    console.log('=== AFTER DEDUP ===');
    console.table(
      deduped.map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        downloadMode: f.downloadMode,
      })),
    );
    console.log('After dedup count:', deduped.length);

    const allFormats = deduped;
    const dedupedGroupCounts = groupFormats(allFormats);
    console.log('FINAL VIDEO/AUDIO COUNTS', {
      videoOnlyCount: dedupedGroupCounts.videoOnly.length,
      audioOnlyCount: dedupedGroupCounts.audioOnly.length,
      progressiveCount: dedupedGroupCounts.progressive.length,
    });
    console.log('Format groups counts:', {
      progressive: dedupedGroupCounts.progressive.length,
      videoOnly: dedupedGroupCounts.videoOnly.length,
      audioOnly: dedupedGroupCounts.audioOnly.length,
    });

    console.log('[DEBUG] After deduplication by itag:', allFormats.length);
    timeline.push(`Step 10: After dedup by itag: ${allFormats.length}`);

    const formatProcessingMs = Date.now() - formatProcessingStart;
    const validFormats = filterValidFormats(allFormats);
    console.log('[DEBUG] After valid URL filter:', validFormats.length);
    timeline.push(`Step 11: After valid URL filter: ${validFormats.length}`);

    debugLines.push(`Total raw formats: ${rawFormats.length}`);
    debugLines.push(`Total adaptive formats: ${rawAdaptiveFormats.length}`);
    debugLines.push(`Valid formats: ${validFormats.length}`);
    debugLines.push(`Format processing time: ${formatProcessingMs}ms`);

    if (validFormats.length === 0) {
      console.log('[STEP 10] No playable formats found');
      debugLines.push(`=== DETAILED FORMAT ANALYSIS ===`);
      
      // Analyze why formats were rejected
      const rejectionAnalysis: {itag: number; reason: string}[] = [];
      
      for (const f of allFormats) {
        if (!f.url) {
          rejectionAnalysis.push({
            itag: f.itag,
            reason: 'no URL',
          });
        }
      }
      
      debugReport.rejectedFormats = rejectionAnalysis;
      
      debugLines.push(`Total formats checked: ${allFormats.length}`);
      debugLines.push(`Formats rejected: ${rejectionAnalysis.length}`);
      debugLines.push(`=== REJECTION REASONS ===`);
      
      rejectionAnalysis.forEach((r, i) => {
        if (i < 20) { // Show first 20
          debugLines.push(`itag=${r.itag}: ${r.reason}`);
          console.log(`[REJECTED] itag=${r.itag}: ${r.reason}`);
        }
      });

      debugLines.push(`\n=== RAW FORMAT DUMP (first 20) ===`);
      for (let i = 0; i < Math.min(20, allFormats.length); i += 1) {
        const f = allFormats[i];
        debugLines.push(
          `[${i}] itag=${f.itag} container=${f.container} hasVideo=${f.hasVideo} hasAudio=${f.hasAudio} url=${Boolean(
            f.url,
          )} quality=${f.qualityLabel || 'none'}`,
        );
      }
      
      debugReport.extractionMethod = debugReport.extractionAttempts[debugReport.extractionAttempts.length - 1] || 'none';
      
      if (rawFormats.length === 0 && rawAdaptiveFormats.length === 0) {
        debugReport.exactFailureReason = 'No formats found in player response';
      } else if (rejectionAnalysis.length === allFormats.length) {
        const commonReason = rejectionAnalysis[0]?.reason || 'unknown';
        debugReport.exactFailureReason = `All formats rejected: ${commonReason}`;
      } else {
        debugReport.exactFailureReason = `No valid formats found (got ${allFormats.length} total, ${validFormats.length} valid)`;
      }
      
      timeline.push(`Step X: Format filtering failed - ${debugReport.exactFailureReason}`);
      debugReport.timeline = timeline;
      
      console.log('[FAIL] No playable formats:', debugReport.exactFailureReason);
      console.log('\n========================\nYOUTUBE DEBUG REPORT\n========================');
      console.log('Input URL:', debugReport.inputUrl);
      console.log('Video ID:', debugReport.videoId);
      console.log('Extraction Method:', debugReport.extractionMethod);
      console.log('Extraction Attempts:', debugReport.extractionAttempts);
      console.log('Raw Formats Found:', rawFormats.length);
      console.log('Raw Adaptive Formats:', rawAdaptiveFormats.length);
      console.log('Total After Dedup:', allFormats.length);
      console.log('Valid formats:', validFormats.length);
      console.log('HTML Length:', debugReport.htmlLength);
      console.log('Request Status:', debugReport.requestStatus);
      console.log('Anti-Bot Detected:', debugReport.antiBotDetected);
      console.log('Streaming Data Found:', debugReport.streamingDataExists);
      console.log('Exact Failure Reason:', debugReport.exactFailureReason);
      console.log('Timeline:', timeline);
      console.log('========================\n');

      return jsonResponse(
        {
          success: false,
          error: debugReport.exactFailureReason,
          debug: debugMode ? debugLines : undefined,
          debugReport,
        },
        404,
      );
    }

    const normalizedFormats = sortFormats(
      validFormats
        .map(normalizeFormat)
        .filter((format): format is YoutubeFormat => format !== null),
    );

    const details = playerResponse?.videoDetails || {};
    const title = details.title || 'Untitled';
    const description = details.shortDescription || details.description || '';
    const thumbnail = (() => {
      const thumbnails = Array.isArray(details.thumbnail?.thumbnails)
        ? details.thumbnail.thumbnails
        : Array.isArray(details.thumbnails)
        ? details.thumbnails
        : [];
      if (thumbnails.length === 0) return null;
      return thumbnails.reduce((best: any, current: any) => {
        const bestScore = Number(best.width || 0) * Number(best.height || 0);
        const currentScore = Number(current.width || 0) * Number(current.height || 0);
        return currentScore > bestScore ? current : best;
      }).url || null;
    })();
    const duration = details.lengthSeconds ? `${details.lengthSeconds}s` : undefined;
    const formatGroups = groupFormats(normalizedFormats);

    const performanceReport: PerformanceReport = {
      cacheHit: false,
      cacheLookupMs,
      watchPageFetchMs,
      playerResponseParseMs,
      formatProcessingMs,
      totalExecutionMs: Date.now() - requestStartTime,
    };

    debugReport.formatsFound = rawFormats.length;
    debugReport.adaptiveFormatsFound = rawAdaptiveFormats.length;
    debugReport.extractionMethod = debugReport.extractionAttempts[debugReport.extractionAttempts.length - 1] || 'unknown';
    debugReport.timeline = timeline;

    console.log('[SUCCESS] Extraction successful');
    console.log('[FINAL] Title:', title);
    console.log('[FINAL] Formats:', normalizedFormats.length);
    console.log('[FINAL] Method:', debugReport.extractionMethod);
    timeline.push(`SUCCESS: ${normalizedFormats.length} formats extracted`);

    console.log('\n========================\nYOUTUBE DEBUG REPORT (SUCCESS)\n========================');
    console.log('Input URL:', debugReport.inputUrl);
    console.log('Video ID:', debugReport.videoId);
    console.log('Title:', title);
    console.log('Extraction Method:', debugReport.extractionMethod);
    console.log('Extraction Attempts:', debugReport.extractionAttempts);
    console.log('Raw Formats Found:', rawFormats.length);
    console.log('Raw Adaptive Formats:', rawAdaptiveFormats.length);
    console.log('Playable Formats:', normalizedFormats.length);
    console.log('HTML Length:', debugReport.htmlLength);
    console.log('Request Status:', debugReport.requestStatus);
    console.log('Timeline:', timeline);
    console.log('========================\n');

    const responsePayload = {
      success: true,
      videoId,
      title,
      thumbnail,
      description,
      duration,
      formatsCount: rawFormats.length,
      adaptiveFormatsCount: rawAdaptiveFormats.length,
      formats: normalizedFormats,
      formatGroups,
      formatGroupCounts: {
        progressive: formatGroups.progressive.length,
        videoOnly: formatGroups.videoOnly.length,
        audioOnly: formatGroups.audioOnly.length,
      },
      performanceReport,
      debug: debugMode ? debugLines : undefined,
      debugReport,
    };

    setCacheEntry(videoId, responsePayload);
    return jsonResponse(responsePayload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : 'no-stack';
    console.error('[youtube/extract] Unexpected error:', message);
    console.error('[youtube/extract] Stack:', stack);
    return jsonResponse(
      {
        success: false,
        error: `Internal server error: ${message}`,
        debug: [message, stack],
      },
      500,
    );
  }
}
