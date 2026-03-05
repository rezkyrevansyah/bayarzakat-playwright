import { Wifi, X } from 'lucide-react';

interface InternetBannerProps {
  onClose: () => void;
}

export default function InternetBanner({ onClose }: InternetBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <Wifi className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">Pastikan Koneksi Internet Stabil</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Setelah menjalankan test, pastikan koneksi internet Anda stabil agar proses pengujian payment channel berjalan lancar.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup banner"
          className="text-amber-500 hover:text-amber-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
