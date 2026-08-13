'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { FiMenu, FiX, FiPlay, FiImage, FiMusic, FiBookOpen } from 'react-icons/fi';
import { MdSlideshow } from 'react-icons/md';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { label: 'Reel', href: '/instagram-reel-downloader', icon: <MdSlideshow className="w-5 h-5" /> },
  { label: 'Video', href: '/instagram-video-downloader', icon: <FiPlay className="w-5 h-5" /> },
  { label: 'Photo', href: '/instagram-photo-downloader', icon: <FiImage className="w-5 h-5" /> },
  { label: 'Audio', href: '/instagram-audio-downloader', icon: <FiMusic className="w-5 h-5" /> },
  { label: 'Story', href: '/instagram-story-downloader', icon: <MdSlideshow className="w-5 h-5" /> },
  { label: 'Blog', href: '/blog', icon: <FiBookOpen className="w-5 h-5" /> },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-emerald-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-lg"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-stone-950 via-emerald-950 to-teal-900 text-white shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/40">
                <span className="text-lg font-bold">G</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">globltools</p>
                <p className="text-xs font-normal text-slate-500 dark:text-slate-400">Instagram Downloader</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${pathname === link.href ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="ml-4 border-l border-slate-200 pl-4 dark:border-slate-700">
                <ThemeToggle />
              </div>
            </nav>

            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6 text-slate-900 dark:text-slate-100" />
                ) : (
                  <FiMenu className="w-6 h-6 text-slate-900 dark:text-slate-100" />
                )}
              </button>
            </div>
          </div>

          {isMounted && isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                onClick={closeMenu}
                style={{ top: '60px' }}
              />
              <nav id="mobile-navigation" className="fixed left-0 top-0 z-50 h-screen w-72 overflow-y-auto border-r border-slate-200 bg-white pt-20 shadow-2xl transition-transform dark:border-slate-800 dark:bg-slate-950" aria-label="Mobile navigation">
                <div className="space-y-1 px-4 pb-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all ${pathname === link.href ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'}`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <a
                      href="/#faq"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                    >
                      <FiBookOpen className="w-5 h-5" />
                      <span>FAQ</span>
                    </a>
                  </div>
                </div>
              </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
}
