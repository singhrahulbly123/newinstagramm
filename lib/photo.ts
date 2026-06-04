export type InstagramPhotoItem = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  filename: string;
};

export type PhotoDebug = {
  id?: string;
  source: string;
  url: string;
  width: number | null;
  height: number | null;
  note?: string;
};

const instaPostRegex = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+(?:[\/?].*)?$/i;

function decodeInstagramValue(value: string) {
  const unicodeDecoded = value.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const entityDecoded = unicodeDecoded.replace(/&amp;/gi, '&').replace(/\\\//g, '/');

  try {
    return decodeURIComponent(entityDecoded);
  } catch {
    return entityDecoded;
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

function parseSharedData(html: string) {
  const match = html.match(/window\._sharedData\s*=\s*(\{.*?\});\s*<\/script>/s);
  if (!match) return null;
  return safeJsonParse(match[1]);
}

function parseApplicationJson(html: string) {
  const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  const results: any[] = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    const parsed = safeJsonParse(match[1]);
    if (parsed) results.push(parsed);
  }
  return results;
}

function getShortcode(url: string) {
  const match = url.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : 'instagram-photo';
}

function buildFilename(shortcode: string, index: number) {
  return `${shortcode}-${index + 1}.jpg`;
}

function buildItem(url: string, width: number | null, height: number | null, shortcode: string, index: number): InstagramPhotoItem {
  return {
    id: `${shortcode}-${index + 1}`,
    url,
    width,
    height,
    filename: buildFilename(shortcode, index),
  };
}

function extractInstagramItemWithDebug(node: any, shortcode: string, index: number): { item: InstagramPhotoItem | null; debug: PhotoDebug | null } {
  if (!node) return { item: null, debug: null };

  let chosenUrl: string | null = null;
  let width: number | null = null;
  let height: number | null = null;
  let source = '';

  // 1) image_versions2.candidates
  const candidates = node.image_versions2?.candidates ?? node.image_versions?.candidates;
  if (Array.isArray(candidates) && candidates.length) {
    const best = candidates.reduce((best: any, cur: any) => {
      const bw = Number(best.width ?? best.w ?? best.config_width ?? 0);
      const cw = Number(cur.width ?? cur.w ?? cur.config_width ?? 0);
      return cw > bw ? cur : best;
    }, candidates[0]);

    chosenUrl = best.url || best.src || best.original || null;
    width = Number(best.width ?? best.w ?? best.config_width ?? null) || null;
    height = Number(best.height ?? best.h ?? best.config_height ?? null) || null;
    source = 'image_versions2.candidates';
  }

  // 2) display_resources
  if (!chosenUrl && Array.isArray(node.display_resources) && node.display_resources.length) {
    const bestRes = node.display_resources.reduce((prev: any, current: any) => {
      return (current.config_width || 0) > (prev.config_width || 0) ? current : prev;
    }, node.display_resources[0]);

    chosenUrl = bestRes.src || bestRes.url || null;
    width = Number(bestRes.config_width) || null;
    height = Number(bestRes.config_height) || null;
    source = 'display_resources';
  }

  // 3) look for structured fields that may contain image arrays
  if (!chosenUrl) {
    // Some structures use 'display_url' directly on node
    if (typeof node.display_url === 'string') {
      chosenUrl = node.display_url;
      if (node.dimensions) {
        width = Number(node.dimensions.width) || null;
        height = Number(node.dimensions.height) || null;
      }
      source = 'display_url';
    }
  }

  // If still not found, try other node keys that sometimes hold image urls
  if (!chosenUrl) {
    const maybe = node.url || node.src || node.original || node.image_url || null;
    if (maybe && typeof maybe === 'string') {
      chosenUrl = maybe;
      source = 'other_node_field';
    }
  }

  if (!chosenUrl) return { item: null, debug: null };
  chosenUrl = decodeInstagramValue(chosenUrl);
  if (!chosenUrl.startsWith('http')) return { item: null, debug: null };

  const item = buildItem(chosenUrl, width, height, shortcode, index);
  const debug: PhotoDebug = { id: item.id, source, url: chosenUrl, width, height };
  return { item, debug };
}

function parsePhotoNodesFromMedia(media: any, shortcode: string) {
  const nodes = media.edge_sidecar_to_children?.edges?.map((edge: any) => edge.node) ?? [media];
  const results: { item: InstagramPhotoItem; debug: PhotoDebug }[] = [];

  nodes.forEach((node: any, index: number) => {
    const { item, debug } = extractInstagramItemWithDebug(node, shortcode, index);
    if (item && debug) results.push({ item, debug });
  });

  return results;
}

function findResourcesFromHtml(html: string) {
  const resources: Array<{ url: string; width: number; height: number }> = [];
  const resourceRegex = /"src"\s*:\s*"(https:[^"\\]+)"\s*,\s*"config_width"\s*:\s*(\d+)\s*,\s*"config_height"\s*:\s*(\d+)/gi;
  let match;
  while ((match = resourceRegex.exec(html)) !== null) {
    resources.push({ url: decodeInstagramValue(match[1]), width: Number(match[2]), height: Number(match[3]) });
  }
  return resources;
}

