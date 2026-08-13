import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-white/90 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-stone-950 via-emerald-950 to-teal-900 text-white font-bold">G</div>
                            <p className="font-bold text-slate-950 dark:text-white">globltools</p>
                        </div>
                        <p className="text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-400">A fast browser-based tool to download public Instagram reels, videos, photos, stories, and audio in a few simple steps.</p>
                    </div>

                    {/* Tools */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Tools</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/instagram-reel-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Instagram Reels Downloader</Link></li>
                            <li><Link href="/instagram-video-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Instagram Video Downloader</Link></li>
                            <li><Link href="/instagram-photo-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Instagram Photo Downloader</Link></li>
                            <li><Link href="/instagram-audio-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Instagram Audio Downloader</Link></li>
                            <li><Link href="/instagram-story-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Instagram Story Downloader</Link></li>
                            <li><Link href="/facebook-video-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Facebook Video Downloader</Link></li>
                            <li><Link href="/facebook-reel-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Facebook Reel Downloader</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Utilities</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/reel-cover-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Reel Cover</Link></li>
                            <li><Link href="/caption-hashtag-extractor" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Caption & Hashtags</Link></li>
                            <li><Link href="/instagram-link-checker" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Link Checker</Link></li>
                            <li><Link href="/video-quality-analyzer" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Quality Analyzer</Link></li>
                            <li><Link href="/carousel-zip-downloader" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Carousel ZIP</Link></li>
                            <li><Link href="/download-history" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Download History</Link></li>
                            <li><Link href="/install-app" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Install App</Link></li>
                            <li><Link href="/duplicate-media-finder" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition">Duplicate Finder</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Company</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Blog</Link></li>
                            <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">About Us</Link></li>
                            <li><Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Contact</Link></li>
                            <li><a href="/#faq" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Legal</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/privacy-policy" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Terms of Service</Link></li>
                            <li><Link href="/cookie-policy" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Cookie Policy</Link></li>
                            <li><Link href="/editorial-policy" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 rounded px-1">Editorial Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 sm:my-8 border-t border-slate-200 dark:border-slate-800"></div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <p>© 2026 Globltools — All Rights Reserved.</p>
                    <p>Designed for speed, clarity, and simple downloads.</p>
                </div>
            </div>
        </footer>
    );
}
