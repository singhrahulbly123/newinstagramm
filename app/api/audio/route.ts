  import { NextResponse } from 'next/server';
  import { normalizeInstagramUrl } from '../../../lib/download';
  import { isInstagramReelUrl } from '../../../lib/audio';
  import { createReadStream, existsSync } from 'node:fs';
  import { mkdir, rm, stat, access } from 'node:fs/promises';
  import path from 'node:path';
  import os from 'node:os';
  import { execFile, execSync } from 'node:child_process';
  import ffprobe from 'ffprobe-static';
  import { promisify } from 'node:util';
  import ffmpeg from 'fluent-ffmpeg';
  import ffmpegPath from 'ffmpeg-static';
  
  import {
    fetchInstagramPageHtml,
    extractInstagramReelVideoUrl,
    getMP3CachePath,
    setMP3CachePath,
    cleanupExpiredMP3Cache,
  } from '../../../lib/instagramAudioService';

  export const runtime = 'nodejs';

  const validInstagramReelRegex = /^https?:\/\/(www\.)?instagram\.com\/(?:reel|reels)\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;
  const allowedMediaHosts = [
    'instagram.com',
    'www.instagram.com',
    'cdninstagram.com',
    'instagramcdn.com',
    'fbcdn.net',
    'akamaized.net',
  ];

  /**
   * Detect and set up FFmpeg path with multiple fallback strategies
   */
  let detectedFFmpegPath: string | null = null;
  let detectedFFprobePath: string | null = null;
  let ffmpegDetectionError: string | null = null;
  let ffprobeDetectionError: string | null = null;

  const execFileAsync = promisify(execFile);

const ffmpegStaticPath = ffmpegPath
  ? path.resolve(String(ffmpegPath))
  : null;
