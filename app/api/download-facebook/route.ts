import { NextRequest } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
      return new Response('Missing "url" query parameter', { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (err) {
      return new Response('Invalid URL', { status: 400 });
    }

    // Basic host whitelist to avoid open proxy abuse
    const host = parsed.hostname.toLowerCase();
    const allowedHosts = [
      'facebook.com',
      'www.facebook.com',
      'fb.watch',
      'video.xx.fbcdn.net',
      'scontent.xx.fbcdn.net',
      'cdn.fbsbx.com',
    ];

    const okHost = allowedHosts.some((h) => host === h || host.endsWith(h));
    if (!okHost) {
      return new Response('Invalid host for download', { status: 400 });
    }

    // Fetch the remote video. Use a user-agent to mimic browser requests.
    const upstream = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream responded with ${upstream.status}`, { status: upstream.status });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    headers.set('Content-Type', contentType);

    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);

    // Derive a filename from the remote path or fall back to a generic name
    const pathnameParts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = pathnameParts.length > 0 ? pathnameParts[pathnameParts.length - 1] : '';
    const safeFilename = lastPart || 'facebook-video.mp4';
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response('Failed to fetch remote video', { status: 500 });
  }
}

export const runtime = 'edge';
