import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { blogPosts, type BlogPost } from '../app/blog/posts';

export type BlogSheetRow = {
  rowNumber: number;
  title: string;
  slug?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  imageAlt?: string;
  blogPrompt?: string;
  blogContent?: string;
  publishApproved: boolean;
};

type GeneratedBlogPost = BlogPost & {
  focusKeyword?: string;
  secondaryKeywords?: string[];
  sourceRow?: number;
  generatedBy?: string;
};

type GitHubFile = {
  path: string;
  content: string;
};

const postsFilePath =
  process.env.BLOG_POSTS_FILE_PATH?.trim() ||
  path.join(/* turbopackIgnore: true */ process.cwd(), 'data', 'generated-blog-posts.json');
const stateFilePath =
  process.env.BLOG_STATE_FILE_PATH?.trim() ||
  path.join(/* turbopackIgnore: true */ process.cwd(), 'data', 'blog-automation-state.json');
const githubRepo = process.env.GITHUB_REPO?.trim();
const githubBranch = process.env.GITHUB_BRANCH?.trim() || 'main';
const githubToken = process.env.GITHUB_TOKEN?.trim();
const githubAuthorName = process.env.BLOG_COMMIT_AUTHOR_NAME?.trim() || 'globltools Blog Bot';
const githubAuthorEmail = process.env.BLOG_COMMIT_AUTHOR_EMAIL?.trim() || 'blog-bot@globltools.com';
const targetWordCount = Number(process.env.BLOG_TARGET_WORDS || '1800');
const minWordCount = Number(process.env.BLOG_MIN_WORDS || '700');
const maxWordCount = Number(process.env.BLOG_MAX_WORDS || '5000');
const maxOutputTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || '8000');

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function normalizeFieldName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getCell(row: Record<string, string>, names: string[]) {
  const normalizedRow: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    normalizedRow[normalizeFieldName(key)] = value;
  }

  for (const name of names) {
    const normalized = normalizeFieldName(name);
    const value = normalizedRow[normalized];
    if (value) return value.trim();
  }
  return '';
}

function mapSheetRows(rows: Array<Record<string, string>>): BlogSheetRow[] {
  return rows
    .map((row, index) => {
      const title = getCell(row, ['Blog Title', 'Title', 'H1']);
      const focusKeyword = getCell(row, ['Focus Keyword', 'Keyword']) || title;
      const metaTitle = getCell(row, ['Meta Title']) || title;
      const metaDescription = getCell(row, ['Meta Description', 'Featured Snippet']) || focusKeyword || '';
      const secondaryKeywords = getCell(row, ['Secondary Keywords'])
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean);
      const approval = getCell(row, ['Publish Approved', 'Approved', 'Status']).toLowerCase();

      return {
        rowNumber: Number(getCell(row, ['#', 'No', 'Index'])) || index + 1,
        title,
        slug: getCell(row, ['URL Slug', 'Slug']),
        focusKeyword,
        secondaryKeywords,
        metaTitle,
        metaDescription,
        image: getCell(row, ['Image', 'Image URL', 'ImageUrl', 'image', 'Featured Image Filename']),
        imageAlt: getCell(row, ['Image Alt', 'ImageAlt', 'Alt Text', 'AltText', 'imageAlt', 'Image ALT Texts']),
        blogPrompt: getCell(row, ['Blog Prompt', 'Prompt']),
        blogContent: getCell(row, ['Full Blog Content', 'Blog Content', 'Content', 'Brief']),
        publishApproved: ['approved', 'publish', 'published', 'yes', 'true'].includes(approval),
      };
    })
    .filter((row) => row.title);
}

function getBlogDocExportUrl() {
  if (process.env.BLOG_DOC_EXPORT_URL?.trim()) {
    return process.env.BLOG_DOC_EXPORT_URL.trim();
  }

  const docUrl = process.env.BLOG_DOC_URL?.trim();
  if (docUrl) {
    if (docUrl.includes('/export?format=')) {
      return docUrl;
    }

    const match = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://docs.google.com/document/d/${encodeURIComponent(match[1])}/export?format=txt`;
    }

    throw new Error('BLOG_DOC_URL is not a valid Google Docs document URL. Use a URL like https://docs.google.com/document/d/FILE_ID/.');
  }

  const docId = process.env.BLOG_DOC_ID?.trim();
  if (docId) {
    return `https://docs.google.com/document/d/${encodeURIComponent(docId)}/export?format=txt`;
  }

  throw new Error(
    'BLOG_DOC_URL, BLOG_DOC_ID, or BLOG_DOC_EXPORT_URL is required to fetch blog content from Google Docs.',
  );
}

