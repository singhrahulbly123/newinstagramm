import type { Metadata } from 'next';
import { makePageMetadata } from '../../lib/seo';
import FacebookReelDownloaderClient from './FacebookReelDownloaderClient';

export const metadata: Metadata = makePageMetadata({
  title: 'Facebook Reel & Video Downloader',
  description: 'Download Facebook Reels and videos instantly in high quality. Paste a link, select your preferred quality, and download directly to your device.',
  slug: 'facebook-reel-downloader',
  keywords: ['facebook reel downloader', 'facebook video downloader', 'fb reel download', 'download facebook videos'],
});

export default function FacebookReelDownloaderPage() {
  return <FacebookReelDownloaderClient />;
}
