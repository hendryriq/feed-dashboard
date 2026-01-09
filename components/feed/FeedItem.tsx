'use client';

import { memo } from 'react';
import { Event, FeedType } from '@/types';

type FeedItemProps = {
  event: Event;
};

const FEED_COLORS: Record<Exclude<FeedType, FeedType.ALL>, string> = {
  [FeedType.NEWS]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [FeedType.MARKET]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [FeedType.PRICE]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const FEED_LABELS: Record<Exclude<FeedType, FeedType.ALL>, string> = {
  [FeedType.NEWS]: 'News',
  [FeedType.MARKET]: 'Market',
  [FeedType.PRICE]: 'Price',
};

function FeedItemComponent({ event }: FeedItemProps) {
  const formatTimestamp = (ts: number) => {
    const now = Date.now();
    const diff = now - ts;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const feedColor = FEED_COLORS[event.feed as Exclude<FeedType, FeedType.ALL>] || FEED_COLORS[FeedType.NEWS];
  const feedLabel = FEED_LABELS[event.feed as Exclude<FeedType, FeedType.ALL>] || 'Unknown';

  return (
    <div className="group p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-white font-medium flex-1 group-hover:text-blue-300 transition-colors">
          {event.title}
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium border ${feedColor} whitespace-nowrap`}>
          {feedLabel}
        </span>
      </div>
      
      {event.body && (
        <p className="text-gray-400 text-sm mb-2">
          {event.body}
        </p>
      )}
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{formatTimestamp(event.ts)}</span>
        <span>•</span>
        <span className="font-mono text-gray-600">{event.id}</span>
      </div>
    </div>
  );
}

export default memo(FeedItemComponent);
