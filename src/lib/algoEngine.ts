// lib/algoEngineV2.ts
import type { MarketData } from "@/lib/kotakNeoHslib";

const VOL_WINDOW = 30;
const VOL_DECAY = 0.8;
const IMB_THRESHOLD = 0.25;
const BASE_SPREAD = 0.15;

const tickHistory: Record<string, number[]> = {};

function calculateVolatility(symbol: string, newPrice: number): number {
  if (!tickHistory[symbol]) tickHistory[symbol] = [];
  const prices = tickHistory[symbol];

  prices.push(newPrice);
  if (prices.length > VOL_WINDOW) prices.shift();

  if (prices.length < 2) return 0;

  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  let variance = 0;
  for (let i = 0; i < prices.length; i++) {
    const weight = Math.pow(VOL_DECAY, prices.length - i); // recent ticks weigh more
    variance += weight * (prices[i] - mean) ** 2;
  }
  variance /= prices.length;
  return Math.sqrt(variance) / mean;
}

function parseTick(data: any) {
  return {
    symbol: data.symbol,
    name: data.name,
    exchange: data.exchange,
    ltp: parseFloat(data.ltp),
    change: parseFloat(data.change),
    changePercent: parseFloat(data.changePercent),
    bidPrice: parseFloat(data.bidPrice),
    askPrice: parseFloat(data.askPrice),
    bidQty: parseFloat(data.bidQty),
    askQty: parseFloat(data.askQty),
    lastTradeQty: parseFloat(data.lastTradeQty),
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low),
    close: parseFloat(data.close),
    volume: parseFloat(data.volume),
    turnover: parseFloat(data.turnover),
    upperCircuit: parseFloat(data.upperCircuit),
    lowerCircuit: parseFloat(data.lowerCircuit),
    yearlyHigh: parseFloat(data.yearlyHigh),
    yearlyLow: parseFloat(data.yearlyLow),
    feedTimestamp: data.feedTimestamp, // string (from API)
    lastTradeTime: data.lastTradeTime, // string (from API)
    systemTimestamp: Number(data.systemTimestamp), // numeric timestamp
    timestamp: Number(data.timestamp),
  };
}

export function runAlgoEngineV2(data: MarketData) {
  const tick = parseTick(data);
  const volatility = calculateVolatility(tick.symbol, tick.ltp);
  const imbalance =
    (tick.bidQty - tick.askQty) / Math.max(tick.bidQty + tick.askQty, 1);
  const spread = tick.askPrice - tick.bidPrice;
  const mid = (tick.askPrice + tick.bidPrice) / 2;
  const dynamicSpread =
    BASE_SPREAD * (1 + volatility * 10 + Math.abs(imbalance) * 2);
  const buyQuote = mid - dynamicSpread / 2;
  const sellQuote = mid + dynamicSpread / 2;
  const confidence = 1 - Math.min(volatility * 20 + Math.abs(imbalance), 1);

  // ----- Decision Logic -----
  let action: "BUY" | "SELL" | "HOLD" = "HOLD";
  let reason = "";

  if (confidence > 0.7 && imbalance > 0.2) {
    action = "BUY";
    reason = "Strong buy-side pressure with stable volatility";
  } else if (confidence > 0.7 && imbalance < -0.2) {
    action = "SELL";
    reason = "Strong sell-side pressure with stable volatility";
  }

  if (confidence < 0.5) {
    action = "HOLD";
    reason = "Market unstable — no trade";
  }

  return {
    symbol: tick.symbol,
    ltp: tick.ltp,
    volatility,
    imbalance,
    mid,
    dynamicSpread,
    confidence,
    buyQuote,
    sellQuote,
    action,
    reason,
  };
}