function normalizeDocValue(value: string) {
  return value.trim();
}

function parseDocText(text: string) {
  const normalized = text.replace(/\r/g, '');
  const blocks = normalized
    .split(/_{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const fieldNameMap: Record<string, string> = {
    'meta title': 'meta_title',
    'meta description': 'meta_description',
    'url slug': 'url_slug',
    h1: 'h1',
    'full blog content': 'full_blog_content',
    'featured snippet': 'featured_snippet',
    'featured image filename': 'featured_image_filename',
    'image alt texts': 'image_alt_texts',
    'image seo': 'image_seo',
    'suggested internal links': 'suggested_internal_links',
    'article schema': 'article_schema',
    'breadcrumb schema': 'breadcrumb_schema',
    'document tabs': 'document_tabs',
  };

  type DocBlock = { type: 'field' | 'rowHeader'; label?: string; value: string; title?: string };
  const parsedBlocks: DocBlock[] = blocks
    .map((block) => {
      const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return null;

      const firstLine = lines[0];
      const headerMatch = firstLine.match(/^\d+\s+(.+)$/);
      if (headerMatch && lines.length === 1) {
        return { type: 'rowHeader', title: normalizeDocValue(headerMatch[1]), value: '' };
      }

      const fieldMatch = firstLine.match(/^(?:\d+\.\s*)?(.+)$/);
      if (fieldMatch) {
        const rawLabel = fieldMatch[1].trim().toLowerCase();
        const label = fieldNameMap[rawLabel] || rawLabel.replace(/\s+/g, '_');
        const valueLines = lines.slice(1);
        return { type: 'field', label, value: normalizeDocValue(valueLines.join('\n')) };
      }

      return { type: 'field', label: 'unknown', value: normalizeDocValue(lines.join('\n')) };
    })
    .filter(Boolean) as DocBlock[];

  const rows: Array<Record<string, string>> = [];
  let currentRow: Record<string, string> = {};

  for (const block of parsedBlocks) {
    if (block.type === 'rowHeader') {
      if (Object.keys(currentRow).length) {
        rows.push(currentRow);
      }
      currentRow = { title: block.title || '' };
      continue;
    }

    if (!currentRow) currentRow = {};

    if (block.label === 'meta_title' && Object.keys(currentRow).length && currentRow.meta_title) {
      rows.push(currentRow);
      currentRow = {};
    }

    currentRow[block.label || 'unknown'] = block.value;
  }

  if (Object.keys(currentRow).length) {
    rows.push(currentRow);
  }

  return rows.map((row) => {
    const parsed: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      parsed[key.toLowerCase()] = normalizeDocValue(value);
    }
    return parsed;
  });
}

function buildDocPostFromRow(row: BlogSheetRow, publishedDate: string): GeneratedBlogPost | null {
  if (!row.title || !row.blogContent) {
    return null;
  }

  const overview = row.metaDescription || row.blogContent.split(/\n\s*\n/)[0].slice(0, 240).trim();
  const slug = row.slug ? slugify(row.slug) : slugify(row.metaTitle || row.title);

  return {
    slug,
    title: row.title,
    description: row.metaDescription || overview,
    overview,
    sections: [
      {
        heading: row.title,
        body: row.blogContent,
      },
    ],
    datePublished: publishedDate,
    dateModified: publishedDate,
    focusKeyword: row.focusKeyword || row.title,
    secondaryKeywords: row.secondaryKeywords,
    image: row.image,
    imageAlt: row.imageAlt,
    sourceRow: row.rowNumber,
    generatedBy: 'google-docs',
  };
}

export async function fetchBlogDocRows(): Promise<BlogSheetRow[]> {
  const response = await fetch(getBlogDocExportUrl(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to fetch blog doc: ${response.status}`);
  }

  return mapSheetRows(parseDocText(await response.text()));
}

export async function fetchBlogSourceRows(): Promise<BlogSheetRow[]> {
  return fetchBlogDocRows();
}

export async function getGeneratedBlogPosts(): Promise<GeneratedBlogPost[]> {
  return readGeneratedBlogPostsFromFile();
}

async function readGeneratedBlogPostsFromFile(): Promise<GeneratedBlogPost[]> {
  try {
    const raw = await readFile(postsFilePath, 'utf8');
    const posts = JSON.parse(raw);
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

function isGitHubPublishEnabled() {
  return Boolean(githubRepo && githubToken);
}

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

class GitHubRequestError extends Error {
  public status: number;
  public body: string;
  public path: string;

  constructor(status: number, body: string, path: string) {
    super(`GitHub request failed: ${status} ${body}`);
    this.status = status;
    this.body = body;
    this.path = path;
  }
}

class GeminiRequestError extends Error {
  public status: number;
  public body: string;

  constructor(status: number, body: string) {
    super(`Gemini API error: ${status} - ${body}`);
    this.status = status;
    this.body = body;
  }
}

async function githubRequest<T>(pathName: string, init: RequestInit = {}): Promise<T> {
  if (!githubToken || !githubRepo) {
    throw new Error('GITHUB_TOKEN and GITHUB_REPO are required for GitHub publishing.');
  }

  const fullUrl = `https://api.github.com/repos/${githubRepo}${pathName}`;
  console.log(`🔗 GitHub API Request: ${fullUrl}`);
  console.log(`🔐 GitHub auth present=${Boolean(githubToken)} repo=${githubRepo} branch=${githubBranch} tokenLen=${githubToken?.length || 0}`);

  const response = await fetch(fullUrl, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`❌ GitHub API Error on ${pathName}:`, response.status, body.substring(0, 300));
    throw new GitHubRequestError(response.status, body, pathName);
  }

  return response.json() as Promise<T>;
}

async function readGeneratedBlogPostsFromGitHub(): Promise<GeneratedBlogPost[]> {
  type GitHubContentResponse = { content?: string; encoding?: string };

  try {
    const file = await githubRequest<GitHubContentResponse>(
      `/contents/data/generated-blog-posts.json?ref=${encodeURIComponent(githubBranch)}`,
    );

    const raw =
      file.encoding === 'base64' && file.content
        ? Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')
        : '[]';
    const posts = JSON.parse(raw);
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    if (error instanceof GitHubRequestError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

async function readGeneratedBlogPostsForPublish(): Promise<GeneratedBlogPost[]> {
  if (isGitHubPublishEnabled()) {
    return readGeneratedBlogPostsFromGitHub();
  }

  return readGeneratedBlogPostsFromFile();
}

async function commitGeneratedBlogFiles(files: GitHubFile[], message: string) {
  type RefResponse = { object: { sha: string } };
  type CommitResponse = { tree: { sha: string } };
  type TreeResponse = { sha: string };
  type NewCommitResponse = { sha: string };

  console.log(`📦 Preparing to commit to branch: ${githubBranch}`);
  console.log(`📝 Files to commit: ${files.map((f) => f.path).join(', ')}`);

  const ref = await githubRequest<RefResponse>(`/git/refs/heads/${encodeURIComponent(githubBranch)}`);
  console.log(`✅ Found branch ref with SHA: ${ref.object.sha}`);

  const currentCommit = await githubRequest<CommitResponse>(`/git/commits/${ref.object.sha}`);
  const tree = await githubRequest<TreeResponse>('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: currentCommit.tree.sha,
      tree: files.map((file) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        content: file.content,
      })),
    }),
  });
  const commit = await githubRequest<NewCommitResponse>('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [ref.object.sha],
      author: {
        name: githubAuthorName,
        email: githubAuthorEmail,
      },
    }),
  });

  await githubRequest(`/git/refs/heads/${encodeURIComponent(githubBranch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  console.log(`✅ Commit created successfully: ${commit.sha}`);
  return commit.sha;
}

async function writeGeneratedBlogPosts(posts: GeneratedBlogPost[], state: Record<string, unknown>) {
  const postsContent = `${JSON.stringify(posts, null, 2)}\n`;
  const stateContent = `${JSON.stringify(state, null, 2)}\n`;

  if (isGitHubPublishEnabled()) {
    console.log(`📤 Publishing to GitHub repo: ${githubRepo}`);
    return commitGeneratedBlogFiles(
      [
        { path: 'data/generated-blog-posts.json', content: postsContent },
        { path: 'data/blog-automation-state.json', content: stateContent },
      ],
      `Publish blog: ${state.lastSlug || 'generated post'}`,
    );
  }

  console.log(`💾 Saving locally to: ${postsFilePath}`);
  await mkdir(path.dirname(postsFilePath), { recursive: true });
  await writeFile(postsFilePath, postsContent, 'utf8');
  await mkdir(path.dirname(stateFilePath), { recursive: true });
  await writeFile(stateFilePath, stateContent, 'utf8');
  return null;
}

export async function getAllBlogPosts(): Promise<GeneratedBlogPost[]> {
  const generated = await getGeneratedBlogPosts();
  const combined = [...generated, ...blogPosts];
  const unique = new Map<string, GeneratedBlogPost>();

  for (const post of combined) {
    unique.set(post.slug, post);
  }

  return Array.from(unique.values()).sort((a, b) => {
    const first = a.datePublished || '';
    const second = b.datePublished || '';
    return second.localeCompare(first);
  });
}

export async function findBlogPost(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

function extractJsonObject(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI response did not contain JSON.');
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function countPostWords(post: Pick<GeneratedBlogPost, 'title' | 'description' | 'overview' | 'sections'>) {
  const text = [
    post.title,
    post.description,
    post.overview,
    ...post.sections.flatMap((section) => [section.heading, section.body, ...(section.points || [])]),
  ].join(' ');

  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validatePostForPublishing(post: GeneratedBlogPost) {
  const errors: string[] = [];
  const wordCount = countPostWords(post);
  const paragraphs = [post.overview, ...post.sections.map((section) => section.body)]
    .flatMap((value) => value.split(/\n\s*\n/))
    .map((value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
    .filter((value) => value.length >= 80);
  const duplicateParagraphs = paragraphs.filter((value, index) => paragraphs.indexOf(value) !== index);

  if (wordCount < minWordCount) errors.push(`Article has ${wordCount} words; minimum reviewed length is ${minWordCount}.`);
  if (wordCount > maxWordCount) errors.push(`Article has ${wordCount} words; maximum reviewed length is ${maxWordCount}.`);
  if (post.title.trim().length < 20 || post.title.trim().length > 90) errors.push('Title must be between 20 and 90 characters.');
  if (post.description.trim().length < 70 || post.description.trim().length > 180) errors.push('Meta description must be between 70 and 180 characters.');
  if (post.sections.length < 3) errors.push('Article must contain at least three substantive sections.');
  if (!post.image || !post.imageAlt) errors.push('A representative image and descriptive alt text are required.');
  if (duplicateParagraphs.length) errors.push('Article contains repeated substantive paragraphs.');

  return { valid: errors.length === 0, errors, wordCount };
}

async function generateWithGemini(row: BlogSheetRow, publishedDate: string): Promise<GeneratedBlogPost | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Automated publication will stop.');
    return null;
  }

  const prompt = `
Write one original, people-first blog draft for globltools that must pass human review before publication.
Return only valid JSON with this exact shape:
{
  "title": string,
  "description": string,
  "overview": string,
  "sections": [{"heading": string, "body": string, "points": string[]}]
}

Rules:
- Cover the topic completely without padding. A useful target is about ${targetWordCount} words; stay between ${minWordCount} and ${maxWordCount} words.
- Unique content, no copied or duplicate paragraphs.
- Helpful, specific tone. Do not mention SEO, rankings, keyword targeting, or search engines in reader-facing copy.
- Use H2-style section headings in "heading"; include practical H3/H4 ideas inside the body naturally when useful.
- Write enough detailed sections for a long-form guide. Avoid thin summaries.
- Focus keyword: "${row.focusKeyword}".
- Secondary keywords: "${(row.secondaryKeywords || []).join(', ')}".
- Meta title: "${row.metaTitle || row.title}".
- Meta description: "${row.metaDescription || row.title}".
- Blog title: "${row.title}".
- Blog prompt from sheet: "${row.blogPrompt || 'Follow SEO best practices, clear intro, step-by-step guidance, troubleshooting, safety, FAQ-style helpful coverage.'}"
- Blog content/brief from sheet: "${row.blogContent || 'Write around the topic and globltools Instagram downloader use case.'}"
- Explain that only public Instagram content is supported. Do not encourage private-content bypassing.
`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const looksLikeAccessToken = apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.');
  const url = looksLikeAccessToken ? baseUrl : `${baseUrl}?key=${apiKey}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (looksLikeAccessToken) headers.Authorization = `Bearer ${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `Status: ${response.status}, Body: ${errorText.substring(0, 500)}`;
      console.error('❌ Gemini API Error:', errorMsg);
      throw new GeminiRequestError(response.status, errorText);
    }

    const data = await response.json();
    
    // Check for API errors in response
    if (data.error) {
      console.error('❌ Gemini API Error Response:', data.error);
      throw new GeminiRequestError(response.status, JSON.stringify(data.error));
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
    
    if (!text) {
      console.warn('⚠️ Gemini returned empty response. Using fallback.');
      return null;
    }

    const parsed = extractJsonObject(text);
    if (!Array.isArray(parsed.sections) || parsed.sections.length < 3) {
      console.warn('⚠️ Gemini draft did not contain enough substantive sections.');
      return null;
    }

    return {
      slug: slugify(row.metaTitle || row.title),
      title: String(parsed.title || row.metaTitle || row.title),
      description: String(parsed.description || row.metaDescription),
      overview: String(parsed.overview || row.metaDescription),
      sections: parsed.sections,
      datePublished: publishedDate,
      dateModified: publishedDate,
      focusKeyword: row.focusKeyword,
      secondaryKeywords: row.secondaryKeywords,
      image: row.image,
      imageAlt: row.imageAlt,
      sourceRow: row.rowNumber,
      generatedBy: 'gemini',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Gemini generation failed:', errorMsg);
    console.warn('⚠️ Falling back to template for row:', row.rowNumber);
    return null;
  }
}

export async function publishNextBlogPost(options: { forceRow?: number } = {}) {
  try {
    if (process.env.BLOG_AUTO_PUBLISH_ENABLED !== 'true') {
      return {
        published: false,
        reason: 'Automatic blog publishing is disabled. Set BLOG_AUTO_PUBLISH_ENABLED=true only after enabling the editorial approval workflow.',
        totalGenerated: 0,
      };
    }
    console.log(`\n${'='.repeat(60)}`);
    console.log('🚀 Starting blog publication process');
    console.log(`📋 GitHub Config: repo=${githubRepo}, branch=${githubBranch}`);
    console.log(`${'='.repeat(60)}\n`);

    const rows = await fetchBlogSourceRows();
    console.log(`📊 Fetched ${rows.length} rows from Google Docs`);

    const generated = await readGeneratedBlogPostsForPublish();
    console.log(`📚 Found ${generated.length} previously generated posts`);

    const publishedRows = new Set(generated.map((post) => post.sourceRow).filter(Boolean));
    const row =
      typeof options.forceRow === 'number'
        ? rows.find((item) => item.rowNumber === options.forceRow && item.publishApproved)
        : rows.find((item) => item.publishApproved && !publishedRows.has(item.rowNumber));

    if (!row) {
      console.log('⚠️ No unpublished blog rows found.');
      return { published: false, reason: 'No approved, unpublished blog rows found.', totalGenerated: generated.length };
    }

    const publishedDate = new Date().toISOString().split('T')[0];
    console.log(`\n📝 Processing row ${row.rowNumber}: ${row.title}`);
    console.log(`🔑 Focus Keyword: ${row.focusKeyword}`);
    
    const docsPost = buildDocPostFromRow(row, publishedDate);
    const aiPost = docsPost || (await generateWithGemini(row, publishedDate));
    const post = aiPost;

    if (!post) {
      return {
        published: false,
        reason: 'No complete reviewed draft was available. Generic fallback content is never auto-published.',
        totalGenerated: generated.length,
      };
    }

    const quality = validatePostForPublishing(post);
    if (!quality.valid) {
      return {
        published: false,
        reason: 'Draft failed editorial quality checks.',
        qualityErrors: quality.errors,
        wordCount: quality.wordCount,
        totalGenerated: generated.length,
      };
    }
    
    console.log(`\n✅ Generated blog post - Generated by: ${post.generatedBy}`);
    console.log(`📊 Word count: ${countPostWords(post)}`);
    
    const nextPosts = [post, ...generated.filter((item) => item.slug !== post.slug && item.sourceRow !== row.rowNumber)];
    const state = {
      lastPublishedAt: new Date().toISOString(),
      lastRow: row.rowNumber,
      lastSlug: post.slug,
      generatedBy: post.generatedBy,
      wordCount: countPostWords(post),
    };

    const commitSha = await writeGeneratedBlogPosts(nextPosts, state);

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Blog publication completed successfully!');
    console.log(`${'='.repeat(60)}\n`);

    return { published: true, post, totalGenerated: nextPosts.length, wordCount: countPostWords(post), commitSha };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ publishNextBlogPost failed: ${errorMsg}`);
    console.error(`${'='.repeat(60)}\n`);
    return { published: false, reason: `Error: ${errorMsg}`, totalGenerated: 0, error: errorMsg };
  }
}
