import type { ChannelResult } from '@/lib/types';

interface ChannelCardProps {
  channel: ChannelResult;
}

const STATUS_CONFIG = {
  operational: {
    badge: 'PASS',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  issue: {
    badge: 'SLOW',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  down: {
    badge: 'FAIL',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  pending: {
    badge: '-',
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-300',
  },
};

export default function ChannelCard({ channel }: ChannelCardProps) {
  const config = STATUS_CONFIG[channel.status];

  return (
    <div className={`card rounded-xl border p-4 ${config.bg} ${config.border} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="uppercase text-[10px] font-semibold text-slate-400 tracking-widest">
          {channel.category}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.text} ${config.border} bg-white`}>
          {config.badge}
        </span>
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-3 leading-tight">{channel.name}</h3>
      <div className="space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Latency</span>
          <span className="font-mono text-slate-700">{channel.latency}</span>
        </div>
        <div className="flex justify-between">
          <span>Uptime</span>
          <span className="font-medium text-slate-700">{channel.uptime}</span>
        </div>
        {channel.checkedAt ? (
          <div className="text-slate-400 pt-1 border-t border-slate-200 mt-2">
            Dicek: {new Date(channel.checkedAt).toLocaleString('id-ID', { timeStyle: 'short', dateStyle: 'short' })}
          </div>
        ) : (
          <div className="text-slate-300 pt-1 border-t border-slate-200 mt-2 italic">
            Belum dicek
          </div>
        )}
      </div>
    </div>
  );
}
