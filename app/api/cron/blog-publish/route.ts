import { NextResponse } from 'next/server';
import { publishNextBlogPost } from '../../../../lib/blogAutomation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret');
  const auth = request.headers.get('authorization');
  return querySecret === secret || auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized cron request.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const forceRow = url.searchParams.get('row');
  const result = await publishNextBlogPost({
    forceRow: forceRow ? Number(forceRow) : undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  return GET(request);
}
