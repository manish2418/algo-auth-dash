import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useKotakNeoHslib } from "@/hooks/useKotakNeoHslib";
import { KotakNeoConfig, kotakNeoHslib } from "@/lib/kotakNeoHslib";

export const KotakNeoHslibTest: React.FC = () => {
  const [config, setConfig] = useState<KotakNeoConfig>({
    token: "",
    sid: "",
    datacenter: "gdc",
    source: "WEB",
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [pingCount, setPingCount] = useState(0);

  const {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    subscribeToSymbols,
    pauseChannels,
    resumeChannels,
  } = useKotakNeoHslib();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    if (isConnected) {
      addLog("✅ Connected successfully");
    } else if (isConnecting) {
      addLog("🔄 Connecting...");
    } else if (error) {
      addLog(`❌ Error: ${error}`);
    }
  }, [isConnected, isConnecting, error]);

  const handleConnect = async () => {
    if (!config.token || !config.sid) {
      addLog("❌ Please enter token and session ID");
      return;
    }

    addLog("🚀 Starting connection with hslib.js...");
    addLog(
      `📋 Token: ${config.token.substring(0, 10)}... (${
        config.token.length
      } chars)`
    );
    addLog(
      `📋 SID: ${config.sid.substring(0, 10)}... (${config.sid.length} chars)`
    );

    try {
      await connect(config);
      addLog("📡 Subscribing to market data...");
      subscribeToSymbols(["nse_cm|11536"]);
    } catch (err) {
      addLog(`❌ Connection failed: ${err}`);
    }
  };

  const handleDisconnect = () => {
    addLog("🔌 Disconnecting...");
    disconnect();
  };

  const handlePauseChannel = () => {
    addLog("⏸️ Pausing channel 1...");
    pauseChannels([1]);
  };

  const handleResumeChannel = () => {
    addLog("▶️ Resuming channel 1...");
    resumeChannels([1]);
  };

  const handlePing = useCallback(() => {
    setPingCount((prev) => prev + 1);
    addLog("🏓 Ping received!");
  }, []);

  // Override the onPing callback to track pings
  useEffect(() => {
    kotakNeoHslib.updateCallbacks({
      onPing: handlePing,
    });

    return () => {
      kotakNeoHslib.updateCallbacks({});
    };
  }, [handlePing]);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>KotakNeo HSLib.js Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="token">Access Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Enter access token"
                value={config.token}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, token: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="sid">Session ID</Label>
              <Input
                id="sid"
                type="password"
                placeholder="Enter session ID"
                value={config.sid}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, sid: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleConnect}
              disabled={!config.token || !config.sid || isConnecting}
              className="flex-1"
            >
              {isConnecting ? "Connecting..." : "Connect with HSLib.js"}
            </Button>
            <Button
              onClick={handleDisconnect}
              disabled={!isConnected}
              variant="outline"
              className="flex-1"
            >
              Disconnect
            </Button>
            <Button
              onClick={handlePauseChannel}
              disabled={!isConnected}
              variant="outline"
            >
              Pause Channel
            </Button>
            <Button
              onClick={handleResumeChannel}
              disabled={!isConnected}
              variant="outline"
            >
              Resume Channel
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Connection Status:</strong>{" "}
              {isConnected ? "Connected" : "Disconnected"}
              <br />
              <strong>WebSocket State:</strong> {kotakNeoHslib.getState()}
              <br />
              <strong>Is Connected:</strong>{" "}
              {kotakNeoHslib.isConnected() ? "Yes" : "No"}
              <br />
              <strong>Ping Count:</strong> {pingCount}
            </AlertDescription>
          </Alert>

          <div>
            <Label>Connection Logs</Label>
            <div className="mt-2 p-3 bg-gray-900 rounded max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-sm">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-gray-300 mb-1"
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>
              <strong>Using HSLib.js:</strong>
            </p>
            <p>
              • This implementation uses the working hslib.js from your demo
            </p>
            <p>• Should work exactly like demo.html</p>
            <p>• No timeout issues - uses proven demo code</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KotakNeoHslibTest;
