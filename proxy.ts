import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLegacyRedirect, goneLegacyPaths } from './lib/legacyRoutes';

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname === 'www.globltools.com') {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = 'globltools.com';
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const legacyRedirect = getLegacyRedirect(request.nextUrl.pathname);
  if (legacyRedirect) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = legacyRedirect;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (goneLegacyPaths.has(request.nextUrl.pathname)) {
    return new NextResponse('This legacy resource has been permanently removed.', {
      status: 410,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const developmentScriptPolicy = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: https://www.google-analytics.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'`,
  );

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Vary', 'Accept-Encoding, Content-Type');
  } else if (pathname.startsWith('/blog') || pathname.startsWith('/about') || pathname.startsWith('/contact')) {
    response.headers.set('Cache-Control', 'public, max-age=86400, s-max-age=604800, stale-while-revalidate=2592000');
  } else if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    response.headers.set('Cache-Control', 'public, max-age=86400, s-max-age=604800');
  } else {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-max-age=86400, stale-while-revalidate=604800');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
