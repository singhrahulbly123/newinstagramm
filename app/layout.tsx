import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FastVideoSave - Download Instagram Reels, Photos, Videos & Audio Online',
  description:
    'FastVideoSave is the easiest Instagram downloader for reels, photos, videos, and audio. Download Instagram reels online free without watermark or app.',
  keywords: [
    'Instagram downloader',
    'Instagram reels downloader',
    'download instagram reels',
    'instagram reel download',
    'instagram video downloader',
    'download instagram video',
    'download instagram photo',
    'instagram photo downloader',
    'save instagram reels',
    'instagram reels save',
    'instagram reel saver',
    'download instagram story',
    'instagram downloader online',
    'download reels without watermark',
    'free instagram reel downloader',
    'instagram reels download mp4',
  ],
  metadataBase: new URL('https://fastvideosave.net'),
  alternates: {
    canonical: 'https://fastvideosave.net',
  },
  openGraph: {
    title: 'FastVideoSave - Download Instagram Reels, Photos, Videos & Audio Online',
    description:
      'FastVideoSave is the easiest Instagram downloader for reels, photos, videos, and audio. Download Instagram content in high quality without watermark or app.',
    type: 'website',
    url: 'https://fastvideosave.net',
    siteName: 'FastVideoSave',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastVideoSave - Download Instagram Reels, Photos, Videos & Audio Online',
    description:
      'FastVideoSave is the easiest Instagram downloader for reels, photos, videos, and audio. Download Instagram content in high quality without watermark or app.',
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
    <html lang="en" className={poppins.className}>
      <body className="bg-soft text-slate-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
