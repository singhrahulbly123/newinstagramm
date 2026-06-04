import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '../posts';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function findPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | FastVideoSave Blog`,
    description: post.description,
    alternates: {
      canonical: `https://fastvideosave.net/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | FastVideoSave Blog`,
      description: post.description,
      type: 'article',
      url: `https://fastvideosave.net/blog/${post.slug}`,
      siteName: 'FastVideoSave',
      locale: 'en_US',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-soft text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">FastVideoSave Blog</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">{post.overview}</p>
          </div>

          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-950">{section.heading}</h2>
              <p className="text-sm leading-7 text-slate-600">{section.body}</p>
              {section.points?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
            <h2 className="text-xl font-semibold text-slate-950">Quick Tip</h2>
            <p className="mt-3">
              Always use public Instagram links and respect creator rights. FastVideoSave is best for personal saving and offline viewing.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Back to blog
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Use downloader now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
