// KotakNeo WebSocket implementation using hslib.js
// This integrates the working demo code with React

// Import the hslib.js (we'll need to copy it to public folder)
declare global {
  interface Window {
    HSWebSocket: any;
    HSIWebSocket: any;
    userWS: any;
    hsWs: any;
    retrySocket: any;
    windowIntervals: any;
  }
}

// Market data types
export interface MarketData {
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
  name: string;
}

// Socket event callbacks
export interface SocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMarketData?: (data: MarketData) => void;
  onOrderUpdate?: (order: any) => void;
  onPositionUpdate?: (position: any) => void;
  onPing?: () => void;
  onAuthSuccess?: () => void;
  onAuthFailure?: (error: string) => void;
}

// Configuration
export interface KotakNeoConfig {
  token: string;
  sid: string;
  datacenter?: "gdc" | "adc" | "e21" | "e22" | "e41" | "e43";
  source?: string;
}

// Socket states
export enum SocketState {
  DISCONNECTED = 0,
  CONNECTING = 1,
  AUTHENTICATING = 2,
  CONNECTED = 3,
  ERROR = 4,
}

class KotakNeoHslib {
  private config: KotakNeoConfig | null = null;
  private callbacks: SocketCallbacks = {};
  private state: SocketState = SocketState.DISCONNECTED;
  private isAuthenticated = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isRetrying = false;
  private subscriptions: string[] = [];

  constructor() {
    // Initialize global variables like in demo
    this.initializeGlobals();
  }

  private initializeGlobals() {
    // Initialize global variables that hslib.js expects
    if (typeof window !== "undefined") {
      window.retrySocket = {
        hsmRetry: false,
        hsiRetry: false,
        subscriptions: [],
        hsiRetryCount: 0,
        retryCount: 0,
        initiateRetry: (socketIdentity: string) => {
          this.handleRetry(socketIdentity);
        },
      };

      window.windowIntervals = {
        hsmInterval: null,
        hsiInterval: null,
        hsiRetryTimeout: null,
        hsmRetryTimeout: null,
      };
    }
  }

