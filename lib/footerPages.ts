import type { Metadata } from 'next';
import { makePageMetadata } from './seo';

export type FooterPageKey =
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'editorial-policy';

export type FooterPage = {
  slug: FooterPageKey;
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
  accent: string;
  reader: string;
  promise: string;
  sections: string[];
  stats: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
  schemaType: 'AboutPage' | 'ContactPage' | 'PrivacyPolicy' | 'TermsOfService' | 'WebPage';
};

const sharedSections = [
  'Clear purpose',
  'Public link workflow',
  'User privacy',
  'Responsible downloads',
  'Mobile experience',
  'Desktop reliability',
  'Quality expectations',
  'Support and feedback',
  'Search visibility',
  'Internal navigation',
  'Trust signals',
  'Regular improvement',
  'Limits and transparency',
  'Best practice guidance',
  'Final recommendation',
];

export const footerPages: Record<FooterPageKey, FooterPage> = {
  about: {
    slug: 'about',
    eyebrow: 'About globltools',
    title: 'About globltools and Our Instagram Downloader Mission',
    description:
      'Learn about globltools, our mission to make public media downloads simple, and the privacy-first approach behind our downloader tools.',
    keywords: ['about globltools', 'instagram downloader mission', 'download tool company', 'public media downloader'],
    accent: 'Built for fast, simple, public media saving',
    reader: 'people who want a clean downloader without installing extra apps',
    promise:
      'globltools exists to make downloading public Instagram reels, videos, photos, stories, and audio easier for everyday users while keeping the main workflow simple, respectful, and transparent.',
    sections: sharedSections,
    stats: [
      { label: 'Core focus', value: 'Instagram tools' },
      { label: 'Login needed', value: 'No' },
      { label: 'Main action', value: 'Paste a link' },
    ],
    faqs: [
      {
        question: 'What is globltools built for?',
        answer:
          'globltools is built for users who need a quick browser-based way to process public Instagram links and save media for personal offline access.',
      },
      {
        question: 'Does globltools require an Instagram account?',
        answer:
          'No. The service is designed around public links and does not ask for Instagram login credentials.',
      },
      {
        question: 'Where should I start a download?',
        answer:
          'Start on the homepage, paste the public Instagram URL, and let the downloader detect the available media.',
      },
    ],
    schemaType: 'AboutPage',
  },
  contact: {
    slug: 'contact',
    eyebrow: 'Contact globltools',
    title: 'Contact globltools Support and Product Team',
    description:
      'Contact globltools for support, feedback, bug reports, and media downloader questions about public Instagram links and site performance.',
    keywords: ['contact globltools', 'globltools support', 'instagram downloader support', 'download tool help'],
    accent: 'Support for download issues, feedback, and improvements',
    reader: 'users who need help with a public link, a page issue, or a product suggestion',
    promise:
      'This contact page explains how to reach globltools, what information helps us investigate downloader issues, and how feedback improves the Instagram download experience for every visitor.',
    sections: sharedSections,
    stats: [
      { label: 'Support email', value: 'Available' },
      { label: 'Best detail', value: 'Public URL' },
      { label: 'Response focus', value: 'Helpful context' },
    ],
    faqs: [
      {
        question: 'What should I include when contacting support?',
        answer:
          'Include the page you used, the type of Instagram link, the browser or device, and a short description of what happened.',
      },
      {
        question: 'Can I request a new feature?',
        answer:
          'Yes. Feature ideas, bug reports, and usability suggestions help us decide what to improve next.',
      },
      {
        question: 'Do you provide help for private Instagram content?',
        answer:
          'No. globltools only works with public links, and support cannot help bypass private account restrictions.',
      },
    ],
    schemaType: 'ContactPage',
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    eyebrow: 'Privacy Policy',
    title: 'globltools Privacy Policy for Public Link Downloads',
    description:
      'Read globltools privacy policy and understand how we handle public links, technical data, analytics, and user privacy.',
    keywords: ['privacy policy', 'globltools privacy', 'instagram downloader privacy', 'public link privacy'],
    accent: 'Privacy-first handling for public Instagram URLs',
    reader: 'visitors who want to understand how downloader data is processed',
    promise:
      'This privacy policy explains how globltools approaches public link processing, temporary technical data, analytics, security, and user control while keeping the main downloader experience clear.',
    sections: sharedSections,
    stats: [
      { label: 'Login data', value: 'Not requested' },
      { label: 'Private content', value: 'Not supported' },
      { label: 'Core data', value: 'Public links' },
    ],
    faqs: [
      {
        question: 'Does globltools ask for my Instagram password?',
        answer:
          'No. globltools does not need or request Instagram credentials. The downloader only works with public links.',
      },
      {
        question: 'Why does the site process pasted URLs?',
        answer:
          'The pasted URL is needed to detect public media and prepare the download response requested by the user.',
      },
      {
        question: 'Can I manage cookies?',
        answer:
          'Yes. You can manage cookies through your browser settings, though some preferences or analytics signals may be affected.',
      },
    ],
    schemaType: 'PrivacyPolicy',
  },
  'terms-of-service': {
    slug: 'terms-of-service',
    eyebrow: 'Terms of Service',
    title: 'globltools Terms of Service for Responsible Downloads',
    description:
      'Read the terms of service for globltools, including usage rules, disclaimers, public link limits, and responsible downloader behavior.',
    keywords: ['terms of service', 'globltools terms', 'instagram downloader terms', 'responsible downloads'],
    accent: 'Rules for fair and lawful public media use',
    reader: 'users who want to understand permitted use before downloading media',
    promise:
      'These terms describe how globltools should be used, what public links are supported, how intellectual property responsibilities remain with users, and how the service may change over time.',
    sections: sharedSections,
    stats: [
      { label: 'Supported content', value: 'Public links' },
      { label: 'User duty', value: 'Respect rights' },
      { label: 'Platform status', value: 'Independent' },
    ],
    faqs: [
      {
        question: 'Can I use globltools for private posts?',
        answer:
          'No. The service is intended for public links only and cannot be used to access private or restricted Instagram content.',
      },
      {
        question: 'Who is responsible for downloaded content?',
        answer:
          'Users are responsible for how they use downloaded files and should respect creator rights, platform rules, and local law.',
      },
      {
        question: 'Can these terms change?',
        answer:
          'Yes. We may update terms as the website, platform requirements, or legal expectations change.',
      },
    ],
    schemaType: 'TermsOfService',
  },
  'cookie-policy': {
    slug: 'cookie-policy',
    eyebrow: 'Cookie Policy',
    title: 'globltools Cookie Policy and Browser Preference Guide',
    description:
      'Read globltools cookie policy to understand which cookies and similar technologies support performance, preferences, analytics, and user experience.',
    keywords: ['cookie policy', 'globltools cookies', 'instagram downloader cookies', 'browser preferences'],
    accent: 'Simple cookies for performance and usable preferences',
    reader: 'visitors who want to understand browser cookies before using the downloader',
    promise:
      'This cookie policy explains how globltools may use essential cookies, preference storage, analytics signals, and performance measurements to keep the Instagram downloader reliable.',
    sections: sharedSections,
    stats: [
      { label: 'Main use', value: 'Performance' },
      { label: 'Control', value: 'Browser settings' },
      { label: 'Sensitive data', value: 'Not required' },
    ],
    faqs: [
      {
        question: 'Can I disable cookies?',
        answer:
          'Yes. Your browser can block or delete cookies, though some preferences and measurement features may work differently.',
      },
      {
        question: 'Are cookies needed to paste an Instagram link?',
        answer:
          'The main public link workflow should remain simple, but some site preferences or stability features may depend on browser storage.',
      },
      {
        question: 'Does globltools use cookies for passwords?',
        answer:
          'No. globltools does not request Instagram passwords, so cookies are not used to store account credentials.',
      },
    ],
    schemaType: 'WebPage',
  },
  'editorial-policy': {
    slug: 'editorial-policy',
    eyebrow: 'Editorial Policy',
    title: 'globltools Editorial Policy for Downloader Guidance',
    description:
      'Read globltools editorial policy and how we keep content accurate, helpful, user-first, and aligned with public downloader best practices.',
    keywords: ['editorial policy', 'globltools editorial', 'instagram downloader content', 'site accuracy'],
    accent: 'Helpful content written around real user intent',
    reader: 'readers who want accurate downloader guidance before using a tool',
    promise:
      'This editorial policy explains how globltools creates, reviews, and improves content about Instagram downloading so users can understand public link workflows with confidence.',
    sections: sharedSections,
    stats: [
      { label: 'Content focus', value: 'User intent' },
      { label: 'Claims', value: 'Supported features' },
      { label: 'Updates', value: 'Ongoing' },
    ],
    faqs: [
      {
        question: 'How does globltools write downloader content?',
        answer:
          'We focus on clear instructions, public link limits, user privacy, and the practical steps needed to start from the homepage.',
      },
      {
        question: 'Do pages make unsupported claims?',
        answer:
          'Pages should describe supported public workflows and avoid promises that the product cannot reasonably deliver.',
      },
      {
        question: 'Why does internal linking matter?',
        answer:
          'Internal links help users move from guidance pages to the homepage, where the actual downloader action happens.',
      },
    ],
    schemaType: 'WebPage',
  },
};

