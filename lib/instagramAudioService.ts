import { createWriteStream } from 'node:fs';
import { writeFile, readFile, stat, mkdir, readdir, unlink, open } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import type { Browser } from 'playwright-core';
import { decodeInstagramUrl, extractMetaTag, extractUrlsFromAppJsonScripts } from './download';

let playwrightCore: any = null;
let chromiumPkg: any = null;
let playwrightBrowsersJsonIncluded = false;
const nodeRequire = createRequire(import.meta.url);

const DEFAULT_FETCH_TIMEOUT = Number(process.env.IG_FETCH_TIMEOUT_MS || 12000);
const DEFAULT_DOWNLOAD_TIMEOUT = Number(process.env.IG_DOWNLOAD_TIMEOUT_MS || 20000);
const MAX_FETCH_RETRIES = Number(process.env.IG_FETCH_RETRY_COUNT || 2);
const MAX_VIDEO_DOWNLOAD_RETRIES = Number(process.env.IG_VIDEO_DOWNLOAD_RETRY_COUNT || 2);
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const VIDEO_URL_REGEX = /https?:\/\/(?:[\w-]+\.)+[\w-]+\/(?:[^"'<>\s]+?)\.mp4(?:\?[^"'<>\s]*)?/gi;
const SIMPLE_VIDEO_URL_FIELD = /"video_url"\s*:\s*"(https:[^"\\]+)"/i;

export type AudioExtractionDiagnostics = string[];

export type InstagramAudioExtractionResult = {
  videoUrl: string | null;
  mediaUrls?: string[];
  strategy: string | null;
  diagnostics: AudioExtractionDiagnostics;
  error?: string;
};

