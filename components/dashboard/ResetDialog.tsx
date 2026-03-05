'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ResetDialog({ isOpen, onClose, onConfirm }: ResetDialogProps) {
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsResetting(true);
    try {
      await onConfirm();
    } finally {
      setIsResetting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
        <div className="flex justify-center">
          <div className="bg-rose-100 rounded-full p-3">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-slate-800 text-lg">Reset Dashboard?</h2>
          <p className="text-sm text-slate-500 mt-1">
            Semua hasil testing akan dihapus dan channel akan kembali ke status awal.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isResetting}
            className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? 'Mereset...' : 'Ya, Reset'}
          </button>
        </div>
      </div>
    </div>
  );
}
