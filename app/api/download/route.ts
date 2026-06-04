import { NextResponse } from 'next/server';
import {
  normalizeInstagramUrl,
  extractInstagramVideoUrl,
  extractUrlsFromAppJsonScripts,
} from '../../../lib/download';

const instaRegex = /^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.url !== 'string') {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const originalUrl = body.url.trim();
  if (!instaRegex.test(originalUrl)) {
    return NextResponse.json({ error: 'Please enter a valid Instagram reel or post URL.' }, { status: 400 });
  }

  const pageUrl = normalizeInstagramUrl(originalUrl);

  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://www.instagram.com/',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Sec-CH-UA': '"Chromium";v="126", "Not=A?Brand";v="99", "Google Chrome";v="126"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
    },
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ error: 'Unable to fetch Instagram content. Please try again later.' }, { status: 502 });
  }

  const html = await response.text();

  let downloadUrl = extractInstagramVideoUrl(html, originalUrl);
  let previewType: 'video' | 'image' = 'video';

  // If Instagram returned the login/redirect page, try the public embed endpoint
  if (!downloadUrl && (html.includes('accounts/login') || response.url.includes('/accounts/login'))) {
    try {
      const embedUrl = normalizeInstagramUrl(originalUrl).replace(/\/+$/, '') + '/embed/';
      const embedResp = await fetch(embedUrl, { headers: { 'User-Agent': response.headers.get('user-agent') || '', Referer: 'https://www.instagram.com/' } }).catch(() => null);
      if (embedResp && embedResp.ok) {
        const embedHtml = await embedResp.text();
        const fromEmbed = extractUrlsFromAppJsonScripts(embedHtml);
        if (fromEmbed) {
          downloadUrl = fromEmbed.url;
          previewType = fromEmbed.type;
        }
      }
    } catch {}
  }

  if (!downloadUrl) {
    return NextResponse.json({ error: 'Unable to extract video from this Instagram URL.' }, { status: 422 });
  }

  return NextResponse.json({
    success: true,
    downloadUrl,
    previewUrl: downloadUrl,
    proxyUrl: `/api/proxy?url=${encodeURIComponent(downloadUrl)}`,
    previewType,
  });
}
