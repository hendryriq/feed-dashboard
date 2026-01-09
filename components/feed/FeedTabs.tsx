'use client';

import { FeedType } from '@/types';

type FeedTabsProps = {
  activeFeed: FeedType;
  onFeedChange: (feed: FeedType) => void;
  eventCounts: Record<FeedType, number>;
};

const FEED_LABELS: Record<FeedType, string> = {
  [FeedType.ALL]: 'All',
  [FeedType.NEWS]: 'News Feed',
  [FeedType.MARKET]: 'Market Activity',
  [FeedType.PRICE]: 'Price Movement',
};

export default function FeedTabs({ activeFeed, onFeedChange, eventCounts }: FeedTabsProps) {
  const feeds = [FeedType.ALL, FeedType.NEWS, FeedType.MARKET, FeedType.PRICE];

  return (
    <div className="flex flex-wrap gap-2">
      {feeds.map((feed) => {
        const isActive = activeFeed === feed;
        const count = eventCounts[feed] || 0;

        return (
          <button
            key={feed}
            onClick={() => onFeedChange(feed)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }
            `}
          >
            <span>{FEED_LABELS[feed]}</span>
            {count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
