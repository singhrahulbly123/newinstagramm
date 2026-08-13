import type { Metadata } from 'next';
import { makePageMetadata } from '../../lib/seo';
import YoutubeDownloaderClient from './YoutubeDownloaderClient';

export const metadata: Metadata = makePageMetadata({
  title: 'YouTube Downloader',
  description: 'Paste a YouTube link and extract downloadable MP4 qualities safely through the server.',
  slug: 'youtube-downloader',
  keywords: ['youtube downloader', 'download youtube video', 'youtube mp4', 'youtube to mp4', 'youtube audio downloader'],
});

export default function YoutubeDownloaderPage() {
  return <YoutubeDownloaderClient />;
}
