# Kotak Neo WebSocket Integration

This document describes the implementation of Kotak Neo WebSocket integration for real-time trading and market data in the algo-auth-dash application.

## Overview

The integration provides:
- Real-time market data streaming
- Live order placement and management
- Position tracking
- Connection management with automatic reconnection
- React hooks and context for easy component integration

## Architecture

### Core Components

1. **KotakNeoSocket** (`src/lib/kotakNeoSocket.ts`)
   - Main WebSocket service class
   - Handles HSM (Market Data) and HSI (Order Management) connections
   - Manages authentication, subscriptions, and reconnection logic

2. **useKotakNeoSocket Hook** (`src/hooks/useKotakNeoSocket.ts`)
   - React hook for socket management
   - Provides state management and callbacks
   - Handles real-time data updates

3. **KotakNeoContext** (`src/contexts/KotakNeoContext.tsx`)
   - React context for global socket state
   - Provides socket functionality to all components

4. **KotakNeoConnection** (`src/components/KotakNeoConnection.tsx`)
   - UI component for connection management
   - Handles credential input and connection status

## Features

### Real-time Market Data
- Live price updates
- Volume and change tracking
- Multiple symbol subscriptions
- Automatic data formatting

### Order Management
- Place orders through WebSocket
- Real-time order status updates
- Order history tracking

### Connection Management
- Automatic reconnection on disconnect
- Heartbeat mechanism
- Error handling and recovery
- Multiple datacenter support

## Usage

### Basic Setup

```tsx
import { KotakNeoProvider } from '@/contexts/KotakNeoContext';

function App() {
  return (
    <KotakNeoProvider>
      <YourComponents />
    </KotakNeoProvider>
  );
}
```

### Using the Hook

```tsx
import { useKotakNeoContext } from '@/contexts/KotakNeoContext';

function TradingComponent() {
  const {
    isConnected,
    marketData,
    subscribeToSymbols,
    placeOrder
  } = useKotakNeoContext();

  const handleSubscribe = () => {
    // subscribeToSymbols(['RELIANCE', 'TCS', 'INFY']);
  };

  const handlePlaceOrder = () => {
    placeOrder({
      symbol: 'RELIANCE',
      exchange: 'NSE',
      quantity: 1,
      price: 2500,
      orderType: 'LIMIT',
      productType: 'CASH',
      side: 'BUY'
    });
  };

  return (
    <div>
      {isConnected ? 'Connected' : 'Disconnected'}
      <button onClick={handleSubscribe}>Subscribe</button>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
```

### Connection Configuration

```tsx
const config = {
  token: 'your-access-token',
  sid: 'your-session-id',
  datacenter: 'adc', // or 'e21', 'e22', 'e41', 'e43'
  source: 'WEB'
};

await connect(config);
```

## API Reference

### KotakNeoSocket Class

#### Methods

- `connect(config: KotakNeoConfig, callbacks?: SocketCallbacks): Promise<void>`
  - Establishes connection to Kotak Neo WebSocket services

- `disconnect(): void`
  - Closes all WebSocket connections

- `subscribeToMarketData(symbols: string[], channelNumber?: number): void`
  - Subscribes to real-time market data for specified symbols

- `unsubscribeFromMarketData(symbols: string[], channelNumber?: number): void`
  - Unsubscribes from market data

- `placeOrder(orderData: OrderData): void`
  - Places an order through the WebSocket

- `pauseChannels(channelNumbers: number[]): void`
  - Pauses data streaming for specified channels

- `resumeChannels(channelNumbers: number[]): void`
  - Resumes data streaming for specified channels

#### Properties

- `isConnected(): boolean` - Connection status
- `getState(): SocketState` - Current socket state

### useKotakNeoSocket Hook

#### Returns

```tsx
{
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  marketData: Map<string, MarketData>;
  orders: any[];
  positions: any[];
  connect: (config: KotakNeoConfig) => Promise<void>;
  disconnect: () => void;
  subscribeToSymbols: (symbols: string[]) => void;
  unsubscribeFromSymbols: (symbols: string[]) => void;
  placeOrder: (orderData: OrderData) => void;
  updateWatchlistData: (stocks: WatchlistStock[]) => WatchlistStock[];
}
```

## Data Types

### MarketData
```tsx
interface MarketData {
  symbol: string;
  exchange: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: number;
}
```

### OrderData
```tsx
interface OrderData {
  symbol: string;
  exchange: string;
  quantity: number;
  price: number;
  orderType: 'LIMIT' | 'MARKET' | 'SL-LMT' | 'SL-MKT';
  productType: 'CASH' | 'NRML' | 'MIS';
  side: 'BUY' | 'SELL';
}
```

### KotakNeoConfig
```tsx
interface KotakNeoConfig {
  token: string;
  sid: string;
  datacenter?: 'adc' | 'e21' | 'e22' | 'e41' | 'e43';
  source?: string;
}
```

## WebSocket Endpoints

### Market Data (HSM)
- **Production**: `wss://mlhsm.kotaksecurities.com`
- **UAT**: `wss://qhsm.kotaksecurities.online`

### Order Management (HSI)
- **Default**: `wss://mis.kotaksecurities.com/realtime`
- **ADC**: `wss://cis.kotaksecurities.com/realtime`
- **E21**: `wss://e21.kotaksecurities.com/realtime`
- **E22**: `wss://e22.kotaksecurities.com/realtime`
- **E41**: `wss://e41.kotaksecurities.com/realtime`
- **E43**: `wss://e43.kotaksecurities.com/realtime`

## Message Types

### Authentication
```json
{
  "type": "cn",
  "Authorization": "your-token",
  "Sid": "your-sid",
  "source": "WEB"
}
```

### Market Data Subscription
```json
{
  "type": "mws",
  "scrips": "RELIANCE&TCS&INFY",
  "channelnum": 1
}
```

### Order Placement
```json
{
  "type": "order",
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "quantity": 1,
  "price": 2500,
  "orderType": "LIMIT",
  "productType": "CASH",
  "side": "BUY"
}
```

## Error Handling

The integration includes comprehensive error handling:

- Connection failures with automatic retry
- Message parsing errors
- Network timeout handling
- Authentication failures
- Subscription errors

## Security Considerations

- Credentials are handled securely
- WebSocket connections use WSS (secure)
- No sensitive data is logged
- Automatic disconnection on errors

## Performance

- Efficient data parsing and updates
- Minimal memory footprint
- Optimized reconnection logic
- Heartbeat mechanism for connection health

## Testing

Use the demo page (`/kotak-neo-demo`) to test the integration:

1. Enter your Kotak Neo credentials
2. Connect to the WebSocket
3. Subscribe to market data
4. Place test orders
5. Monitor real-time updates

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check credentials
   - Verify network connectivity
   - Try different datacenter

2. **No Market Data**
   - Ensure subscription is active
   - Check symbol format
   - Verify market hours

3. **Order Placement Failed**
   - Check account balance
   - Verify order parameters
   - Ensure market is open

### Debug Mode

Enable debug logging by setting:
```tsx
localStorage.setItem('kotak-neo-debug', 'true');
```

## Future Enhancements

- [ ] Historical data support
- [ ] Advanced order types
- [ ] Portfolio analytics
- [ ] Risk management
- [ ] Multi-account support
- [ ] Mobile optimization

## Support

For issues related to Kotak Neo API:
- Kotak Securities Support: 1800-209-9191
- API Documentation: https://napi.kotaksecurities.com/devportal/apis
- Email: neo.api@kotak.com
