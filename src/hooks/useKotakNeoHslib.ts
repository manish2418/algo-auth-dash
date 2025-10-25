import { useState, useEffect, useCallback, useRef } from "react";
import {
  kotakNeoHslib,
  KotakNeoConfig,
  SocketState,
  MarketData,
  SocketCallbacks,
} from "@/lib/kotakNeoHslib";
import { runAlgoEngineV2 } from "@/lib/algoEngine";

export interface UseKotakNeoHslibReturn {
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
  pauseChannels: (channels: number[]) => void;
  resumeChannels: (channels: number[]) => void;
  updateWatchlistData: (stocks: any[]) => any[];
}

export const useKotakNeoHslib = (): UseKotakNeoHslibReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(
    new Map()
  );
  const [orders, setOrders] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const subscribedSymbols = useRef<Set<string>>(new Set());
  const callbacksRef = useRef<SocketCallbacks>({});
  console.log(marketData, "MARKET DATA IN HOOKS");
  // Initialize socket callbacks
  useEffect(() => {
    callbacksRef.current = {
      onConnect: () => {
        console.log("[useKotakNeoHslib] Connected");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      },
      onDisconnect: () => {
        console.log("[useKotakNeoHslib] Disconnected");
        setIsConnected(false);
        setIsConnecting(false);
      },
      onError: (error: Error) => {
        console.error("[useKotakNeoHslib] Error:", error);
        setError(error.message);
        setIsConnected(false);
        setIsConnecting(false);
      },
      onAuthSuccess: () => {
        console.log("[useKotakNeoHslib] Authentication successful");
      },
      onAuthFailure: (error: string) => {
        console.error("[useKotakNeoHslib] Authentication failed:", error);
        setError(`Authentication failed: ${error}`);
        setIsConnected(false);
        setIsConnecting(false);
      },
      onPing: () => {
        console.log("[useKotakNeoHslib] Received ping");
      },
      onMarketData: (data: MarketData) => {
        setMarketData((prev) => {
          const newMap = new Map(prev);
          if (data.ltp > 0) newMap.set(data.symbol, data);
          return newMap;
        });
        // Run your algo engine for live data
        const metrics = runAlgoEngineV2(data);

        // Optionally visualize or store metrics somewhere
        console.log(`[ALGO] ${data.name} →`, metrics);
      },
      onOrderUpdate: (order: any) => {
        setOrders((prev) => {
          const existingIndex = prev.findIndex((o) => o.id === order.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = order;
            return updated;
          } else {
            return [...prev, order];
          }
        });
      },
      onPositionUpdate: (position: any) => {
        setPositions((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.symbol === position.symbol
          );
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = position;
            return updated;
          } else {
            return [...prev, position];
          }
        });
      },
    };

    kotakNeoHslib.updateCallbacks(callbacksRef.current);
  }, []);

  // Connect to Kotak Neo using hslib.js
  const connect = useCallback(async (config: KotakNeoConfig) => {
    try {
      setIsConnecting(true);
      setError(null);
      await kotakNeoHslib.connect(config, callbacksRef.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from Kotak Neo
  const disconnect = useCallback(() => {
    kotakNeoHslib.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    setMarketData(new Map());
    setOrders([]);
    setPositions([]);
    subscribedSymbols.current.clear();
  }, []);

  // Subscribe to market data for symbols
  const subscribeToSymbols = useCallback(
    (symbols: string[]) => {
      if (!isConnected) {
        console.warn("[useKotakNeoHslib] Cannot subscribe - not connected");
        return;
      }

      const newSymbols = symbols.filter(
        (symbol) => !subscribedSymbols.current.has(symbol)
      );
      if (newSymbols.length > 0) {
        kotakNeoHslib.subscribeToMarketData(newSymbols);
        newSymbols.forEach((symbol) => subscribedSymbols.current.add(symbol));
      }
    },
    [isConnected]
  );

  // Unsubscribe from market data for symbols
  const unsubscribeFromSymbols = useCallback(
    (symbols: string[]) => {
      if (!isConnected) {
        console.warn("[useKotakNeoHslib] Cannot unsubscribe - not connected");
        return;
      }

      kotakNeoHslib.unsubscribeFromMarketData(symbols);
      symbols.forEach((symbol) => subscribedSymbols.current.delete(symbol));
    },
    [isConnected]
  );

  // Pause channels
  const pauseChannels = useCallback(
    (channels: number[]) => {
      if (!isConnected) {
        console.warn(
          "[useKotakNeoHslib] Cannot pause channels - not connected"
        );
        return;
      }

      kotakNeoHslib.pauseChannels(channels);
    },
    [isConnected]
  );

  // Resume channels
  const resumeChannels = useCallback(
    (channels: number[]) => {
      if (!isConnected) {
        console.warn(
          "[useKotakNeoHslib] Cannot resume channels - not connected"
        );
        return;
      }

      kotakNeoHslib.resumeChannels(channels);
    },
    [isConnected]
  );

  // Update watchlist data with real-time market data
  const updateWatchlistData = useCallback(
    (stocks: any[]): any[] => {
      return stocks.map((stock) => {
        const realTimeData = marketData.get(stock.symbol);
        if (realTimeData?.ltp > 0) {
          return {
            ...stock,
            price: realTimeData.ltp.toString(),
            change:
              realTimeData.change > 0
                ? `+${realTimeData.change.toFixed(2)}`
                : realTimeData.change.toFixed(2),
            changePercent:
              realTimeData.changePercent > 0
                ? `(+${realTimeData.changePercent.toFixed(2)}%)`
                : `(${realTimeData.changePercent.toFixed(2)}%)`,
            isPositive: realTimeData.change >= 0,
          };
        }
        return stock;
      });
    },
    [marketData]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isConnected, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    marketData,
    orders,
    positions,
    connect,
    disconnect,
    subscribeToSymbols,
    unsubscribeFromSymbols,
    pauseChannels,
    resumeChannels,
    updateWatchlistData,
  };
};
