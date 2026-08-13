import Link from 'next/link';
import type { FooterPage } from '../../lib/footerPages';
import { buildSectionParagraphs, makeFooterPageSchema } from '../../lib/footerPages';
import { StructuredData } from './StructuredData';

type FooterContentPageProps = {
  page: FooterPage;
};

function sectionId(section: string) {
  return section.toLowerCase().replace(/\s+/g, '-');
}

export function FooterContentPage({ page }: FooterContentPageProps) {
  const schema = makeFooterPageSchema(page);

  return (
    <main id="main-content" className="min-h-screen bg-soft text-slate-900 dark:bg-slate-950 dark:text-white">
      <StructuredData data={schema} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.45fr_0.75fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">{page.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{page.promise}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-100"
              >
                Instagram Reels Downloader
              </Link>
              <Link
                href="/instagram-video-downloader"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Instagram Video Downloader
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Page Summary</p>
            <p className="mt-3 text-xl font-black text-slate-950 dark:text-white">{page.accent}</p>
            <div className="mt-6 grid gap-3">
              {page.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="h-max rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-black text-slate-950 dark:text-white">Quick navigation</p>
            <nav className="mt-4 grid gap-2 text-sm">
              {page.sections.slice(0, 10).map((section) => (
                <a
                  key={section}
                  href={`#${sectionId(section)}`}
                  className="rounded-lg px-3 py-2 font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                >
                  {section}
                </a>
              ))}
            </nav>
          </aside>

          <article className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Why this page matters</h2>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                {page.description} This page is intentionally detailed because footer pages should not be empty placeholders. They should answer real questions, build trust, and give visitors a natural path back to the main downloader. If your goal is to save a public reel right now, use the{' '}
                <Link href="/" className="font-bold text-emerald-800 underline decoration-emerald-300 underline-offset-4 dark:text-emerald-300">
                  Instagram Reels Downloader
                </Link>{' '}
                on the homepage and paste the public Instagram URL.
              </p>
            </section>

            {page.sections.map((section, index) => (
              <section
                key={section}
                id={sectionId(section)}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{section}</h2>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
                      {buildSectionParagraphs(page, section, index).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-slate-700 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight">Start from the homepage</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Every footer page is connected back to the main download experience. Read the policy or guidance you need, then return to the homepage when you are ready to paste a public Instagram URL. The fastest route is the{' '}
                <Link href="/" className="font-black text-emerald-200 underline decoration-emerald-400 underline-offset-4">
                  Instagram Reels Downloader
                </Link>
                , which keeps the primary action clear and easy to find.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4">
                {page.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
