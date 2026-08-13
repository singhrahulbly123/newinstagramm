'use client';

import Image from 'next/image';
import { useState } from 'react';

type FacebookExtractionResponse = {
  success: boolean;
  title?: string;
  thumbnail?: string;
  description?: string;
  qualities?: Array<{ label: string; url: string }>;
  error?: string;
  debug?: string[];
};

export default function FacebookReelDownloaderClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<FacebookExtractionResponse | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('HD');
  const [showDebug, setShowDebug] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setResult(null);
    setShowDebug(false);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setStatus('Please paste a Facebook video URL first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = (await response.json()) as FacebookExtractionResponse;

      if (!response.ok || !data.success) {
        setStatus(data.error || 'Unable to extract the Facebook video.');
        setResult(data);
        return;
      }

      setResult(data);
      if (data.qualities && data.qualities.length > 0) {
        setSelectedQuality(data.qualities[0].label);
      }
      setStatus('Video found! Select a quality and download below.');
    } catch (error) {
      setStatus('A network error occurred. Please try again.');
      setResult({
        success: false,
        error: 'Network error',
        qualities: [],
        debug: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setLoading(false);
    }
  }

  const selectedQualityUrl = result?.qualities?.find((q) => q.label === selectedQuality)?.url;
  const filename = `facebook-video-${selectedQuality}.mp4`;
  const downloadUrl = selectedQualityUrl
    ? `/api/facebook-download?url=${encodeURIComponent(selectedQualityUrl)}&filename=${encodeURIComponent(filename)}`
    : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm shadow-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 sm:gap-3 sm:px-5 sm:text-sm">
              🎬 Facebook Video Downloader · No Login · Mobile Friendly
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              Facebook{' '}
              <span className="bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 bg-clip-text text-transparent">
                Reel & Video Downloader
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8 md:text-lg">
              Download Facebook Reels and videos instantly in high quality. Paste a link, select your preferred quality, and download directly to your device. Works with Reels, Videos, and fb.watch links.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="facebook-url" className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Facebook URL
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:shadow-slate-900/30">
                    <span className="text-lg">🔗</span>
                    <input
                      id="facebook-url"
                      type="url"
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder="https://www.facebook.com/reel/..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                        Processing…
                      </>
                    ) : (
                      'Extract Video'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {status && (
              <div className={`rounded-lg px-4 py-3 text-sm ${result?.success ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                {status}
              </div>
            )}

            {result?.success && result.qualities && result.qualities.length > 0 && (
              <div className="mt-8 space-y-6 border-t border-slate-200 pt-8 dark:border-slate-700">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Video Preview
                    </label>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-slate-700">
                      <div className="bg-slate-900 flex items-center justify-center">
                        {selectedQualityUrl ? (
                          <video
                            src={`/api/proxy?url=${encodeURIComponent(selectedQualityUrl)}`}
                            controls
                            playsInline
                            poster={result.thumbnail}
                            className="max-h-[70vh] max-w-full object-contain rounded-lg bg-black"
                          />
                        ) : result.thumbnail ? (
                          <Image
                            src={result.thumbnail}
                            alt={result.title || 'Video thumbnail'}
                            width={800}
                            height={450}
                            className="max-h-[70vh] max-w-full object-contain rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-48 text-slate-400">
                            <span className="text-4xl">🎬</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Details
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">
                        {result.title || 'Facebook Video'}
                      </h2>
                      {result.description && (
                        <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300 line-clamp-3">
                          {result.description}
                        </p>
                      )}
                    </div>

                    {result.qualities.length > 1 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Choose quality</label>
                        <div className="grid gap-2">
                          {result.qualities.map((quality) => (
                            <button
                              key={quality.label}
                              type="button"
                              onClick={() => setSelectedQuality(quality.label)}
                              className={`rounded-md px-3 py-2 text-sm ${selectedQuality === quality.label ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                            >
                              {quality.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <a href={downloadUrl ?? '#'} className="block w-full rounded-md bg-gradient-to-r from-stone-950 via-emerald-950 to-teal-900 px-4 py-3 text-center text-sm font-semibold text-white">
                        Download {selectedQuality}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50 sm:p-8">
            <div className="space-y-8">
              <div className="space-y-3 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">
                  How to download Facebook reels and videos
                </p>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
                  Save Facebook reels and short videos in minutes
                </h2>
                <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Facebook reels and video posts can be fun, inspiring, and useful to keep for later. With this downloader, you can save public reels, short clips, and shared video links without signing in or adding extra apps. The whole process is simple: copy the URL, paste it in, preview it, and download it in your preferred quality.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Step-by-step guide</h3>
                  <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    <li><span className="font-semibold text-slate-900 dark:text-white">1.</span> Find the reel or video on Facebook that you want to keep on your device.</li>
                    <li><span className="font-semibold text-slate-900 dark:text-white">2.</span> Open the post and copy the full URL from the browser address bar or the share option.</li>
                    <li><span className="font-semibold text-slate-900 dark:text-white">3.</span> Paste the link in the box above and click Extract Video to start processing it.</li>
                    <li><span className="font-semibold text-slate-900 dark:text-white">4.</span> Review the preview, pick a quality option, and press Download.</li>
                    <li><span className="font-semibold text-slate-900 dark:text-white">5.</span> Your file will be saved so you can watch it later, even when you are offline.</li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Why this downloader is popular</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    <li>• Works well for reels, short videos, and shared Facebook posts.</li>
                    <li>• Gives you a preview first so you know the right video is being downloaded.</li>
                    <li>• Offers quality options to match your phone storage or internet speed.</li>
                    <li>• Keeps the process lightweight and friendly for first-time users.</li>
                    <li>• Helps you save content for offline viewing, repurposing, or personal archives.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-slate-700 dark:from-emerald-950/20 dark:to-slate-900">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Before you download a reel</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Make sure the reel or video is public and that you are allowed to save it. Some creators share content for viewing only, and copyright rules may apply. If you are downloading for personal use, it is still wise to respect the creator’s rights and Facebook’s platform rules. The tool simply helps you access a public link in a faster and cleaner way.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Frequently asked questions</h3>
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-950 dark:text-white">Can I download Facebook reels without an account?</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Yes. You can paste a public reel link and download it without logging into Facebook.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-950 dark:text-white">Will I see a preview before downloading?</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Yes. The tool shows a preview first so you can confirm the content before saving it to your device.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-950 dark:text-white">Can I choose different download quality?</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Yes. After the reel is detected, you can choose from available quality options to match your needs.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-950 dark:text-white">Is it suitable for phone users?</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Definitely. The layout is mobile-friendly, so it works well on phones, tablets, and computers.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
