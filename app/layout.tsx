import type { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import { StructuredData } from './components/StructuredData';
import { Analytics } from './components/Analytics';
import PWARegister from './components/PWARegister';
import { siteOrganization, siteWebsite } from '../lib/schemas';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instagram Downloader for Reels, Videos, Photos & Stories | globltools',
  description:
    'Globltools makes it simple to download public Instagram reels, videos, photos, stories, and audio directly from your browser in a few steps.',
  metadataBase: new URL('https://globltools.com'),
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://globltools.com',
    languages: {
      'en-US': 'https://globltools.com',
      'en': 'https://globltools.com',
      'x-default': 'https://globltools.com',
    },
  },
  openGraph: {
    title: 'Instagram Downloader for Reels, Videos, Photos & Stories | globltools',
    description:
      'Globltools makes it simple to download public Instagram reels, videos, photos, stories, and audio directly from your browser in a few steps.',
    type: 'website',
    url: 'https://globltools.com',
    siteName: 'globltools',
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'globltools public Instagram media utilities' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Downloader for Reels, Videos, Photos & Stories | globltools',
    description:
      'Globltools makes it simple to download public Instagram reels, videos, photos, stories, and audio directly from your browser in a few steps.',
    images: ['/opengraph-image'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'globltools',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="x-default" href="https://globltools.com/" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="google-site-verification" content="r1jIXhZs_dYd8vV1t-rsB5qyr2rMGopIATJ29GqTWXE" />
        <StructuredData data={siteOrganization} />
        <StructuredData data={siteWebsite} />
      </head>
      <body className="bg-soft text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <Analytics />
        <PWARegister />
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
