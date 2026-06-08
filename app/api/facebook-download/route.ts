import { NextRequest } from 'next/server';

export async function GET(req: Request) {
  try {
    console.log('facebook-download route hit');

    const parsedReqUrl = new URL(req.url);
    const { searchParams } = parsedReqUrl;
    console.log('facebook-download incoming querystring:', parsedReqUrl.search);
    const url = searchParams.get('url');
    const filenameParam = searchParams.get('filename');
    console.log('facebook-download incoming url param (raw):', url);

    if (!url) {
      console.log('facebook-download missing url param');
      return new Response(JSON.stringify({ error: 'Missing url query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (err) {
      console.log('facebook-download invalid url');
      return new Response(JSON.stringify({ error: 'Invalid url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const host = parsed.hostname.toLowerCase();
    // Allow common Facebook hosts and any fbcdn.net subdomain
    const allowedHosts = ['facebook.com', 'www.facebook.com', 'fb.watch', 'cdn.fbsbx.com'];
    const okHost = host.endsWith('fbcdn.net') || allowedHosts.some((h) => host === h || host.endsWith(h));
    console.log('facebook-download host:', host, 'host validation result:', okHost);
    if (!okHost) {
      console.log('facebook-download invalid host:', host);
      return new Response(JSON.stringify({ error: 'Invalid host for download' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('facebook-download fetching upstream');
    const upstream = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
      },
    });

    console.log('facebook-download upstream status:', upstream.status);

    if (!upstream.ok) {
      console.log('facebook-download upstream not ok');
      return new Response(JSON.stringify({ error: `Upstream responded with ${upstream.status}` }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentType = upstream.headers.get('content-type') || '';
    console.log('facebook-download upstream content-type:', contentType);

    // Log upstream response headers (for debugging signed URLs/hashes)
    try {
      const upstreamHeaders: Record<string, string> = {};
      upstream.headers.forEach((value, key) => {
        upstreamHeaders[key] = value;
      });
      console.log('facebook-download upstream headers:', upstreamHeaders);
    } catch (e) {
      console.log('facebook-download could not enumerate upstream headers', e);
    }

    if (!contentType.startsWith('video/')) {
      const snippet = await upstream.text().then((t) => t.slice(0, 2000)).catch(() => '');
      console.log('facebook-download upstream returned non-video content');
      return new Response(JSON.stringify({ error: 'Upstream did not return a video', contentType, snippet }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Derive filename
    const pathnameParts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = pathnameParts.length > 0 ? pathnameParts[pathnameParts.length - 1] : '';
    const safeFilename = filenameParam || lastPart || 'facebook-video.mp4';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

    console.log('facebook-download final response headers to client:');
    try {
      const respHeaders: Record<string, string> = {};
      headers.forEach((value, key) => {
        respHeaders[key] = value;
      });
      console.log(respHeaders);
    } catch (e) {
      console.log('facebook-download could not enumerate response headers', e);
    }

    console.log('facebook-download streaming response, filename:', safeFilename);

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.log('facebook-download unexpected error', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch remote video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const runtime = 'edge';
