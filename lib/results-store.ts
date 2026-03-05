import fs from 'fs';
import path from 'path';
import type { StatusPayload, ChannelResult } from './types';
import { CHANNELS } from './channels';

const RESULTS_PATH = path.join(process.cwd(), 'results', 'results.json');
const WRITE_LOCK_PATH = path.join(process.cwd(), 'results', '.write-lock');

function withFileLock(fn: () => void, retries = 20, delayMs = 50): void {
  for (let i = 0; i < retries; i++) {
    try {
      // O_EXCL: fails if file already exists — atomic lock acquisition
      const fd = fs.openSync(WRITE_LOCK_PATH, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY);
      fs.closeSync(fd);
      try {
        fn();
      } finally {
        fs.unlinkSync(WRITE_LOCK_PATH);
      }
      return;
    } catch (e: unknown) {
      if ((e as NodeJS.ErrnoException).code === 'EEXIST') {
        // Lock held by another worker — busy wait
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
      } else {
        throw e;
      }
    }
  }
  // Fallback: force-remove stale lock and try once more
  try { fs.unlinkSync(WRITE_LOCK_PATH); } catch { /* ignore */ }
  fn();
}

function ensureResultsDir(): void {
  const dir = path.dirname(RESULTS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getEmptyPayload(): StatusPayload {
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

export function readResults(): StatusPayload {
  ensureResultsDir();
  if (!fs.existsSync(RESULTS_PATH)) {
    return getEmptyPayload();
  }
  try {
    const raw = fs.readFileSync(RESULTS_PATH, 'utf-8');
    return JSON.parse(raw) as StatusPayload;
  } catch {
    return getEmptyPayload();
  }
}

export function writeResults(payload: StatusPayload): void {
  ensureResultsDir();
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(payload, null, 2), 'utf-8');
}

export function resetResults(): StatusPayload {
  const empty = getEmptyPayload();
  empty.lastReset = new Date().toISOString();
  writeResults(empty);
  return empty;
}

export function updateChannelResult(result: ChannelResult): void {
  withFileLock(() => {
    const current = readResults();
    const idx = current.channels.findIndex((c) => c.id === result.id);
    if (idx >= 0) {
      current.channels[idx] = result;
    } else {
      current.channels.push(result);
    }
    current.lastUpdated = new Date().toISOString();
    const passed = current.channels.filter((c) => c.status === 'operational').length;
    const failed = current.channels.filter((c) => c.status === 'down').length;
    current.summary = { total: current.channels.length, passed, failed };
    writeResults(current);
  });
}
