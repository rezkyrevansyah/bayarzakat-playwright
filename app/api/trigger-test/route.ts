export const dynamic = 'force-dynamic';

const BB_WORKSPACE = process.env.BB_WORKSPACE!;
const BB_REPO_SLUG = process.env.BB_REPO_SLUG!;
const BB_TOKEN = process.env.BB_TOKEN!; // Bitbucket Access Token (Bearer)

export async function POST() {
  if (!BB_WORKSPACE || !BB_REPO_SLUG || !BB_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Bitbucket env vars not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const url = `https://api.bitbucket.org/2.0/repositories/${BB_WORKSPACE}/${BB_REPO_SLUG}/pipelines/`;

  const body = {
    target: {
      type: 'pipeline_ref_target',
      ref_name: 'main',
      ref_type: 'branch',
      selector: {
        type: 'custom',
        pattern: 'run-zakat-test',
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BB_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    return new Response('Already running', { status: 409 });
  }

  if (!res.ok) {
    const text = await res.text();
    return new Response(
      JSON.stringify({ error: `Bitbucket API error ${res.status}`, detail: text }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const data = await res.json();
  return new Response(
    JSON.stringify({ pipelineUuid: data.uuid, buildNumber: data.build_number }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}
