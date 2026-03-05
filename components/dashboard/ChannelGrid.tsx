'use client';

import { useState } from 'react';
import { Search, X, LayoutGrid } from 'lucide-react';
import type { ChannelResult } from '@/lib/types';
import ChannelCard from './ChannelCard';

interface ChannelGridProps {
  channels: ChannelResult[];
}

export default function ChannelGrid({ channels }: ChannelGridProps) {
  const [query, setQuery] = useState('');

  const filtered = channels.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <h2 className="font-semibold text-slate-800">Payment Gateways</h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
            Live Status
          </span>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari payment channel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 w-52"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {channels.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Still waiting to get data...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-slate-400 text-sm">Channel tidak ditemukan</p>
          <button
            onClick={() => setQuery('')}
            className="text-sm text-emerald-600 hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
}
