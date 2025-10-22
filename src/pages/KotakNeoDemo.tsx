import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KotakNeoHslibTest } from "@/components/KotakNeoHslibTest";
import { useKotakNeoContext } from "@/contexts/KotakNeoContext";
import { MarketData } from "@/lib/kotakNeoHslib";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";

/**
 * Kotak Neo Demo Page
 *
 * Demonstrates the Kotak Neo WebSocket integration with:
 * - Connection management
 * - Real-time market data display
 * - Order placement simulation
 * - Live data streaming
 */
const KotakNeoDemo = () => {
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(
    new Map()
  );
  const [orders, setOrders] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const {
    isConnected,
    isConnecting,
    error,
    marketData: liveMarketData,
    orders: liveOrders,
    positions: livePositions,
    subscribeToSymbols,
    unsubscribeFromSymbols,
  } = useKotakNeoContext();

  // Demo symbols for testing
  const demoSymbols = ["RELIANCE", "TCS", "INFY", "HDFC", "ICICIBANK"];

  const handleSubscribe = () => {
    if (isConnected) {
      // subscribeToSymbols(demoSymbols);
    }
  };

  const handleUnsubscribe = () => {
    if (isConnected) {
      unsubscribeFromSymbols(demoSymbols);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Kotak Neo Integration Demo</h1>
          <p className="text-gray-400">
            Real-time market data and trading with Kotak Neo WebSocket API
          </p>
        </div>

        {/* Connection Status */}
        <KotakNeoHslibTest />

        {/* Market Data Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Live Market Data
            </CardTitle>
            <CardDescription>
              Real-time price updates from Kotak Neo WebSocket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSubscribe}
                  disabled={!isConnected}
                  variant="outline"
                >
                  Subscribe to Demo Symbols
                </Button>
                <Button
                  onClick={handleUnsubscribe}
                  disabled={!isConnected}
                  variant="outline"
                >
                  Unsubscribe
                </Button>
              </div>

              {/* Market Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoSymbols.map((symbol) => {
                  const data = liveMarketData.get(symbol);
                  return (
                    <div key={symbol} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{symbol}</h3>
                        {data && (
                          <Badge
                            variant={
                              data.change >= 0 ? "default" : "destructive"
                            }
                          >
                            {data.change >= 0 ? "+" : ""}
                            {data.changePercent.toFixed(2)}%
                          </Badge>
                        )}
                      </div>

                      {data ? (
                        <div className="space-y-1">
                          <div className="text-lg font-bold">
                            ₹{data.ltp.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm flex items-center gap-1 ${
                              data.change >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {data.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>₹{data.change.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Vol: {data.volume.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          {isConnected
                            ? "Waiting for data..."
                            : "Not connected"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Order Management
            </CardTitle>
            <CardDescription>
              Place and track orders through Kotak Neo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Orders List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Orders</h4>
                {liveOrders.length > 0 ? (
                  <div className="space-y-2">
                    {liveOrders.map((order, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{order.symbol}</span>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.side} {order.quantity} @ ₹{order.price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No orders placed</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Positions
            </CardTitle>
            <CardDescription>Current trading positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {livePositions.length > 0 ? (
                livePositions.map((position, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{position.symbol}</span>
                      <Badge variant="outline">{position.side}</Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      Qty: {position.quantity} | P&L: ₹{position.pnl}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No open positions</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
            <CardDescription>
              WebSocket connection details and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Connecting:</span>
                <span>{isConnecting ? "Yes" : "No"}</span>
              </div>
              {error && (
                <div className="flex justify-between">
                  <span>Error:</span>
                  <span className="text-red-400">{error}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subscribed Symbols:</span>
                <span>{demoSymbols.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Live Data Points:</span>
                <span>{liveMarketData.size}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KotakNeoDemo;
