import { StructuredData } from './StructuredData';
import { makeFAQSchema, makeHowToSchema } from '../../lib/schemas';

type ToolKey = 'cover' | 'caption' | 'link' | 'quality' | 'carousel' | 'duplicates' | 'install';
type Content = { title: string; intro: string; steps: [string, string][]; facts: [string, string][]; limits: string[]; faqs: [string, string][] };

const content: Record<ToolKey, Content> = {
  cover: {
    title: 'How the Reel cover downloader works',
    intro: 'This utility reads the public metadata available for the exact Reel URL you submit and returns the associated cover image when Instagram exposes one. It does not create, upscale, or modify the image.',
    steps: [['Copy the Reel link', 'Open the public Reel, use Share, and copy its full instagram.com/reel/ URL.'], ['Check the cover', 'Paste the link and wait while the tool validates the URL and looks for public cover metadata.'], ['Review and save', 'Inspect the returned image, then download it only if you have the right to keep or reuse it.']],
    facts: [['What you receive', 'The cover file made available with the public Reel—not a frame guessed from the video.'], ['Privacy approach', 'No Instagram login is requested. Submitted URLs are processed only to provide the requested result.'], ['Accuracy policy', 'If a cover cannot be confirmed, the tool reports failure instead of inventing a result.']],
    limits: ['Private, deleted, login-only, age-restricted, or region-restricted Reels may not work.', 'The available cover resolution depends on the source metadata.', 'Downloading media does not transfer copyright or reuse permission.'],
    faqs: [['Can it download a private Reel cover?', 'No. The tool is designed for metadata available without signing in.'], ['Does the tool improve the cover quality?', 'No. It returns an available source image and does not claim to upscale it.'], ['Do I need an Instagram account?', 'No Instagram credentials are requested.']],
  },
  caption: {
    title: 'Extract captions without mixing the results',
    intro: 'The extractor separates the text and unique hashtags found in public post metadata. It is useful for reviewing your own copy, research, and permitted reuse; it does not generate a new caption.',
    steps: [['Paste a public post or Reel URL', 'Use the complete link copied from Instagram.'], ['Extract available text', 'The tool checks public metadata and separates caption text from hashtag tokens.'], ['Copy the section you need', 'Copy the full caption, cleaned text, or hashtag list independently.']],
    facts: [['Hashtag handling', 'Repeated hashtags are de-duplicated for a cleaner list.'], ['Source transparency', 'Results come from text exposed for the submitted public URL.'], ['Responsible use', 'Creator attribution and permission remain your responsibility.']],
    limits: ['Edited, hidden, truncated, or unavailable captions cannot be reconstructed.', 'Private and login-only posts are not supported.', 'Hashtags are extracted, not ranked or recommended.'],
    faqs: [['Does it generate hashtags?', 'No. It only separates hashtags already present in available caption text.'], ['Why is a caption missing?', 'The post may be private, restricted, deleted, or not exposing caption metadata.'], ['Can I reuse the extracted caption?', 'Only when you own it or have permission; extraction does not grant usage rights.']],
  },
  link: {
    title: 'Understand what the link check can confirm',
    intro: 'The checker first validates Instagram URL structure, identifies the supported content type, and then tests whether public metadata responds. It deliberately avoids claiming a precise reason when Instagram does not disclose one.',
    steps: [['Paste the complete URL', 'Submit an Instagram Reel, post, video, or Story link.'], ['Validate and test', 'The tool checks the hostname, path format, content type, and public response.'], ['Read the diagnostic', 'Use the result and stated uncertainty to correct the link or check access in Instagram.']],
    facts: [['Format check', 'Detects malformed domains and unsupported paths before making an availability check.'], ['Public availability', 'Tests what is available to a logged-out request at that moment.'], ['Honest diagnosis', 'Does not label content private or deleted unless that state can be established.']],
    limits: ['A failed public response can have several causes, including privacy or regional restrictions.', 'Availability can change after a check.', 'A valid URL format does not guarantee downloadable media.'],
    faqs: [['Can it prove that a post is private?', 'Not always. Instagram may return similar responses for private, removed, restricted, or temporary failures.'], ['Does it open or follow shortened links?', 'Use the final full instagram.com URL for the clearest result.'], ['Does a valid result guarantee downloading?', 'No. It confirms the current check only; media availability can differ.']],
  },
  quality: {
    title: 'Read technical video metadata accurately',
    intro: 'The analyzer inspects the available video file with a media probe and reports fields such as dimensions, duration, frame rate, bitrate, codec, container, and reported size. Missing fields remain clearly marked rather than estimated.',
    steps: [['Submit a supported public video URL', 'Paste a Reel or video link that exposes a media file.'], ['Run the media inspection', 'The server reads technical headers and stream metadata without changing the source.'], ['Interpret the report', 'Compare resolution, FPS, bitrate, codec, duration, orientation, and size together.']],
    facts: [['Resolution', 'Pixel dimensions describe the encoded frame and do not by themselves measure visual quality.'], ['FPS and bitrate', 'These values help explain motion and compression but should be interpreted with codec and resolution.'], ['Reported values', 'The report reflects the available file at check time, not the original creator upload.']],
    limits: ['Instagram may transcode uploads, so analyzed metadata can differ from the original file.', 'Some containers omit bitrate or file-size headers.', 'The analyzer does not assign an invented quality score.'],
    faqs: [['Is higher resolution always better?', 'No. Codec, bitrate, source detail, and compression also affect visible quality.'], ['Why does a field say Not reported?', 'That value was not reliably present in the available headers or media metadata.'], ['Does analysis modify the video?', 'No. It reads metadata and does not re-encode the submitted media.']],
  },
  carousel: {
    title: 'Download supported carousel items together',
    intro: 'The carousel utility discovers photos and videos exposed for one public carousel post, presents them for review, and packages the fetched items into a ZIP with safe sequential filenames.',
    steps: [['Paste a carousel post URL', 'Use the full instagram.com/p/ link for the public multi-item post.'], ['Preview detected items', 'Check the number and type of media files found before processing.'], ['Create the ZIP', 'The tool fetches the available items and creates one downloadable archive.']],
    facts: [['Review before download', 'The preview lets you verify detected items before the ZIP request.'], ['Archive contents', 'Only successfully fetched media from the submitted carousel is packaged.'], ['Safer filenames', 'Sequential filenames avoid using untrusted remote names.']],
    limits: ['ZIP creation is limited to 80 MB to control processing time and memory.', 'Private, deleted, restricted, or unusually structured posts may be unavailable.', 'A partial upstream failure can prevent a complete archive.'],
    faqs: [['Does it work for a single-image post?', 'This page is intended for carousel posts; use the photo downloader for single images.'], ['Why is an item missing?', 'Instagram may not expose that item or its fetch may have failed. Review the preview before downloading.'], ['Are ZIP files stored permanently?', 'The archive is generated for the request and is not presented as permanent cloud storage.']],
  },
  duplicates: {
    title: 'Find exact duplicate media privately',
    intro: 'Files are compared by calculating a SHA-256 fingerprint from their actual bytes inside your browser. Matching fingerprints identify exact copies even when filenames differ.',
    steps: [['Select two or more files', 'Choose photos, videos, or audio files from your device.'], ['Compare locally', 'Your browser reads each file and calculates its SHA-256 fingerprint.'], ['Review duplicate groups', 'Files with identical fingerprints are grouped; deletion remains entirely under your control.']],
    facts: [['Local processing', 'Selected files and their fingerprints are not uploaded by this tool.'], ['Exact-match method', 'The comparison finds byte-for-byte duplicates, not merely visually similar media.'], ['No automatic deletion', 'The tool reports matches but never removes or changes your files.']],
    limits: ['Re-encoded or edited copies will not match even when they look similar.', 'Very large files can take longer and use more device memory.', 'A matching filename alone is not treated as proof of duplication.'],
    faqs: [['Are my files uploaded?', 'No. Hash calculation and grouping happen in your browser.'], ['Can it find similar-looking photos?', 'No. It currently finds exact byte-for-byte duplicates only.'], ['Will it delete duplicate files?', 'No. It only identifies groups for you to review.']],
  },
  install: {
    title: 'What installing the globltools web app does',
    intro: 'Installation adds globltools to your home screen or app launcher and opens it in a standalone window. It does not install a native app package or make online media processing work without an internet connection.',
    steps: [['Open the install page in a supported browser', 'Chrome, Edge, and mobile browsers expose installation in different places.'], ['Choose Install or Add to Home Screen', 'Use the on-page prompt when available or your browser menu.'], ['Launch from your device', 'Open GloblTools from its new icon and use online tools as usual.']],
    facts: [['Lightweight installation', 'The browser manages the app shell, icon, and launch experience.'], ['Offline fallback', 'A basic offline notice can load, while tools that fetch or process online media still need connectivity.'], ['Easy removal', 'Uninstall it through your browser or operating system app settings.']],
    limits: ['Install prompts depend on browser and device support.', 'Instagram link processing requires an internet connection.', 'The web app does not request background access to your media library.'],
    faqs: [['Is this a native Android or iPhone app?', 'No. It is an installable progressive web app managed by your browser.'], ['Do downloads work offline?', 'No. Online media fetching and server processing require connectivity.'], ['Why is the install button unavailable?', 'Your browser may already have the app installed or may require Add to Home Screen from its menu.']],
  },
};

