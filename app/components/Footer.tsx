import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-white/90 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 text-white font-bold">F</div>
                            <p className="font-bold text-slate-950 dark:text-white">FastVideoSave</p>
                        </div>
                        <p className="text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-400">A fast web tool to download Instagram reels, videos, photos, and audio in original quality without watermark.</p>
                    </div>

                    {/* Tools */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Tools</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/instagram-reel-downloader" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Reels Downloader</Link></li>
                            <li><Link href="/instagram-video-downloader" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Video Downloader</Link></li>
                            <li><Link href="/instagram-photo-downloader" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Photo Downloader</Link></li>
                            <li><Link href="/instagram-audio-downloader" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Audio Downloader</Link></li>
                            <li><Link href="/instagram-story-downloader" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Story Downloader</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Company</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Blog</Link></li>
                            <li><a href="#faq" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">FAQ</a></li>
                            <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">About Us</Link></li>
                            <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-4">Legal</p>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Privacy Policy</Link></li>
                            <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Terms of Service</Link></li>
                            <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 sm:my-8 border-t border-slate-200 dark:border-slate-800"></div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <p>© 2026 Fastvideosave.net — All Rights Reserved.</p>
                    <p>Designed for speed, premium UX & clean performance.</p>
                </div>
            </div>
        </footer>
    );
}
