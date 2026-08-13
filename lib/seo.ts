import type { Metadata } from 'next';
import { baseUrl, defaultKeywords, siteName } from './toolPages';

export function makePageMetadata({
  title,
  description,
  slug,
  keywords,
  pageType = 'website',
}: {
  title: string;
  description: string;
  slug?: string;
  keywords?: string[];
  pageType?: 'website' | 'article';
}): Metadata {
  const url = slug ? `${baseUrl}/${slug}` : baseUrl;

  return {
    title,
    description,
    keywords: keywords ?? defaultKeywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
      },
    },
    openGraph: {
      title,
      description,
      type: pageType,
      url,
      siteName,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
      },
    },
  };
}

export function makeArticleMetadata({
  title,
  description,
  slug,
  keywords,
}: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
}): Metadata {
  return makePageMetadata({ title, description, slug, keywords, pageType: 'article' });
}
