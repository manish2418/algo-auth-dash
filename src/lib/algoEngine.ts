// lib/algoEngine.ts

import type { MarketData } from "@/lib/kotakNeoHslib";

// Parameters
const VOL_WINDOW = 20; // number of ticks to calculate volatility
const VOL_THRESHOLD = 0.02; // threshold for volatility
const IMB_THRESHOLD = 0.2; // threshold for order-book imbalance

const tickHistory: Record<string, number[]> = {}; // store LTPs per symbol

function calculateVolatility(symbol: string, newPrice: number): number {
  if (!tickHistory[symbol]) tickHistory[symbol] = [];
  const prices = tickHistory[symbol];

  prices.push(newPrice);
  if (prices.length > VOL_WINDOW) prices.shift();

  if (prices.length < 2) return 0;

  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance =
    prices.reduce((a, b) => a + (b - mean) ** 2, 0) / prices.length;

  return Math.sqrt(variance) / mean;
}

function parseTick(data: MarketData) {
  return {
    name: data.name,
    ltp: data.ltp,
    volume: data.volume,
    high: data.high,
    low: data.low,
    open: data.open,
    close: data.close,
  };
}

export function runAlgoEngine(data: MarketData) {
  const tick = parseTick(data);

  // Calculate volatility
  const volatility = calculateVolatility(tick.name, tick.ltp);

  // Derive order-book metrics (stubbed for demo)
  const bid = tick.ltp - 0.1;
  const ask = tick.ltp + 0.1;
  const mid = (bid + ask) / 2;
  const spread = ask - bid;
  const imbalance = Math.random() * 0.4 - 0.2; // fake imbalance between -0.2 to +0.2

  // Decision engine
  if (Math.abs(imbalance) < IMB_THRESHOLD && volatility < VOL_THRESHOLD) {
    console.log(
      `🟢 Adding liquidity for ${tick.name} | Buy: ${(mid - spread / 2).toFixed(
        2
      )} | Sell: ${(mid + spread / 2).toFixed(2)}`
    );
  } else {
    console.log(
      `🔴 Cancel quotes for ${tick.name} | Volatility=${volatility.toFixed(
        4
      )}, Imbalance=${imbalance.toFixed(3)}`
    );
  }

  return { volatility, imbalance, mid, spread };
}
