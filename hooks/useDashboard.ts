'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StatusPayload, WorkflowStatus } from '@/lib/types';

interface LogEntry {
  message: string;
  timestamp: string;
}

const POLL_INTERVAL_MS = 10_000; // poll every 10s while running

export function useDashboard() {
  const [payload, setPayload] = useState<StatusPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StatusPayload = await res.json();
      setPayload(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkRunStatus = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/check-run-status');
      const { running } = await res.json();
      return running as boolean;
    } catch {
      return false;
    }
  }, []);

  // On mount: fetch status and check if already running
  useEffect(() => {
    const init = async () => {
      await fetchStatus();
      const running = await checkRunStatus();
      if (running) {
        setWorkflowStatus('running');
      }
    };
    init();
  }, [fetchStatus, checkRunStatus]);

  // Start polling loop when running
  const startPolling = useCallback(() => {
    stopPolling();

    // Fake progress bar: slowly advance to 90% while waiting
    let fakeProgress = 5;
    progressRef.current = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 1, 90);
      setProgress(fakeProgress);
    }, 6000); // +1% every 6s → ~90% at ~9min

    pollingRef.current = setInterval(async () => {
      const running = await checkRunStatus();

      if (!running) {
        // Pipeline finished — fetch fresh results
        stopPolling();
        await fetchStatus();
        setProgress(100);
        setWorkflowStatus('completed');
        setLogs((prev) => [
          ...prev,
          { message: 'Pipeline selesai. Hasil telah diperbarui.', timestamp: new Date().toISOString() },
        ]);
        setTimeout(() => {
          setWorkflowStatus('idle');
          setProgress(0);
        }, 5000);
      }
    }, POLL_INTERVAL_MS);
  }, [checkRunStatus, fetchStatus, stopPolling]);

  // Sync polling when workflowStatus changes to 'running'
  useEffect(() => {
    if (workflowStatus === 'running' && !pollingRef.current) {
      startPolling();
    }
    return () => {
      if (workflowStatus !== 'running') stopPolling();
    };
  }, [workflowStatus, startPolling, stopPolling]);

  const runTest = useCallback(async () => {
    if (workflowStatus === 'running') return;

    setWorkflowStatus('running');
    setProgress(2);
    setLogs([{ message: 'Memicu Bitbucket Pipeline...', timestamp: new Date().toISOString() }]);

    try {
      const response = await fetch('/api/trigger-test', { method: 'POST' });

      if (response.status === 409) {
        setLogs((prev) => [
          ...prev,
          { message: 'Pipeline sudah berjalan.', timestamp: new Date().toISOString() },
        ]);
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? 'Gagal memulai pipeline');
        setWorkflowStatus('idle');
        setProgress(0);
        return;
      }

      const { buildNumber } = await response.json();
      setLogs((prev) => [
        ...prev,
        {
          message: `Pipeline #${buildNumber} dimulai. Menunggu hasil... (polling setiap ${POLL_INTERVAL_MS / 1000}s)`,
          timestamp: new Date().toISOString(),
        },
      ]);

      startPolling();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setWorkflowStatus('idle');
      setProgress(0);
    }
  }, [workflowStatus, startPolling]);

  const resetData = useCallback(async () => {
    await fetch('/api/reset-status', { method: 'POST' });
    await fetchStatus();
  }, [fetchStatus]);

  return {
    payload,
    isLoading,
    error,
    workflowStatus,
    progress,
    logs,
    showBanner,
    setShowBanner,
    runTest,
    resetData,
    refetch: fetchStatus,
  };
}
