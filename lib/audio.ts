/**
 * Audio Downloader Utilities
 * 
 * This module provides minimal utilities for the Audio Downloader.
 * All extraction logic is delegated to lib/download.ts which is shared with the working Reels Downloader.
 */

const reelUrlRegex = /^https?:\/\/(www\.)?instagram\.com\/(?:reel|reels)\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;

/**
 * Validate if URL is a valid Instagram Reel URL
 */
export function isInstagramReelUrl(url: string) {
  return typeof url === 'string' && reelUrlRegex.test(url.trim());
}
