import { NextResponse } from 'next/server';
import { buildEmbedUrl, extractPhotoItemsFromHtml, isInstagramPhotoUrl } from '../../../lib/photo';

const validInstagramPhotoRegex = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;

async function fetchInstagramPage(url: string) {
  return await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
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
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.url !== 'string') {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const originalUrl = body.url.trim();
  if (!validInstagramPhotoRegex.test(originalUrl) || !isInstagramPhotoUrl(originalUrl)) {
    return NextResponse.json({ error: 'Please enter a valid Instagram photo URL.' }, { status: 400 });
  }

  const pageUrl = originalUrl.replace(/\/+$/, '');
  const response = await fetchInstagramPage(pageUrl).catch(() => null);
  if (!response || !response.ok) {
    return NextResponse.json({ error: 'Unable to fetch Instagram content. Please try again later.' }, { status: 502 });
  }

  const html = await response.text();
  const result = extractPhotoItemsFromHtml(html, pageUrl);
  let items = result.items;
  let debug = result.debug;

  if (!items.length && (html.includes('accounts/login') || response.url.includes('/accounts/login'))) {
    const embedUrl = buildEmbedUrl(pageUrl);
    const embedResponse = await fetchInstagramPage(embedUrl).catch(() => null);
    if (embedResponse && embedResponse.ok) {
      const embedHtml = await embedResponse.text();
      const embedResult = extractPhotoItemsFromHtml(embedHtml, pageUrl);
      items = embedResult.items;
      debug = debug.concat(embedResult.debug);
    }
  }

  if (!items.length) {
    return NextResponse.json({ error: 'Unable to find Instagram photo data from this link.' }, { status: 422 });
  }

  const previewUrl = items[0]?.url || null;

  return NextResponse.json({
    success: true,
    items,
    previewUrl,
    debug,
  });
}