export function getFooterPage(slug: FooterPageKey) {
  return footerPages[slug];
}

export function makeFooterPageMetadata(slug: FooterPageKey): Metadata {
  const page = getFooterPage(slug);

  return makePageMetadata({
    title: page.title,
    description: page.description,
    slug: page.slug,
    keywords: page.keywords,
  });
}

export function makeFooterPageSchema(page: FooterPage) {
  return {
    '@context': 'https://schema.org',
    '@type': page.schemaType,
    name: page.title,
    description: page.description,
    url: `https://globltools.com/${page.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'globltools',
      url: 'https://globltools.com',
    },
  };
}

export function buildSectionParagraphs(page: FooterPage, section: string, index: number) {
  const phrase = section.toLowerCase();
  const ordinal = index + 1;

  return [
    `${section} is an important part of the ${page.eyebrow.toLowerCase()} because ${page.reader} need more than a short answer when they are deciding whether a downloader page is trustworthy. globltools keeps this page detailed so visitors can understand the purpose, the limits, and the practical value of the service before they paste any URL. The main experience is still direct: open the homepage, choose the public Instagram content you want to save, paste the link, and follow the download result. This long-form explanation gives search visitors enough context to move confidently from reading to action.`,
    `For ${phrase}, the most important principle is that globltools works around public links and user choice. A visitor should never feel pushed into sharing account details, installing unknown software, or guessing which page matters. The homepage is the central place for action, and this page supports that action with policy, guidance, and context. When we mention our primary tool, the link text is intentionally clear so users and search engines understand the destination. The phrase Instagram Reels Downloader points users back to the main download workflow instead of leaving them stranded on an informational page.`,
    `This section ${ordinal} also supports interlinking across the site. Good internal navigation is not just an SEO tactic; it is a user experience feature. Someone who lands here from a search result may be reading about ${phrase}, privacy, support, or rules, but their final goal is usually to download an Instagram reel, video, photo, story, or audio file from a public URL. By explaining the context and then guiding the reader back to the home tool, globltools keeps every footer page useful, complete, and connected to the core downloader journey.`,
  ];
}

