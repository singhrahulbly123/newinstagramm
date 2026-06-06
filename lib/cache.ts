import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL?.trim();
let redisClient: RedisClientType | null = null;

const inMemoryCache = new Map<string, { value: unknown; expiresAt: number }>();

async function getRedisClient(): Promise<RedisClientType | null> {
  if (!redisUrl) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  const client = createClient({ url: redisUrl });
  client.on('error', (err) => {
    console.warn('[CACHE] Redis error', err);
  });

  try {
    await client.connect();
    redisClient = client;
    return redisClient;
  } catch (error) {
    console.warn('[CACHE] Unable to connect to Redis, falling back to in-memory cache.', error);
    return null;
  }
}

export function buildStoryCacheKey(input: string): string {
  return `story:${input.trim().toLowerCase()}`;
}

export async function getCachedStory<T = unknown>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (client) {
    const raw = await client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  const entry = inMemoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    inMemoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

export async function setCachedStory(key: string, data: unknown, ttlSeconds = Number(process.env.STORY_CACHE_TTL_SECONDS || '900')): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.set(key, JSON.stringify(data), { EX: ttlSeconds });
    return;
  }

  inMemoryCache.set(key, { value: data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function deleteCachedStory(key: string): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.del(key);
    return;
  }

  inMemoryCache.delete(key);
}
