'use client';

import { useState, useMemo, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { FeedType } from '@/types';
import ConnectionStatus from '@/components/feed/ConnectionStatus';
import FeedTabs from '@/components/feed/FeedTabs';
import SearchBar from '@/components/feed/SearchBar';
import FeedItem from '@/components/feed/FeedItem';

export default function FeedPage() {
  const { events, connectionState, reconnectAttempts } = useWebSocket();
  const [activeFeed, setActiveFeed] = useState<FeedType>(FeedType.ALL);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate event counts per feed
  const eventCounts = useMemo(() => {
    const counts: Record<FeedType, number> = {
      [FeedType.ALL]: events.length,
      [FeedType.NEWS]: 0,
      [FeedType.MARKET]: 0,
      [FeedType.PRICE]: 0,
    };

    events.forEach((event) => {
      if (event.feed in counts) {
        counts[event.feed]++;
      }
    });

    return counts;
  }, [events]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by feed type
    if (activeFeed !== FeedType.ALL) {
      filtered = filtered.filter((event) => event.feed === activeFeed);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const titleMatch = event.title.toLowerCase().includes(query);
        const bodyMatch = event.body?.toLowerCase().includes(query);
        return titleMatch || bodyMatch;
      });
    }

    return filtered;
  }, [events, activeFeed, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFeedChange = useCallback((feed: FeedType) => {
    setActiveFeed(feed);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Real-Time Activity Feed
              </h1>
              <p className="text-gray-400 text-sm">
                Live events streaming via WebSocket
              </p>
            </div>
            <ConnectionStatus state={connectionState} reconnectAttempts={reconnectAttempts} />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <FeedTabs 
              activeFeed={activeFeed} 
              onFeedChange={handleFeedChange}
              eventCounts={eventCounts}
            />
            <SearchBar onSearch={handleSearchChange} />
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? 'Try adjusting your search query or filters' 
                : 'Waiting for events to arrive...'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredEvents.map((event) => (
              <FeedItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
