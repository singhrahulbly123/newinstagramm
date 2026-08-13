import { permanentRedirect } from 'next/navigation';

export default async function LegacyInstagramKeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/instagram/${encodeURIComponent(slug)}`);
}
