// lib/algoEngineV3.ts
import type { MarketData } from "@/lib/kotakNeoHslib";

// ---------------------------
// CONFIG
// ---------------------------
const SMA_SHORT = 20;
const SMA_LONG = 50;
const ATR_PERIOD = 14;
const RSI_PERIOD = 14;

interface Tick {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

const history: Record<string, Tick[]> = {};
const tickBuffer: Record<string, number[]> = {};
const reEntryLimit = { BUY: 0, SELL: 0 };

// ---------------------------
// INDICATOR FUNCTIONS
// ---------------------------

function calculateSMA(values: number[], period: number) {
  if (values.length < period) return null;
  const slice = values.slice(values.length - period);
  const avg = slice.reduce((a, b) => a + b, 0) / period;
  return avg;
}

function calculateATR(data: Tick[], period = 14) {
  if (data.length < period + 1) return null;
  const trs = [];
  for (let i = data.length - period; i < data.length; i++) {
    const h = data[i].high,
      l = data[i].low,
      pc = data[i - 1].close;
    trs.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
  }
  return trs.reduce((a, b) => a + b, 0) / period;
}

function calculateRSI(closes: number[], period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0,
    losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
}

function parseTick(data: MarketData): number {
  return parseFloat(data.ltp);
}

// ---------------------------
// STATE
// ---------------------------
let position: "BUY" | "SELL" | null = null;
let entryPrice: number | null = null;
let trailingSL: number | null = null;

// ---------------------------
// MAIN ALGO ENGINE
// ---------------------------

export function runAlgoEngineV3(data: MarketData) {
  const symbol = data.symbol;
  const ltp = parseTick(data);
  const timestamp = Number(data.timestamp);

  // initialize buffers
  if (!tickBuffer[symbol]) tickBuffer[symbol] = [];
  if (!history[symbol]) history[symbol] = [];

  // add tick to buffer
  tickBuffer[symbol].push(ltp);

  // every 60 ticks (~1 min), create candle
  if (tickBuffer[symbol].length >= 60) {
    const buffer = tickBuffer[symbol];
    const open = buffer[0];
    const high = Math.max(...buffer);
    const low = Math.min(...buffer);
    const close = buffer[buffer.length - 1];
    const volume = buffer.length * 10; // simulate volume

    const newCandle: Tick = { open, high, low, close, volume, timestamp };
    history[symbol].push(newCandle);
    if (history[symbol].length > 200) history[symbol].shift();
    tickBuffer[symbol] = []; // reset for next minute

    // ---- calculate indicators ----
    const candles = history[symbol];
    const closes = candles.map((c) => c.close);
    const volumes = candles.map((c) => c.volume);
    if (closes.length < SMA_LONG) return null;

    const sma20 = calculateSMA(closes, SMA_SHORT);
    const sma50 = calculateSMA(closes, SMA_LONG);
    const atr = calculateATR(candles, ATR_PERIOD);
    const rsi = calculateRSI(closes, RSI_PERIOD);
    const avgVolume20 = calculateSMA(volumes, 20);
    const volCondition = newCandle.volume > (avgVolume20 || 0);
    const entryThreshold = atr ? 1.2 * atr : 0;

    const now = new Date(timestamp);
    const hour = now.getHours();
    const min = now.getMinutes();
    const withinTradeWindow =
      (hour > 9 || (hour === 9 && min >= 30)) &&
      (hour < 15 || (hour === 15 && min <= 10));

    if (!withinTradeWindow) return null;

    // ---- Signal Logic ----
    let signal: "BUY" | "SELL" | "EXIT" | "HOLD" = "HOLD";
    let reason = "";

    if (
      sma20 &&
      sma50 &&
      atr &&
      rsi &&
      sma20 > sma50 &&
      close > sma20 + entryThreshold &&
      rsi > 55 &&
      volCondition &&
      (!position || position === "SELL") &&
      reEntryLimit.BUY < 2
    ) {
      signal = "BUY";
      position = "BUY";
      entryPrice = close;
      trailingSL = entryPrice - 1.5 * atr;
      reEntryLimit.BUY++;
      reason = "SMA20>SMA50 + ATR breakout + RSI + Volume confirm";
    } else if (
      sma20 &&
      sma50 &&
      atr &&
      rsi &&
      sma20 < sma50 &&
      close < sma20 - entryThreshold &&
      rsi < 45 &&
      volCondition &&
      (!position || position === "BUY") &&
      reEntryLimit.SELL < 2
    ) {
      signal = "SELL";
      position = "SELL";
      entryPrice = close;
      trailingSL = entryPrice + 1.5 * atr;
      reEntryLimit.SELL++;
      reason = "SMA20<SMA50 + ATR breakdown + RSI + Volume confirm";
    }

    // ---- Trailing Stoploss ----
    if (position === "BUY" && atr) {
      const newSL = close - 1.5 * atr;
      if (newSL > (trailingSL || 0)) trailingSL = newSL;
      if (close <= trailingSL) {
        signal = "EXIT";
        reason = "Trailing SL hit (BUY)";
        position = null;
      }
    } else if (position === "SELL" && atr) {
      const newSL = close + 1.5 * atr;
      if (newSL < (trailingSL || Infinity)) trailingSL = newSL;
      if (close >= trailingSL) {
        signal = "EXIT";
        reason = "Trailing SL hit (SELL)";
        position = null;
      }
    }

    return {
      symbol,
      ltp: close,
      sma20,
      sma50,
      atr,
      rsi,
      trailingSL,
      position,
      signal,
      reason,
      timestamp,
    };
  }

  return null; // skip until candle formed
}
