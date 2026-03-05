'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface LogEntry {
  message: string;
  timestamp: string;
}

interface ActivityLogProps {
  logs: LogEntry[];
}

export default function ActivityLog({ logs }: ActivityLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <h2 className="text-slate-300 font-semibold text-sm">Live Activity Log</h2>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">Live</span>
        </span>
      </div>
      <div className="font-mono space-y-1 max-h-64 overflow-y-auto text-xs">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 text-slate-400">
            <span className="text-slate-600 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString('id-ID')}
            </span>
            <span className={log.message.startsWith('[ERR]') ? 'text-rose-400' : 'text-slate-300'}>
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <span className="text-slate-600 italic">Menunggu output...</span>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
