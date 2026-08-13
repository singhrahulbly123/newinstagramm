import Link from 'next/link';
import type { KeywordPage } from '../../lib/keywordPages';

const articleTopics = [
  'Search intent behind this page',
  'What makes the workflow premium',
  'How to download step by step',
  'Features that matter in real use',
  'Quality, file format, and preview checks',
  'Privacy, safety, and no-login access',
  'Responsible use after saving media',
  'Troubleshooting common download issues',
];

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

function makeIntro(page: KeywordPage) {
  return [
    `${page.title} is not just a random keyword page. It is a focused guide for visitors who arrive with one clear goal: understand the best way to save public Instagram media, avoid confusing tools, and move quickly to the real downloader. ${page.intent} The page explains the search phrase in plain language, shows how the workflow works, and links back to the homepage with the exact Instagram Reels Downloader anchor text so the next step is obvious.`,
    `The angle here is ${page.angle}. That matters because many Instagram download searches look similar, but the user need is not always the same. Someone searching for HD quality, no login, mobile use, no watermark, or a free online tool needs different guidance before they paste a link. This page keeps that guidance specific, human, and useful instead of repeating the same generic paragraph on every important link.`,
  ];
}

function makeArticleParagraphs(page: KeywordPage, topic: string, index: number) {
  const keyword = page.title;
  const practicalNouns = [
    'preview accuracy',
    'browser compatibility',
    'public URL handling',
    'file naming',
    'creator credit',
    'mobile download behavior',
    'clean navigation',
    'safe link processing',
  ];
  const noun = pick(practicalNouns, page.index + index);

  if (topic.includes('Search intent')) {
    return [
      `People searching for "${keyword}" usually do not want a long technical explanation before they can act. They want a page that confirms they are in the right place, explains what kind of Instagram link works, and gives them a clean route to the downloader. This page is built for ${page.audience}, so the wording focuses on the real job behind the search instead of stuffing the same sentence with repeated keywords.`,
      `${page.scenario} That situation is different from browsing a general help article. The visitor may be on a phone, copying a link from Instagram, or comparing tools on a desktop. A strong keyword page has to serve both reading and action. It should answer the intent, explain the boundaries, and then make the next click easy.`,
      `For SEO, the keyword appears naturally in the heading, body, FAQ, and internal link context. For humans, the page stays readable. The main phrase is used where it helps meaning, while related phrases such as public Instagram link, reel saver, online downloader, MP4 download, and no-login workflow support the topic without making the article feel artificial.`,
    ];
  }

  if (topic.includes('premium')) {
    return [
      `A premium downloader page should feel calm, direct, and trustworthy. It should not force users through a maze of popups or vague buttons. The page design separates the introduction, quick steps, features, safety notes, and FAQ so visitors can scan the article without losing the download path. The important link still has a real destination and real content, which is better for both visitors and search engines.`,
      `The experience also depends on ${noun}. When the page clearly describes what will happen after a URL is pasted, users make fewer mistakes and feel less pressure to try risky alternatives. Good design is not only color and spacing; it is the way the page lowers uncertainty. That is why the homepage link appears near the top, inside the guide, and again near the final call to action.`,
      `Every Important Links page uses a different visual rhythm, accent color, and content angle. Some pages highlight quality, some highlight mobile use, some explain no-login safety, and others clarify format or free online access. This keeps the section from becoming a collection of duplicate doorway pages and gives each keyword its own useful reason to exist.`,
    ];
  }

  if (topic.includes('step')) {
    return [
      `The download process starts with a public Instagram link. Open the reel, video, photo, story, audio, highlight, or post that matches your search, then use Instagram's share option to copy the URL. A clean share URL is easier for the downloader to understand than a copied address with missing characters, broken tracking, or a private session requirement.`,
      `Next, open the homepage through the ${keyword} guidance and choose the Instagram Reels Downloader link. Paste the URL into the input field, submit it, and wait while globltools checks the public media source. If a preview appears, compare it with the original post before saving. This small check prevents accidental downloads from the wrong slide, wrong reel, or stale copied link.`,
      `After the download button appears, save the file to a folder where you can find it later. For research, inspiration, or personal archiving, rename the file with a short description and date. A tidy habit saves time when you download several public posts in one session and helps you remember the context without reopening Instagram.`,
    ];
  }

  if (topic.includes('Features')) {
    return [
      `The strongest feature of this page is clarity. It explains the phrase "${keyword}" without pretending that every searcher has the same need. It also includes a direct homepage route, a no-login reminder, practical quality expectations, and FAQ answers that match the topic. Visitors can read the full article or jump straight to the downloader when they are ready.`,
      `Another useful feature is cross-device simplicity. The same process works whether the visitor is copying a link from the Instagram mobile app, opening a browser on a tablet, or saving a file from a desktop computer. The page avoids app-only assumptions and keeps the workflow centered on the public URL, because the link is the piece that makes the download possible.`,
      `The content also makes limits visible. globltools can process public links, but it is not a tool for bypassing private accounts or restricted audiences. Saying that clearly is part of a premium user experience. It prevents false expectations and keeps the site aligned with responsible downloader use.`,
    ];
  }

  if (topic.includes('Quality')) {
    return [
      `${page.qualityNote} This is why the preview stage matters. If the preview looks wrong, low quality, or unrelated to the post you intended, it is better to copy a fresh Instagram link and try again before saving a file you will not use.`,
      `For video-based searches, MP4 is usually the most convenient format because it plays in common video players and editing tools. For photo-based searches, the available image file is cleaner than a screenshot because it avoids browser controls, caption text, notification bars, and manual cropping. For audio-focused searches, the result depends on how the public reel exposes its sound source.`,
      `No honest downloader can create quality that was never present in the original upload. If a reel was uploaded in low resolution, heavily compressed, or copied from another source, the saved version may reflect those limits. The best approach is to use the original public post when possible and treat the downloader as a preservation tool, not a magic enhancer.`,
    ];
  }

  if (topic.includes('Privacy')) {
    return [
      `A no-login workflow is a major trust signal. For public Instagram media, the downloader should not need your Instagram username, password, two-factor code, or session cookie. You choose a public URL, paste it, and receive the available result. That is simpler and safer than installing unknown software or handing account access to a random service.`,
      `Privacy also means knowing what the tool cannot do. It cannot unlock private accounts, close-friends stories, restricted content, or anything that depends on a personal relationship inside Instagram. That boundary protects users and creators. If a link is not publicly accessible, the correct answer is not to bypass it.`,
      `When using ${keyword}, keep the URL limited to the media you actually want to process. Avoid pasting unrelated profile data, private notes, or screenshots. The cleanest workflow is also the most private one: copy the public media link, paste it into globltool, download the result, and close the page when finished.`,
    ];
  }

  if (topic.includes('Responsible')) {
    return [
      `${page.caution} Downloading can be helpful for personal reference, offline viewing, research, education, or creative planning, but the saved file still comes from someone else's post unless it is your own. A responsible user keeps that context in mind after the file is on their device.`,
      `If you plan to quote, repost, remix, or use the media in a public project, ask whether you have permission and whether credit is required. Public visibility on Instagram is not the same thing as unlimited reuse. This is especially important for branded videos, music, photography, tutorial clips, interviews, and creator-led educational content.`,
      `For personal organization, add a note with the creator name, original caption idea, or reason you saved the file. That practice is useful for researchers, social media managers, students, and creators because it prevents saved media from becoming a folder of disconnected files with unclear ownership.`,
    ];
  }

  return [
    `If the downloader does not return a result, start by checking the URL. Many failed attempts come from incomplete links, private posts, expired stories, region-limited content, or URLs copied from a preview screen instead of the actual Instagram share option. Copy the link again from the original post and try the homepage input once more.`,
    `Browser behavior can also affect downloads. On mobile, the file may open in a new tab, appear in the browser downloads area, or move into the Files app depending on the device. On desktop, a popup blocker, strict privacy setting, or slow network can interrupt the final save. Refreshing the page and using a clean public link solves many ordinary issues.`,
    `When quality or format looks unexpected, compare it with the original Instagram post. If the source itself is compressed, old, or a reupload, the downloaded file will reflect that. For the best result, use the most direct public post link available and avoid links forwarded through messaging apps when a fresh Instagram share link is available.`,
  ];
}

