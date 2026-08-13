import type { Metadata } from 'next';
import { makePageMetadata } from '../../lib/seo';
import FacebookVideoDownloaderClient from './FacebookVideoDownloaderClient';

export const metadata: Metadata = makePageMetadata({
  title: 'Facebook Video Downloader',
  description: 'Download public Facebook videos and reels instantly in high quality. Paste a link, choose a quality, and save the video directly to your device.',
  slug: 'facebook-video-downloader',
  keywords: ['facebook video downloader', 'download facebook video', 'facebook mp4 downloader', 'save facebook video'],
  pageType: 'article',
});

export default function FacebookVideoDownloaderPage() {
  return <FacebookVideoDownloaderClient />;
}
