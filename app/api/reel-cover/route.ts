import { NextResponse } from 'next/server';
import { decodeInstagramUrl, normalizeInstagramUrl } from '../../../lib/download';

const reelRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels)\/[A-Za-z0-9_-]+(?:[/?].*)?$/i;

const requestHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.instagram.com/',
};

function extractCover(html: string) {
  const metaPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeInstagramUrl(match[1]);
  }

  const jsonPatterns = [
    /"display_url"\s*:\s*"((?:\\.|[^"\\])+)"/i,
    /"thumbnail_src"\s*:\s*"((?:\\.|[^"\\])+)"/i,
    /"image_url"\s*:\s*"((?:\\.|[^"\\])+)"/i,
  ];

  for (const pattern of jsonPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeInstagramUrl(match[1]);
  }

  return null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const originalUrl = typeof body?.url === 'string' ? body.url.trim() : '';

  if (!reelRegex.test(originalUrl)) {
    return NextResponse.json({ error: 'Paste a valid public Instagram Reel URL.' }, { status: 400 });
  }

  const pageUrl = normalizeInstagramUrl(originalUrl);
  const urls = [pageUrl, `${pageUrl.replace(/\/+$/, '')}/embed/`];

  for (const url of urls) {
    const response = await fetch(url, { headers: requestHeaders, cache: 'no-store' }).catch(() => null);
    if (!response?.ok) continue;
    const coverUrl = extractCover(await response.text());
    if (coverUrl) {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(coverUrl)}&filename=reel-cover.jpg`;
      return NextResponse.json({ success: true, previewUrl: proxyUrl, downloadUrl: `${proxyUrl}&download=1` });
    }
  }

  return NextResponse.json({ error: 'A cover image was not available for this public Reel.' }, { status: 422 });
}
