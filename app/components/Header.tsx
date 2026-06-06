'use client';

import Link from 'next/link';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-200/40 dark:shadow-violet-900/40">
              <span className="text-lg font-bold">F</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">FastVideoSave</p>
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400">Instagram Downloader</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-400"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
            <div className="ml-4 border-l border-slate-200 pl-4 dark:border-slate-700">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-slate-900 dark:text-slate-100" />
              ) : (
                <FiMenu className="w-6 h-6 text-slate-900 dark:text-slate-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {isMounted && isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/50 transition-opacity"
              onClick={closeMenu}
              style={{ top: '60px' }}
            />

            {/* Mobile Menu Sidebar */}
            <nav className="fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto border-r border-slate-200 bg-white pt-20 shadow-xl transition-transform dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-1 px-4 pb-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600 active:bg-violet-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-400 dark:active:bg-slate-700"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <a
                    href="/#faq"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-400"
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
  );
}
