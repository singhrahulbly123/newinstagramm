// Keep this inventory explicit. Add a URL only after confirming it existed on
// the previous production site. Irrelevant legacy content should return 410,
// not redirect to the homepage, which would create a soft-404 signal.
export const goneLegacyPaths = new Set([
  '/blog/sweden-mortgage-rates-2026-riksbank',
  '/kr/loan-calculator',
]);

export function getLegacyRedirect(pathname: string) {
  if (pathname === '/instgram') return '/instagram';
  if (pathname.startsWith('/instgram/')) {
    return pathname.replace(/^\/instgram\//, '/instagram/');
  }

  return null;
}
