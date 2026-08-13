# Production SEO migration map

This file is the source of truth for URLs from the previous production site.
Do not redirect an unrelated legacy page to the homepage; use HTTP 410 when no
relevant replacement exists.

| Previous URL pattern | New destination | Response | Reason |
| --- | --- | --- | --- |
| `/instgram/:slug` | `/instagram/:slug` | 308 | Corrects the historical route typo while preserving the same guide. |
| `/audio` | `/instagram-audio-downloader` | 308 | Existing short alias for the canonical audio tool. |
| `/photo` | `/instagram-photo-downloader` | 308 | Existing short alias for the canonical photo tool. |
| `/story` | `/instagram-story-downloader` | 308 | Existing short alias for the canonical Story tool. |
| `/youtube` | `/youtube-downloader` | 308 | Existing short alias for the canonical YouTube tool. |
| `/blog/sweden-mortgage-rates-2026-riksbank` | none | 410 | Confirmed indexed finance article with no relevant replacement in the Instagram-media site. |
| `/kr/loan-calculator` | none | 410 | Confirmed indexed calculator with no relevant replacement in the current product. |

Before deployment, export the full legacy URL list from Google Search Console,
analytics, backlinks, and the old sitemap. Add every confirmed URL here and to
`lib/legacyRoutes.ts` as either a relevant one-to-one redirect or an explicit
410. Unknown URLs should continue to return the normal 404 response.
