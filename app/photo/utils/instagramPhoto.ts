export type InstagramPhotoItem = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  filename: string;
};

const instaPostRegex = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;

function decodeInstagramValue(value: string) {
  const raw = value.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const cleaned = raw.replace(/&amp;/gi, '&').replace(/\\\//g, '/');

  try {
    return decodeURIComponent(cleaned);
  } catch {
    return cleaned;
  }
}

function normalizeInstagramUrl(url: string) {
  const parsed = new URL(url.trim());
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString().replace(/\/+$/g, '');
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"`, 'i');
  const match = html.match(regex);
  return match ? decodeInstagramValue(match[1]) : null;
}

function findResourcesFromJson(html: string) {
  const resources: Array<{ url: string; width: number; height: number }> = [];
  const resourceRegex = /"src"\s*:\s*"(https:[^"\\]+)"\s*,\s*"config_width"\s*:\s*(\d+)\s*,\s*"config_height"\s*:\s*(\d+)/gi;
  let match;

  while ((match = resourceRegex.exec(html)) !== null) {
    resources.push({ url: decodeInstagramValue(match[1]), width: Number(match[2]), height: Number(match[3]) });
  }

  return resources;
}

function findDisplayUrls(html: string) {
  const urls: string[] = [];
  const regex = /"display_url"\s*:\s*"(https:[^"\\]+)"/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    urls.push(decodeInstagramValue(match[1]));
  }

  return urls;
}

function getHighestResource(resources: Array<{ url: string; width: number; height: number }>) {
  if (!resources.length) return null;
  return resources.reduce((best, current) => (current.width > best.width ? current : best));
}

function createFilename(shortcode: string, index: number) {
  return `${shortcode}-${index + 1}.jpg`;
}

function getShortcode(url: string) {
  const match = url.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : 'instagram-photo';
}

function buildItem(url: string, width: number | null, height: number | null, shortcode: string, index: number): InstagramPhotoItem {
  return {
    id: `${shortcode}-${index + 1}`,
    url,
    width,
    height,
    filename: createFilename(shortcode, index),
  };
}

function extractInstagramItem(node: any, shortcode: string, index: number): InstagramPhotoItem | null {
  if (!node) return null;

  const url = node.display_url || node.display_url_legacy || node.thumbnail_src || node.thumbnail_resources?.[0]?.src;
  if (!url || typeof url !== 'string') return null;

  let width: number | null = null;
  let height: number | null = null;

  if (Array.isArray(node.display_resources) && node.display_resources.length) {
    const best = node.display_resources.reduce((prev: any, current: any) => {
      return current.config_width > prev.config_width ? current : prev;
    }, node.display_resources[0]);
    width = best.config_width || null;
    height = best.config_height || null;
  } else if (node.dimensions) {
    width = Number(node.dimensions.width) || null;
    height = Number(node.dimensions.height) || null;
  }

  if (!url.startsWith('http')) return null;

  return buildItem(decodeInstagramValue(url), width, height, shortcode, index);
}

function parseSharedData(html: string) {
  const match = html.match(/window\._sharedData\s*=\s*(\{.*?\});\s*<\/script>/s);
  if (!match) return null;
  return safeJsonParse(match[1]);
}

function parseApplicationJson(html: string) {
  const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const parsed = safeJsonParse(match[1]);
    if (parsed && (parsed.entry_data || parsed.graphql)) {
      return parsed;
    }
  }

  return null;
}

function parsePhotoNodesFromMedia(media: any, shortcode: string): InstagramPhotoItem[] {
  if (!media) return [];

  const nodes = media.edge_sidecar_to_children?.edges?.map((edge: any) => edge.node) ?? [media];
  const items = nodes
    .map((node: any, index: number) => extractInstagramItem(node, shortcode, index))
    .filter((item: InstagramPhotoItem | null): item is InstagramPhotoItem => Boolean(item));

  return items;
}

export function isInstagramPhotoUrl(url: string) {
  if (typeof url !== 'string') return false;
  return instaPostRegex.test(url.trim());
}

export function extractPhotoItemsFromHtml(html: string, originalUrl: string): InstagramPhotoItem[] {
  const shortcode = getShortcode(originalUrl);
  const sharedData = parseSharedData(html);
  const appJson = parseApplicationJson(html);

  const candidates: InstagramPhotoItem[] = [];

  const graphqlMedia =
    sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media ||
    sharedData?.entry_data?.PostPage?.[0]?.graphql?.media ||
    appJson?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media ||
    appJson?.graphql?.shortcode_media ||
    null;

  if (graphqlMedia) {
    candidates.push(...parsePhotoNodesFromMedia(graphqlMedia, shortcode));
  }

  if (!candidates.length) {
    const imageMeta = extractMetaContent(html, 'og:image:secure_url') || extractMetaContent(html, 'og:image');
    if (imageMeta) {
      candidates.push(buildItem(decodeInstagramValue(imageMeta), null, null, shortcode, 0));
    }
  }

  if (!candidates.length) {
    const resources = findResourcesFromJson(html);
    if (resources.length) {
      const best = getHighestResource(resources);
      if (best) {
        candidates.push(buildItem(best.url, best.width, best.height, shortcode, 0));
      }
    }
  }

  if (!candidates.length) {
    const displayUrls = findDisplayUrls(html);
    if (displayUrls.length) {
      displayUrls.slice(0, 4).forEach((url, index) => {
        candidates.push(buildItem(decodeInstagramValue(url), null, null, shortcode, index));
      });
    }
  }

  return candidates;
}

export function buildEmbedUrl(originalUrl: string) {
  const url = normalizeInstagramUrl(originalUrl);
  return `${url}/embed/`;
}
