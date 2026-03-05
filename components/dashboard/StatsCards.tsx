import type { StatusSummary } from '@/lib/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  summary: StatusSummary | undefined;
  lastUpdated: string | null | undefined;
}

export default function StatsCards({ summary, lastUpdated }: StatsCardsProps) {
  const passed = summary?.passed ?? 0;
  const failed = summary?.failed ?? 0;
  const total = summary?.total ?? 0;

  const lastCheckedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    : 'Belum ada testing';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Test Results */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">Test Results</span>
          <CheckCircle className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-end gap-4">
          <div>
            <span className="text-emerald-600 text-2xl font-bold">{passed}</span>
            <span className="text-xs text-slate-400 ml-1">passed</span>
          </div>
          <div>
            <span className="text-rose-600 text-2xl font-bold">{failed}</span>
            <span className="text-xs text-slate-400 ml-1">failed</span>
          </div>
        </div>
      </div>

      {/* Monitored Channels */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">Monitored Channels</span>
          <XCircle className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <span className="text-3xl font-bold text-slate-800">{total}</span>
          <span className="text-xs text-slate-400 ml-2">payment channels</span>
        </div>
      </div>

      {/* Last Checked */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">Last Checked</span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-xl font-bold text-slate-800">{lastCheckedLabel}</div>
      </div>
    </div>
  );
}
