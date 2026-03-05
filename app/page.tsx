'use client';

import { useDashboard } from '@/hooks/useDashboard';
import Header from '@/components/dashboard/Header';
import InternetBanner from '@/components/dashboard/InternetBanner';
import StatsCards from '@/components/dashboard/StatsCards';
import DashboardOptions from '@/components/dashboard/DashboardOptions';
import ChannelGrid from '@/components/dashboard/ChannelGrid';
import ActivityLog from '@/components/dashboard/ActivityLog';
import ErrorState from '@/components/dashboard/ErrorState';
import LoadingState from '@/components/dashboard/LoadingState';

export default function HomePage() {
  const {
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
    refetch,
  } = useDashboard();

  if (isLoading) return <LoadingState />;
  if (error && !payload) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header
        workflowStatus={workflowStatus}
        progress={progress}
        onRunTest={runTest}
      />

      {showBanner && (
        <InternetBanner onClose={() => setShowBanner(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <StatsCards
          summary={payload?.summary}
          lastUpdated={payload?.lastUpdated}
        />

        {workflowStatus === 'running' && (
          <ActivityLog logs={logs} />
        )}

        <DashboardOptions
          lastReset={payload?.lastReset}
          onReset={resetData}
        />

        <ChannelGrid channels={payload?.channels ?? []} />
      </div>
    </main>
  );
}
