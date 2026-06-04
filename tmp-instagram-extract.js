const url = 'https://www.instagram.com/reel/DZEbQxJTm36/';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  Referer: 'https://www.instagram.com/',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-User': '?1',
  'Sec-Fetch-Dest': 'document',
  'Sec-CH-UA': '"Chromium";v="126", "Not=A?Brand";v="99", "Google Chrome";v="126"',
  'Sec-CH-UA-Mobile': '?0',
  'Sec-CH-UA-Platform': '"Windows"'
};
const decodeInstagramUrl = (value) => value.replace(/\\u0026/g, '&').replace(/\\\//g, '/');
const extractVideoUrlFromJsonHtml = (html) => {
  const start = html.indexOf('"video_versions"');
  if (start === -1) return null;
  const snippet = html.slice(start, start + 2000);
  const urlRegex = /"url"\s*:\s*"((?:\\.|[^"\\])+?)"/gi;
  let match;
  while ((match = urlRegex.exec(snippet)) !== null) {
    const candidate = decodeInstagramUrl(match[1]);
    if (candidate.includes('.mp4')) {
      return candidate;
    }
  }
  return null;
};
(async () => {
  const res = await fetch(url, { headers });
  const html = await res.text();
  console.log('status', res.status);
  console.log('has video_versions', html.includes('video_versions'));
  console.log('videoUrl', extractVideoUrlFromJsonHtml(html));
})();
