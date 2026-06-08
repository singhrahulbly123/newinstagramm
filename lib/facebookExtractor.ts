import { log, error } from './logger';
import { browserPool } from './browser-pool';
import type { BrowserContext, Page } from 'playwright-core';

const FACEBOOK_REEL_REGEX = /^https?:\/\/(?:www\.)?facebook\.com\/reel\/[A-Za-z0-9_-]+(?:[\/\?].*)?$/i;
const FACEBOOK_VIDEO_REGEX = /^https?:\/\/(?:www\.)?facebook\.com\/video\/.+$/i;
const FB_WATCH_REGEX = /^https?:\/\/fb\.watch\/[A-Za-z0-9_-]+(?:[\/\?].*)?$/i;
const MOBILE_FACEBOOK_REGEX = /^https?:\/\/m\.facebook\.com\/.+/i;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const REQUEST_TIMEOUT_MS = Number(process.env.FACEBOOK_EXTRACT_TIMEOUT_MS || '12000');
const MAX_RETRIES = Number(process.env.FACEBOOK_EXTRACT_MAX_RETRIES || '3');
const PLAYWRIGHT_TIMEOUT_MS = Number(process.env.FACEBOOK_PLAYWRIGHT_TIMEOUT_MS || '30000');

export type FacebookQuality = {
  label: 'HD' | 'SD' | 'default';
  url: string;
};

export type FacebookExtractionResult = {
  success: boolean;
  title: string | null;
  thumbnail: string | null;
  qualities: FacebookQuality[];
  description: string | null;
  debug: string[];
};

