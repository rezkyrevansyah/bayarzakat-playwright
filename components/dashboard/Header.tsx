import { Play, Loader2, CheckCircle2, Activity } from 'lucide-react';
import type { WorkflowStatus } from '@/lib/types';

interface HeaderProps {
  workflowStatus: WorkflowStatus;
  progress: number;
  onRunTest: () => void;
}

export default function Header({ workflowStatus, progress, onRunTest }: HeaderProps) {
  const isRunning = workflowStatus === 'running';
  const isCompleted = workflowStatus === 'completed';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 rounded-lg p-1.5">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard Testing Bayar Zakat</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          {!isRunning && !isCompleted && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              System Operational
            </span>
          )}
          {isRunning && (
            <span className="flex items-center gap-1.5 text-sm text-amber-600 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Running Tests...
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Check Completed
            </span>
          )}

          {/* Run Button */}
          <button
            onClick={onRunTest}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Testing Bayar Zakat
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {(isRunning || isCompleted) && (
        <div className="h-1.5 w-full bg-slate-100" role="progressbar" aria-valuenow={progress}>
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}
