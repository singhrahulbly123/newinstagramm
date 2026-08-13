import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | globltools',
  description: 'How globltools processes submitted public links, temporary media files, technical logs, analytics events, and browser preferences.',
  alternates: { canonical: 'https://globltools.com/privacy-policy' },
};

const sections = [
  {
    title: 'Information you submit',
    body: 'When you use a downloader, the public URL you paste is sent to our server so the requested media can be located and prepared. Do not submit private links, passwords, account credentials, or personal information. globltools does not ask you to sign in to Instagram.',
  },
  {
    title: 'Temporary processing and caching',
    body: 'Media metadata and generated files may be held temporarily in memory, local processing storage, or a configured cache to complete the request and improve repeat-request reliability. Retention can vary by file type and infrastructure configuration. These temporary files are operational data, not a personal media library.',
  },
  {
    title: 'Technical and security logs',
    body: 'Our hosting provider and application may record standard request information such as time, requested route, response status, IP address, user agent, and diagnostic errors. Submitted URLs may appear in operational diagnostics when needed to investigate a failed request. Logs are used for reliability, abuse prevention, and security.',
  },
  {
    title: 'Analytics',
    body: 'When analytics is enabled, globltools records product events such as downloader submitted, ready, failed, or download clicked. The analytics events implemented by the site do not include the Instagram URL you pasted. Analytics providers may still receive standard device, browser, approximate-location, and network information under their own policies.',
  },
  {
    title: 'Cookies and local preferences',
    body: 'The site may use browser storage for interface preferences such as theme and may use cookies when analytics is configured. You can clear or block browser storage in your browser settings. The downloader does not use cookies to store Instagram passwords because it never requests those credentials.',
  },
  {
    title: 'Third-party services',
    body: 'A download request can involve Instagram-hosted pages or media, hosting and CDN providers, cache infrastructure, and optional analytics services. Their processing is governed by their respective policies. globltools is independent and is not endorsed by Instagram or Meta.',
  },
  {
    title: 'Your choices and contact',
    body: 'You may use the informational pages without submitting a media URL, block optional analytics through browser controls, and avoid the service if you do not want a public link processed. For a privacy question or deletion request concerning identifiable support information, use the contact page and provide enough detail to locate the relevant record.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">Privacy policy</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">How globltools handles downloader data</h1>
        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Effective and last reviewed: August 5, 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
          This policy describes the data involved when you browse globltools or ask it to process a supported public media link. It does not promise that no technical data is ever processed; it explains the limited processing needed to operate and protect the service.
        </p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-slate-200">
          Use only public media you own or have permission to save. For privacy questions, visit the{' '}
          <Link href="/contact" className="font-bold text-emerald-800 underline dark:text-emerald-300">contact page</Link>.
        </div>
      </article>
    </main>
  );
}
