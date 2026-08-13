export interface ToolPageDetail {
  slug: string;
  title: string;
  description: string;
  overview: string;
  keywords: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

export const baseUrl = 'https://globltools.com';
export const siteName = 'globltools';
export const defaultKeywords = [
  'instagram downloader',
  'video downloader',
  'reels downloader',
  'download instagram reels',
  'youtube video downloader',
  'download video online',
];

export const toolPages: ToolPageDetail[] = [
  {
    slug: 'youtube-video-downloader',
    title: 'YouTube Video Downloader',
    description: 'Download YouTube videos instantly in MP4 or MP3 with globltools. Fast browser downloads, no app, no login required.',
    overview: 'Use globltools to save YouTube videos directly from your browser. Works for music, shorts, lectures, and more with a clean download experience.',
    keywords: ['youtube video downloader', 'download youtube video', 'youtube mp4 downloader', 'free youtube download'],
    features: ['MP4 and MP3 output', 'Fast browser downloads', 'No app required', 'Works on mobile and desktop'],
    faqs: [
      {
        question: 'Can I download YouTube videos without installing software?',
        answer: 'Yes. globltools downloads YouTube videos directly in your browser without any app or software installation.',
      },
      {
        question: 'Do I need a YouTube account to download videos?',
        answer: 'No, globltools only needs the public YouTube link. You do not need to sign in to your Google or YouTube account.',
      },
    ],
    relatedSlugs: ['youtube-shorts-downloader', 'instagram-video-downloader', 'video-downloader'],
  },
  {
    slug: 'youtube-shorts-downloader',
    title: 'YouTube Shorts Downloader',
    description: 'Save YouTube Shorts in HD with globltools. Instant downloads without watermark, no login, and mobile-friendly output.',
    overview: 'Download YouTube Shorts videos in high quality with a simple link. globltools supports short clips, music shorts, and trending content for fast sharing.',
    keywords: ['youtube shorts downloader', 'download youtube shorts', 'shorts mp4', 'youtube shorts save'],
    features: ['Shorts video download', 'Fast mobile support', 'Clear MP4 files', 'No watermark or branding'],
    faqs: [
      {
        question: 'Can I save a YouTube Short to my phone?',
        answer: 'Yes. globltools delivers mobile-friendly MP4 downloads that work on phones, tablets, and desktop browsers.',
      },
      {
        question: 'Does the download include the audio track?',
        answer: 'Yes, the downloaded Short includes the original audio track in the same video file.',
      },
    ],
    relatedSlugs: ['youtube-video-downloader', 'instagram-reels-downloader', 'all-video-downloader'],
  },
  {
    slug: 'tiktok-video-downloader',
    title: 'TikTok Video Downloader',
    description: 'Download TikTok videos quickly and safely with globltools. No login, no watermark, and instant browser download support.',
    overview: 'Save TikTok videos in HD using only the post link. globltools makes it easy to keep TikTok clips offline for personal viewing.',
    keywords: ['tiktok video downloader', 'download tiktok video', 'tiktok mp4', 'save tiktok video'],
    features: ['HD TikTok downloads', 'Watermark free output', 'Works in browser', 'Supports public TikTok posts'],
    faqs: [
      {
        question: 'Can I download TikTok videos without an app?',
        answer: 'Yes, globltools downloads TikTok videos directly in your browser without requiring an app.',
      },
      {
        question: 'Are private TikTok videos supported?',
        answer: 'No, only public TikTok videos can be downloaded with this service.',
      },
    ],
    relatedSlugs: ['tiktok-mp3-downloader', 'video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'tiktok-mp3-downloader',
    title: 'TikTok MP3 Downloader',
    description: 'Convert TikTok videos to MP3 audio quickly with globltools. Get clean audio downloads for music, quotes, and voice clips.',
    overview: 'Extract the audio track from TikTok videos and download it as MP3. This is perfect for saving music clips and audio-only content from public posts.',
    keywords: ['tiktok mp3 downloader', 'download tiktok audio', 'tiktok audio extractor', 'tiktok music download'],
    features: ['Audio-only downloads', 'MP3 output', 'No installation', 'Fast extraction'],
    faqs: [
      {
        question: 'Can I get MP3 from TikTok videos?',
        answer: 'Yes, globltools extracts the audio from public TikTok videos and delivers it as an MP3 download.',
      },
      {
        question: 'Does the downloaded MP3 keep original sound quality?',
        answer: 'globltools preserves the best available audio quality from the original TikTok clip.',
      },
    ],
    relatedSlugs: ['tiktok-video-downloader', 'audio', 'all-video-downloader'],
  },
  {
    slug: 'facebook-video-downloader',
    title: 'Facebook Video Downloader',
    description: 'Save Facebook videos in HD with globltools. Fast downloads from public Facebook posts and pages without login.',
    overview: 'Download video posts from Facebook instantly. globltools works in the browser and keeps downloads clean and simple for personal use.',
    keywords: ['facebook video downloader', 'download facebook video', 'facebook mp4 downloader', 'save facebook video'],
    features: ['Public Facebook video support', 'HD downloads', 'Browser-based tool', 'No login required'],
    faqs: [
      {
        question: 'Can I download Facebook videos without logging in?',
        answer: 'Yes, globltools only requires the public Facebook link to process and download videos.',
      },
      {
        question: 'Does this work for Facebook page videos?',
        answer: 'Yes, public video posts from pages and profiles are supported.',
      },
    ],
    relatedSlugs: ['facebook-reels-downloader', 'video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'facebook-reels-downloader',
    title: 'Facebook Reels Downloader',
    description: 'Download Facebook Reels and short vertical videos with globltools. Fast browser downloads without watermark or apps.',
    overview: 'Save Facebook Reels instantly using the post link. globltools supports short-form Facebook videos for fast download and offline playback.',
    keywords: ['facebook reels downloader', 'download facebook reels', 'facebook reels mp4', 'save facebook reel'],
    features: ['Facebook Reels support', 'Quick downloads', 'No app needed', 'Clean MP4 output'],
    faqs: [
      {
        question: 'Are Facebook Reels downloads free?',
        answer: 'Yes, globltools provides free downloads for public Facebook Reels.',
      },
      {
        question: 'Is the downloaded video watermark-free?',
        answer: 'Yes, the output does not add extra watermarks or branding.',
      },
    ],
    relatedSlugs: ['facebook-video-downloader', 'video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'twitter-video-downloader',
    title: 'Twitter Video Downloader',
    description: 'Download Twitter videos and GIFs fast with globltools. No login required for public tweets and easy browser downloads.',
    overview: 'Use globltools to save videos from public Twitter tweets. The tool supports MP4 downloads and works on desktop and mobile browsers.',
    keywords: ['twitter video downloader', 'download twitter video', 'twitter mp4 downloader', 'save tweet video'],
    features: ['Twitter MP4 downloads', 'GIF conversion support', 'No login required', 'Fast processing'],
    faqs: [
      {
        question: 'Can I download Twitter videos from any public tweet?',
        answer: 'Yes, globltools supports public tweets that contain video or GIF content.',
      },
      {
        question: 'Do I need to sign in to Twitter?',
        answer: 'No, only the public tweet URL is needed for download.',
      },
    ],
    relatedSlugs: ['x-video-downloader', 'video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'x-video-downloader',
    title: 'X Video Downloader',
    description: 'Save videos from X (formerly Twitter) quickly with globltools. Download MP4 files from public posts without extra tools.',
    overview: 'Download X videos and convert them to MP4 directly in your browser. globltools makes it easy to save tweets with video content.',
    keywords: ['x video downloader', 'download x video', 'twitter video save', 'download tweet video'],
    features: ['Public X video support', 'No software needed', 'Fast MP4 downloads', 'Works on mobile'],
    faqs: [
      {
        question: 'Does this work for X videos?',
        answer: 'Yes, globltools supports downloads from public X posts that include video media.',
      },
      {
        question: 'Can I download videos from X without an account?',
        answer: 'Yes, only the public post link is required.',
      },
    ],
    relatedSlugs: ['twitter-video-downloader', 'video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'pinterest-video-downloader',
    title: 'Pinterest Video Downloader',
    description: 'Download Pinterest videos and story pins with globltools. Instant MP4 downloads from public Pinterest pins.',
    overview: 'Save Pinterest video pins and story content quickly using a browser-based downloader. globltools supports public Pinterest video links.',
    keywords: ['pinterest video downloader', 'download pinterest video', 'save pinterest pin', 'pinterest mp4 downloader'],
    features: ['Pinterest video supports', 'Fast downloads', 'No login', 'Simple browser interface'],
    faqs: [
      {
        question: 'Can I download Pinterest videos without signing in?',
        answer: 'Yes, the service downloads public Pinterest videos without a login.',
      },
      {
        question: 'What format is the download?',
        answer: 'Downloads are delivered as MP4 video files.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'linkedin-video-downloader',
    title: 'LinkedIn Video Downloader',
    description: 'Save LinkedIn videos in MP4 with globltools. Download public training videos, presentations, and business clips from LinkedIn posts.',
    overview: 'Download public LinkedIn videos quickly for offline viewing. globltools supports business and professional video posts with a clean download workflow.',
    keywords: ['linkedin video downloader', 'download linkedin video', 'linkedin mp4 downloader', 'save linkedin video'],
    features: ['LinkedIn video support', 'Fast browser download', 'No login needed', 'Clean MP4 output'],
    faqs: [
      {
        question: 'Does LinkedIn require login for downloads?',
        answer: 'No, globltools downloads public LinkedIn videos without requiring LinkedIn credentials.',
      },
      {
        question: 'Can I use this for presentations and tutorials?',
        answer: 'Yes, any public LinkedIn video link works for download.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'reddit-video-downloader',
    title: 'Reddit Video Downloader',
    description: 'Download Reddit videos and GIFs fast with globltools. Works for public subreddits and posts without extra apps.',
    overview: 'Save Reddit video posts and clips using a browser-based downloader. globltools supports public Reddit links and delivers MP4 output.',
    keywords: ['reddit video downloader', 'download reddit video', 'reddit mp4 downloader', 'save reddit clip'],
    features: ['Reddit MP4 downloads', 'GIF support', 'No install required', 'Fast browser extraction'],
    faqs: [
      {
        question: 'Can I download Reddit videos from public posts?',
        answer: 'Yes, globltools supports downloads from public Reddit video posts and clips.',
      },
      {
        question: 'Does it support GIFs and reels?',
        answer: 'Yes, the tool can download GIF-style video content as MP4.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'snapchat-video-downloader',
    title: 'Snapchat Video Downloader',
    description: 'Save public Snapchat videos instantly with globltools. Download Snaps as MP4 files without installing an app.',
    overview: 'Use globltools to download public Snap videos directly in your browser. Works quickly for public content shared via Snapchat links.',
    keywords: ['snapchat video downloader', 'download snapchat video', 'snap mp4 downloader', 'save snapchat snap'],
    features: ['Snapchat video support', 'Fast downloads', 'No app needed', 'Browser-friendly tool'],
    faqs: [
      {
        question: 'Can I download Snapchat videos without the app?',
        answer: 'Yes, globltools downloads public Snapchat videos directly in your browser.',
      },
      {
        question: 'Are private Snaps supported?',
        answer: 'No, only public Snapchat video links can be downloaded.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'dailymotion-video-downloader',
    title: 'Dailymotion Video Downloader',
    description: 'Download Dailymotion videos in MP4 quickly with globltools. No login required and browser-friendly downloads for public content.',
    overview: 'Save Dailymotion videos directly from the link. globltools handles public Dailymotion video posts with fast MP4 output.',
    keywords: ['dailymotion video downloader', 'download dailymotion video', 'dailymotion mp4', 'save dailymotion clip'],
    features: ['Dailymotion support', 'MP4 downloads', 'No account needed', 'Quick browser access'],
    faqs: [
      {
        question: 'Do I need a Dailymotion account to download?',
        answer: 'No, only the public Dailymotion video link is required.',
      },
      {
        question: 'Can I download full videos?',
        answer: 'Yes, globltools downloads videos in the highest available quality.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'vimeo-video-downloader',
    title: 'Vimeo Video Downloader',
    description: 'Save Vimeo videos in HD with globltools. Use a browser-friendly downloader for public Vimeo links and fast MP4 output.',
    overview: 'Download public Vimeo videos using any browser. globltools converts Vimeo links into clean downloadable MP4 files.',
    keywords: ['vimeo video downloader', 'download vimeo video', 'vimeo mp4 downloader', 'save vimeo video'],
    features: ['Vimeo video support', 'High-quality downloads', 'No login required', 'Mobile-ready output'],
    faqs: [
      {
        question: 'Can I download Vimeo videos without an account?',
        answer: 'Yes, globltools supports downloads from public Vimeo links without requiring an account.',
      },
      {
        question: 'Is the downloaded file MP4?',
        answer: 'Yes, downloads are delivered as MP4 for easy playback.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'threads-video-downloader',
    title: 'Threads Video Downloader',
    description: 'Download Threads videos quickly with globltools. Save clips from public Threads posts without apps or login.',
    overview: 'Use globltools to download public video content from Threads. The tool creates fast MP4 downloads from any supported Threads post link.',
    keywords: ['threads video downloader', 'download threads video', 'save threads clip', 'threads mp4 downloader'],
    features: ['Threads video support', 'No app installation', 'Quick downloads', 'Clean MP4 output'],
    faqs: [
      {
        question: 'Does this work for public Threads posts?',
        answer: 'Yes, globltools supports public Threads videos and clips.',
      },
      {
        question: 'Can I download videos without login?',
        answer: 'Yes, only the public Threads URL is required.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'telegram-video-downloader',
    title: 'Telegram Video Downloader',
    description: 'Download Telegram videos from public channels and groups with globltools. Fast MP4 downloads in the browser, no software needed.',
    overview: 'Save Telegram videos shared through public links using globltools. The downloader supports public channel and group video content.',
    keywords: ['telegram video downloader', 'download telegram video', 'telegram mp4 downloader', 'save telegram video'],
    features: ['Telegram video support', 'Browser downloads', 'No app required', 'Fast processing'],
    faqs: [
      {
        question: 'Can I download Telegram videos without the app?',
        answer: 'Yes, globltools downloads public Telegram videos directly via browser.',
      },
      {
        question: 'Are private Telegram messages supported?',
        answer: 'No, only public channel and group video links can be downloaded.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'twitch-video-downloader',
    title: 'Twitch Video Downloader',
    description: 'Save Twitch clips and VODs with globltools. Download public Twitch video links as MP4 quickly in your browser.',
    overview: 'Use globltools to download Twitch clips and past broadcasts from public links. The tool delivers MP4 output ready for playback.',
    keywords: ['twitch video downloader', 'download twitch clip', 'twitch vod downloader', 'save twitch video'],
    features: ['Twitch clip downloads', 'VOD support', 'No login required', 'Fast MP4 output'],
    faqs: [
      {
        question: 'Can I download Twitch clips without login?',
        answer: 'Yes, globltools supports public Twitch clip links without requiring login.',
      },
      {
        question: 'Does it support Twitch VODs?',
        answer: 'The tool works best with public Twitch video links and clips.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'rumble-video-downloader',
    title: 'Rumble Video Downloader',
    description: 'Download Rumble videos quickly with globltools. Convert public Rumble links into fast MP4 downloads in the browser.',
    overview: 'Use globltools to save Rumble video content with a simple public link. The service delivers clean MP4 downloads without extra apps.',
    keywords: ['rumble video downloader', 'download rumble video', 'save rumble clip', 'rumble mp4 downloader'],
    features: ['Rumble video support', 'Quick downloads', 'No login', 'MP4 output'],
    faqs: [
      {
        question: 'Can I download Rumble videos without software?',
        answer: 'Yes, globltools downloads public Rumble videos directly in your browser.',
      },
      {
        question: 'Is the downloaded file watermark-free?',
        answer: 'Yes, no additional watermark is added during the download.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'kuaishou-video-downloader',
    title: 'Kuaishou Video Downloader',
    description: 'Download Kuaishou videos fast with globltools. Save public clips in MP4 format without login or apps.',
    overview: 'Use globltools to download Kuaishou videos from public links. The tool creates fast browser downloads for mobile and desktop playback.',
    keywords: ['kuaishou video downloader', 'download kuaishou video', 'save kuaishou clip', 'kuaishou mp4 downloader'],
    features: ['Kuaishou support', 'Browser download', 'No login', 'MP4 output'],
    faqs: [
      {
        question: 'Can I download Kuaishou videos without an app?',
        answer: 'Yes, the service downloads public Kuaishou videos in the browser.',
      },
      {
        question: 'Does it support international content?',
        answer: 'Yes, public Kuaishou links are supported regardless of location.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'douyin-video-downloader',
    title: 'Douyin Video Downloader',
    description: 'Save Douyin videos quickly with globltools. Download public Douyin links in MP4 format without extra software.',
    overview: 'globltools supports public Douyin videos and converts them into fast MP4 downloads for offline viewing.',
    keywords: ['douyin video downloader', 'download douyin video', 'save douyin clip', 'douyin mp4 downloader'],
    features: ['Douyin download support', 'Browser-based tool', 'No installation', 'Fast MP4 output'],
    faqs: [
      {
        question: 'Can I download Douyin videos directly in the browser?',
        answer: 'Yes, globltools downloads public Douyin videos without requiring an app.',
      },
      {
        question: 'Is the download high quality?',
        answer: 'The tool preserves the best available video quality from the original Douyin link.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'likee-video-downloader',
    title: 'Likee Video Downloader',
    description: 'Download Likee videos instantly with globltools. Fast MP4 downloads from public Likee links without login.',
    overview: 'Save Likee videos in high quality using a browser-based downloader. globltools works with public Likee posts for easy offline access.',
    keywords: ['likee video downloader', 'download likee video', 'likee mp4 downloader', 'save likee clip'],
    features: ['Likee video support', 'Quick downloads', 'No app required', 'MP4 output'],
    faqs: [
      {
        question: 'Can I download Likee videos in the browser?',
        answer: 'Yes, globltools downloads public Likee videos directly via browser.',
      },
      {
        question: 'Does it support all Likee clips?',
        answer: 'The tool supports public Likee video links.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'moj-video-downloader',
    title: 'Moj Video Downloader',
    description: 'Save Moj videos quickly with globltools. Download public Moj clips in MP4 without login or app installation.',
    overview: 'Download Moj videos using any browser. globltools converts Moj links into clean MP4 downloads for offline playback.',
    keywords: ['moj video downloader', 'download moj video', 'save moj clip', 'moj mp4 downloader'],
    features: ['Moj video support', 'Browser downloads', 'No login', 'Fast MP4 output'],
    faqs: [
      {
        question: 'Do I need a Moj account to download?',
        answer: 'No, globltools only requires a public Moj link.',
      },
      {
        question: 'Can I save Moj videos for offline viewing?',
        answer: 'Yes, the downloaded MP4 files work on phones and computers.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'josh-video-downloader',
    title: 'Josh Video Downloader',
    description: 'Download Josh app videos using globltools. Fast MP4 downloads from public Josh links without extra apps.',
    overview: 'Save Josh videos quickly with a browser-based downloader. globltools supports public Josh posts for easy offline viewing.',
    keywords: ['josh video downloader', 'download josh video', 'save josh clip', 'josh mp4 downloader'],
    features: ['Josh video downloads', 'No login required', 'Browser-friendly', 'Fast MP4 output'],
    faqs: [
      {
        question: 'Can I download Josh videos without an app?',
        answer: 'Yes, globltools downloads public Josh videos directly in the browser.',
      },
      {
        question: 'Is the output compatible with mobile devices?',
        answer: 'Yes, the downloads are MP4 files compatible with phones and tablets.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'chingari-video-downloader',
    title: 'Chingari Video Downloader',
    description: 'Save Chingari videos instantly with globltools. Download public Chingari clips in MP4 without installation.',
    overview: 'Use globltools to download Chingari videos from public links. The tool delivers fast MP4 downloads for personal use.',
    keywords: ['chingari video downloader', 'download chingari video', 'save chingari clip', 'chingari mp4 downloader'],
    features: ['Chingari downloader', 'No login', 'Quick browser downloads', 'MP4 output'],
    faqs: [
      {
        question: 'Can I download Chingari videos without apps?',
        answer: 'Yes, globltools downloads public Chingari videos directly in your browser.',
      },
      {
        question: 'Are downloads watermark free?',
        answer: 'Yes, globltools does not add additional watermarks.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'sharechat-video-downloader',
    title: 'ShareChat Video Downloader',
    description: 'Download ShareChat videos in MP4 with globltools. Fast browser downloads for public ShareChat clips and stories.',
    overview: 'Save ShareChat videos quickly with globltools. The downloader supports public ShareChat links and delivers clean MP4 files.',
    keywords: ['sharechat video downloader', 'download sharechat video', 'save sharechat clip', 'sharechat mp4 downloader'],
    features: ['ShareChat video support', 'No app install', 'Fast browser downloads', 'MP4 output'],
    faqs: [
      {
        question: 'Can I download ShareChat videos without the app?',
        answer: 'Yes, globltools works directly in the browser with public ShareChat links.',
      },
      {
        question: 'Do downloads keep video quality?',
        answer: 'Yes, the tool preserves the best available quality from the original clip.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'triller-video-downloader',
    title: 'Triller Video Downloader',
    description: 'Download Triller videos easily with globltools. Save public Triller clips in MP4 without login or apps.',
    overview: 'Use globltools to download public Triller videos and clips with a simple browser-based workflow.',
    keywords: ['triller video downloader', 'download triller video', 'save triller clip', 'triller mp4 downloader'],
    features: ['Triller downloads', 'Browser-friendly', 'No login', 'Fast MP4 output'],
    faqs: [
      {
        question: 'Can I download Triller videos without installing apps?',
        answer: 'Yes, globltools downloads public Triller videos directly via browser.',
      },
      {
        question: 'Is the output MP4?',
        answer: 'Yes, downloads are delivered as MP4 video files.',
      },
    ],
    relatedSlugs: ['video-downloader', 'all-video-downloader'],
  },
  {
    slug: 'soundcloud-downloader',
    title: 'SoundCloud Downloader',
    description: 'Download public SoundCloud tracks with globltools. Extract audio quickly and save MP3 files without login.',
    overview: 'Use globltools to save audio from public SoundCloud tracks. The downloader converts SoundCloud links into clean MP3 files.',
    keywords: ['soundcloud downloader', 'download soundcloud mp3', 'save soundcloud audio', 'soundcloud mp3'],
    features: ['SoundCloud MP3 downloads', 'Fast audio extraction', 'No login required', 'Browser-based tool'],
    faqs: [
      {
        question: 'Can I download SoundCloud tracks without an account?',
        answer: 'Yes, globltools downloads audio from public SoundCloud tracks without requiring a login.',
      },
      {
        question: 'What audio format is delivered?',
        answer: 'Downloads are delivered as MP3 audio files.',
      },
    ],
    relatedSlugs: ['spotify-downloader', 'audio', 'all-video-downloader'],
  },
  {
    slug: 'spotify-downloader',
    title: 'Spotify Downloader',
    description: 'Convert public Spotify tracks into downloadable audio with globltools. Fast browser downloads without a Spotify account.',
    overview: 'Use globltools to get audio from public Spotify links. The tool creates clean downloads for music previews and tracks.',
    keywords: ['spotify downloader', 'download spotify audio', 'spotify mp3 downloader', 'save spotify track'],
    features: ['Spotify audio download', 'Browser-based conversion', 'No Spotify login', 'Fast MP3 output'],
    faqs: [
      {
        question: 'Can I download Spotify tracks directly?',
        answer: 'globltools supports public Spotify links with browser-based audio extraction.',
      },
      {
        question: 'Do I need a Spotify subscription?',
        answer: 'No subscription is required to use the public Spotify downloader.',
      },
    ],
    relatedSlugs: ['soundcloud-downloader', 'audio', 'all-video-downloader'],
  },
  {
    slug: 'all-video-downloader',
    title: 'All Video Downloader',
    description: 'Use globltools to download videos from all supported platforms in one place. A simple browser downloader for public links.',
    overview: 'globltools supports video downloads from Instagram, YouTube, TikTok, Facebook, and many more platforms. Save any public video link quickly in MP4.',
    keywords: ['all video downloader', 'download video from any site', 'universal video downloader', 'online video downloader'],
    features: ['Supports many platforms', 'Single download page', 'No login or app', 'Fast browser downloads'],
    faqs: [
      {
        question: 'Does this support multiple video platforms?',
        answer: 'Yes, globltools supports downloads from many public video platforms with one interface.',
      },
      {
        question: 'Do I need to switch tools for each platform?',
        answer: 'No, the All Video Downloader centralizes the process for supported links.',
      },
    ],
    relatedSlugs: ['video-downloader', 'youtube-video-downloader', 'instagram-video-downloader'],
  },
  {
    slug: 'video-downloader',
    title: 'Video Downloader',
    description: 'Download videos from public links across supported platforms with globltools. Fast MP4 downloads in the browser.',
    overview: 'globltools Video Downloader converts public video links into quick MP4 downloads. Use the tool for clips, reels, shorts, and posts from supported services.',
    keywords: ['video downloader', 'download video online', 'public video downloader', 'browser video download'],
    features: ['Universal video support', 'Fast MP4 downloads', 'No login required', 'Works on desktop and mobile'],
    faqs: [
      {
        question: 'Can I download any public video link?',
        answer: 'globltools supports public video links from the platforms we list in the downloader.',
      },
      {
        question: 'What file format is available?',
        answer: 'Downloads are delivered as MP4 unless the platform limits the format.',
      },
    ],
    relatedSlugs: ['all-video-downloader', 'youtube-video-downloader', 'instagram-video-downloader'],
  },
];

export function getToolBySlug(slug: string) {
  return toolPages.find((tool) => tool.slug === slug);
}

export function getToolTitleBySlug(slug: string) {
  return getToolBySlug(slug)?.title ?? slug.replace(/-/g, ' ');
}
