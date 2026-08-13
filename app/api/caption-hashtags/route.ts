import { NextResponse } from 'next/server';
import { decodeInstagramUrl, normalizeInstagramUrl } from '../../../lib/download';

const instagramPostRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p|tv)\/[A-Za-z0-9_-]+(?:[/?].*)?$/i;
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.instagram.com/',
};

function decodeText(value: string) {
  return decodeInstagramUrl(value)
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .trim();
}

function extractCaption(html: string) {
  const jsonPatterns = [
    /"edge_media_to_caption"\s*:\s*\{"edges"\s*:\s*\[\{"node"\s*:\s*\{"text"\s*:\s*"((?:\\.|[^"\\])*)"/i,
    /"caption"\s*:\s*\{"text"\s*:\s*"((?:\\.|[^"\\])*)"/i,
    /"caption_text"\s*:\s*"((?:\\.|[^"\\])*)"/i,
  ];
  for (const pattern of jsonPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeText(match[1]);
  }

  const metaPatterns = [
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeText(match[1]);
  }
  return '';
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const originalUrl = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!instagramPostRegex.test(originalUrl)) {
    return NextResponse.json({ error: 'Paste a valid public Instagram post or Reel URL.' }, { status: 400 });
  }

  const pageUrl = normalizeInstagramUrl(originalUrl);
  for (const url of [pageUrl, `${pageUrl.replace(/\/+$/, '')}/embed/`]) {
    const response = await fetch(url, { headers, cache: 'no-store' }).catch(() => null);
    if (!response?.ok) continue;
    const caption = extractCaption(await response.text());
    if (!caption) continue;
    const hashtags = Array.from(new Set(caption.match(/#[\p{L}\p{N}_]+/gu) || []));
    const captionWithoutHashtags = caption.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s{2,}/g, ' ').trim();
    return NextResponse.json({ success: true, caption, captionWithoutHashtags, hashtags });
  }

  return NextResponse.json({ error: 'No public caption was available for this link.' }, { status: 422 });
}
