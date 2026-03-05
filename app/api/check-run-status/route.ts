import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BB_WORKSPACE = process.env.BB_WORKSPACE!;
const BB_REPO_SLUG = process.env.BB_REPO_SLUG!;
const BB_TOKEN = process.env.BB_TOKEN!;

// Bitbucket pipeline states that mean "still running"
const RUNNING_STATES = new Set(['PENDING', 'IN_PROGRESS', 'PAUSED']);

export async function GET() {
  if (!BB_WORKSPACE || !BB_REPO_SLUG || !BB_TOKEN) {
    return NextResponse.json({ running: false });
  }

  // Fetch the most recent pipeline for the custom trigger
  const url = `https://api.bitbucket.org/2.0/repositories/${BB_WORKSPACE}/${BB_REPO_SLUG}/pipelines/?sort=-created_on&pagelen=1`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${BB_TOKEN}` },
      // No caching — always get fresh state
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ running: false });
    }

    const data = await res.json();
    const latest = data.values?.[0];

    if (!latest) {
      return NextResponse.json({ running: false });
    }

    const state: string = latest.state?.name ?? '';
    const running = RUNNING_STATES.has(state.toUpperCase());

    return NextResponse.json({
      running,
      pipelineUuid: latest.uuid,
      buildNumber: latest.build_number,
      state,
    });
  } catch {
    return NextResponse.json({ running: false });
  }
}
