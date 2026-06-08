import ytdl from '@distube/ytdl-core';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId')?.trim();
    const itagParam = searchParams.get('itag')?.trim();
    const filename = searchParams.get('filename')?.trim() || 'youtube-video.mp4';
    const mode = searchParams.get('mode') === 'preview' ? 'preview' : 'download';

    console.log('[youtube-download] request:', { videoId, itag: itagParam, filename, mode });

    if (!videoId || !itagParam) {
      return jsonResponse({ error: 'Missing videoId or itag parameter' }, 400);
    }

    const itag = Number(itagParam);
    if (Number.isNaN(itag)) {
      return jsonResponse({ error: 'Invalid itag parameter' }, 400);
    }

    let info: any;
    try {
      info = await ytdl.getInfo(videoId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('[youtube-download] getInfo error:', message);
      return jsonResponse({ error: message }, 502);
    }

    const formats = Array.isArray(info.formats) ? info.formats : [];
    const selectedFormat = formats.find((format: any) => Number(format.itag) === itag);

    console.log('[youtube-download] selected itag:', itag, 'format found:', Boolean(selectedFormat));

    if (!selectedFormat || !selectedFormat.url) {
      return jsonResponse({ error: 'Requested format not found.' }, 404);
    }

    const upstreamUrl = selectedFormat.url;
    const upstreamHost = new URL(upstreamUrl).hostname;
    console.log('[youtube-download] upstream host:', upstreamHost);

    if (!upstreamHost.endsWith('googlevideo.com')) {
      return jsonResponse({ error: 'Disallowed upstream host' }, 400);
    }

    const range = req.headers.get('range');
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Accept: '*/*',
      Referer: 'https://www.youtube.com/',
    };
    if (range) headers.Range = range;

    const upstreamResp = await fetch(upstreamUrl, { method: 'GET', headers });
    console.log('[youtube-download] upstream status:', upstreamResp.status);

    if (!upstreamResp.ok && upstreamResp.status !== 206) {
      const text = await upstreamResp.text().catch(() => '');
      console.log('[youtube-download] upstream error body snippet:', text.slice(0, 200));
      return jsonResponse({ error: `Upstream responded with ${upstreamResp.status}` }, upstreamResp.status);
    }

    const contentType = upstreamResp.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = upstreamResp.headers.get('content-length');
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    responseHeaders.set('Content-Disposition', `${mode === 'preview' ? 'inline' : 'attachment'}; filename="${filename}"`);
    if (upstreamResp.status === 206) responseHeaders.set('Accept-Ranges', 'bytes');

    console.log('[youtube-download] using filename:', filename, 'mode:', mode);

    return new Response(upstreamResp.body, { status: upstreamResp.status, headers: responseHeaders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('[youtube-download] unexpected error:', message);
    return jsonResponse({ error: 'Unexpected server error', debug: [message] }, 500);
  }
}
