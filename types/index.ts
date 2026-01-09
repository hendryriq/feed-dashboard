export enum FeedType {
  ALL = 'all',
  NEWS = 'news',
  MARKET = 'market',
  PRICE = 'price'
}

export enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

export type Event = {
  id: string;
  feed: FeedType;
  ts: number;
  title: string;
  body?: string;
}

export type WebSocketMessage = {
  data: string;
}

export type UseWebSocketReturn = {
  events: Event[];
  connectionState: ConnectionState;
  reconnectAttempts: number;
}