type PlaywrightFallbackResult = {
  videoUrl: string | null;
  mediaUrls?: string[];
  error?: string;
};

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeString(value: string) {
  return value.replace(/\u0026/gi, '&').replace(/\\\//g, '/');
}

function addMp4CandidatesFromText(value: string | null | undefined, candidates: Set<string>) {
  if (!value) return;
  const decoded = normalizeString(value);
  let match: RegExpExecArray | null;
  VIDEO_URL_REGEX.lastIndex = 0;
  while ((match = VIDEO_URL_REGEX.exec(decoded)) !== null) {
    candidates.add(decodeInstagramUrl(match[0]));
  }
}

function rankMp4Candidates(candidates: string[]) {
  return Array.from(new Set(candidates.map(decodeInstagramUrl)))
    .filter((url) => url.startsWith('https://') && url.includes('.mp4'))
    .sort((a, b) => {
      const score = (url: string) => {
        let value = url.length;
        if (/https:\/\/[^/]*scontent/i.test(url)) value += 10000;
        if (url.includes('cdninstagram.com')) value += 5000;
        if (url.includes('bytestart') || url.includes('byteend')) value += 1000;
        return value;
      };
      return score(b) - score(a);
    });
}

function pushDiagnostic(diagnostics: AudioExtractionDiagnostics, message: string) {
  diagnostics.push(message);
  console.log('[AUDIO]', message);
}

function hasModernInstagramMarkers(html: string) {
  const markers = [
    'window.__additionalDataLoaded',
    'RelayPrefetchedStreamCache',
    'PolarisSiteData',
    'PolarisPostActionLoadPostQueryQuery',
    'xdt_api__v1__media',
    'xdt_shortcode_media',
  ];
  return markers.some((marker) => html.includes(marker));
}

async function saveFetchedHtml(html: string, label: string, diagnostics: AudioExtractionDiagnostics) {
  const filename = `${label.replace(/[^a-zA-Z0-9_-]+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2)}.html`;
  const filepath = path.join(os.tmpdir(), filename);
  await writeFile(filepath, html, 'utf8');
  pushDiagnostic(diagnostics, `[AUDIO] Saved fetched HTML to ${filepath}`);
  return filepath;
}

const CACHE_DIR = path.join(os.tmpdir(), 'fastvideosave-cache');
const VIDEO_CACHE_FILE = path.join(CACHE_DIR, 'video-cache.json');
const MP3_CACHE_DIR = path.join(CACHE_DIR, 'mp3');
const VIDEO_CACHE_TTL_MS = Number(process.env.IG_VIDEO_CACHE_TTL_MS || 1000 * 60 * 60 * 24); // 24h
const MP3_CACHE_TTL_MS = Number(process.env.IG_MP3_CACHE_TTL_MS || 1000 * 60 * 60 * 24 * 7); // 7d

async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await mkdir(MP3_CACHE_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readJsonFile<T = any>(file: string): Promise<T | null> {
  try {
    const txt = await readFile(file, 'utf8');
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}

async function writeJsonFile(file: string, data: unknown) {
  await writeFile(file, JSON.stringify(data), 'utf8');
}

async function getCachedVideoUrl(pageUrl: string): Promise<string | null> {
  await ensureCacheDir();
  const cache = (await readJsonFile<Record<string, { url: string; ts: number }>>(VIDEO_CACHE_FILE)) || {};
  const entry = cache[pageUrl];
  if (!entry) return null;
  if (Date.now() - entry.ts > VIDEO_CACHE_TTL_MS) return null;
  return entry.url;
}

async function setCachedVideoUrl(pageUrl: string, videoUrl: string) {
  await ensureCacheDir();
  const cache = (await readJsonFile<Record<string, { url: string; ts: number }>>(VIDEO_CACHE_FILE)) || {};
  cache[pageUrl] = { url: videoUrl, ts: Date.now() };
  await writeJsonFile(VIDEO_CACHE_FILE, cache);
}

export async function getMP3CachePath(filename: string) {
  await ensureCacheDir();
  const safe = filename.replace(/[^a-zA-Z0-9-_.]/g, '-');
  const filePath = path.join(MP3_CACHE_DIR, safe);
  try {
    const s = await stat(filePath);
    if (Date.now() - s.mtimeMs > MP3_CACHE_TTL_MS) {
      // expired
      await unlink(filePath).catch(() => undefined);
      return null;
    }
    return filePath;
  } catch {
    return null;
  }
}

export async function setMP3CachePath(filename: string, tmpPath: string) {
  await ensureCacheDir();
  const safe = filename.replace(/[^a-zA-Z0-9-_.]/g, '-');
  const dest = path.join(MP3_CACHE_DIR, safe);
  try {
    const fileBuffer = await readFile(tmpPath);
    await writeFile(dest, new Uint8Array(fileBuffer));
    return dest;
  } catch (err) {
    return null;
  }
}

export async function cleanupExpiredMP3Cache() {
  await ensureCacheDir();
  try {
    const files = await readdir(MP3_CACHE_DIR);
    for (const f of files) {
      const p = path.join(MP3_CACHE_DIR, f);
      try {
        const s = await stat(p);
        if (Date.now() - s.mtimeMs > MP3_CACHE_TTL_MS) {
          await unlink(p).catch(() => undefined);
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

async function ensurePlaywrightBrowsersJson() {
  if (playwrightBrowsersJsonIncluded) return;

  try {
    const playwrightPackageJson = nodeRequire.resolve('playwright-core/package.json');
    const browsersJsonPath = path.join(path.dirname(playwrightPackageJson), 'browsers.json');
    await readFile(browsersJsonPath, 'utf8');
    playwrightBrowsersJsonIncluded = true;
  } catch {
    // If this file cannot be resolved, we allow the later Playwright import to fail normally.
  }
}

class PlaywrightManager {
  private static browser: Browser | null = null;

  static async getBrowser(): Promise<Browser> {
    if (this.browser) return this.browser;

    await ensurePlaywrightBrowsersJson();

    if (!playwrightCore) {
      playwrightCore = await import('playwright-core');
    }
    if (!chromiumPkg) {
      const chromiumModule = await import('@sparticuz/chromium');
      chromiumPkg = chromiumModule.default ?? chromiumModule;
    }

    const browser = await playwrightCore.chromium.launch({
      args: chromiumPkg.args,
      executablePath: await chromiumPkg.executablePath(),
      headless: true,
    });

    this.browser = browser;
    return browser;
  }

  static async extractVideoFromPage(url: string, diagnostics: AudioExtractionDiagnostics, timeoutMs = Number(process.env.IG_PLAYWRIGHT_TIMEOUT_MS || 15000)): Promise<PlaywrightFallbackResult> {
    pushDiagnostic(diagnostics, '[AUDIO] Playwright manager extracting video');
    const browser = await this.getBrowser();
    pushDiagnostic(diagnostics, '[AUDIO] Browser launched');
    const proxy = process.env.PROXY_URL || undefined;

    const contextOptions: any = { userAgent: USER_AGENT, locale: 'en-US' };
    if (proxy) {
      contextOptions.proxy = { server: proxy };
      pushDiagnostic(diagnostics, `[AUDIO] Using proxy for Playwright: ${proxy}`);
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    const networkCandidates = new Set<string>();
    const mediaResponseCandidates = new Set<string>();

    page.on('request', (request) => {
      addMp4CandidatesFromText(request.url(), networkCandidates);
      if (request.resourceType() === 'media') {
        addMp4CandidatesFromText(request.url(), mediaResponseCandidates);
      }
      const postData = request.postData();
      if (postData) addMp4CandidatesFromText(postData, networkCandidates);
    });

    page.on('response', async (response) => {
      const responseUrl = response.url();
      addMp4CandidatesFromText(responseUrl, networkCandidates);
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('video') || contentType.includes('octet-stream')) {
        addMp4CandidatesFromText(responseUrl, mediaResponseCandidates);
      }
    });

    // Inject cookies if present
    const sessionId = process.env.INSTAGRAM_SESSIONID;
    const csrftoken = process.env.INSTAGRAM_CSRFTOKEN;
    if (sessionId) {
      try {
        await context.addCookies([
          { name: 'sessionid', value: sessionId, domain: '.instagram.com', path: '/', httpOnly: true, secure: true },
        ]);
        pushDiagnostic(diagnostics, '[AUDIO] Session cookie injected');
      } catch (e) {
        pushDiagnostic(diagnostics, `[AUDIO] Session cookie injection failed: ${(e as Error).message}`);
      }
    }
    if (csrftoken) {
      try {
        await context.addCookies([
          { name: 'csrftoken', value: csrftoken, domain: '.instagram.com', path: '/', httpOnly: false, secure: true },
        ]);
        pushDiagnostic(diagnostics, '[AUDIO] CSRF token cookie injected');
      } catch (e) {
        pushDiagnostic(diagnostics, `[AUDIO] CSRF cookie injection failed: ${(e as Error).message}`);
      }
    }

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => undefined);
      pushDiagnostic(diagnostics, '[AUDIO] Page loaded');

      const videoData = await page.evaluate(() => {
        const primaryVideoSrc = document.querySelector("video")?.src || null;
        const urls: string[] = [];
        const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
        for (const video of videos) {
          if (video.currentSrc) urls.push(video.currentSrc);
          if (video.src) urls.push(video.src);
          const sourceElements = Array.from(video.querySelectorAll('source')) as HTMLSourceElement[];
          for (const sourceEl of sourceElements) {
            if (sourceEl.src) urls.push(sourceEl.src);
          }
        }
        return {
          primaryVideoSrc,
          sources: Array.from(new Set(urls)),
          videoCount: videos.length,
        };
      });

      if (!videoData.videoCount) {
        const error = 'No video element found';
        pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback error: ${error}`);
        return { videoUrl: null, error };
      }
      pushDiagnostic(diagnostics, '[AUDIO] Video element found');

      await page.evaluate(() => {
        const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
        for (const video of videos) {
          video.muted = true;
          video.play().catch(() => undefined);
        }
      }).catch(() => undefined);
      await page.waitForTimeout(3000);

      const performanceUrls = await page.evaluate(() =>
        performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter(Boolean),
      );
      for (const resourceUrl of performanceUrls) {
        addMp4CandidatesFromText(resourceUrl, networkCandidates);
      }

      const sources = videoData.sources;
      if (videoData.primaryVideoSrc || sources.length) {
        pushDiagnostic(diagnostics, '[AUDIO] Video src extracted');
        pushDiagnostic(diagnostics, `[AUDIO] Playwright video sources: ${JSON.stringify({ primaryVideoSrc: videoData.primaryVideoSrc, sources })}`);
      } else {
        const error = 'Video element found but no video src extracted';
        pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback error: ${error}`);
        return { videoUrl: null, error };
      }

      for (const source of sources) {
        addMp4CandidatesFromText(source, networkCandidates);
      }

      const candidates = rankMp4Candidates([...mediaResponseCandidates, ...networkCandidates]);
      pushDiagnostic(diagnostics, `[AUDIO] Playwright media response candidates: ${JSON.stringify(Array.from(mediaResponseCandidates))}`);
      pushDiagnostic(diagnostics, `[AUDIO] Playwright MP4 candidates: ${JSON.stringify(candidates)}`);
      if (!candidates.length) {
        const error = `No MP4 URL found in Playwright video sources or network activity: ${JSON.stringify({ sources, mediaResponseCandidates: Array.from(mediaResponseCandidates), networkCandidates: Array.from(networkCandidates) })}`;
        pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback error: ${error}`);
        return { videoUrl: null, error };
      }

      const best = candidates.sort((a, b) => b.length - a.length)[0];
      pushDiagnostic(diagnostics, '[AUDIO] MP4 URL found');
      return { videoUrl: best, mediaUrls: candidates };
    } catch (err) {
      const error = (err as Error).message || String(err);
      pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback error: ${error}`);
      return { videoUrl: null, error };
    } finally {
      try {
        await context.close();
      } catch { }
    }
  }
}

async function playwrightFallback(url: string, diagnostics: AudioExtractionDiagnostics): Promise<PlaywrightFallbackResult> {
  pushDiagnostic(diagnostics, '[AUDIO] Starting Playwright fallback');

  try {
    const cached = await getCachedVideoUrl(url);
    if (cached) {
      pushDiagnostic(diagnostics, '[AUDIO] Cached MP4 URL hit');
      pushDiagnostic(diagnostics, '[AUDIO] MP4 URL found');
      return { videoUrl: cached, mediaUrls: [cached] };
    }

    const extracted = await PlaywrightManager.extractVideoFromPage(url, diagnostics);
    if (extracted.videoUrl) {
      await setCachedVideoUrl(url, extracted.videoUrl).catch(() => undefined);
      pushDiagnostic(diagnostics, '[AUDIO] Playwright extraction success');
      return extracted;
    }

    const error = extracted.error || 'Playwright fallback failed to extract a URL';
    pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback failed: ${error}`);
    return { videoUrl: null, error };
  } catch (err) {
    const error = (err as Error).message || String(err);
    pushDiagnostic(diagnostics, `[AUDIO] Playwright fallback error: ${error}`);
    return { videoUrl: null, error };
  }
}

function extractVideoUrlsFromObject(value: unknown, results: Set<string>) {
  if (value == null) return;

  if (typeof value === 'string') {
    const decoded = normalizeString(value);
    let match: RegExpExecArray | null;
    while ((match = VIDEO_URL_REGEX.exec(decoded)) !== null) {
      results.add(decodeInstagramUrl(match[0]));
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      extractVideoUrlsFromObject(item, results);
    }
    return;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if (typeof record.video_url === 'string') {
      results.add(decodeInstagramUrl(record.video_url));
    }
    if (typeof record.playback_url === 'string') {
      results.add(decodeInstagramUrl(record.playback_url));
    }
    if (typeof record.playback_uri === 'string') {
      results.add(decodeInstagramUrl(record.playback_uri));
    }
    if (typeof record.contentUrl === 'string') {
      results.add(decodeInstagramUrl(record.contentUrl));
    }
    if (typeof record.url === 'string' && record.url.includes('.mp4')) {
      results.add(decodeInstagramUrl(record.url));
    }

    if (Array.isArray(record.video_versions)) {
      for (const item of record.video_versions) {
        if (item && typeof item === 'object' && typeof (item as any).url === 'string') {
          results.add(decodeInstagramUrl((item as any).url));
        }
      }
    }

    for (const nested of Object.values(record)) {
      extractVideoUrlsFromObject(nested, results);
    }
  }
}

function findVideoUrlCandidatesFromJson(html: string, pattern: RegExp, label: string, diagnostics: AudioExtractionDiagnostics) {
  const urls = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const jsonString = match[1];
    const parsed = safeParseJson(jsonString);
    if (parsed) {
      extractVideoUrlsFromObject(parsed, urls);
    } else {
      const rawMatch = String(jsonString);
      let nested: RegExpExecArray | null;
      while ((nested = VIDEO_URL_REGEX.exec(rawMatch)) !== null) {
        urls.add(decodeInstagramUrl(nested[0]));
      }
    }
  }

  pushDiagnostic(diagnostics, `Checked ${label} JSON source, found ${urls.size} candidate(s)`);
  return Array.from(urls);
}

function findBestCandidate(candidates: string[]) {
  return candidates
    .map((url) => decodeInstagramUrl(url))
    .filter((url) => url.startsWith('https://') && url.includes('.mp4'))
    .sort((a, b) => b.length - a.length)[0] || null;
}

function extractFromModernJsonStructures(html: string, diagnostics: AudioExtractionDiagnostics) {
  const results = new Set<string>();

  const patterns = [
    { label: 'xdt_shortcode_media', regex: /xdt_shortcode_media\s*:\s*(\{[\s\S]*?\})(?:,|\n)/gi },
    { label: 'RelayPrefetchedStreamCache', regex: /RelayPrefetchedStreamCache\s*=\s*(\{[\s\S]*?\});/gi },
    { label: '__additionalDataLoaded', regex: /window\.__additionalDataLoaded\([^,]+,\s*(\{[\s\S]*?\})\s*\)/gi },
    { label: '_sharedData', regex: /window\._sharedData\s*=\s*(\{[\s\S]*?\})\s*;/gi },
  ];

  for (const entry of patterns) {
    const candidates = findVideoUrlCandidatesFromJson(html, entry.regex, entry.label, diagnostics);
    for (const candidate of candidates) {
      results.add(candidate);
    }
  }

  const final = findBestCandidate(Array.from(results));
  if (final) {
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 1 success: Modern Instagram JSON structures');
  } else {
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 1 failed: no modern JSON video source found');
  }
  return final;
}

function extractFromAppJsonScripts(html: string, diagnostics: AudioExtractionDiagnostics) {
  const appJsonResult = extractUrlsFromAppJsonScripts(html);
  if (appJsonResult?.type === 'video' && appJsonResult.url) {
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 2 success: embedded application/json script detected');
    return appJsonResult.url;
  }
  pushDiagnostic(diagnostics, '[AUDIO] Strategy 2 failed: no video URL in embedded JSON scripts');
  return null;
}

function extractFromOpenGraph(html: string, diagnostics: AudioExtractionDiagnostics) {
  const videoMeta = extractMetaTag(html, 'og:video');
  const alternateVideoMeta = extractMetaTag(html, 'og:video:url');
  const candidate = videoMeta || alternateVideoMeta || null;
  if (candidate) {
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 3 success: og:video metadata');
    return decodeInstagramUrl(candidate);
  }
  pushDiagnostic(diagnostics, '[AUDIO] Strategy 3 failed: no og:video metadata found');
  return null;
}

function extractFromInlineVideoUrl(html: string, diagnostics: AudioExtractionDiagnostics) {
  const match = SIMPLE_VIDEO_URL_FIELD.exec(html);
  if (match) {
    const candidate = decodeInstagramUrl(match[1]);
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 4 success: inline video_url pattern matched');
    return candidate;
  }

  const fallbackMatches = [...html.matchAll(VIDEO_URL_REGEX)].map((m) => decodeInstagramUrl(m[0]));
  if (fallbackMatches.length > 0) {
    pushDiagnostic(diagnostics, '[AUDIO] Strategy 4 success: raw MP4 URL pattern detected');
    return findBestCandidate(fallbackMatches);
  }

  pushDiagnostic(diagnostics, '[AUDIO] Strategy 4 failed: no video_url or MP4 pattern found');
  return null;
}

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function retryFetch(url: string, options: RequestInit = {}, retries = MAX_FETCH_RETRIES, timeoutMs = DEFAULT_FETCH_TIMEOUT) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok) {
        return response;
      }
      if (response.status >= 500 || response.status === 429) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      attempt += 1;
      if (attempt > retries) {
        throw error;
      }
      const delay = 300 * attempt;
      console.log('[AUDIO] fetch retry', { url, attempt, delay, error: (error as Error).message });
      await pause(delay);
    }
  }
  throw new Error('Retry loop failed unexpectedly');
}

export async function fetchInstagramPageHtml(url: string) {
  const response = await retryFetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://www.instagram.com/',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
      'Sec-CH-UA': '"Chromium";v="126", "Not=A?Brand";v="99", "Google Chrome";v="126"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
    },
  });

  const html = await response.text();
  return { html, status: response.status, url: response.url };
}

export async function downloadInstagramVideoToFile(videoUrl: string, outputPath: string) {
  const response = await retryFetch(videoUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      Referer: 'https://www.instagram.com/',
      Origin: 'https://www.instagram.com',
      Accept: 'video/mp4,video/*;q=0.9,*/*;q=0.8',
      Range: 'bytes=0-',
      'Sec-Fetch-Dest': 'video',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
    },
  }, MAX_VIDEO_DOWNLOAD_RETRIES, DEFAULT_DOWNLOAD_TIMEOUT);

  const contentType = response.headers.get('content-type') || '';
  const contentLength = response.headers.get('content-length') || null;
  console.log('[AUDIO] Video source response received', {
    status: response.status,
    contentType,
    contentLength,
    responseUrl: response.url,
  });

  if (!response.ok || !response.body) {
    const preview = await response.text().catch(() => '');
    throw new Error(`Failed to download video source: HTTP ${response.status}. contentType=${contentType}. preview=${preview.slice(0, 200)}`);
  }

  const writer = createWriteStream(outputPath);
  const reader = (response.body as ReadableStream<Uint8Array>).getReader();

  await new Promise<void>(async (resolve, reject) => {
    writer.on('error', reject);
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          if (!writer.write(Buffer.from(value))) {
            await new Promise<void>((drainResolve, drainReject) => {
              writer.once('drain', drainResolve);
              writer.once('error', drainReject);
            });
          }
        }
      }
      writer.end(resolve);
    } catch (error) {
      reject(error);
    }
  });

  const fileStat = await stat(outputPath);
  console.log('[AUDIO] Downloaded video file saved', { outputPath, bytes: fileStat.size });

  const handle = await open(outputPath, 'r');
  try {
    const probe = Buffer.alloc(Math.min(fileStat.size, 1024 * 1024));
    const { bytesRead } = await handle.read(probe, 0, probe.length, 0);
    const probeText = probe.subarray(0, bytesRead).toString('latin1');
    const hasFtyp = probeText.includes('ftyp');
    const hasMoof = probeText.includes('moof');
    const isVideoContentType = contentType.toLowerCase().startsWith('video/');

    if (hasMoof) {
      console.log('[AUDIO] fMP4 detected', { contentType, bytes: fileStat.size });
    } else if (hasFtyp || isVideoContentType) {
      console.log('[AUDIO] MP4 detected', { contentType, bytes: fileStat.size });
    } else {
      console.log('[AUDIO] MP4 signature not found; passing file to FFmpeg for validation', {
        contentType,
        bytes: fileStat.size,
        firstBytesHex: probe.subarray(0, Math.min(bytesRead, 64)).toString('hex'),
      });
    }
  } finally {
    await handle.close();
  }
}

export async function extractInstagramReelVideoUrl(html: string, originalUrl: string, pageUrl: string): Promise<InstagramAudioExtractionResult> {
  const diagnostics: AudioExtractionDiagnostics = [];
  pushDiagnostic(diagnostics, '[AUDIO] Starting extraction pipeline');

  try {
    const cached = await getCachedVideoUrl(pageUrl);
    if (cached) {
      pushDiagnostic(diagnostics, '[AUDIO] Returning cached video URL');
      return { videoUrl: cached, mediaUrls: [cached], strategy: 'Cache', diagnostics };
    }
  } catch (e) {
    // ignore cache errors
  }

  const strategy1 = extractFromModernJsonStructures(html, diagnostics);
  if (strategy1) {
    try { await setCachedVideoUrl(pageUrl, strategy1); } catch { }
    return { videoUrl: strategy1, mediaUrls: [strategy1], strategy: 'Strategy 1', diagnostics };
  }

  const strategy2 = extractFromAppJsonScripts(html, diagnostics);
  if (strategy2) {
    try { await setCachedVideoUrl(pageUrl, strategy2); } catch { }
    return { videoUrl: strategy2, mediaUrls: [strategy2], strategy: 'Strategy 2', diagnostics };
  }

  const strategy3 = extractFromOpenGraph(html, diagnostics);
  if (strategy3) {
    try { await setCachedVideoUrl(pageUrl, strategy3); } catch { }
    return { videoUrl: strategy3, mediaUrls: [strategy3], strategy: 'Strategy 3', diagnostics };
  }

  const strategy4 = extractFromInlineVideoUrl(html, diagnostics);
  if (strategy4) {
    try { await setCachedVideoUrl(pageUrl, strategy4); } catch { }
    return { videoUrl: strategy4, mediaUrls: [strategy4], strategy: 'Strategy 4', diagnostics };
  }

  pushDiagnostic(diagnostics, '[AUDIO] Static extraction failed');
  if (!hasModernInstagramMarkers(html)) {
    await saveFetchedHtml(html, 'instagram-failed-extraction', diagnostics);
  }

  const playwrightResult = await playwrightFallback(pageUrl, diagnostics);
  if (playwrightResult.videoUrl) {
    try { await setCachedVideoUrl(pageUrl, playwrightResult.videoUrl); } catch { }
    return { videoUrl: playwrightResult.videoUrl, mediaUrls: playwrightResult.mediaUrls || [playwrightResult.videoUrl], strategy: 'Playwright fallback', diagnostics };
  }

  const failureReasons = diagnostics.filter((line) => line.includes('failed') || line.includes('detected'));
  const failureMessage = ['Unable to extract Instagram reel video URL.'].concat(failureReasons).join(' ');
  return {
    videoUrl: null,
    strategy: null,
    diagnostics,
    error: playwrightResult.error || failureMessage,
  };
}

