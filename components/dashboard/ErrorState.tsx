import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-rose-200 p-8 max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-rose-100 rounded-full p-3">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
        <h2 className="font-semibold text-slate-800">Gagal memuat data</h2>
        <p className="text-sm text-slate-500">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );
}
