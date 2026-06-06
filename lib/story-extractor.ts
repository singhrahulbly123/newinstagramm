import type { BrowserContext, Page } from 'playwright-core';
import { browserPool } from './browser-pool';
import { createInitialStoryItem } from './media-processor';
import { error, log } from './logger';
import type { StoryExtractionResult, StoryItem, StoryProfile } from '../types/story';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const MAX_HTML_FETCH_RETRIES = Number(process.env.STORY_HTML_FETCH_RETRY_COUNT || '2');
const REQUEST_TIMEOUT_MS = Number(process.env.STORY_EXTRACT_TIMEOUT_MS || '12000');
const STORY_URL_REGEX = /^https?:\/\/([^\/]+\.)?instagram\.com\/stories\/([^\/\?#]+)(?:[\/\?#].*)?$/i;
const USERNAME_REGEX = /^@?([a-z0-9._]{1,30})$/i;

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeJsonParse(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeInput(input: string): string {
  return input.trim().replace(/\s+/g, '');
}

export type NormalizedStoryInput = {
  username: string;
  sourceUrl: string;
};

export function parseStoryInput(input: string): NormalizedStoryInput | null {
  const normalized = normalizeInput(input);
  const urlMatch = normalized.match(STORY_URL_REGEX);
  if (urlMatch) {
    return {
      username: urlMatch[2],
      sourceUrl: normalized,
    };
  }

  const usernameMatch = normalized.match(USERNAME_REGEX);
  if (usernameMatch) {
    return {
      username: usernameMatch[1],
      sourceUrl: `https://www.instagram.com/stories/${usernameMatch[1]}/`,
    };
  }

  return null;
}

export function buildStoryPageUrl(username: string): string {
  return `https://www.instagram.com/stories/${username}/`;
}

function extractJsonPayloadsFromHtml(html: string): unknown[] {
  const payloads: unknown[] = [];

  const sharedDataMatch = html.match(/window\._sharedData\s*=\s*(\{[\s\S]*?\});/i);
  if (sharedDataMatch) {
    const parsed = safeJsonParse(sharedDataMatch[1]);
    if (parsed) {
      payloads.push(parsed);
    }
  }

  for (const regex of [
    /window\.__additionalDataLoaded\('.*?',\s*(\{[\s\S]*?\})\);/gi,
    /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi,
  ]) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const parsed = safeJsonParse(match[1]);
      if (parsed) {
        payloads.push(parsed);
      }
    }
  }

  return payloads;
}

function isStoryItemObject(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  const imageVersions = record.image_versions2 as Record<string, unknown> | undefined;
  if (Array.isArray(record.video_versions) || Array.isArray(imageVersions?.candidates)) {
    return true;
  }

  if (typeof record.display_url === 'string' || typeof record.media_url === 'string') {
    return true;
  }

  if ('taken_at' in record || 'taken_at_timestamp' in record) {
    return true;
  }

  return false;
}

function walkPayload(root: unknown, callback: (node: unknown) => boolean): void {
  if (Array.isArray(root)) {
    for (const item of root) {
      walkPayload(item, callback);
    }
    return;
  }

  if (!root || typeof root !== 'object') {
    return;
  }

  if (callback(root)) {
    return;
  }

  for (const value of Object.values(root)) {
    walkPayload(value, callback);
  }
}

function collectStoryArrays(root: unknown): unknown[][] {
  const storyArrays: unknown[][] = [];

  walkPayload(root, (node) => {
    if (Array.isArray(node) && node.length > 0 && node.every(isStoryItemObject)) {
      storyArrays.push(node);
      return true;
    }
    return false;
  });

  return storyArrays;
}

function findProfileObject(root: unknown, username: string): Record<string, unknown> | null {
  let profile: Record<string, unknown> | null = null;

  walkPayload(root, (node) => {
    if (!node || typeof node !== 'object') {
      return false;
    }

    const record = node as Record<string, unknown>;
    if (typeof record.username === 'string' && record.username.toLowerCase() === username.toLowerCase()) {
      if (typeof record.profile_pic_url === 'string' || typeof record.profile_pic_url_hd === 'string') {
        profile = record;
        return true;
      }
    }

    return false;
  });

  return profile;
}

function getBestMediaUrl(item: any): string | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const videoVersions = Array.isArray(item.video_versions) ? item.video_versions : [];
  if (videoVersions.length) {
    const best = videoVersions.reduce((current: any, candidate: any) => {
      if (!candidate || typeof candidate !== 'object') return current;
      return Number(candidate.width ?? 0) > Number(current.width ?? 0) ? candidate : current;
    }, videoVersions[0]);

    if (best && typeof best.url === 'string') {
      return best.url;
    }
  }

  const imageVersions = item.image_versions2 as Record<string, unknown> | undefined;
  const imageCandidates = Array.isArray(imageVersions?.candidates)
    ? imageVersions.candidates
    : Array.isArray(item.image_versions2)
    ? item.image_versions2
    : [];
  if (imageCandidates.length) {
    const best = imageCandidates.reduce((current: any, candidate: any) => {
      if (!candidate || typeof candidate !== 'object') return current;
      return Number(candidate.width ?? 0) > Number(current.width ?? 0) ? candidate : current;
    }, imageCandidates[0]);

    if (best && typeof best.url === 'string') {
      return best.url;
    }
  }

  if (typeof item.display_url === 'string') {
    return item.display_url;
  }

  if (typeof item.media_url === 'string') {
    return item.media_url;
  }

  return null;
}

