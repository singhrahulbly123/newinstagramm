'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

type FacebookExtractionResponse = {
  success: boolean;
  title?: string;
  thumbnail?: string;
  description?: string;
  qualities?: Array<{
    label: string;
    url: string;
  }>;
  error?: string;
  debug?: string[];
};

export default function FacebookReelDownloaderPage() {
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
  // Use a server-side proxy for safe downloads and DO NOT strip query params
  // Include a filename parameter so Content-Disposition can use it
  const filename = `facebook-video-${selectedQuality}.mp4`;
  const downloadUrl = selectedQualityUrl
    ? `/api/facebook-download?url=${encodeURIComponent(selectedQualityUrl)}&filename=${encodeURIComponent(filename)}`
    : undefined;

  // Helpful debug logs for client-side troubleshooting
  console.log('Selected quality label:', selectedQuality);
  console.log('Selected quality URL:', selectedQualityUrl);
  console.log('Generated download URL:', downloadUrl);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Section */}
          <section className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-100 dark:bg-blue-900/30 dark:text-blue-300 sm:gap-3 sm:px-5 sm:text-sm">
              🎬 Facebook Video Downloader · No Login · Mobile Friendly
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              Facebook{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Reel & Video Downloader
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8 md:text-lg">
              Download Facebook Reels and videos instantly in high quality. Paste a link, select your preferred quality, and download directly to your device. Works with Reels, Videos, and fb.watch links.
            </p>
          </section>

          {/* Main Content Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-slate-900/50 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
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
                    className="inline-flex h-12 w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-blue-600 to-cyan-500 px-8 text-sm font-semibold text-white shadow-lg shadow-cyan-300/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

              {/* Status Message */}
              {status && (
                <div className={`rounded-lg px-4 py-3 text-sm ${
                  result?.success
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                }`}>
                  {status}
                </div>
              )}
            </form>

            {/* Success Result */}
            {result?.success && result.qualities && result.qualities.length > 0 ? (
              <div className="mt-8 space-y-6 border-t border-slate-200 pt-8 dark:border-slate-700">
                {/* Video Preview Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Video Preview */}
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
                              onLoadedMetadata={(e) => {
                                const v = e.currentTarget as HTMLVideoElement;
                                console.log('video metadata:', v.videoWidth, v.videoHeight);
                              }}
                            />
                          ) : result.thumbnail ? (
                            <img
                              src={result.thumbnail}
                              alt={result.title || 'Video thumbnail'}
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

                  {/* Details Panel */}
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

                    {/* Quality Selection */}
                    {result.qualities.length > 1 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Quality
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {result.qualities.map((quality) => (
                            <button
                              key={quality.label}
                              onClick={() => {
                                console.log('Selected quality:', quality);
                                console.log('Video URL:', quality?.url);
                                setSelectedQuality(quality.label);
                              }}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                selectedQuality === quality.label
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-300/30'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                              }`}
                            >
                              {quality.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Button */}
                    <a
                      href={downloadUrl || '#'}
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-300/30 transition hover:opacity-95 disabled:opacity-60"
                      onClick={() => console.log('Download link clicked, url:', downloadUrl)}
                    >
                      <span>⬇️</span>
                      Download {selectedQuality}
                    </a>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 p-4 dark:from-blue-900/20 dark:to-slate-900/20">
                    <p className="font-semibold text-slate-900 dark:text-white">Supported URLs</p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <li>• facebook.com/reel/*</li>
                      <li>• facebook.com/video/*</li>
                      <li>• fb.watch/*</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-slate-100 p-4 dark:from-cyan-900/20 dark:to-slate-900/20">
                    <p className="font-semibold text-slate-900 dark:text-white">Quality Options</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      Download in HD or SD quality depending on availability.
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-teal-50 to-slate-100 p-4 dark:from-teal-900/20 dark:to-slate-900/20">
                    <p className="font-semibold text-slate-900 dark:text-white">Fast & Safe</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      No login required. Works on all devices.
                    </p>
                  </div>
                </div>

             
              </div>
            ) : null}
          </section>

          {/* FAQ Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-950 dark:text-white">What URLs are supported?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  We support Facebook Reels (facebook.com/reel/), Videos (facebook.com/video/), and shortened fb.watch links.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-950 dark:text-white">Do I need to log in?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  No login required. Just paste a public video link and click download.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-950 dark:text-white">What quality options are available?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  HD and SD quality options are available when supported by the original video.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-950 dark:text-white">Is this mobile friendly?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Yes! Our downloader works seamlessly on phones, tablets, and desktop browsers.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Facebook Reel & Video Downloader',
            description: 'Download Facebook Reels and videos in HD quality without watermark',
            applicationCategory: 'UtilityApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </main>
  );
}
