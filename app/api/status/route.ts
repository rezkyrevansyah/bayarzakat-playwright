import { NextResponse } from 'next/server';
import type { StatusPayload } from '@/lib/types';
import { CHANNELS } from '@/lib/channels';

export const dynamic = 'force-dynamic';

const BB_WORKSPACE = process.env.BB_WORKSPACE!;
const BB_REPO_SLUG = process.env.BB_REPO_SLUG!;
const BB_TOKEN = process.env.BB_TOKEN!;
const BB_BRANCH = process.env.BB_BRANCH ?? 'main';

function emptyPayload(): StatusPayload {
  return {
    lastUpdated: null,
    lastReset: null,
    summary: { total: CHANNELS.length, passed: 0, failed: 0 },
    channels: CHANNELS.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      status: 'pending',
      latency: '-',
      uptime: '-',
      checkedAt: null,
    })),
  };
}

export async function GET() {
  if (!BB_WORKSPACE || !BB_REPO_SLUG || !BB_TOKEN) {
    return NextResponse.json(emptyPayload());
  }

  // Fetch results.json directly from Bitbucket raw content API
  const url = `https://api.bitbucket.org/2.0/repositories/${BB_WORKSPACE}/${BB_REPO_SLUG}/src/${BB_BRANCH}/results/results.json`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${BB_TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      // File doesn't exist yet — return empty payload
      return NextResponse.json(emptyPayload());
    }

    const data: StatusPayload = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(emptyPayload());
  }
}