function getThumbnailUrl(item: any): string {
  if (typeof item.display_url === 'string') {
    return item.display_url;
  }

  if (typeof item.thumbnail_src === 'string') {
    return item.thumbnail_src;
  }

  if (Array.isArray(item.display_resources) && item.display_resources.length) {
    const best = item.display_resources.reduce((current: any, candidate: any) => {
      if (!candidate || typeof candidate !== 'object') return current;
      return Number(candidate.config_width ?? 0) > Number(current.config_width ?? 0) ? candidate : current;
    }, item.display_resources[0]);
    if (best && typeof best.src === 'string') {
      return best.src;
    }
  }

  return getBestMediaUrl(item) ?? '';
}

function getMediaType(item: any): 'video' | 'image' {
  if (Array.isArray(item.video_versions) && item.video_versions.length) {
    return 'video';
  }
  if (item.is_video === true || item.media_type === 2) {
    return 'video';
  }
  return 'image';
}

function parseTimestamp(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

function buildStoryProfile(rawProfile: Record<string, unknown>, username: string, storyCount: number): StoryProfile {
  const followedBy = rawProfile.edge_followed_by as Record<string, unknown> | undefined;
  const follow = rawProfile.edge_follow as Record<string, unknown> | undefined;

  return {
    username,
    displayName: (typeof rawProfile.full_name === 'string' && rawProfile.full_name) || (typeof rawProfile.name === 'string' && rawProfile.name) || username,
    avatarUrl: (typeof rawProfile.profile_pic_url_hd === 'string' && rawProfile.profile_pic_url_hd) || (typeof rawProfile.profile_pic_url === 'string' && rawProfile.profile_pic_url) || '',
    verified: Boolean(rawProfile.is_verified || rawProfile.is_verified_account),
    isPrivate: Boolean(rawProfile.is_private),
    followerCount: parseTimestamp(followedBy?.count) ?? parseTimestamp(rawProfile.follower_count) ?? null,
    followingCount: parseTimestamp(follow?.count) ?? parseTimestamp(rawProfile.following_count) ?? null,
    biography: typeof rawProfile.biography === 'string' ? rawProfile.biography : null,
    storyCount,
    externalUrl: typeof rawProfile.external_url === 'string' ? rawProfile.external_url : null,
  };
}

function buildStoryItem(rawItem: any, username: string, index: number): StoryItem | null {
  const primaryUrl = getBestMediaUrl(rawItem);
  if (!primaryUrl) {
    return null;
  }

  const thumbnailUrl = getThumbnailUrl(rawItem);
  const mediaType = getMediaType(rawItem);
  const duration = parseTimestamp(rawItem.video_duration) ?? parseTimestamp(rawItem.duration) ?? null;
  const takenAt = parseTimestamp(rawItem.taken_at) ?? parseTimestamp(rawItem.taken_at_timestamp) ?? null;
  const id = typeof rawItem.id === 'string' ? rawItem.id : typeof rawItem.pk === 'string' ? rawItem.pk : `${username}-${index}`;
  const filename = `${username}-${id}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;

  return createInitialStoryItem({
    id,
    mediaType,
    title: mediaType === 'video' ? 'Instagram story video' : 'Instagram story image',
    filename,
    primaryUrl,
    thumbnailUrl,
    width: parseTimestamp(rawItem.original_width) ?? parseTimestamp(rawItem.width) ?? null,
    height: parseTimestamp(rawItem.original_height) ?? parseTimestamp(rawItem.height) ?? null,
    duration,
    takenAt,
  });
}

function extractStoryDetails(payloads: unknown[], username: string, sourceUrl: string, diagnostics: string[]): StoryExtractionResult | null {
  let profileCandidate: Record<string, unknown> | null = null;
  const storyItems: StoryItem[] = [];

  for (const payload of payloads) {
    if (!payload) {
      continue;
    }

    if (!profileCandidate) {
      profileCandidate = findProfileObject(payload, username);
    }

    const arrays = collectStoryArrays(payload);
    for (const array of arrays) {
      array.forEach((rawItem, index) => {
        const item = buildStoryItem(rawItem, username, storyItems.length + index);
        if (item) {
          storyItems.push(item);
        }
      });
    }
  }

  if (!storyItems.length) {
    return null;
  }

  const profile = buildStoryProfile(profileCandidate ?? {}, username, storyItems.length);
  log('STORY', 'Parsed story details from payloads', {
    username,
    mediaCount: storyItems.length,
    profileFound: Boolean(profileCandidate),
    sourceUrl,
  });

  return {
    sourceUrl,
    profile,
    stories: storyItems,
    extractedAt: new Date().toISOString(),
    diagnostics,
  };
}

async function fetchHtml(url: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_HTML_FETCH_RETRIES; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.instagram.com/',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        lastError = `Instagram responded with status ${response.status}`;
        continue;
      }

      return await response.text();
    } catch (err) {
      lastError = err;
      await pause(500 + attempt * 250);
    }
  }

  throw new Error(String(lastError ?? 'Failed to fetch HTML')); 
}

function collectPayloadsFromHtml(html: string): unknown[] {
  const payloads = extractJsonPayloadsFromHtml(html);
  if (!payloads.length) {
    const fallbackMatch = html.match(/<script[^>]*>([\s\S]*window\._sharedData[\s\S]*?)<\/script>/i);
    if (fallbackMatch) {
      const extracted = extractJsonPayloadsFromHtml(fallbackMatch[1]);
      payloads.push(...extracted);
    }
  }
  return payloads;
}

async function extractWithBrowser(username: string, pageUrl: string, diagnostics: string[]): Promise<StoryExtractionResult | null> {
  const context = await browserPool.acquireContext();
  let page: Page | null = null;

  try {
    page = await context.newPage();
    const capturePayloads: unknown[] = [];

    page.on('response', async (response) => {
      const requestUrl = response.url();
      if (/reel_media|stories|web\/graphql|api\/v1\//i.test(requestUrl)) {
        try {
          const text = await response.text();
          const parsed = safeJsonParse(text);
          if (parsed) {
            capturePayloads.push(parsed);
          }
        } catch {
          // ignore non-JSON responses
        }
      }
    });

    await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: REQUEST_TIMEOUT_MS });
    await page.waitForTimeout(1000);

    const pageSources = await page.$$eval('script[type="application/json"]', (nodes) => nodes.map((node) => node.textContent).filter(Boolean));
    const evalData = await page.evaluate(() => {
      const additional = (window as any).__additionalDataLoaded;
      const shared = (window as any)._sharedData;
      return {
        additional: additional ? JSON.stringify(additional) : null,
        shared: shared ? JSON.stringify(shared) : null,
      };
    });

    if (evalData.additional) {
      const parsed = safeJsonParse(evalData.additional);
      if (parsed) capturePayloads.push(parsed);
    }
    if (evalData.shared) {
      const parsed = safeJsonParse(evalData.shared);
      if (parsed) capturePayloads.push(parsed);
    }

    for (const source of pageSources) {
      if (typeof source !== 'string') {
        continue;
      }

      const parsed = safeJsonParse(source);
      if (parsed) {
        capturePayloads.push(parsed);
      }
    }

    const html = await page.content();
    const htmlPayloads = collectPayloadsFromHtml(html);
    capturePayloads.push(...htmlPayloads);

    const result = extractStoryDetails(capturePayloads, username, pageUrl, diagnostics);
    if (result) {
      diagnostics.push('[STORY] Browser extraction succeeded.');
      return result;
    }

    diagnostics.push('[STORY] Browser extraction did not find story data.');
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error('STORY', 'Browser extraction failed', message);
    diagnostics.push(`[STORY] Browser extraction failed: ${message}`);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch {
        // ignore
      }
    }
    await browserPool.releaseContext(context);
  }
}

export async function extractInstagramStory(input: string): Promise<StoryExtractionResult> {
  const normalized = parseStoryInput(input);
  if (!normalized) {
    throw new Error('Invalid Instagram story username or URL.');
  }

  const diagnostics: string[] = [];
  const pageUrl = buildStoryPageUrl(normalized.username);

  try {
    const html = await fetchHtml(pageUrl);
    diagnostics.push('[STORY] Retrieved Instagram story page HTML.');
    const payloads = collectPayloadsFromHtml(html);
    const result = extractStoryDetails(payloads, normalized.username, pageUrl, diagnostics);
    if (result) {
      diagnostics.push('[STORY] Static HTML story extraction succeeded.');
      return result;
    }

    diagnostics.push('[STORY] Static HTML extraction did not find story content, falling back to browser extraction.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    diagnostics.push(`[STORY] HTML fetch failed: ${message}`);
    log('STORY', 'HTML fetch failed for Story extraction', { username: normalized.username, error: message });
  }

  const browserResult = await extractWithBrowser(normalized.username, pageUrl, diagnostics);
  if (browserResult) {
    return browserResult;
  }

  throw new Error('No stories found, account is private, expired, or the profile is invalid.');
}
