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
  const jsonMatch = html.match(/"video_versions"\s*:\s*\[([^\]]+)\]/s);
  if (!jsonMatch) return null;
  const urlMatch = jsonMatch[1].match(/"url"\s*:\s*"(https:[^"\\]+)"/i);
  return urlMatch ? decodeInstagramUrl(urlMatch[1]) : null;
};
(async () => {
  const res = await fetch(url, { headers });
  const html = await res.text();
  console.log('status', res.status);
  console.log('has video_versions', html.includes('video_versions'));
  console.log('has og:video', html.includes('og:video'));
  console.log('has display_url', html.includes('display_url'));
  const idx = html.indexOf('"video_versions"');
  console.log('video_versions index', idx);
  if (idx !== -1) {
    console.log(html.slice(idx - 100, idx + 500));
  }
  const m = html.match(/"video_versions"\s*:\s*\[([^\]]+)\]/s);
  console.log('match', !!m);
  if (m) {
    const urlMatch = m[1].match(/"url"\s*:\s*"(https:[^"\\]+)"/i);
    console.log('url', urlMatch ? decodeInstagramUrl(urlMatch[1]) : 'none');
  }
})();
