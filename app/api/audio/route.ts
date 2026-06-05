import { NextResponse } from 'next/server';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, rm, stat, access } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';

import {
  fetchInstagramPageHtml,
  extractInstagramReelVideoUrl,
  getMP3CachePath,
  setMP3CachePath,
  cleanupExpiredMP3Cache,
} from '../../../lib/instagramAudioService';

export const runtime = 'nodejs';

// Constants
const validInstagramReelRegex = /^https?:\/\/(www\.)?instagram\.com\/(?:reel|reels)\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;
const allowedMediaHosts = [
  'instagram.com',
  'www.instagram.com',
  'cdninstagram.com',
  'instagramcdn.com',
  'fbcdn.net',
  'akamaized.net',
];

// FFmpeg Detection
const execFileAsync = promisify(execFile);
const ffmpegStaticPath = ffmpegPath ? path.resolve(String(ffmpegPath)) : null;
const ffprobeStaticPath = ffprobe.path;

let detectedFFmpegPath: string | null = null;
let detectedFFprobePath: string | null = null;
let ffmpegDetectionError: string | null = null;
let ffprobeDetectionError: string | null = null;

// Types
type FFProbeStream = {
  codec_type?: string;
  codec_name?: string;
};

type FFProbeResult = {
  streams?: FFProbeStream[];
  format?: {
    format_name?: string;
    duration?: string;
    size?: string;
  };
};

type MediaProbe = {
  url: string;
  formatName: string;
  duration: number | null;
  hasVideo: boolean;
  streamType: string;
  raw: FFProbeResult;
};

// Utility Functions
function uniqueValues(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function normalizeInstagramUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove query parameters and hash
    parsed.search = '';
    parsed.hash = '';
    // Ensure no trailing slash
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
}

function isInstagramReelUrl(url: string): boolean {
  return validInstagramReelRegex.test(url);
}

function sanitizeFilename(value: string | null | undefined): string {
  const base = (value || 'instagram-audio')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_\.]/g, '')
    .
