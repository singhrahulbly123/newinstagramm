export const siteOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'globltools',
  url: 'https://globltools.com',
  logo: 'https://globltools.com/app-icon.svg',
  description: 'Fast online downloader for Instagram, YouTube, TikTok, and other public social media content. No login, no apps, no watermark.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@globltools.com',
  },
};

export const siteWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'globltools',
  url: 'https://globltools.com',
  description: 'Download videos, reels, photos, and audio from Instagram, YouTube, TikTok, and more.',
};

export function makeBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function makeWebPageSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author = 'globltools',
  isPartOf = 'https://globltools.com',
}: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  isPartOf?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      url: isPartOf,
      name: 'globltools',
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://globltools.com',
    },
  };
}

export function makeArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author = 'globltools',
  articleBody,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  articleBody?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url,
    mainEntityOfPage: url,
    ...(image && { image }),
    articleBody,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://globltools.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'globltools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://globltools.com/app-icon.svg',
      },
    },
  };
}

export function makeFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function makeProductSchema({
  name,
  description,
  url,
  image,
  price = 'Free',
  priceCurrency = 'USD',
  availability = 'https://schema.org/InStock',
  aggregateRating,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  aggregateRating?: { ratingValue: number; reviewCount: number };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency,
      price,
      availability,
    },
    ...(aggregateRating && { aggregateRating }),
  };
}

export function makeVideoObjectSchema({
  name,
  description,
  url,
  uploadDate,
  duration,
  thumbnailUrl,
}: {
  name: string;
  description: string;
  url: string;
  uploadDate?: string;
  duration?: string;
  thumbnailUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    url,
    ...(uploadDate && { uploadDate }),
    ...(duration && { duration }),
    ...(thumbnailUrl && { thumbnailUrl }),
  };
}

export function makeHowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function makeSoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'UtilityApplication',
  offers = { price: 'Free' },
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers?: { price: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory,
    offers: {
      '@type': 'Offer',
      price: offers.price,
    },
  };
}