export default function ToolSeoContent({ tool }: { tool: ToolKey }) {
  const item = content[tool];
  return <div className="mt-4 space-y-6">
    <StructuredData data={makeHowToSchema({ name: item.title, description: item.intro, steps: item.steps.map(([name, text]) => ({ name, text })) })} />
    <StructuredData data={makeFAQSchema(item.faqs.map(([question, answer]) => ({ question, answer })))} />
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Practical guide</p><h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{item.title}</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">{item.intro}</p><div className="mt-7 grid gap-4 md:grid-cols-3">{item.steps.map(([title, body], index) => <article key={title} className="rounded-2xl bg-slate-50 p-5"><span className="text-xs font-black text-emerald-700">STEP {index + 1}</span><h3 className="mt-2 font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}</div></section>
    <section className="grid gap-4 md:grid-cols-3">{item.facts.map(([title, body]) => <article key={title} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"><h2 className="font-black text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}</section>
    <section className="grid gap-6 rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8 md:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Transparent limitations</p><h2 className="mt-3 text-2xl font-black">What this tool cannot guarantee</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{item.limits.map((text) => <li key={text}>• {text}</li>)}</ul></div><div className="rounded-2xl bg-white/10 p-5"><h2 className="font-black">Reviewed information</h2><p className="mt-3 text-sm leading-6 text-slate-300">This page describes the current tool behavior and avoids guaranteed results. Last reviewed: 5 August 2026. For corrections, use the Contact page; our methodology and publishing standards are available in the Editorial Policy.</p></div></section>
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-black text-slate-950">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{item.faqs.map(([question, answer]) => <details key={question} className="py-4"><summary className="cursor-pointer font-bold text-slate-950">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></section>
  </div>;
}
