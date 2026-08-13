export interface KeywordFaq {
  question: string;
  answer: string;
}

export interface KeywordPage {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  featured?: boolean;
  index: number;
  intent: string;
  audience: string;
  angle: string;
  scenario: string;
  qualityNote: string;
  caution: string;
  howToSteps: string[];
  features: string[];
  faqs: KeywordFaq[];
  palette: {
    hero: string;
    accent: string;
    soft: string;
    ring: string;
  };
}

export function slugifyKeyword(keyword: string) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const primaryPalette = {
  hero: 'from-stone-950 via-emerald-950 to-teal-900',
  accent: 'text-emerald-700',
  soft: 'bg-emerald-50',
  ring: 'border-emerald-200',
};

const pageInputs = [
  ['Instagram reel downloader', 'people who want one dependable page for saving public reels', 'turning a copied reel URL into a clean MP4 without app clutter', 'You found a useful reel while researching a trend and want to keep it for offline viewing, caption notes, or later inspiration.', 'Reels are usually short, vertical, and compressed by Instagram, so the best result comes from using the original public URL instead of a screen recording.', 'Avoid downloading private reels, reposting another creator without permission, or using saved clips in a way that hides the original source.'],
  ['download Instagram reels', 'mobile users who search with a direct action phrase', 'a simple paste-and-save workflow for public reel links', 'A friend sends a reel in chat, you open it in Instagram, copy the share link, and want the video saved before it disappears in your feed.', 'The downloader focuses on the available reel file and keeps the file easy to play on Android, iPhone, Windows, and Mac.', 'Only use public reel URLs and keep creator credit when the saved video informs your own content.'],
  ['Instagram video downloader', 'visitors saving regular Instagram video posts', 'supporting feed videos where the post is not technically a reel', 'You are collecting examples from product demos, travel clips, or creator updates posted as videos on an Instagram profile.', 'Video posts can vary in size and format, so checking the preview before saving helps confirm that the correct media has been detected.', 'Respect copyright, brand ownership, and any usage limits that apply to the original video.'],
  ['save Instagram video', 'users who think in plain language rather than tool names', 'saving a public Instagram video from the browser in a few steps', 'You need a quick local copy for reference, lesson planning, or personal viewing and do not want to install a browser extension.', 'Saving from the public link gives a cleaner result than recording your screen because the audio and frame are not captured through another layer.', 'Do not use the saved file to impersonate the creator or remove important context from the original post.'],
  ['reel downloader online', 'people looking for a web-based reel saver', 'using an online tool instead of APKs or desktop software', 'You are on a shared computer or a locked-down work device and need a browser-only method that does not add software.', 'Online downloading is best when the URL is clean, public, and copied from the share menu rather than from a broken redirect.', 'Be careful with sites that ask for login credentials; globltool does not need your Instagram password for public links.'],
  ['Instagram reel download no watermark', 'creators and editors who need clean reference files', 'saving the public reel source without adding extra marks from the downloader', 'You want to study pacing, transitions, audio timing, or visual framing without a third-party watermark covering the video.', 'A no-watermark flow means globltool does not stamp its own branding on the file; it does not remove creator rights or platform context.', 'Keep attribution intact when discussing, reposting, or using the clip as a reference in your own work.'],
  ['download Instagram photos', 'people saving public photo posts and carousel images', 'preserving images without screenshots and rough cropping', 'You found a recipe image, infographic, outfit reference, or travel photo and want a clearer saved copy than a phone screenshot.', 'Photo quality depends on what Instagram exposes for that public post, but using the source image usually beats manual screenshots.', 'Do not download private photos or reuse images commercially without permission.'],
  ['Instagram downloader no login', 'privacy-conscious visitors avoiding account sign-in', 'downloading public media without sharing Instagram credentials', 'You want to save a public link but do not trust tools that ask you to connect your account or paste a password.', 'No-login access is ideal for public media because the downloader only needs the URL you choose to submit.', 'A no-login tool cannot access private accounts, close-friends stories, or restricted media.'],
  ['download reels HD', 'users who care most about visual clarity', 'keeping the best available reel quality from the public URL', 'You plan to view a reel on a larger screen or use it as a reference, so soft screenshots and compressed shares are not enough.', 'HD depends on the original upload and the formats Instagram makes available, so the downloader aims for the strongest accessible file.', 'Do not promise yourself impossible quality upgrades; a downloader can preserve available quality, not recreate missing pixels.'],
  ['Instagram reel saver', 'repeat visitors who want a reliable reel-saving shortcut', 'a stable page that explains safe reel saving before sending users home', 'You frequently bookmark useful reels and need a predictable flow that works from phone, tablet, or desktop.', 'A good saver keeps the action simple: copy link, paste it, preview, download, and store the file where you can find it.', 'Keep saved reels organized and do not treat someone else’s content as a free stock library.'],
  ['reel download without app', 'users avoiding app installs and risky APK files', 'browser-based reel downloads with no extension required', 'You have limited phone storage or do not want another app requesting permissions just to save one public reel.', 'Without-app downloading works especially well when your browser can handle file downloads and media previews normally.', 'Avoid APKs and extensions that request broad access to your device or social accounts.'],
  ['fast Instagram downloader', 'visitors who want speed and low friction', 'reducing steps between copied URL and saved file', 'You are saving several public posts during research and want each link processed quickly without repeated popups.', 'Fast processing depends on a valid public URL, network quality, and whether Instagram exposes the media cleanly.', 'Speed should not replace judgment; confirm the preview and respect the original creator.'],
  ['Instagram reel download 2026', 'searchers looking for a current reel workflow', 'modern browser downloading for today’s Instagram link patterns', 'You want a current method that still makes sense in 2026, with mobile sharing links and browser privacy expectations in mind.', 'The best 2026 workflow is still simple: use the public share URL, avoid login prompts, and download through a clean web page.', 'If Instagram changes a URL format, use a fresh share link from the app instead of an old copied redirect.'],
  ['Instagram video save tool', 'people comparing practical downloader tools', 'a focused explanation of what a save tool should do', 'You need a tool that handles public Instagram videos without confusing menus, heavy ads, or unnecessary setup.', 'A useful video save tool should show clear status, detect media reliably, and return a playable file format.', 'Do not save videos from accounts where permission, privacy, or legal use is unclear.'],
  ['online Instagram downloader', 'desktop and mobile users who prefer websites', 'an all-browser route for public Instagram media', 'You are switching between devices and want the same paste box and download process everywhere.', 'An online downloader should adapt to mobile and desktop screens without making the core action hard to find.', 'Public access is the boundary; the site should not ask for secret tokens or account access.'],
  ['reel downloader for mobile', 'phone-first users saving from the Instagram app', 'a mobile-friendly reel workflow with touch-safe steps', 'You are holding your phone, copying a reel link from the Instagram share sheet, and opening globltool in the same browser.', 'Mobile downloads can behave differently by browser, so watching for the download prompt or Files app location helps.', 'If your browser blocks a download, retry from the menu or use a standard mobile browser.'],
  ['Instagram reel to mp4', 'users who specifically need an MP4 video file', 'converting the public reel source into a familiar playback format', 'You want a file that opens easily in editors, presentations, cloud drives, and normal video players.', 'MP4 is widely supported, but the final file depends on the source Instagram media and available streams.', 'Do not rename files to hide where they came from when sharing them in public or professional contexts.'],
  ['Instagram story downloader', 'users saving public story items before they expire', 'helping visitors understand story timing and access limits', 'You noticed a public story with useful information and want to save it before the 24-hour window closes.', 'Stories can be images or short videos, and availability changes quickly, so fresh public links matter.', 'Private stories and restricted story audiences should be respected and cannot be bypassed.'],
  ['Instagram photo downloader', 'people who need clean images from posts', 'saving public Instagram photos without manual cropping', 'You want the image itself, not the browser chrome, caption area, or screenshot artifacts around it.', 'The downloader works best with a direct public post URL and can help preserve the available image dimensions.', 'Credit photographers, designers, and creators when their images influence your work.'],
  ['download Instagram post', 'users saving mixed media posts and carousels', 'understanding the difference between reels, videos, photos, and carousel posts', 'You have a post that may include multiple slides and want to save the right media item from it.', 'Carousel posts may include several images or clips, so previewing matters before choosing what to download.', 'Use saved posts for personal reference unless you have permission for broader reuse.'],
  ['Instagram video download free', 'people looking for a free browser tool', 'downloading public Instagram videos without hidden payment steps', 'You need one public video saved and do not want a subscription, trial wall, or forced app install.', 'A free flow should still be transparent about quality, privacy, and public-link limits.', 'Be wary of services that call themselves free but ask for account credentials or unrelated downloads.'],
  ['reel downloader website', 'searchers choosing a dedicated website', 'what a good reel downloader page should provide', 'You would rather use a stable website than install a tool that may stop working or collect extra data.', 'A website can stay lightweight while still offering previews, clear instructions, and direct internal navigation.', 'Bookmark the homepage for convenience, but keep using only public links.'],
  ['save Instagram reels online', 'users who want online reel saving from any device', 'saving reels in a browser session without setup', 'You are moving between phone and laptop and want the same online flow to handle copied reel URLs.', 'Online saving keeps the workflow portable because the important input is just the public Instagram link.', 'Do not upload or paste links that expose private material or violate someone’s expectations.'],
  ['best Instagram downloader', 'visitors comparing quality, speed, privacy, and clarity', 'explaining the standards that make a downloader worth using', 'You are deciding which downloader to trust and want signs of a clean, user-first experience.', 'The best tool for most people is the one that stays simple, gives a preview, avoids login, and supports common formats.', 'No downloader should encourage misuse of copyrighted, private, or sensitive media.'],
  ['free Instagram downloader', 'users who need no-cost access to public media saving', 'a free public-link download route with practical limits', 'You want to save a public post without paying for basic functionality or installing anything.', 'Free downloading should still be stable and respectful: no login required, no unnecessary permissions, and clear output.', 'Free does not mean unrestricted; creator rights and platform rules still matter.'],
  ['download IGTV video', 'users saving older long-form Instagram videos', 'handling long-form Instagram video links where available', 'You found an older IGTV-style video or long Instagram clip and want a local copy for later viewing.', 'Long videos can be larger and may take more time to process, especially on slower mobile networks.', 'Use long-form downloads responsibly, especially when the content contains interviews, courses, or copyrighted material.'],
  ['Instagram clip downloader', 'people saving short clips for reference', 'quick saving for short public Instagram media', 'You are collecting short examples of hooks, edits, or product shots and want each clip available offline.', 'Short clips are easier to preview, but they still depend on the correct public URL and available file quality.', 'Do not stitch other creators’ clips into your own content without permission.'],
  ['reel download quality', 'users trying to understand why quality changes', 'setting realistic expectations about reel quality and source files', 'You downloaded a reel once and it looked softer than expected, so you want to understand what affects quality.', 'Quality depends on upload resolution, Instagram compression, network delivery, and the media variant available to the tool.', 'Avoid tools that promise magical 4K upgrades for low-quality reels; preservation is different from enhancement.'],
  ['Instagram media downloader', 'users saving more than one Instagram media type', 'one broad page for reels, photos, videos, stories, and audio context', 'You do not know whether your link is a reel, video post, photo, or story, but you want a single starting point.', 'A media downloader should guide the user based on the URL and show the available output clearly.', 'Broad support still follows the public-link rule and cannot unlock restricted content.'],
  ['reel downloader without login', 'users who value privacy while saving reels', 'saving public reels without Instagram sign-in', 'You are on a browser where you are not logged into Instagram and still want to process a public reel URL.', 'Without-login downloading is safer for public links because the downloader does not handle your account session.', 'If a reel requires login to view because of privacy or age restrictions, do not try to bypass that limit.'],
  ['download Instagram audio', 'people extracting or saving sound from reel content', 'understanding audio-focused downloads from public reels', 'You heard a useful sound, quote, or music bed in a reel and want the audio for personal reference.', 'Audio availability depends on the reel source and may be delivered separately from the video in some cases.', 'Music and voice recordings can have rights attached, so do not reuse audio commercially without permission.'],
  ['video downloader for Instagram', 'general users looking for a video-first Instagram tool', 'a clear video download explanation with Instagram-specific limits', 'You want a video downloader made for Instagram links rather than a generic tool that guesses the platform.', 'Instagram video URLs have their own patterns, so platform-aware parsing improves the chance of a useful preview.', 'Avoid pasting links from unrelated sites into an Instagram-specific page.'],
  ['Instagram download page', 'visitors looking for the correct starting page', 'directing keyword traffic to the real homepage tool', 'You landed on a keyword page and need to know where the actual downloader action happens.', 'The homepage is the central download page, while this article explains the keyword and links you there clearly.', 'Do not mistake informational pages for login portals or official Instagram pages.'],
  ['Instagram downloader fast', 'users who prioritize quick response times', 'speed-focused downloading with clean input and preview checks', 'You want the downloader to respond quickly because you are saving several public links in one session.', 'Fast results come from clean links, stable connection, and a page that avoids unnecessary steps.', 'If a link fails, refresh the Instagram share URL instead of repeatedly submitting a broken copy.'],
  ['Instagram content downloader', 'users saving different kinds of public content', 'a broader content workflow for reels, posts, photos, and stories', 'You are building a personal archive of public content examples for study, not just saving one reel.', 'Different content types may produce different file names, previews, and download buttons.', 'Keep content organized and label it honestly so the original creator remains clear.'],
  ['reel download tool', 'people searching for a practical utility', 'what the tool does and how to use it safely', 'You want a utility page that gets straight to the point and explains how to download public reels.', 'A reel tool should keep the paste field obvious and return a standard video file when possible.', 'Do not use the tool to mass-copy creators or republish content without consent.'],
  ['Instagram reel save high quality', 'users who want the best available reel output', 'quality-conscious reel saving without unrealistic claims', 'You need a reel saved cleanly because the details, text overlays, or product visuals matter.', 'High quality means preserving the best accessible source, not upscaling a weak upload into a perfect file.', 'Check the preview and avoid downloading from reuploaded or heavily compressed copies when quality matters.'],
  ['download Instagram highlights', 'users saving public highlight stories', 'explaining highlight access, timing, and public visibility', 'You found a public profile highlight with useful story clips and want to keep a reference copy.', 'Highlights behave differently from live stories because they can remain on a profile, but access still depends on public visibility.', 'Do not attempt to save highlights from private profiles or restricted audiences.'],
  ['Instagram download apk', 'users tempted by Android app packages', 'explaining why a website is safer than random APK downloads', 'You searched for an APK because you thought a downloader must be installed, but a browser page can be enough.', 'A web downloader avoids device-level permissions and keeps the workflow inside your browser.', 'Avoid unknown APK files that can request storage, notification, or account access unrelated to downloading.'],
  ['Instagram downloader online free', 'people looking for a free online Instagram saver', 'combining no-cost access with browser-based safety', 'You want a free online tool that works from the browser and sends you to the real download box quickly.', 'The best online free flow is transparent: paste a public link, preview the result, and save the file without account access.', 'Do not ignore ownership rules just because the tool is free and easy to open.'],
] as const;

