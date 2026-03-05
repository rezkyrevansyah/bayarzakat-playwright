'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import ResetDialog from './ResetDialog';

interface DashboardOptionsProps {
  lastReset: string | null | undefined;
  onReset: () => Promise<void>;
}

export default function DashboardOptions({ lastReset, onReset }: DashboardOptionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const lastResetLabel = lastReset
    ? new Date(lastReset).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    : 'Belum pernah';

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Opsi Dashboard</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Terakhir direset: <span className="font-medium">{lastResetLabel}</span>
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm hover:bg-rose-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Semua Data
        </button>
      </div>

      <ResetDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={onReset}
      />
    </>
  );
}
