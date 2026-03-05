import { NextResponse } from 'next/server';
import type { StatusPayload } from '@/lib/types';
import { CHANNELS } from '@/lib/channels';

export const dynamic = 'force-dynamic';

const BB_WORKSPACE = process.env.BB_WORKSPACE!;
const BB_REPO_SLUG = process.env.BB_REPO_SLUG!;
const BB_TOKEN = process.env.BB_TOKEN!;
const BB_BRANCH = process.env.BB_BRANCH ?? 'main';

function buildEmptyPayload(): StatusPayload {
  return {
    lastUpdated: null,
    lastReset: new Date().toISOString(),
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

export async function POST() {
  if (!BB_WORKSPACE || !BB_REPO_SLUG || !BB_TOKEN) {
    return NextResponse.json({ error: 'Bitbucket env vars not configured' }, { status: 500 });
  }

  const empty = buildEmptyPayload();
  const content = JSON.stringify(empty, null, 2);

  // Bitbucket src API — upload/commit a file
  const url = `https://api.bitbucket.org/2.0/repositories/${BB_WORKSPACE}/${BB_REPO_SLUG}/src`;

  const form = new FormData();
  form.append('results/results.json', new Blob([content], { type: 'application/json' }), 'results.json');
  form.append('message', 'chore: reset test results [skip ci]');
  form.append('branch', BB_BRANCH);
  form.append('author', 'Dashboard Bot <pipeline@bitbucket.org>');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${BB_TOKEN}` },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Bitbucket API error ${res.status}`, detail: text },
        { status: 502 },
      );
    }

    return NextResponse.json(empty);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
