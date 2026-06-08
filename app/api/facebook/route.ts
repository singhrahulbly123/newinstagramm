import { NextResponse } from 'next/server';
import { extractFacebookMetadata, isSupportedFacebookUrl, normalizeFacebookUrl } from '../../../lib/facebookExtractor';
import { log, error } from '../../../lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.url !== 'string' || !body.url.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid Facebook URL.',
          qualities: [],
          debug: [],
        },
        { status: 400 }
      );
    }

    const originalUrl = body.url.trim();

    if (!isSupportedFacebookUrl(originalUrl)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid Facebook Reel, Video, or fb.watch URL.',
          qualities: [],
          debug: [],
        },
        { status: 400 }
      );
    }

    const pageUrl = normalizeFacebookUrl(originalUrl);
    log('FACEBOOK_API', 'Processing Facebook URL extraction', { originalUrl, pageUrl });

    const result = await extractFacebookMetadata(pageUrl);

    if (!result.success || result.qualities.length === 0) {
      error('FACEBOOK_API', 'No video found in extracted metadata', { pageUrl, debug: result.debug });
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to extract video from this Facebook link. Make sure the URL is public and contains a video.',
          qualities: [],
          debug: result.debug,
        },
        { status: 422 }
      );
    }

    log('FACEBOOK_API', 'Successfully extracted Facebook video', {
      title: result.title,
      qualityCount: result.qualities.length,
    });

    // Validate all quality URLs before returning
    const validatedQualities = result.qualities.filter((quality) => {
      try {
        new URL(quality.url);
        return true;
      } catch {
        error('FACEBOOK_API', 'Invalid URL in result', { url: quality.url, label: quality.label });
        return false;
      }
    });

    if (validatedQualities.length === 0) {
      error('FACEBOOK_API', 'No valid URLs after validation', { pageUrl });
      return NextResponse.json(
        {
          success: false,
          error: 'Extracted URLs are invalid. Please try again.',
          qualities: [],
          debug: result.debug,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      title: result.title || 'Facebook Video',
      thumbnail: result.thumbnail || undefined,
      description: result.description || undefined,
      qualities: validatedQualities,
      debug: result.debug,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    error('FACEBOOK_API', 'API endpoint error', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
        qualities: [],
        debug: [errorMessage],
      },
      { status: 500 }
    );
  }
}
