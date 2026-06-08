export type LogCategory =
  | 'STORY'
  | 'PLAYWRIGHT'
  | 'CACHE'
  | 'QUEUE'
  | 'PROFILE'
  | 'DOWNLOAD'
  | 'ANALYTICS'
  | 'FACEBOOK'
  | 'FACEBOOK_API'
  | 'FACEBOOK_PLAYWRIGHT';

const enableDebug = process.env.STORY_DEBUG === '1';

function formatPayload(category: LogCategory, message: string, data?: unknown) {
  const payload: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    category,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return payload;
}

export function log(category: LogCategory, message: string, data?: unknown) {
  if (!enableDebug && category !== 'STORY') {
    return;
  }

  const payload = formatPayload(category, message, data);
  console.log('[LOG]', JSON.stringify(payload));
}

export function trace(category: LogCategory, message: string, data?: unknown) {
  const payload = formatPayload(category, message, data);
  console.debug('[TRACE]', JSON.stringify(payload));
}

export function error(category: LogCategory, message: string, data?: unknown) {
  const payload = formatPayload(category, message, data);
  console.error('[ERROR]', JSON.stringify(payload));
}
