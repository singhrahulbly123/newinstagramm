import { NextResponse } from 'next/server';
import { buildStoryCacheKey, getCachedStory, setCachedStory } from '../../../lib/cache';
import { storyExtractionQueue } from '../../../lib/queue';
import { extractInstagramStory, parseStoryInput } from '../../../lib/story-extractor';
import { error, log } from '../../../lib/logger';
import type { StoryApiResponse, StoryExtractionResult } from '../../../types/story';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.query !== 'string' || !body.query.trim()) {
    return NextResponse.json({ success: false, cached: false, error: 'Please provide a username or Instagram story URL.' }, { status: 400 });
  }

  const normalized = parseStoryInput(body.query.trim());
  if (!normalized) {
    return NextResponse.json({ success: false, cached: false, error: 'Invalid Instagram story username or URL.' }, { status: 400 });
  }

  const cacheKey = buildStoryCacheKey(normalized.username);
  try {
    const cached = await getCachedStory<StoryExtractionResult>(cacheKey);
    if (cached) {
      log('CACHE', 'Story cache hit', { username: normalized.username, cacheKey });
      return NextResponse.json({ success: true, cached: true, ...cached } as StoryApiResponse);
    }
  } catch (err) {
    error('CACHE', 'Failed to read story cache', err);
  }

  try {
    const result = await storyExtractionQueue.enqueue(async () => {
      log('QUEUE', 'Queued story extraction task started', { username: normalized.username });
      return extractInstagramStory(body.query.trim());
    });

    await setCachedStory(cacheKey, result);
    log('CACHE', 'Story cache stored', { username: normalized.username, cacheKey });

    return NextResponse.json({ success: true, cached: false, ...result } as StoryApiResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Story extraction failed.';
    const status = message.includes('private') ? 403 : message.includes('rate limit') ? 429 : 422;
    error('STORY', 'Story extraction failed', { username: normalized.username, message });
    return NextResponse.json({ success: false, cached: false, error: message }, { status });
  }
}