function layoutClasses(index: number) {
  const layouts = [
    'lg:grid-cols-[1.15fr_0.85fr]',
    'lg:grid-cols-[0.9fr_1.1fr]',
    'lg:grid-cols-[1.3fr_0.7fr]',
    'lg:grid-cols-[0.75fr_1.25fr]',
  ];

  return pick(layouts, index);
}

export function KeywordContentPage({ page }: { page: KeywordPage }) {
  const heroShape = page.index % 3 === 0 ? 'rounded-b-[3rem]' : page.index % 3 === 1 ? 'rounded-b-[1.5rem]' : 'rounded-b-[4rem]';
  const flipHero = page.index % 2 === 1;
  const normalizedTitle = page.title.toLowerCase();
  const primaryTool = normalizedTitle.includes('story') || normalizedTitle.includes('highlight')
    ? { href: '/instagram-story-downloader', label: 'Instagram Story Downloader' }
    : normalizedTitle.includes('photo')
      ? { href: '/instagram-photo-downloader', label: 'Instagram Photo Downloader' }
      : normalizedTitle.includes('audio')
        ? { href: '/instagram-audio-downloader', label: 'Instagram Audio Downloader' }
        : normalizedTitle.includes('video') || normalizedTitle.includes('igtv')
          ? { href: '/instagram-video-downloader', label: 'Instagram Video Downloader' }
          : { href: '/instagram-reel-downloader', label: 'Instagram Reel Downloader' };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className={`bg-gradient-to-br ${page.palette.hero} ${heroShape} text-white`}>
        <div className={`mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ${layoutClasses(page.index)}`}>
          <div className={flipHero ? 'lg:order-2' : ''}>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">Instagram Media Guide</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/78">{page.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryTool.href}
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {primaryTool.label}
              </Link>
              <a
                href="#how-to-download"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                How to download
              </a>
            </div>
          </div>

          <aside className={`${flipHero ? 'lg:order-1' : ''} border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur`}>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/65">Page focus</p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-3xl font-black">#{String(page.index + 1).padStart(2, '0')}</p>
                <p className="mt-2 text-sm leading-7 text-white/75">Focused guidance for {page.title.toLowerCase()}</p>
              </div>
              <div className="h-px bg-white/20" />
              <p className="text-lg font-bold leading-8">{page.angle}</p>
              <p className="text-sm leading-7 text-white/72">{page.intent}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-max border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className={`text-sm font-black uppercase tracking-[0.18em] ${page.palette.accent}`}>On this page</p>
            <nav className="mt-4 grid gap-2 text-sm">
              <a href="#overview" className="px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">Overview</a>
              <a href="#features" className="px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">Features</a>
              <a href="#how-to-download" className="px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">How to download</a>
              {articleTopics.map((topic) => (
                <a
                  key={topic}
                  href={`#${sectionId(topic)}`}
                  className="px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {topic}
                </a>
              ))}
              <a href="#faq" className="px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">FAQ</a>
            </nav>
          </aside>

          <article className="space-y-8">
            <section id="overview" className={`border ${page.palette.ring} bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8`}>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">A unique guide for {page.title}</h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                {makeIntro(page).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="features" className={`${page.palette.soft} border ${page.palette.ring} p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8`}>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">What this guide covers</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {page.features.map((feature, index) => (
                  <div key={feature} className="border border-white/80 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <p className={`text-xs font-black uppercase tracking-[0.18em] ${page.palette.accent}`}>Feature {index + 1}</p>
                    <p className="mt-3 text-sm font-bold leading-7 text-slate-800 dark:text-slate-200">{feature}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="how-to-download" className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">How to download with globltool</h2>
              <div className="mt-6 grid gap-4">
                {page.howToSteps.map((step, index) => (
                  <div key={step} className="grid gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[4rem_1fr] dark:border-slate-800">
                    <span className={`text-3xl font-black ${page.palette.accent}`}>{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {articleTopics.map((topic, index) => (
              <section
                key={topic}
                id={sectionId(topic)}
                className={`border p-6 shadow-sm dark:border-slate-800 sm:p-8 ${
                  index % 2 === 0 ? 'border-slate-200 bg-white dark:bg-slate-900' : `${page.palette.ring} ${page.palette.soft} dark:bg-slate-900`
                }`}
              >
                <p className={`text-xs font-black uppercase tracking-[0.2em] ${page.palette.accent}`}>Guide section {index + 1}</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{topic}</h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  {makeArticleParagraphs(page, topic, index).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="faq" className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
                {page.faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">{faq.question}</h3>
                    <p className="mt-3 text-base leading-8 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`bg-gradient-to-br ${page.palette.hero} p-6 text-white shadow-xl shadow-slate-300/30 dark:shadow-black/30 sm:p-8`}>
              <h2 className="text-3xl font-black tracking-tight">Continue with the matching Instagram tool</h2>
              <p className="mt-4 text-base leading-8 text-white/78">
                This guide explains {page.title} in context. When you are ready, open the{' '}
                <Link href={primaryTool.href} className="font-black text-white underline decoration-white/50 underline-offset-4">
                  {primaryTool.label}
                </Link>
                , paste a public Instagram link, preview the result, and save the available file.
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
