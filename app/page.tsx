import DownloadHero from './components/DownloadHero';

const featureItems = [
  'Original quality without watermark or logo',
  'Download reels video in gallery on any device',
  'Download by link using your browser (No software)',
  '100% Lifetime Free with simple ads support',
];

const cards = [
  {
    title: 'Super-Fast Downloader',
    description:
      'Our Instagram reels downloader allows users to fetch reels and video content fast and free. It is built for speed and ease of use.',
  },
  {
    title: 'Content Formats',
    description:
      'Download reels in MP4 or MP3 format. The tool supports videos, audio, and photos with a single clean link.',
  },
];

const faqItems = [
  {
    question: 'What is an Instagram Reel Downloader and how does it work?',
    answer:
      'An Instagram Reel Downloader is a web tool that converts Instagram reel URLs into downloadable video files. FastVideoSave finds the reel video, prepares it in high definition, and gives you a simple download button without any watermark.',
  },
  {
    question: 'Do I need to log in to Instagram to download reels?',
    answer:
      'No, FastVideoSave works without Instagram login. It only supports public reels and videos, so you can save content quickly from any public post without entering your account details.',
  },
  {
    question: 'Can I download unlimited reels and Instagram videos?',
    answer:
      'Yes, there are no download limits. FastVideoSave lets you download unlimited reels, videos, and photos from Instagram for personal offline use.',
  },
  {
    question: 'Will the downloaded video be high quality?',
    answer:
      'Yes, the tool preserves the original video quality whenever possible. If the Instagram reel is available in HD, you will receive the same resolution in your downloaded file.',
  },
];

