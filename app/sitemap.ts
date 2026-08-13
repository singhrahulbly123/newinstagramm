import type { MetadataRoute } from 'next';
import { footerPages } from '../lib/footerPages';
import { getAllBlogPosts } from '../lib/blogAutomation';

type SitemapEntry = MetadataRoute.Sitemap[number];

function makeRoute(
  url: string,
  priority: number,
  changeFrequency: NonNullable<SitemapEntry['changeFrequency']>,
  lastModified?: Date,
): SitemapEntry {
  return {
    url,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://globltools.com';
  const allBlogPosts = await getAllBlogPosts();

  // Only canonical, indexable URLs that return content belong here. Redirect
  // aliases, noindex tools, and legacy keyword-variation pages are excluded.
  const staticRoutes: SitemapEntry[] = [
    makeRoute(baseUrl, 1.0, 'weekly'),
    makeRoute(`${baseUrl}/instagram`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/about`, 0.7, 'monthly'),
    makeRoute(`${baseUrl}/contact`, 0.6, 'monthly'),
    makeRoute(`${baseUrl}/blog`, 0.8, 'weekly'),
    makeRoute(`${baseUrl}/youtube-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/reel-cover-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/caption-hashtag-extractor`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/instagram-link-checker`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/video-quality-analyzer`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/carousel-zip-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/duplicate-media-finder`, 0.8, 'monthly'),
    makeRoute(`${baseUrl}/install-app`, 0.7, 'monthly'),
    makeRoute(`${baseUrl}/facebook-reel-downloader`, 0.85, 'weekly'),
    makeRoute(`${baseUrl}/facebook-video-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/cookie-policy`, 0.5, 'monthly'),
    makeRoute(`${baseUrl}/editorial-policy`, 0.5, 'monthly'),
    makeRoute(`${baseUrl}/privacy-policy`, 0.6, 'monthly'),
    makeRoute(`${baseUrl}/terms-of-service`, 0.6, 'monthly'),
    makeRoute(`${baseUrl}/instagram-reel-downloader`, 0.95, 'weekly'),
    makeRoute(`${baseUrl}/instagram-video-downloader`, 0.95, 'weekly'),
    makeRoute(`${baseUrl}/instagram-photo-downloader`, 0.95, 'weekly'),
    makeRoute(`${baseUrl}/instagram-audio-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/instagram-story-downloader`, 0.9, 'weekly'),
    makeRoute(`${baseUrl}/instagram-profile-picture-downloader`, 0.9, 'weekly'),
  ];

  const footerRoutes: SitemapEntry[] = Object.values(footerPages).map((page) =>
    makeRoute(`${baseUrl}/${page.slug}`, page.slug === 'about' ? 0.7 : 0.5, 'monthly'),
  );

  const blogPostRoutes: SitemapEntry[] = allBlogPosts.map((post) => {
    const modified = post.dateModified || post.datePublished;
    return makeRoute(
      `${baseUrl}/blog/${post.slug}`,
      0.7,
      'monthly',
      modified ? new Date(modified) : undefined,
    );
  });

  const routes = [...staticRoutes, ...footerRoutes, ...blogPostRoutes];
  return Array.from(new Map(routes.map((route) => [route.url, route])).values());
}
