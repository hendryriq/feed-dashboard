'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Event, ConnectionState, UseWebSocketReturn } from '@/types';

const WS_URL = 'ws://localhost:8080';
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const INITIAL_RECONNECT_DELAY = 1000; // 1 second

export function useWebSocket(): UseWebSocketReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.CONNECTING);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const seenEventIds = useRef<Set<string>>(new Set());
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);

  const connect = useCallback(() => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnectionState(ConnectionState.CONNECTED);
        setReconnectAttempts(0);
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY; 
      };

      ws.onmessage = (message) => {
        try {
          const event: Event = JSON.parse(message.data);
          
          if (!event.id || !event.feed || !event.ts || !event.title) {
            console.warn('⚠️ Invalid event structure:', event);
            return;
          }

          if (seenEventIds.current.has(event.id)) {
            console.log(`🔄 Duplicate event detected: ${event.id} - skipping`);
            return;
          }

          seenEventIds.current.add(event.id);
          
          setEvents((prev) => [event, ...prev]);
          
        } catch (error) {
          console.warn('⚠️ Ignored malformed WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionState(ConnectionState.ERROR);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setConnectionState(ConnectionState.DISCONNECTED);
        
        setReconnectAttempts((prev) => prev + 1);
        
        const delay = Math.min(reconnectDelayRef.current, MAX_RECONNECT_DELAY);
        console.log(`🔄 Reconnecting in ${delay}ms...`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, MAX_RECONNECT_DELAY);
          connect();
        }, delay);
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setConnectionState(ConnectionState.ERROR);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    events,
    connectionState,
    reconnectAttempts,
  };
}
