import { NextResponse } from 'next/server';
import {
  extractFacebookReelMetadata,
  fetchFacebookPageHtml,
  isSupportedFacebookReelUrl,
  normalizeFacebookReelUrl,
} from '../../../lib/facebook-extractor';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.url !== 'string') {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const originalUrl = body.url.trim();
  if (!isSupportedFacebookReelUrl(originalUrl)) {
    return NextResponse.json({ error: 'Please enter a valid Facebook Reel URL.' }, { status: 400 });
  }

  const pageUrl = normalizeFacebookReelUrl(originalUrl);

  const html = await fetchFacebookPageHtml(pageUrl).catch(() => null);
  if (!html) {
    return NextResponse.json({ error: 'Unable to fetch Facebook content. Please try again later.' }, { status: 502 });
  }

  const result = extractFacebookReelMetadata(html, pageUrl);
  if (!result.videoUrl) {
    return NextResponse.json({ 
      error: 'Unable to extract a Facebook Reel video from this link.',
      debug: result.debug,
    }, { status: 422 });
  }

  // Validate that the URL looks like a valid video URL
  if (!result.videoUrl.includes('.mp4') && !result.videoUrl.startsWith('https://')) {
    return NextResponse.json({ 
      error: 'Invalid video URL extracted from this reel.',
      debug: result.debug,
    }, { status: 422 });
  }

  const proxyUrl = `/api/proxy?url=${encodeURIComponent(result.videoUrl)}`;

  return NextResponse.json({
    success: true,
    videoUrl: result.videoUrl,
    proxyUrl,
    previewUrl: proxyUrl,
    thumbnailUrl: result.thumbnailUrl || undefined,
    title: result.title || undefined,
    description: result.description || undefined,
    debug: result.debug,
  });
}