  private handleRetry(socketIdentity: string) {
    if (socketIdentity === "Hsm") {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `[KotakNeo] Retrying HSM connection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        setTimeout(() => {
          if (this.config) {
            this.connect(this.config, this.callbacks);
          }
        }, 5000);
      } else {
        console.error("[KotakNeo] Max retry attempts reached");
        this.state = SocketState.ERROR;
        if (this.callbacks.onError) {
          this.callbacks.onError(new Error("Max retry attempts reached"));
        }
      }
    }
  }

  // Check if hslib.js is loaded
  private checkHslibLoaded(): boolean {
    if (typeof window === "undefined" || !window.HSWebSocket) {
      console.error(
        "[KotakNeo] hslib.js not loaded. Please include hslib.js in your HTML."
      );
      return false;
    }
    return true;
  }

  // Connect to HSM using hslib.js
  public async connect(
    config: KotakNeoConfig,
    callbacks?: SocketCallbacks
  ): Promise<void> {
    if (!this.checkHslibLoaded()) {
      throw new Error("hslib.js not loaded");
    }

    this.config = config;
    if (callbacks) {
      this.callbacks = callbacks;
    }

    this.state = SocketState.CONNECTING;
    this.isAuthenticated = false;

    try {
      console.log("[KotakNeo] Starting connection with hslib.js...");
      await this.connectHsm(config.token, config.sid);

      this.state = SocketState.CONNECTED;
      this.reconnectAttempts = 0;
      this.isRetrying = false;

      console.log("[KotakNeo] Successfully connected and authenticated");

      if (this.callbacks.onConnect) {
        this.callbacks.onConnect();
      }
    } catch (error) {
      console.error("[KotakNeo] Connection failed:", error);
      this.state = SocketState.ERROR;
      if (this.callbacks.onError) {
        this.callbacks.onError(error as Error);
      }
    }
  }

  // Connect to HSM using hslib.js (based on demo.js)
  private async connectHsm(token: string, sid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = "wss://mlhsm.kotaksecurities.com";
      console.log("[KotakNeo] Creating HSWebSocket connection to:", url);

      // Use hslib.js HSWebSocket
      window.userWS = new window.HSWebSocket(url);
      window.retrySocket.hsmRetry = true;

      window.userWS.onopen = () => {
        console.log("[KotakNeo] HSM WebSocket opened");
        this.state = SocketState.AUTHENTICATING;

        // Send authentication message (exactly like demo)
        const authMessage = {
          Authorization: token,
          Sid: sid,
          type: "cn",
        };

        console.log("[KotakNeo] Sending auth message:", authMessage);
        window.userWS.send(JSON.stringify(authMessage));

        // Start heartbeat (exactly like demo)
        clearInterval(window.windowIntervals.hsmInterval);
        window.windowIntervals.hsmInterval = setInterval(() => {
          if (window.userWS) {
            window.userWS.send(JSON.stringify({ type: "ti", scrips: "" }));
          }
        }, 30000);

        resolve();
      };

      window.userWS.onclose = () => {
        console.log("[KotakNeo] HSM WebSocket closed");
        this.isAuthenticated = false;

        if (this.state === SocketState.AUTHENTICATING) {
          reject(new Error("WebSocket closed during authentication"));
        } else {
          this.handleReconnect();
        }
      };

      window.userWS.onerror = () => {
        console.error("[KotakNeo] HSM WebSocket error");
        reject(new Error("WebSocket connection error"));
      };

      window.userWS.onmessage = (msg: string) => {
        this.handleMessage(msg);
      };
    });
  }

  // Handle incoming messages
  private handleMessage(msg: string) {
    try {
      const data = JSON.parse(msg);
      console.log("[KotakNeo] Received message:", data);

      // Handle array payloads (most market socket messages)
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.type === "cn") {
            this.handleAuthResponse(item);
          } else if (item.type === "sub") {
            console.log("[KotakNeo] Subscription started:", item);
          } else if (item.type === "mws" || item.type === "mwu") {
            console.log("[KotakNeo] Subscription response:", item);
          } else {
            this.handleMarketData(item);
            console.log("[KotakNeo] Market data update:", item);
          }
        }
        return;
      }

      // Handle single object payloads (fallback)
      if (data.type === "cn") {
        this.handleAuthResponse(data);
      } else if (data.type === "mws" || data.type === "mwu") {
        console.log("[KotakNeo] Subscription response:", data);
      } else {
        this.handleMarketData(data);
        console.log("[KotakNeo] Single data update:", data);
      }
    } catch (error) {
      console.error("[KotakNeo] Error parsing message:", error);
    }
  }

  // Handle authentication response
  private handleAuthResponse(data: any) {
    console.log("[KotakNeo] Authentication response:", data);

    if (data.stat === "Ok" || data.status === "Ok" || data.success === true) {
      console.log("[KotakNeo] Authentication successful");
      this.isAuthenticated = true;

      if (this.callbacks.onAuthSuccess) {
        this.callbacks.onAuthSuccess();
      }
    } else {
      const errorMsg =
        data.message || data.error || data.reason || "Authentication failed";
      console.error("[KotakNeo] Authentication failed:", errorMsg);

      if (this.callbacks.onAuthFailure) {
        this.callbacks.onAuthFailure(errorMsg);
      }
    }
  }

  // Handle ping messages
  private handlePingMessage(data: any) {
    console.log("[KotakNeo] Received ping:", data);

    if (this.callbacks.onPing) {
      this.callbacks.onPing();
    }
  }
  private tokenSymbolMap: Record<string, string> = {}; // token -> symbol mapping

  // Handle market data
  private handleMarketData(data: any) {
    if (!data.tk) {
      console.warn("[KotakNeo] Market data without symbol:", data);
      return;
    }
    if (data.ts) {
      this.tokenSymbolMap[data.tk] = data.ts;
    }
    const name = data.ts || this.tokenSymbolMap[data.tk] || "Unknown";

    console.log(data, "datamsss");
    const marketData: MarketData = {
      symbol: data.tk, // TATASTEEL-EQ
      exchange: data.e === "nse_cm" ? "NSE" : data.e || "BSE",
      ltp: parseFloat(data.ltp) || 0,
      change: parseFloat(data.cng) || 0,
      changePercent: parseFloat(data.nc) || 0,
      volume: parseInt(data.v) || 0,
      high: parseFloat(data.h) || 0,
      low: parseFloat(data.lo) || 0,
      open: parseFloat(data.op) || 0,
      close: parseFloat(data.c) || 0,
      timestamp: new Date().getTime(), // current timestamp
      name: name,
    };

    console.log(
      "[KotakNeo] Market data for",
      marketData.symbol,
      ":",
      marketData
    );
    if (this.callbacks.onMarketData) {
      this.callbacks.onMarketData(marketData);
    }
  }

  // Subscribe to market data
  public subscribeToMarketData(
    symbols: string[],
    channelNumber: number = 1
  ): void {
    if (!window.userWS || this.state !== SocketState.CONNECTED) {
      console.error("[KotakNeo] Socket not connected");
      return;
    }

    const subscriptionMessage = {
      type: "mws",
      scrips: symbols.join("&"),
      channelnum: channelNumber,
    };

    console.log("[KotakNeo] Subscribing to:", subscriptionMessage);
    window.userWS.send(JSON.stringify(subscriptionMessage));
    this.subscriptions.push(JSON.stringify(subscriptionMessage));
  }

  // Unsubscribe from market data
  public unsubscribeFromMarketData(
    symbols: string[],
    channelNumber: number = 1
  ): void {
    if (!window.userWS || this.state !== SocketState.CONNECTED) {
      console.error("[KotakNeo] Socket not connected");
      return;
    }

    const unsubscriptionMessage = {
      type: "mwu",
      scrips: symbols.join("&"),
      channelnum: channelNumber,
    };

    window.userWS.send(JSON.stringify(unsubscriptionMessage));
    console.log("[KotakNeo] Unsubscribed from:", symbols);
  }

  // Pause channels
  public pauseChannels(channelNumbers: number[]): void {
    if (!window.userWS || this.state !== SocketState.CONNECTED) {
      console.error("[KotakNeo] Socket not connected");
      return;
    }

    const pauseMessage = {
      type: "cp",
      channelnums: channelNumbers,
    };

    window.userWS.send(JSON.stringify(pauseMessage));
    console.log("[KotakNeo] Channels paused:", channelNumbers);
  }

  // Resume channels
  public resumeChannels(channelNumbers: number[]): void {
    if (!window.userWS || this.state !== SocketState.CONNECTED) {
      console.error("[KotakNeo] Socket not connected");
      return;
    }

    const resumeMessage = {
      type: "cr",
      channelnums: channelNumbers,
    };

    window.userWS.send(JSON.stringify(resumeMessage));
    console.log("[KotakNeo] Channels resumed:", channelNumbers);
  }

  // Handle reconnection
  private handleReconnect(): void {
    if (
      this.isRetrying ||
      this.reconnectAttempts >= this.maxReconnectAttempts
    ) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("[KotakNeo] Max reconnection attempts reached");
        this.state = SocketState.ERROR;
        if (this.callbacks.onError) {
          this.callbacks.onError(
            new Error("Max reconnection attempts reached")
          );
        }
      }
      return;
    }

    this.isRetrying = true;
    this.reconnectAttempts++;

    console.log(
      `[KotakNeo] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      if (this.config) {
        this.connect(this.config, this.callbacks);
      }
    }, 5000);
  }

  // Disconnect
  public disconnect(): void {
    console.log("[KotakNeo] Disconnecting...");
    this.state = SocketState.DISCONNECTED;
    this.isAuthenticated = false;

    if (window.windowIntervals.hsmInterval) {
      clearInterval(window.windowIntervals.hsmInterval);
      window.windowIntervals.hsmInterval = null;
    }

    if (window.userWS) {
      window.userWS.close();
      window.userWS = null;
    }

    this.subscriptions = [];
    this.isRetrying = false;
    this.reconnectAttempts = 0;

    if (this.callbacks.onDisconnect) {
      this.callbacks.onDisconnect();
    }

    console.log("[KotakNeo] Disconnected");
  }

  // Get connection state
  public getState(): SocketState {
    return this.state;
  }

  // Check if connected
  public isConnected(): boolean {
    return (
      this.state === SocketState.CONNECTED &&
      this.isAuthenticated &&
      window.userWS
    );
  }

  // Update callbacks
  public updateCallbacks(callbacks: Partial<SocketCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

// Export singleton instance
export const kotakNeoHslib = new KotakNeoHslib();
export default KotakNeoHslib;
