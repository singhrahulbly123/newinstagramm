import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mx-auto max-w-full bg-white/90 px-8 py-10 text-slate-600 shadow-xl shadow-slate-200/80">
            <div className="max-w-4xl mx-auto">
                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <p className="font-semibold text-slate-950">Fastvideosave.net</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">A fast web tool to download Instagram reels, videos, photos, and audio in original quality.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-950">Tools</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>Reels Downloader</li>
                            <li>Video Downloader</li>
                            <li>Photo Downloader</li>
                            <li>Audio Downloader</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-950">Legal</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-950">Support</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>Contact Us</li>
                            <li><a href="/blog" className="transition hover:text-slate-950">Blog</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Fastvideosave.net — All Rights Reserved.</p>
                    <p>Designed for speed, premium UX, and clean performance.</p>
                </div>
            </div>
        </footer>
    );
}
