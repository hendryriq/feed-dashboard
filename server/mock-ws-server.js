const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

const FEED_TYPES = ['news', 'market', 'price'];

const NEWS_TITLES = [
  'Breaking: Major Tech Company Announces New Product',
  'Global Markets React to Economic Data',
  'Industry Leader Steps Down After 10 Years',
  'New Regulations Announced for Tech Sector',
  'Startup Raises $100M in Series B Funding',
  'Merger Talks Between Two Giants Confirmed',
  'Cybersecurity Breach Affects Millions',
  'AI Breakthrough Announced by Research Team',
];

const MARKET_TITLES = [
  'Stock Market Opens Higher on Positive News',
  'Trading Volume Surges in Tech Sector',
  'Bond Yields Rise Amid Inflation Concerns',
  'Commodity Prices Show Mixed Results',
  'Currency Markets React to Central Bank Decision',
  'IPO Launches with Strong Investor Interest',
  'Market Volatility Increases After Announcement',
  'Index Reaches New All-Time High',
];

const PRICE_TITLES = [
  'BTC/USD +5.2% - Breaking Resistance Level',
  'ETH/USD -2.1% - Profit Taking Observed',
  'AAPL Stock Price Update: $175.50 (+1.2%)',
  'Gold Prices Surge to $2,100/oz',
  'Oil Prices Drop 3% on Supply News',
  'EUR/USD Exchange Rate: 1.0850',
  'Tesla Stock Jumps 7% After Earnings',
  'Silver Prices Consolidate Around $24',
];

const BODIES = [
  'This is a significant development that could impact the industry for years to come.',
  'Analysts are closely monitoring the situation as it continues to unfold.',
  'Market participants are adjusting their positions in response to this news.',
  'Industry experts suggest this could be a turning point in the sector.',
  'Investors are showing increased interest following this announcement.',
  'The implications of this event are still being assessed by stakeholders.',
  'This development has sparked intense debate among market watchers.',
  'Further updates are expected as more information becomes available.',
];

let eventIdCounter = 0;
const recentEventIds = new Set();

function generateEvent() {
  const feed = FEED_TYPES[Math.floor(Math.random() * FEED_TYPES.length)];
  let title, body;

  switch (feed) {
    case 'news':
      title = NEWS_TITLES[Math.floor(Math.random() * NEWS_TITLES.length)];
      break;
    case 'market':
      title = MARKET_TITLES[Math.floor(Math.random() * MARKET_TITLES.length)];
      break;
    case 'price':
      title = PRICE_TITLES[Math.floor(Math.random() * PRICE_TITLES.length)];
      break;
  }

  body = Math.random() > 0.3 ? BODIES[Math.floor(Math.random() * BODIES.length)] : undefined;

  // 10% chance of duplicate event
  let id;
  if (Math.random() < 0.1 && recentEventIds.size > 0) {
    // Send a duplicate
    const recentIds = Array.from(recentEventIds);
    id = recentIds[Math.floor(Math.random() * recentIds.length)];
  } else {
    id = `event-${++eventIdCounter}`;
    recentEventIds.add(id);
    
    // Keep only last 50 IDs for duplicate simulation
    if (recentEventIds.size > 50) {
      const firstId = recentEventIds.values().next().value;
      recentEventIds.delete(firstId);
    }
  }

  return {
    id,
    feed,
    ts: Date.now(),
    title,
    body,
  };
}

wss.on('connection', (ws) => {
  console.log('✅ New client connected');
  
  let interval;
  let disconnectTimeout;

  const sendEvent = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const event = generateEvent();
      
      ws.send(JSON.stringify(event));
      console.log(`📤 Sent event: ${event.id} [${event.feed}] ${event.title.substring(0, 40)}...`);
    }
  };

  interval = setInterval(() => {
    sendEvent();
  }, Math.random() * 1500 + 500); // 500ms - 2s

  const scheduleDisconnect = () => {
    const delay = Math.random() * 30000 + 30000; // 30-60 seconds
    disconnectTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('🔌 Simulating connection drop...');
        ws.close();
      }
    }, delay);
  };

  scheduleDisconnect();

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clearInterval(interval);
    clearTimeout(disconnectTimeout);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  sendEvent();
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
console.log('📊 Generating events across feeds: news, market, price');
console.log('🔄 Simulating duplicates (~10%) and connection drops (every 30-60s)');