function makeHowToSteps(title: string, scenario: string) {
  return [
    `Open Instagram and copy the public link connected to "${title}". Use the share menu when possible because it usually gives the cleanest URL.`,
    'Go to the homepage through the Instagram Reels Downloader link and paste the URL into the main input box.',
    'Wait for globltool to read the public page and show a preview, file type, or download option that matches the media.',
    `Check that the preview matches your intended ${title.toLowerCase()} result, then press download and save the file to your device.`,
    `${scenario} After saving, rename the file in a way that helps you remember the source and purpose.`,
  ];
}

function makeFeatures(title: string, qualityNote: string) {
  return [
    `Dedicated guidance for "${title}" search intent`,
    'Homepage link with the exact Instagram Reels Downloader anchor text',
    'No Instagram login required for public URLs',
    'Works in modern mobile and desktop browsers',
    qualityNote,
    'FAQ, troubleshooting, safety notes, and practical use cases on one page',
  ];
}

function makeFaqs(title: string, audience: string, caution: string, qualityNote: string): KeywordFaq[] {
  return [
    {
      question: `How do I use this ${title} page?`,
      answer: `Read the quick guidance, then open the Instagram Reels Downloader link on the homepage. Paste a public Instagram URL, confirm the preview, and download the available file.`,
    },
    {
      question: 'Does this page download private Instagram content?',
      answer: 'No. globltool is built around public links only. Private accounts, restricted stories, and content that requires special access should remain private.',
    },
    {
      question: 'Why does the page link back to the homepage?',
      answer: `The homepage contains the main download input. This keyword page helps ${audience} understand the process before they start, while the homepage performs the actual download workflow.`,
    },
    {
      question: 'Will the download keep the best available quality?',
      answer: qualityNote,
    },
    {
      question: 'Is it safe to use without logging in?',
      answer: 'Yes, for public URLs. You do not need to provide Instagram credentials, and you should avoid any downloader that asks for your password to process a public link.',
    },
    {
      question: 'What should I remember after saving a file?',
      answer: caution,
    },
  ];
}

export const keywordPages: KeywordPage[] = pageInputs.map((item, index) => {
  const [title, audience, angle, scenario, qualityNote, caution] = item;
  const slug = slugifyKeyword(title);

  return {
    title,
    slug,
    index,
    intent: `This page is written for ${audience}.`,
    audience,
    angle,
    scenario,
    qualityNote,
    caution,
    description: `A premium SEO guide for ${title} with unique tips, features, FAQ, and a direct homepage link to Instagram Reels Downloader for public Instagram media downloads.`,
    keywords: [title, `download ${title}`, `${title} online`, `${title} free`, 'Instagram Reels Downloader'],
    featured: title === 'Instagram reel downloader',
    howToSteps: makeHowToSteps(title, scenario),
    features: makeFeatures(title, qualityNote),
    faqs: makeFaqs(title, audience, caution, qualityNote),
    palette: primaryPalette,
  };
});

export function getKeywordPageBySlug(slug: string) {
  return keywordPages.find((page) => page.slug === slug);
}