const ffprobeStaticPath = ffprobe.path;


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

  function uniqueValues(values: Array<string | null | undefined>) {
    return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
  }

  function getFFmpegStaticCandidates() {
    const candidates: Array<string | null | undefined> = [
      ffmpegStaticPath,
      ffmpegPath,
      path.resolve(process.cwd(), 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    ];

    return uniqueValues(candidates.map((candidate) => (candidate ? path.resolve(candidate) : candidate)));
  }

  function getFFprobeStaticCandidates() {
    const candidates: Array<string | null | undefined> = [
      ffprobeStaticPath,
      path.resolve(
        process.cwd(),
        'node_modules',
        'ffprobe-static',
        'bin',
        process.platform,
        process.arch,
        process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe',
      ),
    ];


    return uniqueValues(candidates.map((candidate) => (candidate ? path.resolve(candidate) : candidate)));
  }

  async function validateExecutable(executablePath: string) {
    await access(executablePath);
    await execFileAsync(executablePath, ['-version'], { timeout: 5000, maxBuffer: 1024 * 256 });
  }

  async function detectFFmpegPath(): Promise<string | null> {
    // Return cached result if already detected
    if (detectedFFmpegPath !== null) {
      return detectedFFmpegPath;
    }

    if (ffmpegDetectionError !== null) {
      console.log('[AUDIO] Retrying FFmpeg detection after previous failure', { previousError: ffmpegDetectionError });
      ffmpegDetectionError = null;
    }

    const attemptedPaths: string[] = [];

    // Strategy 1: Check FFMPEG_PATH environment variable
    if (process.env.FFMPEG_PATH) {
      try {
        attemptedPaths.push(process.env.FFMPEG_PATH);
        await validateExecutable(process.env.FFMPEG_PATH);
        detectedFFmpegPath = process.env.FFMPEG_PATH;
        console.log('[AUDIO] FFmpeg path (from FFMPEG_PATH env)', detectedFFmpegPath);
        return detectedFFmpegPath;
      } catch (error) {
        console.log('[AUDIO] FFMPEG_PATH env var set but path not accessible', {
          path: process.env.FFMPEG_PATH,
          error: (error as Error).message,
        });
      }
    }

    // Strategy 2: Use ffmpeg-static package if available
    for (const candidate of getFFmpegStaticCandidates()) {
      try {
        attemptedPaths.push(candidate);
        await validateExecutable(candidate);
        detectedFFmpegPath = candidate;
        console.log('[AUDIO] FFmpeg path (from ffmpeg-static package)', detectedFFmpegPath);
        return detectedFFmpegPath;
      } catch (error) {
        console.log('[AUDIO] ffmpeg-static package path not accessible', {
          path: candidate,
          error: (error as Error).message,
        });
      }
    }

    // Strategy 3: Try system-installed ffmpeg
    try {
      const lookupCommand = process.platform === 'win32' ? 'where ffmpeg' : 'which ffmpeg';
      const systemFFmpegPath = execSync(lookupCommand, { encoding: 'utf8' }).trim().split(/\r?\n/)[0];
      if (systemFFmpegPath) {
        attemptedPaths.push(systemFFmpegPath);
        await validateExecutable(systemFFmpegPath);
        detectedFFmpegPath = systemFFmpegPath;
        console.log('[AUDIO] FFmpeg path (from system PATH)', detectedFFmpegPath);
        return detectedFFmpegPath;
      }
    } catch {
      console.log('[AUDIO] System ffmpeg not found in PATH');
    }

    // No FFmpeg found
    ffmpegDetectionError = `FFmpeg not found. Tried: ${attemptedPaths.length ? attemptedPaths.join(', ') : 'FFMPEG_PATH env var, ffmpeg-static package, system PATH'}`;
    console.log('[AUDIO] FFmpeg detection failed:', ffmpegDetectionError);
    return null;
  }

  async function detectFFprobePath(): Promise<string | null> {
    if (detectedFFprobePath !== null) {
      console.log('[AUDIO] Returning cached FFprobe path', { detectedFFprobePath });
      return detectedFFprobePath;
    }

    if (ffprobeDetectionError !== null) {
      console.log('[AUDIO] Retrying FFprobe detection after previous failure', { previousError: ffprobeDetectionError });
      ffprobeDetectionError = null;
    }

    const attemptedPaths: string[] = [];

    // Strategy 1: Check FFPROBE_PATH environment variable
    if (process.env.FFPROBE_PATH) {
      try {
        attemptedPaths.push(process.env.FFPROBE_PATH);
        const envExists = existsSync(process.env.FFPROBE_PATH);
        console.log('[AUDIO] FFPROBE_PATH env check', {
          path: process.env.FFPROBE_PATH,
          exists: envExists,
        });
        if (envExists) {
          await validateExecutable(process.env.FFPROBE_PATH);
          detectedFFprobePath = process.env.FFPROBE_PATH;
          console.log('[AUDIO] FFprobe path selected (FFPROBE_PATH env)', { detectedFFprobePath });
          return detectedFFprobePath;
        }
      } catch (error) {
        console.log('[AUDIO] FFPROBE_PATH validation failed', {
          path: process.env.FFPROBE_PATH,
          error: (error as Error).message,
        });
      }
    }

    // Strategy 2: Use ffprobe-static package if exists (no validation, direct check)
    if (ffprobeStaticPath) {
      console.log('[AUDIO] Checking ffprobe-static path', { ffprobeStaticPath });
      const staticExists = existsSync(ffprobeStaticPath);
      console.log('[AUDIO] ffprobe-static exists check', {
        ffprobeStaticPath,
        exists: staticExists,
      });
      if (staticExists) {
        try {
          detectedFFprobePath = ffprobeStaticPath;
          console.log('[AUDIO] FFprobe path selected (ffprobe-static direct)', { detectedFFprobePath });
          return detectedFFprobePath;
        } catch (error) {
          console.log('[AUDIO] ffprobe-static path error', { error: (error as Error).message });
        }
      }
    }

    // Strategy 3: Additional static candidates
    const ffprobeCandidates = getFFprobeStaticCandidates();
    if (ffprobeCandidates.length > 0) {
      console.log('[AUDIO] ffprobe-static candidates', { count: ffprobeCandidates.length, candidates: ffprobeCandidates });
    }

    for (const candidate of ffprobeCandidates) {
      if (!candidate) continue;
      try {
        attemptedPaths.push(candidate);
        const candidateExists = existsSync(candidate);
        console.log('[AUDIO] checking ffprobe candidate', {
          candidate,
          exists: candidateExists,
        });
        if (candidateExists) {
          await validateExecutable(candidate);
          detectedFFprobePath = candidate;
          console.log('[AUDIO] FFprobe path selected (candidate)', { detectedFFprobePath });
          return detectedFFprobePath;
        } else {
          console.log('[AUDIO] ffprobe candidate does not exist', { candidate });
        }
      } catch (error) {
        console.log('[AUDIO] ffprobe candidate validation failed', {
          path: candidate,
          error: (error as Error).message,
        });
      }
    }

    // Strategy 4: Try system-installed ffprobe
    try {
      const lookupCommand = process.platform === 'win32' ? 'where ffprobe' : 'which ffprobe';
      const systemFFprobePath = execSync(lookupCommand, { encoding: 'utf8' }).trim().split(/\r?\n/)[0];
      if (systemFFprobePath) {
        attemptedPaths.push(systemFFprobePath);
        console.log('[AUDIO] Found system ffprobe', { systemFFprobePath });
        await validateExecutable(systemFFprobePath);
        detectedFFprobePath = systemFFprobePath;
        console.log('[AUDIO] FFprobe path selected (system PATH)', { detectedFFprobePath });
        return detectedFFprobePath;
      }
    } catch (error) {
      console.log('[AUDIO] System ffprobe lookup failed', { error: (error as Error).message });
    }

    // All strategies failed
    ffprobeDetectionError = `FFprobe not found. Tried: ${attemptedPaths.length ? attemptedPaths.join(', ') : 'FFPROBE_PATH env var, ffprobe-static package, system PATH'}`;
    console.log('[AUDIO] FFprobe detection FAILED', { ffprobeDetectionError, attemptedPaths });
    return null;
  }

  /**
   * Initialize FFmpeg with detected path
   */
  async function initializeFFmpeg(): Promise<{ success: boolean; error?: string }> {
    const ffmpegExePath = await detectFFmpegPath();
    const ffprobeExePath = await detectFFprobePath();

    console.log('[AUDIO] Initialization paths detected', {
      ffmpegExePath,
      ffprobeExePath,
    });

    if (!ffmpegExePath) {
      return {
        success: false,
        error: ffmpegDetectionError || 'FFmpeg is not installed or not found. Please install ffmpeg-static package or system ffmpeg.',
      };
    }

    if (!ffprobeExePath) {
      return {
        success: false,
        error: ffprobeDetectionError || 'FFprobe is not installed or not found. Please install ffprobe-static package or system ffprobe.',
      };
    }

    // Test ffprobe executable
    try {
      console.log('[AUDIO] Testing ffprobe executable', { ffprobeExePath });
      await execFileAsync(ffprobeExePath, ['-version'], { timeout: 5000, maxBuffer: 1024 * 256 });
      console.log('[AUDIO] FFprobe executable test passed', { ffprobeExePath });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log('[AUDIO] FFprobe executable test FAILED', { ffprobeExePath, error: errorMessage });
      return {
        success: false,
        error: `FFprobe executable test failed: ${errorMessage}`,
      };
    }

    try {
      ffmpeg.setFfmpegPath(ffmpegExePath);
      ffmpeg.setFfprobePath(ffprobeExePath);
      console.log('[AUDIO] FFmpeg initialized successfully', { ffmpegPath: ffmpegExePath, ffprobePath: ffprobeExePath });
      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log('[AUDIO] FFmpeg initialization failed', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  function logJsonResponse(label: string, responseBody: Record<string, unknown>, status: number) {
    console.log(`[AUDIO] Returning ${label}`, { status, responseBody });
    console.log('[AUDIO] Response JSON:', JSON.stringify(responseBody));
    return NextResponse.json(responseBody, { status });
  }

  function sanitizeFilename(value: string | null | undefined) {
    const base = (value || 'instagram-audio').trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_\.]/g, '').replace(/[-_.]{2,}/g, '-');
    const filename = base.replace(/^[-_.]+|[-_.]+$/g, '') || 'instagram-audio';
    return filename.toLowerCase().endsWith('.mp3') ? filename : `${filename}.mp3`;
  }

  function isAllowedHost(url: URL) {
    const hostname = url.hostname.toLowerCase();
    return allowedMediaHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  }

  async function convertVideoToMp3(inputPath: string, outputPath: string) {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .format('mp3')
        .audioBitrate(192)
        .audioCodec('libmp3lame')
        .on('error', (error) => reject(error))
        .on('end', () => resolve())
        .save(outputPath);
    });
  }

  function getInstagramMediaHeaders() {
    return [
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Referer: https://www.instagram.com/',
      'Origin: https://www.instagram.com',
    ].join('\r\n');
  }

  function parseMediaUrls(value: string | null, primaryUrl: string) {
    if (!value) return [primaryUrl];

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return Array.from(new Set([primaryUrl, ...parsed.filter((item) => typeof item === 'string')]));
      }
    } catch {
      // Fall through to comma parsing.
    }

    return Array.from(new Set([primaryUrl, ...value.split(',').map((item) => item.trim()).filter(Boolean)]));
  }

  function detectStreamType(probe: FFProbeResult, mediaUrl: string) {
    const formatName = (probe.format?.format_name || 'unknown').toLowerCase();
    const duration = Number(probe.format?.duration);
    const lowerUrl = mediaUrl.toLowerCase();

    if (lowerUrl.includes('.mpd') || formatName.includes('dash')) return 'DASH';
    if (lowerUrl.includes('.m4s')) return 'm4s fragment';
    if (formatName.includes('mov') || formatName.includes('mp4') || formatName.includes('m4a')) {
      if (!Number.isFinite(duration) || duration <= 0 || lowerUrl.includes('bytestart') || lowerUrl.includes('byteend')) {
        return 'fragmented MP4';
      }
      return 'MP4';
    }
    if (!Number.isFinite(duration) || duration <= 0) return 'partial download';
    return formatName || 'unknown';
  }

  async function ffprobeMediaUrl(mediaUrl: string): Promise<MediaProbe> {
    console.log('[AUDIO] Media URL', { mediaUrl });
    const ffprobeExePath = await detectFFprobePath();

    if (!ffprobeExePath) {
      throw new Error(ffprobeDetectionError || 'FFprobe is not installed or not found.');
    }

    const { stdout } = await execFileAsync(
      ffprobeExePath,
      [
        '-v',
        'error',
        '-headers',
        getInstagramMediaHeaders(),
        '-show_format',
        '-show_streams',
        '-print_format',
        'json',
        mediaUrl,
      ],
      { timeout: Number(process.env.IG_FFPROBE_TIMEOUT_MS || 20000), maxBuffer: 1024 * 1024 * 4 },
    );

    const raw = JSON.parse(stdout || '{}') as FFProbeResult;
    const formatName = raw.format?.format_name || 'unknown';
    const durationValue = Number(raw.format?.duration);
    const duration = Number.isFinite(durationValue) ? durationValue : null;
    const hasVideo = Boolean(raw.streams?.some((stream) => stream.codec_type === 'video'));
    const streamType = detectStreamType(raw, mediaUrl);
    const result: MediaProbe = { url: mediaUrl, formatName, duration, hasVideo, streamType, raw };

    console.log('[AUDIO] ffprobe result', {
      formatName,
      duration,
      hasVideo,
      streams: raw.streams?.map((stream) => ({ codec_type: stream.codec_type, codec_name: stream.codec_name })) || [],
    });
    console.log('[AUDIO] Stream type', { streamType });

    if (!formatName || formatName === 'unknown') {
      throw new Error(`ffprobe did not detect a media format for ${mediaUrl}`);
    }
    if (!hasVideo) {
      throw new Error(`ffprobe did not find a video stream. format=${formatName}`);
    }

    return result;
  }

  async function convertRemoteMediaToMp3(mediaUrl: string, outputPath: string, streamType: string) {
    console.log('[AUDIO] Direct FFmpeg conversion', { mediaUrl, streamType, outputPath });

    await new Promise<void>((resolve, reject) => {
      ffmpeg(mediaUrl)
        .inputOptions(['-headers', getInstagramMediaHeaders()])
        .format('mp3')
        .audioBitrate(192)
        .audioCodec('libmp3lame')
        .on('error', (error) => reject(error))
        .on('end', () => resolve())
        .save(outputPath);
    });
  }

  async function cleanupTempDir(dir: string) {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }

  export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    console.log('[AUDIO] URL received', { url: body?.url });

    if (!body || typeof body.url !== 'string') {
      console.log('[AUDIO] Returning validation error: invalid payload');
      const errorResponse = { error: 'Invalid request payload.' };
      return logJsonResponse('validation error', errorResponse, 400);
    }

    const originalUrl = body.url.trim();
    const pageUrl = normalizeInstagramUrl(originalUrl);
    console.log('[AUDIO] URL normalized', { originalUrl, pageUrl });

    if (!validInstagramReelRegex.test(originalUrl) || !isInstagramReelUrl(originalUrl)) {
      console.log('[AUDIO] Returning validation error: invalid Instagram reel URL');
      const errorResponse = { error: 'Please enter a valid Instagram reel URL.' };
      return logJsonResponse('validation error', errorResponse, 400);
    }

    // ============================================================
    // STEP 1: Fetch Instagram page
    // ============================================================
    const pageResult = await fetchInstagramPageHtml(pageUrl).catch((error) => {
      console.log('[AUDIO] Instagram fetch failed', { pageUrl, error: (error as Error)?.message });
      return null;
    });

    if (!pageResult || !pageResult.html) {
      console.log('[AUDIO] Returning fetch error');
      const errorResponse: Record<string, unknown> = { error: 'Unable to fetch Instagram content. Please try again later.' };
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.debug = ['Failed to fetch Instagram page HTML.'];
      }
      return logJsonResponse('fetch error', errorResponse, 502);
    }

    console.log('[AUDIO] Instagram page fetched successfully', {
      pageUrl,
      status: pageResult.status,
      responseUrl: pageResult.url,
    });

    const html = pageResult.html;

    const extraction = await extractInstagramReelVideoUrl(html, originalUrl, pageUrl);
    if (!extraction.videoUrl) {
      console.log('[AUDIO] MP4 URL extraction failed', { error: extraction.error });
      const errorResponse: Record<string, unknown> = {
        error:
          extraction.error ||
          'Unable to extract the Instagram reel video URL. This may be a private reel or Instagram page format has changed.',
      };
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.debug = extraction.diagnostics;
      }
      return logJsonResponse('extraction error', errorResponse, 422);
    }

    const videoUrl = extraction.videoUrl;
    console.log('[AUDIO] MP4 URL found', { videoUrl, strategy: extraction.strategy });

    // Log extraction source successes
    if (extraction.strategy && extraction.strategy.includes('Strategy 1')) console.log('[AUDIO] Static extraction success');
    if (extraction.strategy && extraction.strategy.includes('Strategy 2')) console.log('[AUDIO] Embed extraction success');
    if (extraction.strategy && extraction.strategy.toLowerCase().includes('playwright')) console.log('[AUDIO] Playwright extraction success');
    if (process.env.INSTAGRAM_SESSIONID || process.env.INSTAGRAM_CSRFTOKEN) console.log('[AUDIO] Session cookie extraction success');

    // ============================================================
    // STEP 5: Log final result and handle failure
    // ============================================================
    console.log('[AUDIO] final MP4 URL', videoUrl);

    if (!videoUrl) {
      console.log('[AUDIO] MP4 URL extraction failed: unable to extract from any strategy');
      const errorResponse = {
        error: 'Unable to extract the Instagram reel video URL. This may be a private reel or Instagram page format has changed.',
      };
      return logJsonResponse('extraction error', errorResponse, 422);
    }

    console.log('[AUDIO] MP4 URL found', { videoUrl });

    // ============================================================
    // STEP 6: Prepare response with streaming endpoint
    // ============================================================
    const filename = sanitizeFilename('instagram-reel-audio');
    const mediaUrls = Array.from(new Set([videoUrl, ...(extraction.mediaUrls || [])])).slice(0, 8);
    const audioUrl = `/api/audio?videoUrl=${encodeURIComponent(videoUrl)}&mediaUrls=${encodeURIComponent(JSON.stringify(mediaUrls))}&filename=${encodeURIComponent(filename)}`;

    const successResponse: Record<string, unknown> = {
      success: true,
      audioUrl,
      previewUrl: null,
      title: 'Instagram Reel Audio',
      author: null,
      duration: null,
      description: null,
      fileType: 'audio/mpeg',
      fileSize: null,
      filename,
    };

    if (process.env.NODE_ENV !== 'production') {
      successResponse.debug = extraction.diagnostics;
      successResponse.mediaUrls = mediaUrls;
    }
    console.log('[AUDIO] Extraction complete, streaming endpoint ready', { audioUrl, filename });
    return logJsonResponse('success response', successResponse, 200);
  }

  export async function GET(request: Request) {
    // ============================================================
    // Initialize FFmpeg with production-safe detection
    // ============================================================
    const ffmpegInit = await initializeFFmpeg();
    if (!ffmpegInit.success) {
      console.log('[AUDIO] FFmpeg initialization failed', { error: ffmpegInit.error });
      const errorResponse = { error: ffmpegInit.error || 'FFmpeg initialization failed.' };
      return logJsonResponse('ffmpeg error', errorResponse, 503);
    }

    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('videoUrl');
    const download = url.searchParams.get('download') === '1';
    const filename = sanitizeFilename(url.searchParams.get('filename') || 'instagram-audio.mp3');

    if (!videoUrl) {
      const errorResponse = { error: 'Missing videoUrl parameter.' };
      return logJsonResponse('videoUrl missing error', errorResponse, 400);
    }

    let remoteUrl: URL;
    try {
      remoteUrl = new URL(videoUrl);
    } catch {
      const errorResponse = { error: 'Invalid videoUrl parameter.' };
      return logJsonResponse('invalid videoUrl error', errorResponse, 400);
    }

    if (!isAllowedHost(remoteUrl)) {
      const errorResponse = { error: 'The video URL is not an allowed Instagram source.' };
      return logJsonResponse('host validation error', errorResponse, 400);
    }

    const candidateMediaUrls = parseMediaUrls(url.searchParams.get('mediaUrls'), remoteUrl.toString()).filter((candidate) => {
      try {
        return isAllowedHost(new URL(candidate));
      } catch {
        return false;
      }
    });

    const tempDir = path.join(os.tmpdir(), `ig-audio-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(tempDir, { recursive: true });
    const outputPath = path.join(tempDir, 'output.mp3');

    // Cleanup expired MP3 cache in background
    cleanupExpiredMP3Cache().catch(() => undefined);

    // If there's an MP3 cached for requested filename, return it directly
    try {
      const cached = await getMP3CachePath(filename);
      if (cached) {
        console.log('[AUDIO] MP3 cache hit', { cached });
        const fileStat = await stat(cached);
        const stream = createReadStream(cached);
        const headers = new Headers({ 'Content-Type': 'audio/mpeg', 'Content-Length': String(fileStat.size) });
        if (url.searchParams.get('download') === '1') {
          headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        }
        return new Response(stream as any, { status: 200, headers });
      }
    } catch (e) {
      console.log('[AUDIO] MP3 cache check failed', { error: (e as Error).message });
    }

    try {
      const streamAttempts: Array<Record<string, unknown>> = [];
      let selectedProbe: MediaProbe | null = null;

      for (const mediaUrl of candidateMediaUrls) {
        let probe: MediaProbe;
        try {
          probe = await ffprobeMediaUrl(mediaUrl);
        } catch (error) {
          const errorMessage = (error as Error).message || String(error);
          console.log('[AUDIO] ffprobe failed', { mediaUrl, error: errorMessage });
          streamAttempts.push({ mediaUrl, stage: 'ffprobe', error: errorMessage });
          continue;
        }

        try {
          await convertRemoteMediaToMp3(mediaUrl, outputPath, probe.streamType);
          const convertedStat = await stat(outputPath);
          console.log('[AUDIO] FFmpeg conversion completed', { bytes: convertedStat.size, streamType: probe.streamType });
          console.log('[AUDIO] MP3 generated', { outputPath });
          selectedProbe = probe;
          break;
        } catch (error) {
          const errorMessage = (error as Error).message || String(error);
          console.log('[AUDIO] FFmpeg conversion failed', {
            error: errorMessage,
            mediaUrl,
            streamType: probe.streamType,
            formatName: probe.formatName,
          });
          streamAttempts.push({
            mediaUrl,
            stage: 'ffmpeg',
            streamType: probe.streamType,
            formatName: probe.formatName,
            duration: probe.duration,
            error: errorMessage,
          });
        }
      }

      if (!selectedProbe) {
        throw new Error(`All media streams failed: ${JSON.stringify(streamAttempts)}`);
      }

      // Persist MP3 to cache for reuse
      try {
        const cached = await setMP3CachePath(filename, outputPath);
        if (cached) console.log('[AUDIO] MP3 conversion success', { cached });
      } catch (e) {
        console.log('[AUDIO] MP3 cache persist failed', { error: (e as Error).message });
      }

      const fileStat = await stat(outputPath);
      const stream = createReadStream(outputPath);
      stream.on('close', () => cleanupTempDir(tempDir));
      stream.on('error', () => cleanupTempDir(tempDir));

      const headers = new Headers({
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(fileStat.size),
      });

      if (download) {
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      }
      headers.set('X-Audio-Stream-Type', selectedProbe.streamType);
      headers.set('X-Audio-Format-Name', selectedProbe.formatName);

      console.log('[AUDIO] Returning success response: MP3 stream', { outputPath, filename });
      return new Response(stream as any, {
        status: 200,
        headers,
      });
    } catch (error) {
      await cleanupTempDir(tempDir);
      const errorMessage = (error as Error).message || String(error);
      console.log('[AUDIO] Conversion failed', { error: errorMessage });

      // Provide specific error messages for common issues
      if (errorMessage.toLowerCase().includes('ffprobe')) {
        const errorResponse = { error: 'FFprobe not found. Please ensure FFprobe is installed.' };
        return logJsonResponse('ffprobe error', errorResponse, 503);
      }
      if (errorMessage.includes('ENOENT') || errorMessage.toLowerCase().includes('cannot find ffmpeg')) {
        const errorResponse = { error: 'FFmpeg not found. Please ensure FFmpeg is installed.' };
        return logJsonResponse('ffmpeg error', errorResponse, 503);
      }
      if (errorMessage.includes('spawn')) {
        const errorResponse = { error: 'Failed to start FFmpeg process. Check FFmpeg installation.' };
        return logJsonResponse('ffmpeg error', errorResponse, 503);
      }

      const errorResponse: Record<string, unknown> = { error: 'Unable to convert Instagram reel video to MP3.' };
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.debug = errorMessage;
      }
      return logJsonResponse('ffmpeg error', errorResponse, 500);
    }
  }
