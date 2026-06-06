import { NextResponse } from 'next/server';

const allowedHosts = [
  'instagram.com',
  'www.instagram.com',
  'cdninstagram.com',
  'instagramcdn.com',
  'fbcdn.net',
  'akamaized.net',
];

function isAllowedHost(url: URL) {
  const hostname = url.hostname.toLowerCase();
  return allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

function getAttachmentName(url: URL, filename: string) {
  const path = url.pathname;
  const ext = path.split('.').pop();
  if (ext && ext.length <= 5 && ext !== path) {
    return `${filename}.${ext}`;
  }
  return filename;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const urlParam = searchParams.get('url');
  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
  }

  let mediaUrl: URL;
  try {
    mediaUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: 'Invalid url parameter.' }, { status: 400 });
  }

  if (!isAllowedHost(mediaUrl)) {
    return NextResponse.json({ error: 'Only Instagram media URLs are allowed.' }, { status: 400 });
  }

  const downloadParam = searchParams.get('download') === '1';
  const filename = searchParams.get('filename') || 'instagram-media';
  const contentDisposition = downloadParam ? `attachment; filename="${getAttachmentName(mediaUrl, filename)}"` : undefined;

  const response = await fetch(mediaUrl.toString(), {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Referer: 'https://www.instagram.com/',
      Accept: '*/*',
    },
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ error: 'Unable to fetch Instagram media.' }, { status: 502 });
  }

  const headers = new Headers();
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  headers.set('Content-Type', contentType);
  if (contentDisposition) {
    headers.set('Content-Disposition', contentDisposition);
  }
  headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
