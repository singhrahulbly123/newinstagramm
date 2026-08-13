# GloblTools — Remaining Tools Roadmap

यह roadmap केवल बाकी छह features के लिए है। किसी feature को **Complete** तभी माना जाएगा जब उसका UI, functionality, validation, privacy handling, responsive design और production build pass हो जाए।

## Build order

| चरण | Feature | कठिनाई | अनुमानित कार्य | स्थिति |
|---|---|---:|---|---|
| 1 | Hindi/Hinglish Interface | मध्यम | UI language system और मुख्य pages का translation | Planned |
| 2 | Reel to GIF Converter | मध्यम | Video upload, clip selection और GIF export | Planned |
| 3 | Audio/Video Trimmer | मध्यम | Start/end selection और trimmed file export | Planned |
| 4 | Aspect Ratio Resizer | मध्यम–बड़ा | 9:16, 1:1 और 16:9 presets, crop/pad preview | Planned |
| 5 | Video Compressor | बड़ा | Compression levels, size comparison और export | Planned |
| 6 | Automatic Subtitle/SRT Generator | सबसे बड़ा | Speech-to-text integration, subtitle editor और SRT export | Planned |

## चरण 1 — Hindi/Hinglish Interface

### Scope

- Header में English/Hindi language switcher।
- Homepage और मुख्य downloader pages के जरूरी UI labels का Hindi translation।
- नई utility pages के instructions, errors और buttons का translation।
- चुनी गई भाषा browser में locally याद रखना।
- Hindi pages के लिए सही `lang`, canonical और `hreflang` व्यवस्था।
- Brand name, URLs और technical formats को अनावश्यक रूप से translate नहीं करना।

### Completion criteria

- Mobile और desktop पर language switcher ठीक चले।
- Page reload के बाद selected language बनी रहे।
- Hindi text readable हो और mojibake/टूटे Unicode characters न हों।
- English और Hindi pages duplicate SEO pages न बनें।
- Accessibility labels दोनों languages में सही हों।

## चरण 2 — Reel to GIF Converter

### Scope

- Device से MP4/WebM video upload।
- Start time और duration selection।
- Output width और FPS के safe presets।
- Conversion से पहले clip preview।
- Generated GIF का preview, file size और download button।
- File-size तथा duration limits स्पष्ट दिखाना।

### Completion criteria

- Valid video से playable GIF बने।
- Invalid/oversized file पर स्पष्ट error मिले।
- Temporary files conversion के बाद delete हों।
- Output filename सुरक्षित और predictable हो।
- Mobile UI usable रहे।

## चरण 3 — Audio/Video Trimmer

### Scope

- Audio और video file upload।
- Media duration detect करना।
- Start/end inputs और selected duration दिखाना।
- Trimmed output का preview तथा download।
- Supported formats और maximum file size बताना।

### Completion criteria

- Start time हमेशा end time से कम हो।
- Input duration से बाहर values reject हों।
- Audio/video type के अनुसार सही output मिले।
- Failed processing पर temporary files साफ हों।
- Original file कभी overwrite न हो।

## चरण 4 — Aspect Ratio Resizer

### Scope

- Video upload और source dimensions detect करना।
- Presets: Reel/Story `9:16`, Square Post `1:1`, YouTube `16:9`।
- Crop और blurred/solid padding modes।
- Output resolution presets और preview।
- Resized MP4 download।

### Completion criteria

- Output का aspect ratio चुने गए preset से match करे।
- Video unnecessarily stretch न हो।
- Crop/padding choice user को स्पष्ट हो।
- Rotation metadata और portrait videos ठीक handle हों।
- Result common browsers और phones में चले।

## चरण 5 — Video Compressor

### Scope

- Video upload और original size/quality summary।
- Compression presets: Light, Balanced और Maximum।
- Optional target use: WhatsApp, Instagram या Email।
- Processing progress/status।
- Original बनाम compressed file size comparison।
- Compressed MP4 preview और download।

### Completion criteria

- Output वास्तव में original से छोटा हो; नहीं होने पर साफ सूचना मिले।
- Audio/video sync सुरक्षित रहे।
- Resolution, bitrate और quality limits sensible हों।
- Unsupported codecs पर useful error मिले।
- Compression को “lossless” या guaranteed quality न बताया जाए।

## चरण 6 — Automatic Subtitle/SRT Generator

### Dependency decision

यह feature speech-to-text provider के बिना पूर्ण automatic नहीं बन सकता। Implementation शुरू करने से पहले provider, API cost, supported languages और privacy policy तय करनी होगी। API key केवल server environment में रखी जाएगी।

### Scope

- Audio/video upload।
- Hindi, English और automatic language detection।
- Speech-to-text transcription।
- Timestamped subtitle segments।
- Browser में subtitle text और timings edit करना।
- Valid UTF-8 `.srt` download।
- Processing/privacy notice और file retention policy।

### Completion criteria

- Generated SRT standard sequence, timestamp और blank-line format follow करे।
- Hindi Unicode सही export हो।
- API key client bundle में expose न हो।
- Provider failure, silence और unsupported language errors समझने योग्य हों।
- Temporary upload और provider retention व्यवहार privacy page पर documented हो।

## सभी tools के लिए common requirements

- Premium, responsive और keyboard-accessible UI।
- Client और server दोनों तरफ input validation।
- स्पष्ट file type, duration और size limits।
- सुरक्षित filenames और temporary-file cleanup।
- कोई exaggerated या unverified claim नहीं।
- Unique title, description, H1, help content और FAQ।
- Analytics में file, pasted URL, transcript या personal data न भेजना।
- नए public tool को footer और sitemap में तभी जोड़ना जब feature usable और tested हो।
- TypeScript, lint और production build validation।

## Recommended implementation foundation

- पहले एक shared media-processing layer बनाई जाए ताकि GIF, Trimmer, Resizer और Compressor duplicate code इस्तेमाल न करें।
- Shared upload validator, temporary-file manager, FFmpeg runner और download response helper बनाए जाएँ।
- Server/deployment file-size और execution-time limits को UI limits के साथ align किया जाए।
- हर चरण को अलग complete और verify करने के बाद ही अगला चरण शुरू किया जाए।

## वर्तमान स्थिति

Roadmap तैयार है। इन छह features की implementation अभी शुरू नहीं हुई है। अगला निर्धारित feature **Hindi/Hinglish Interface** है।