function decodeUrlFully(encodedUrl: string, debug: string[]): string {
  let url = encodedUrl;
  const originalUrl = url;

  debug.push(`[URL Decode] Original: ${url.substring(0, 100)}...`);

  // Step 1: Decode Unicode escape sequences for percent-encoded characters
  // \u00253D → %3D, \u00252F → %2F, \u002526 → %26, etc.
  url = url.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    const code = parseInt(hex, 16);
    return String.fromCharCode(code);
  });

  if (url !== encodedUrl) {
    debug.push(`[URL Decode] After unicode decode: ${url.substring(0, 100)}...`);
  }

  // Step 2: Handle escaped forward slashes
  url = url.replace(/\\\//g, '/');

  // Step 3: Decode HTML entities
  url = url
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Step 4: URL decode percent-encoded characters (%3D → =, %2F → /)
  try {
    url = decodeURIComponent(url);
    debug.push(`[URL Decode] After decodeURIComponent: ${url.substring(0, 100)}...`);
  } catch (err) {
    debug.push(`[URL Decode] decodeURIComponent failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    // Continue with partially decoded URL
  }

  // Step 5: Remove any trailing quotes or special chars
  url = url.replace(/^["']|["']$/g, '').trim();

  // Step 6: Validate the URL structure
  try {
    const parsed = new URL(url);
    debug.push(`[URL Decode] ✓ Valid URL: scheme=${parsed.protocol}, host=${parsed.hostname}`);
  } catch (urlErr) {
    debug.push(`[URL Decode] ⚠ Invalid URL structure: ${urlErr instanceof Error ? urlErr.message : 'unknown error'}`);
  }

  // Step 7: Ensure URL uses HTTPS
  if (url.startsWith('http://')) {
    url = 'https://' + url.substring(7);
    debug.push(`[URL Decode] Upgraded to HTTPS`);
  }

  debug.push(`[URL Decode] Final: ${url.substring(0, 100)}...`);

  return url;
}

function normalizeFacebookString(value: string): string {
  return value
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
}

async function validateVideoUrl(
  url: string,
  debug: string[],
  quality: string
): Promise<{ valid: boolean; contentType: string | null; statusCode: number | null }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': USER_AGENT,
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type');
    const statusCode = response.status;

    debug.push(
      `[${quality} Validation] URL: ${url.substring(0, 80)}... | Status: ${statusCode} | Content-Type: ${contentType || 'none'}`
    );

    // Accept 200 status and video/* or application/octet-stream (for MP4)
    const isValidVideo =
      statusCode === 200 &&
      (contentType?.startsWith('video/') || contentType?.includes('mp4') || !contentType);

    if (isValidVideo) {
      debug.push(`[${quality} Validation] ✓ URL is valid and downloadable`);
      return { valid: true, contentType, statusCode };
    } else {
      debug.push(
        `[${quality} Validation] ✗ URL returned status ${statusCode} with content-type: ${contentType}`
      );
      return { valid: false, contentType, statusCode };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'unknown error';
    debug.push(`[${quality} Validation] Error: ${errorMsg}`);
    return { valid: false, contentType: null, statusCode: null };
  }
}

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  const match = regex.exec(html);
  return match?.[1] ? normalizeFacebookString(match[1]) : null;
}

function extractJsonProperty(html: string, key: string): string | null {
  const regex = new RegExp(`["']${key}["']\s*:\s*["']([^"']+)["']`, 'gi');
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      return normalizeFacebookString(match[1]);
    }
  }
  return null;
}

function collectQualityVariants(html: string, debug: string[]): Map<string, string> {
  const qualities = new Map<string, string>();

  debug.push('=== HTML-based extraction started ===');

  // Search for playable_url patterns
  const playableUrlMatches = Array.from(html.matchAll(/["']playable_url_quality_hd["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`playable_url_quality_hd matches: ${playableUrlMatches.length}`);
  for (const match of playableUrlMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      qualities.set('HD', candidate);
      debug.push(`✓ HD from playable_url_quality_hd: ${candidate.substring(0, 80)}...`);
      break;
    }
  }

  // Search for playable_url_hd
  const playableUrlHdMatches = Array.from(html.matchAll(/["']playable_url_hd["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`playable_url_hd matches: ${playableUrlHdMatches.length}`);
  for (const match of playableUrlHdMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('HD')) {
        qualities.set('HD', candidate);
        debug.push(`✓ HD from playable_url_hd: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Search for browser_native_hd_url
  const browserNativeHdMatches = Array.from(html.matchAll(/["']browser_native_hd_url["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`browser_native_hd_url matches: ${browserNativeHdMatches.length}`);
  for (const match of browserNativeHdMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('HD')) {
        qualities.set('HD', candidate);
        debug.push(`✓ HD from browser_native_hd_url: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Search for SD quality patterns
  const playableUrlMatches2 = Array.from(html.matchAll(/["']playable_url["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`playable_url (SD) matches: ${playableUrlMatches2.length}`);
  for (const match of playableUrlMatches2) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('SD')) {
        qualities.set('SD', candidate);
        debug.push(`✓ SD from playable_url: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Search for browser_native_sd_url
  const browserNativeSdMatches = Array.from(html.matchAll(/["']browser_native_sd_url["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`browser_native_sd_url matches: ${browserNativeSdMatches.length}`);
  for (const match of browserNativeSdMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('SD')) {
        qualities.set('SD', candidate);
        debug.push(`✓ SD from browser_native_sd_url: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Search for video_url
  const videoUrlMatches = Array.from(html.matchAll(/["']video_url["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`video_url matches: ${videoUrlMatches.length}`);
  for (const match of videoUrlMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('SD')) {
        qualities.set('SD', candidate);
        debug.push(`✓ SD from video_url: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Search for videoData objects
  const videoDataMatches = Array.from(html.matchAll(/["']videoData["']\s*:\s*{[^}]*["']src["']\s*:\s*["']([^"']+)["']/gi));
  debug.push(`videoData.src matches: ${videoDataMatches.length}`);
  for (const match of videoDataMatches) {
    const candidate = decodeUrlFully(match[1], debug);
    if (candidate && candidate.includes('.mp4') && candidate.startsWith('https://')) {
      if (!qualities.has('SD')) {
        qualities.set('SD', candidate);
        debug.push(`✓ SD from videoData: ${candidate.substring(0, 80)}...`);
        break;
      }
    }
  }

  // Fallback: raw MP4 URL search
  const mp4Matches = Array.from(html.matchAll(/https?:\/\/[^"'<>\s\\]+\.mp4(?:\?[^"'<>\s\\]*)?/gi));
  debug.push(`Raw .mp4 URL matches: ${mp4Matches.length}`);
  if (qualities.size === 0 && mp4Matches.length > 0) {
    const urls = mp4Matches
      .map((match) => decodeUrlFully(match[0], debug))
      .filter((url) => url.startsWith('https://') && url.includes('.mp4'));
    if (urls.length > 0) {
      qualities.set('SD', urls[0]);
      debug.push(`✓ SD from raw .mp4 search: ${urls[0].substring(0, 80)}...`);
    }
  }

  debug.push(`=== HTML extraction complete: found ${qualities.size} variant(s) ===`);
  return qualities;
}

export function isSupportedFacebookUrl(url: string): boolean {
  return (
    FACEBOOK_REEL_REGEX.test(url) ||
    FACEBOOK_VIDEO_REGEX.test(url) ||
    FB_WATCH_REGEX.test(url) ||
    MOBILE_FACEBOOK_REGEX.test(url)
  );
}

export function normalizeFacebookUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

export async function fetchFacebookPageHtml(pageUrl: string, retryCount: number = 0): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.facebook.com/',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Sec-CH-UA': '"Chromium";v="126", "Not=A?Brand";v="99", "Google Chrome";v="126"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
      },
    });

    if (!response.ok) {
      if (retryCount < MAX_RETRIES) {
        log('FACEBOOK', `Fetch failed with status ${response.status}, retrying...`, { retryCount });
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchFacebookPageHtml(pageUrl, retryCount + 1);
      }
      throw new Error(`HTTP ${response.status} from Facebook`);
    }

    return await response.text();
  } catch (err) {
    if (retryCount < MAX_RETRIES && !(err instanceof Error && err.name === 'AbortError')) {
      log('FACEBOOK', `Fetch error, retrying...`, { retryCount, error: String(err) });
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
      return fetchFacebookPageHtml(pageUrl, retryCount + 1);
    }

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (errorMessage.includes('AbortError') || errorMessage.includes('timeout')) {
      throw new Error('Request timeout. Facebook took too long to respond.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function extractFacebookWithPlaywright(
  pageUrl: string,
  debug: string[]
): Promise<FacebookExtractionResult> {
  debug.push('Playwright extraction started');
  let context: BrowserContext | null = null;

  try {
    context = await browserPool.acquireContext();
    const page: Page = await context.newPage();
    const collectedUrls = new Set<string>();
    const qualityInfo = new Map<string, string>();

    // Monitor all network responses for MP4 URLs
    page.on('response', (response) => {
      try {
        const url = response.url();
        if (url.includes('.mp4')) {
          debug.push(`[Network] MP4 detected: ${url.substring(0, 100)}...`);
          collectedUrls.add(url);

          // Try to infer quality from URL parameters
          if (url.includes('_hd_') || url.includes('hd=1') || url.includes('quality=high')) {
            qualityInfo.set(url, 'HD');
          } else if (url.includes('_sd_') || url.includes('sd=1') || url.includes('quality=low')) {
            qualityInfo.set(url, 'SD');
          }
        }
      } catch (err) {
        // ignore response monitoring errors
      }
    });

    // Navigate to the page with timeout
    debug.push(`Navigating to ${pageUrl}`);
    const navStart = Date.now();
    try {
      await page.goto(pageUrl, {
        waitUntil: 'networkidle',
        timeout: PLAYWRIGHT_TIMEOUT_MS,
      });
    } catch (navErr) {
      debug.push(`Navigation timeout/error after ${Date.now() - navStart}ms, continuing...`);
      // Continue even if navigation times out - we may have collected URLs
    }

    debug.push(`Page loaded. Elapsed: ${Date.now() - navStart}ms`);
    debug.push(`Collected ${collectedUrls.size} MP4 URL(s) from network`);

    // Try to extract from page content as well
    const pageContent = await page.content();
    const pageQualitiesMap = collectQualityVariants(pageContent, debug);

    // Combine network-detected and HTML-detected URLs
    const allQualities = new Map<string, string>();

    // Add HTML-detected URLs first (higher priority)
    if (pageQualitiesMap.has('HD')) {
      allQualities.set('HD', pageQualitiesMap.get('HD')!);
      debug.push('HD found in page content');
    }
    if (pageQualitiesMap.has('SD')) {
      allQualities.set('SD', pageQualitiesMap.get('SD')!);
      debug.push('SD found in page content');
    }

    // Add network-detected URLs
    if (collectedUrls.size > 0) {
      const urlArray = Array.from(collectedUrls);
      debug.push(`Network URLs: ${urlArray.map((u) => u.substring(0, 60)).join('; ')}`);

      // Decode all network URLs
      const decodedUrlArray = urlArray.map((url) => ({
        original: url,
        decoded: decodeUrlFully(url, debug),
        quality: qualityInfo.get(url),
      }));

      // Try to identify HD vs SD from network URLs
      for (const urlInfo of decodedUrlArray) {
        if (!allQualities.has('HD') && urlInfo.quality === 'HD') {
          allQualities.set('HD', urlInfo.decoded);
          debug.push(`✓ HD from network: ${urlInfo.decoded.substring(0, 80)}...`);
        }
      }
      // Add first non-HD URL as SD if we don't have SD
      if (!allQualities.has('SD')) {
        for (const urlInfo of decodedUrlArray) {
          if (urlInfo.quality !== 'HD') {
            allQualities.set('SD', urlInfo.decoded);
            debug.push(`✓ SD from network: ${urlInfo.decoded.substring(0, 80)}...`);
            break;
          }
        }
      }
      // If still no SD, just use first decoded URL
      if (!allQualities.has('SD') && decodedUrlArray.length > 0) {
        allQualities.set('SD', decodedUrlArray[0].decoded);
        debug.push(`Using first network URL as SD: ${decodedUrlArray[0].decoded.substring(0, 80)}...`);
      }
    }

    // Extract title and thumbnail from page
    let title: string | null = null;
    let thumbnail: string | null = null;
    let description: string | null = null;

    try {
      title = await page.evaluate(() => {
        const og = document.querySelector('meta[property="og:title"]');
        return og?.getAttribute('content') || null;
      });
    } catch {
      // ignore
    }

    try {
      thumbnail = await page.evaluate(() => {
        const og = document.querySelector('meta[property="og:image"]');
        return og?.getAttribute('content') || null;
      });
    } catch {
      // ignore
    }

    try {
      description = await page.evaluate(() => {
        const og = document.querySelector('meta[property="og:description"]');
        return og?.getAttribute('content') || null;
      });
    } catch {
      // ignore
    }

    const qualities: FacebookQuality[] = [];
    if (allQualities.has('HD')) {
      qualities.push({
        label: 'HD',
        url: allQualities.get('HD')!,
      });
    }
    if (allQualities.has('SD')) {
      qualities.push({
        label: 'SD',
        url: allQualities.get('SD')!,
      });
    }

    debug.push(`=== Playwright extraction complete: ${qualities.length} quality variant(s) ===`);

    return {
      success: qualities.length > 0,
      title,
      thumbnail,
      qualities,
      description,
      debug,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Playwright error';
    debug.push(`Playwright error: ${errorMessage}`);
    error('FACEBOOK_PLAYWRIGHT', 'Playwright extraction failed', { error: errorMessage });

    return {
      success: false,
      title: null,
      thumbnail: null,
      qualities: [],
      description: null,
      debug,
    };
  } finally {
    if (context) {
      try {
        await browserPool.releaseContext(context);
        debug.push('Browser context released');
      } catch (releaseErr) {
        error('FACEBOOK_PLAYWRIGHT', 'Failed to release context', releaseErr);
      }
    }
  }
}

export async function extractFacebookMetadata(
  pageUrl: string
): Promise<FacebookExtractionResult> {
  const debug: string[] = [];

  try {
    debug.push(`Fetching: ${pageUrl}`);
    const html = await fetchFacebookPageHtml(pageUrl);
    debug.push(`Received HTML: ${html.length} bytes`);

    const title = extractMetaContent(html, 'og:title');
    const description = extractMetaContent(html, 'og:description');
    const thumbnail = extractMetaContent(html, 'og:image');

    debug.push(`Title: ${title || 'not found'}`);
    debug.push(`Thumbnail: ${thumbnail ? 'found' : 'not found'}`);

    const qualitiesMap = collectQualityVariants(html, debug);
    let qualities: FacebookQuality[] = [];

    // HD first, then SD
    if (qualitiesMap.has('HD')) {
      qualities.push({
        label: 'HD',
        url: qualitiesMap.get('HD')!,
      });
    }
    if (qualitiesMap.has('SD')) {
      qualities.push({
        label: 'SD',
        url: qualitiesMap.get('SD')!,
      });
    }

    // If HTML scraping found no URLs, try Playwright fallback
    if (qualities.length === 0) {
      debug.push('=== HTML extraction found 0 URLs, attempting Playwright fallback ===');
      const playwrightResult = await extractFacebookWithPlaywright(pageUrl, debug);
      if (playwrightResult.qualities.length > 0) {
        qualities = playwrightResult.qualities;
        debug.push(`=== Using Playwright extraction results ===`);
      }
    }

    // Validate all extracted URLs before returning
    debug.push(`=== Starting URL validation for ${qualities.length} quality variant(s) ===`);
    const validatedQualities: FacebookQuality[] = [];

    for (const quality of qualities) {
      const validation = await validateVideoUrl(quality.url, debug, quality.label);
      if (validation.valid) {
        validatedQualities.push(quality);
        debug.push(`✓ ${quality.label} URL passed validation`);
      } else {
        debug.push(
          `✗ ${quality.label} URL failed validation: Status ${validation.statusCode}, Content-Type: ${validation.contentType}`
        );
      }
    }

    // If validation removed all URLs, try fallback extraction
    if (validatedQualities.length === 0 && qualities.length > 0) {
      debug.push('=== All URLs failed validation, trying final fallback ===');
      const defaultUrl = extractJsonProperty(html, 'src') || extractJsonProperty(html, 'playable_url');
      if (defaultUrl) {
        const decodedUrl = decodeUrlFully(defaultUrl, debug);
        if (decodedUrl && decodedUrl.startsWith('https://') && decodedUrl.includes('.mp4')) {
          const validation = await validateVideoUrl(decodedUrl, debug, 'default');
          if (validation.valid) {
            validatedQualities.push({
              label: 'default',
              url: decodedUrl,
            });
            debug.push(`✓ Default URL passed validation`);
          }
        }
      }
    }

    debug.push(
      `=== URL validation complete: ${validatedQualities.length} valid URL(s) of ${qualities.length} ===`
    );

    return {
      success: validatedQualities.length > 0,
      title: title || null,
      thumbnail: thumbnail || null,
      qualities: validatedQualities,
      description: description || null,
      debug,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown extraction error';
    error('FACEBOOK', 'Extraction failed', { error: errorMessage });
    debug.push(`Error: ${errorMessage}`);

    return {
      success: false,
      title: null,
      thumbnail: null,
      qualities: [],
      description: null,
      debug,
    };
  }
}
