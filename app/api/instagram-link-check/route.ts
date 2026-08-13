import { NextResponse } from 'next/server';
import { normalizeInstagramUrl } from '../../../lib/download';

const supportedRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(reel|reels|p|tv|stories)\/([^/?#]+)(?:[/?].*)?$/i;
const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36', Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', Referer: 'https://www.instagram.com/' };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const submittedUrl = typeof body?.url === 'string' ? body.url.trim() : '';
  let parsed: URL;
  try { parsed = new URL(submittedUrl); } catch { return NextResponse.json({ validFormat: false, status: 'invalid', message: 'This is not a valid URL.' }, { status: 400 }); }

  if (!/(^|\.)instagram\.com$/i.test(parsed.hostname)) return NextResponse.json({ validFormat: false, status: 'invalid', message: 'The URL is not from instagram.com.' }, { status: 400 });
  const match = submittedUrl.match(supportedRegex);
  if (!match) return NextResponse.json({ validFormat: false, status: 'unsupported', message: 'Use a Reel, post, video, or Story URL with a supported Instagram path.' }, { status: 400 });

  const rawType = match[1].toLowerCase();
  const contentType = rawType === 'reel' || rawType === 'reels' ? 'Reel' : rawType === 'p' ? 'Post' : rawType === 'tv' ? 'Video' : 'Story';
  const normalizedUrl = normalizeInstagramUrl(submittedUrl);
  const startedAt = Date.now();
  const response = await fetch(normalizedUrl, { headers, redirect: 'follow', cache: 'no-store' }).catch(() => null);
  const responseTimeMs = Date.now() - startedAt;

  if (!response) return NextResponse.json({ validFormat: true, contentType, normalizedUrl, status: 'unreachable', responseTimeMs, message: 'Instagram could not be reached from the server. Try again later.' }, { status: 502 });
  if (response.status === 404) return NextResponse.json({ validFormat: true, contentType, normalizedUrl, status: 'not_found', responseTimeMs, message: 'The content was not found. It may be deleted or the URL may be incorrect.' });
  if (!response.ok) return NextResponse.json({ validFormat: true, contentType, normalizedUrl, status: 'restricted_or_unavailable', responseTimeMs, message: 'The URL format is valid, but the content is restricted or temporarily unavailable.' });

  const html = await response.text();
  const loginWall = /login_required|accounts\/login|Login • Instagram/i.test(html);
  const hasPublicMetadata = /property=["']og:(?:image|video|description)["']/i.test(html);
  const status = hasPublicMetadata ? 'publicly_available' : loginWall ? 'login_required' : 'availability_uncertain';
  const message = hasPublicMetadata ? 'The link format is valid and public metadata is available.' : loginWall ? 'The link is valid, but Instagram requires a login for this response.' : 'The link is valid, but public media availability could not be confirmed.';
  return NextResponse.json({ validFormat: true, contentType, normalizedUrl, status, responseTimeMs, message });
}