function getHighestResource(resources: Array<{ url: string; width: number; height: number }>) {
  if (!resources.length) return null;
  return resources.reduce((best, current) => (current.width > best.width ? current : best));
}

function extractDisplayUrls(html: string) {
  const urls: string[] = [];
  const regex = /"display_url"\s*:\s*"(https:[^"\\]+)"/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(decodeInstagramValue(match[1]));
  }
  return urls;
}

export function isInstagramPhotoUrl(url: string) {
  return typeof url === 'string' && instaPostRegex.test(url.trim());
}

export function buildEmbedUrl(originalUrl: string) {
  return `${normalizeInstagramUrl(originalUrl)}/embed/`;
}

export function extractPhotoItemsFromHtml(html: string, originalUrl: string): { items: InstagramPhotoItem[]; debug: PhotoDebug[] } {
  const shortcode = getShortcode(originalUrl);
  const debug: PhotoDebug[] = [];

  const sharedData = parseSharedData(html);
  const appJsons = parseApplicationJson(html);

  let collected: { item: InstagramPhotoItem; debug: PhotoDebug }[] = [];

  // 1) Try sharedData graphql (window._sharedData)
  const graphqlMedia = sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media || sharedData?.entry_data?.PostPage?.[0]?.graphql?.media;
  if (graphqlMedia) {
    const found = parsePhotoNodesFromMedia(graphqlMedia, shortcode);
    collected = collected.concat(found);
  }

  // 2) Try application/json script blocks for graphql or shortcode_media
  for (const appJson of appJsons) {
    const gm = appJson?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media || appJson?.graphql?.shortcode_media || appJson?.shortcode_media;
    if (gm) {
      const found = parsePhotoNodesFromMedia(gm, shortcode);
      collected = collected.concat(found);
    }

    // general recursive scan for media-like objects
    const stack: any[] = [appJson];
    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object') continue;
      // if looks like a media object
      if (node.image_versions2 || node.display_resources || node.display_url) {
        const { item, debug: d } = extractInstagramItemWithDebug(node, shortcode, collected.length);
        if (item && d) collected.push({ item, debug: d });
      }
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (v && typeof v === 'object') stack.push(v);
      }
    }
  }

  // 3) If still empty, search HTML for image_versions2 JSON blocks or display_resources
  if (!collected.length) {
    // scan for "image_versions2":{...} blocks
    const iv2Regex = /("image_versions2"\s*:\s*\{[\s\S]*?\})/gi;
    let m;
    while ((m = iv2Regex.exec(html)) !== null) {
      const parsed = safeJsonParse(`{${m[1]}}`);
      const candidates = parsed?.image_versions2?.candidates;
      if (Array.isArray(candidates) && candidates.length) {
        const best = candidates.reduce((best: any, cur: any) => {
          const bw = Number(best.width ?? best.w ?? 0);
          const cw = Number(cur.width ?? cur.w ?? 0);
          return cw > bw ? cur : best;
        }, candidates[0]);
        const chosen = decodeInstagramValue(best.url || best.src || '');
        if (chosen) {
          const it = buildItem(chosen, Number(best.width ?? best.w ?? null) || null, Number(best.height ?? best.h ?? null) || null, shortcode, collected.length);
          collected.push({ item: it, debug: { id: it.id, source: 'image_versions2.inline', url: chosen, width: it.width, height: it.height, note: 'found via HTML iv2 scan' } });
        }
      }
    }
  }

  // 4) display_url fallback via regex
  if (!collected.length) {
    const displayUrls = extractDisplayUrls(html);
    displayUrls.slice(0, 8).forEach((u, i) => {
      const it = buildItem(decodeInstagramValue(u), null, null, shortcode, collected.length + i);
      collected.push({ item: it, debug: { id: it.id, source: 'display_url.inline', url: it.url, width: it.width, height: it.height, note: 'fallback from HTML display_url' } });
    });
  }

  // 5) OG image last resort
  if (!collected.length) {
    const imageMeta = extractMetaContent(html, 'og:image:secure_url') || extractMetaContent(html, 'og:image');
    if (imageMeta) {
      const it = buildItem(decodeInstagramValue(imageMeta), null, null, shortcode, 0);
      collected.push({ item: it, debug: { id: it.id, source: 'og_image', url: it.url, width: it.width, height: it.height, note: 'last-resort fallback' } });
    }
  }

  // dedupe by url
  const seen = new Set<string>();
  const items: InstagramPhotoItem[] = [];
  const dbg: PhotoDebug[] = [];
  for (const c of collected) {
    if (!c || !c.item) continue;
    if (seen.has(c.item.url)) continue;
    seen.add(c.item.url);
    items.push(c.item);
    dbg.push(c.debug);
  }

  return { items, debug: dbg };
}