const keywords = [
  'Instagram reel downloader',
  'download Instagram reels',
  'Instagram video downloader',
  'save Instagram video',
  'reel downloader online',
  'Instagram reel download no watermark',
  'download Instagram photos',
  'Instagram downloader no login',
  'download reels HD',
  'Instagram reel saver',
  'reel download without app',
  'fast Instagram downloader',
  'Instagram reel download 2026',
  'Instagram video save tool',
  'online Instagram downloader',
  'reel downloader for mobile',
  'Instagram reel to mp4',
  'Instagram story downloader',
  'Instagram photo downloader',
  'download Instagram post',
  'Instagram video download free',
  'reel downloader website',
  'save Instagram reels online',
  'best Instagram downloader',
  'free Instagram downloader',
  'download IGTV video',
  'Instagram clip downloader',
  'reel download quality',
  'Instagram media downloader',
  'reel downloader without login',
  'download Instagram audio',
  'video downloader for Instagram',
  'Instagram download page',
  'Instagram downloader fast',
  'Instagram content downloader',
  'reel download tool',
  'Instagram reel save high quality',
  'download Instagram highlights',
  'Instagram download apk',
  'Instagram downloader online free',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-full">
        <section className="border-b border-slate-200 bg-gradient-to-b from-white/95 to-white/80 px-4 py-8 sm:px-6 sm:py-12 dark:from-slate-950/95 dark:to-slate-950/80 dark:border-slate-800">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'FastVideoSave',
                url: 'https://fastvideosave.net',
                description:
                  'FastVideoSave is the easiest Instagram downloader for reels, photos, videos, and audio. Download Instagram content in high quality without watermark or app.',
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              }),
            }}
          />
          <div className="mx-auto max-w-6xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-violet-50 px-4 py-2 sm:px-5 text-xs sm:text-sm font-bold text-violet-700 shadow-sm shadow-violet-100 dark:bg-violet-900/30 dark:text-violet-300">
              ✨ No Logo · High Quality · Free
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
              Instagram <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">Reels</span> Downloader
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              Download Instagram reels, stories, videos, and photos instantly with FastVideoSave. This online Instagram downloader works without login, without apps, and without watermark so you get clean HD files fast.
            </p>
          </div>

          <div id="download" className="mx-auto mt-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50">
            <DownloadHero />
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 p-4 sm:p-5 border border-violet-200/50 shadow-sm dark:from-violet-900/20 dark:to-violet-800/10 dark:border-violet-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🌐 Online Downloader</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Save reels, stories, videos and photos in one click.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 border border-blue-200/50 shadow-sm dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">🔒 No Login Required</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download public Instagram content without logging in.</p>
              </div>
              <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 p-4 sm:p-5 border border-green-200/50 shadow-sm dark:from-green-900/20 dark:to-green-800/10 dark:border-green-800/50">
                <p className="font-semibold text-sm sm:text-base text-slate-950 dark:text-white">♾️ Unlimited Downloads</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Use the tool as much as you want every day.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">📚 What is Instagram Reel Downloader</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">A free online tool to save Instagram reels and videos instantly</h2>
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              <p>
                An Instagram Reel Downloader is a browser-based service designed to help you save Instagram reel videos, Instagram posts, and story content directly to your device. It removes the need for a dedicated app, making it simple to download Instagram reels on Android, iPhone, Windows, or Mac.
              </p>
              <p>
                FastVideoSave is built for anyone who wants a reliable Instagram downloader, Instagram story downloader, and Instagram photo downloader in one place. By using only the Instagram link, the tool quickly fetches the original media file and converts it into a downloadable format without any watermark.
              </p>
              <p>
                This Instagram reel download service works with public Instagram content only. It is ideal for content creators, social media managers, students, and anyone saving personal clips for offline viewing. With FastVideoSave, you can keep your favorite reels, music videos, and visual stories accessible whenever you need them.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-slate-50/95 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">⚙️ How it Works</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">The step-by-step process behind the Instagram reel downloader</h2>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  FastVideoSave uses a smart link parser to read the Instagram reel URL and identify the original video file. When you paste a reel or video link, the downloader checks Instagram’s public page, extracts the media source, and generates a downloadable MP4 file without any watermark.
                </p>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  The conversion happens on the server so it works smoothly on mobile browsers, tablets, and desktops. You do not need to install any app or sign in to Instagram. The tool fetches the reel, converts it into a clean download format, and delivers a direct button in seconds.
                </p>
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  FastVideoSave also supports Instagram photo, story, and video downloads. Whether you want to save a single reel clip or an entire gallery image, the downloader provides the best available format for your device.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">✅ 4 simple steps to save Instagram content</h3>
                <ul className="mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">
                  <li>1. Copy the Instagram reel or video link from the app or browser.</li>
                  <li>2. Paste it into the FastVideoSave download field.</li>
                  <li>3. Click Download and wait a few seconds.</li>
                  <li>4. Save the HD video file to your device.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">✨ Features</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Why FastVideoSave is the best Instagram downloader</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">📹 HD Download</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  Download Instagram reels in high definition. The tool preserves the highest available resolution from the original Instagram upload, including 720p, 1080p, and higher when supported. This ensures your saved videos remain crisp even on large screens.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">🔒 No Login Required</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  You can download Instagram reels without signing in. FastVideoSave is built to work with public content only, so there is no need to enter Instagram credentials or connect your account. This makes it safer and faster for everyday use.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">♾️ Unlimited Downloads</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  There are no limits on the number of reels, stories, or videos you can download. FastVideoSave allows unlimited downloads so you can save as many Instagram files as needed for personal viewing and reference.
                </p>
              </div>
              <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">⚡ Fast Processing</h3>
                <p className="mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
                  The service is optimized for speed. Most Instagram reel downloads are ready within seconds, and the website is designed to handle traffic efficiently. Enjoy a fast download experience without long waits or slow processing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-300">🎯 Step-by-Step Guide</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">How to download Instagram reels fast</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {[
                'Copy the Instagram reel URL from the app or browser.',
                'Paste it into the FastVideoSave input field.',
                'Click Download and save the file to your device.',
              ].map((step, index) => (
                <div key={step} className="rounded-lg sm:rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-7 text-center hover:border-violet-500 transition-colors">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 text-sm sm:text-base font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm leading-6 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4 sm:space-y-6 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
              <p>
                The step-by-step guide is made to help you download Instagram reels without confusion. The entire workflow is just three actions: get the Instagram link, paste it in, and download. This is the fastest way to save an Instagram reel, regardless of whether you are on Android, iPhone, Windows, or Mac.
              </p>
              <p>
                After pasting the link, the Instagram reel downloader identifies the reel content, validates the URL, and creates a clean download button. You can also download Instagram photos and videos from public stories and posts using the same process.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">❓ Frequently Asked Questions</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Everything you need to know about FastVideoSave</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg sm:rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 sm:p-7 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:shadow-slate-900/30 hover:shadow-md transition-shadow">
                  <p className="font-bold text-sm sm:text-base text-slate-950 dark:text-white">{item.question}</p>
                  <p className="mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-3 mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">🔥 Popular Searches</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 dark:text-white">Trending Instagram Download Keywords</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Discover the most popular search terms people use to download Instagram content</p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10 rounded-lg sm:rounded-2xl p-6 sm:p-8 border border-violet-200/50 dark:border-violet-800/50">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-4">Why These Keywords Matter</h3>
                  <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 dark:text-slate-300 mb-4">
                    When you search for Instagram content downloaders online, you're using one of these 40 trending keywords. FastVideoSave ranks for all of them because our tool delivers exactly what users want: a fast, free, and easy way to download Instagram reels, videos, photos, and audio without any watermarks or apps.
                  </p>
                  <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 dark:text-slate-300 mb-4">
                    Our platform is built to handle millions of searches every month from people looking for Instagram reel downloaders. Whether you search for "download Instagram reels," "Instagram video downloader," or "save reels without watermark," FastVideoSave delivers consistent, high-quality results in seconds. We've optimized our service for every possible search query so you can find us easily no matter how you phrase your request.
                  </p>
                  <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 dark:text-slate-300">
                    The keywords below represent real user intent—people actively searching for solutions to download Instagram content. By using FastVideoSave, you're joining millions of users who trust our platform for reliable, instant Instagram downloads across all devices and browsers.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg sm:rounded-2xl p-6 sm:p-8 border border-blue-200/50 dark:border-blue-800/50">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-4">Popular Download Types</h3>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                      <p className="font-semibold text-sm text-slate-950 dark:text-white mb-2">📹 Reels & Videos</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Download Instagram Reels in MP4 format with original quality</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                      <p className="font-semibold text-sm text-slate-950 dark:text-white mb-2">📸 Photos & Stories</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Save Instagram photos and stories in high definition</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                      <p className="font-semibold text-sm text-slate-950 dark:text-white mb-2">🎵 Audio & Music</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Extract audio from reels and save as MP3 files</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                      <p className="font-semibold text-sm text-slate-950 dark:text-white mb-2">⚡ Fast & Free</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No login, no watermark, unlimited downloads</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20 bg-gradient-to-br from-violet-600 to-violet-700 dark:from-violet-900 dark:to-violet-800 rounded-lg sm:rounded-2xl p-6 sm:p-8 text-white shadow-lg">
                  <h3 className="text-lg sm:text-xl font-bold mb-4">💡 Pro Tips</h3>
                  <ul className="space-y-3 text-sm leading-6">
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">✓</span>
                      <span>Use the exact URL from Instagram</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">✓</span>
                      <span>Works on mobile, tablet & desktop</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">✓</span>
                      <span>No signup or login needed</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">✓</span>
                      <span>Downloads start instantly</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">✓</span>
                      <span>Original quality always preserved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">All Trending Keywords</h3>
              <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {keywords.map((keyword) => (
                  <div key={keyword} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer shadow-sm">
                    {keyword}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-lg sm:rounded-2xl p-6 sm:p-8 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-3">❓ Common Questions About These Keywords</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-sm mb-2">What does "Instagram downloader no login" mean?</p>
                  <p className="text-xs sm:text-sm text-slate-300">It means you can download Instagram content without signing into your Instagram account. FastVideoSave handles everything—just paste the link and download.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Are Instagram downloaders safe to use?</p>
                  <p className="text-xs sm:text-sm text-slate-300">FastVideoSave is 100% safe. We don't store your data, don't require login, and only process public Instagram content.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Can I download with no watermark?</p>
                  <p className="text-xs sm:text-sm text-slate-300">Yes! FastVideoSave delivers clean downloads without any branding or watermarks added to your files.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Which format is best for downloads?</p>
                  <p className="text-xs sm:text-sm text-slate-300">MP4 for videos and photos, MP3 for audio. We support all major formats and devices.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
